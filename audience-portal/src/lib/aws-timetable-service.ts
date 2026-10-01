import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { AnalyzeDocumentCommand, FeatureType } from "@aws-sdk/client-textract";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { bedrockClient, textractClient, dynamoClient, isAWSConfigured } from "./aws-config";

export interface ExtractedEntry {
  subject: string;
  faculty: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

const DEFAULT_BEDROCK_MODEL = process.env.AWS_BEDROCK_MODEL_ID || "amazon.nova-pro-v1:0";
const DYNAMODB_CACHE_TABLE = process.env.AWS_DYNAMODB_CACHE_TABLE || "acadsphere_timetable_cache";
const DYNAMODB_LIMIT_TABLE = process.env.AWS_DYNAMODB_LIMIT_TABLE || "acadsphere_rate_limit";

const EXTRACTION_PROMPT = `You are an expert timetable schedule parser. Analyze the provided raw text and extracted document tables from a timetable file and convert ALL class/lecture entries into a structured JSON array.

For each class entry, extract:
- subject: The course/subject name (e.g., "Computer Networks", "Data Structures")
- faculty: The instructor/professor name. If not visible, use "TBD"
- room: The room/lab number. If not visible, use "TBD"
- day: The weekday (must be exactly one of: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
- startTime: In 24-hour "HH:MM" format (e.g., "09:00", "14:30")
- endTime: In 24-hour "HH:MM" format (e.g., "10:00", "16:00")

IMPORTANT RULES:
1. Return ONLY a valid JSON array. No markdown code fences, no introductory or trailing text.
2. If a class repeats on multiple days, create a SEPARATE entry for each day.
3. Convert 12-hour times to 24-hour format (e.g., "2:00 PM" -> "14:00").
4. If you cannot extract any timetable entries, return an empty array: []
5. Clean up subject names — capitalize properly, trim extra spaces.

Example output format:
[
  {"subject": "Computer Networks", "faculty": "Dr. Smith", "room": "Lab-304", "day": "Monday", "startTime": "09:00", "endTime": "10:00"},
  {"subject": "Data Structures", "faculty": "Prof. Johnson", "room": "Room-201", "day": "Tuesday", "startTime": "11:00", "endTime": "12:30"}
]`;

// Helper to normalize day string to valid full weekday name
export function normalizeDay(dayRaw: string): string | null {
  if (!dayRaw || typeof dayRaw !== "string") return null;
  const d = dayRaw.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  if (d.startsWith("mon") || d.includes("do1")) return "Monday";
  if (d.startsWith("tue") || d.includes("do2")) return "Tuesday";
  if (d.startsWith("wed") || d.includes("do3")) return "Wednesday";
  if (d.startsWith("thu") || d.includes("do4")) return "Thursday";
  if (d.startsWith("fri") || d.includes("do5")) return "Friday";
  if (d.startsWith("sat") || d.includes("do6")) return "Saturday";
  if (d.startsWith("sun")) return "Sunday";

  return null;
}

// Helper to normalize time string to "HH:MM" (24-hour format)
export function normalizeTime(timeRaw: string, defaultTime: string): string {
  if (!timeRaw || typeof timeRaw !== "string") return defaultTime;
  let t = timeRaw.trim().toUpperCase().replace(/\./g, ":");

  const isPM = t.includes("PM");
  const isAM = t.includes("AM");
  t = t.replace(/AM|PM|\s+/g, "");

  const parts = t.split(":");
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) return defaultTime;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${hh}:${mm}`;
    }
  }

  const singleNum = parseInt(t, 10);
  if (!isNaN(singleNum) && singleNum >= 0 && singleNum <= 23) {
    return `${singleNum.toString().padStart(2, "0")}:00`;
  }

  return defaultTime;
}

export function validateEntry(entry: ExtractedEntry): ExtractedEntry | null {
  if (!entry || !entry.subject || typeof entry.subject !== "string" || entry.subject.trim().length === 0) {
    return null;
  }

  const normalizedDay = normalizeDay(entry.day);
  if (!normalizedDay) return null;

  const startTime = normalizeTime(entry.startTime, "09:00");
  const endTime = normalizeTime(entry.endTime, "10:00");

  return {
    subject: entry.subject.trim(),
    faculty: (entry.faculty || "TBD").trim(),
    room: (entry.room || "TBD").trim(),
    day: normalizedDay,
    startTime,
    endTime,
  };
}

export function cleanAndParseJSON(rawText: string): ExtractedEntry[] {
  if (!rawText) return [];
  let cleaned = rawText.trim();

  cleaned = cleaned.replace(/^```(?:json)?\s*/gi, "").replace(/\s*```$/gi, "").trim();

  const startIdx = cleaned.indexOf("[");
  const endIdx = cleaned.lastIndexOf("]");
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  cleaned = cleaned
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
  } catch (_e) {}

  try {
    const sanitized = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
    const parsedFallback = JSON.parse(sanitized);
    return Array.isArray(parsedFallback) ? parsedFallback : [];
  } catch (err) {
    console.error("[AWS JSON Repair Failed]:", err);
    return [];
  }
}

/**
 * Check DynamoDB Cache for SHA-256 file hash
 */
async function checkDynamoDBCache(fileHash: string): Promise<ExtractedEntry[] | null> {
  if (!isAWSConfigured()) return null;
  try {
    const command = new GetItemCommand({
      TableName: DYNAMODB_CACHE_TABLE,
      Key: { hash: { S: fileHash } },
    });
    const res = await dynamoClient.send(command);
    if (res.Item && res.Item.entries?.S) {
      const ttl = Number(res.Item.ttl?.N || 0);
      if (ttl > Math.floor(Date.now() / 1000)) {
        const parsed = JSON.parse(res.Item.entries.S);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`[AWS DynamoDB Cache Hit] Found cached extraction for hash: ${fileHash.substring(0, 10)}...`);
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn("[AWS DynamoDB Cache Lookup Warning]:", e);
  }
  return null;
}

/**
 * Write extracted entries to DynamoDB Cache
 */
async function writeDynamoDBCache(fileHash: string, entries: ExtractedEntry[]): Promise<void> {
  if (!isAWSConfigured() || entries.length === 0) return;
  try {
    const ttlSeconds = Math.floor(Date.now() / 1000) + 15 * 60; // 15 min TTL
    const command = new PutItemCommand({
      TableName: DYNAMODB_CACHE_TABLE,
      Item: {
        hash: { S: fileHash },
        entries: { S: JSON.stringify(entries) },
        ttl: { N: ttlSeconds.toString() },
      },
    });
    await dynamoClient.send(command);
    console.log(`[AWS DynamoDB Cache Write] Saved ${entries.length} entries for hash: ${fileHash.substring(0, 10)}...`);
  } catch (e) {
    console.warn("[AWS DynamoDB Cache Write Warning]:", e);
  }
}

/**
 * Perform Textract Document Analysis on PDF/Image buffer
 */
async function extractWithAWSTextract(fileBuffer: Buffer): Promise<string> {
  console.log("[AWS Textract] Analyzing document layout & tables...");
  const command = new AnalyzeDocumentCommand({
    Document: { Bytes: fileBuffer },
    FeatureTypes: [FeatureType.TABLES, FeatureType.FORMS],
  });

  const response = await textractClient.send(command);
  const blocks = response.Blocks || [];

  let textOutput = "";
  const tableBlocks: string[] = [];

  for (const block of blocks) {
    if (block.BlockType === "LINE" && block.Text) {
      textOutput += block.Text + "\n";
    } else if (block.BlockType === "CELL" && block.Text) {
      tableBlocks.push(`[Row ${block.RowIndex}, Col ${block.ColumnIndex}]: ${block.Text}`);
    }
  }

  let fullContent = `--- Extracted Text Lines ---\n${textOutput}`;
  if (tableBlocks.length > 0) {
    fullContent += `\n--- Extracted Table Grids ---\n${tableBlocks.join("\n")}`;
  }

  return fullContent;
}

/**
 * Invoke AWS Bedrock multimodal/text model
 */
async function invokeAWSBedrock(content: string, imageBase64?: string, mimeType?: string): Promise<string> {
  console.log(`[AWS Bedrock] Invoking model: ${DEFAULT_BEDROCK_MODEL}...`);

  let requestBody: Record<string, unknown>;

  if (DEFAULT_BEDROCK_MODEL.includes("claude")) {
    const messagesContent: Array<Record<string, unknown>> = [];
    if (imageBase64) {
      messagesContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType || "image/png",
          data: imageBase64,
        },
      });
    }
    messagesContent.push({
      type: "text",
      text: content,
    });

    requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2048,
      temperature: 0.1,
      system: EXTRACTION_PROMPT,
      messages: [
        {
          role: "user",
          content: messagesContent,
        },
      ],
    };
  } else {
    // Amazon Nova or Llama format
    requestBody = {
      messages: [
        { role: "system", content: EXTRACTION_PROMPT },
        { role: "user", content: content },
      ],
      inferenceConfig: {
        maxTokens: 2048,
        temperature: 0.1,
      },
    };
  }

  const command = new InvokeModelCommand({
    modelId: DEFAULT_BEDROCK_MODEL,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(requestBody),
  });

  const response = await bedrockClient.send(command);
  const responseText = new TextDecoder().decode(response.body);
  const parsedRes = JSON.parse(responseText);

  if (DEFAULT_BEDROCK_MODEL.includes("claude")) {
    return parsedRes.content?.[0]?.text || "";
  } else {
    return parsedRes.output?.message?.content?.[0]?.text || parsedRes.generation || responseText;
  }
}

/**
 * Main AWS Extraction Handler
 * Returns null if AWS is unconfigured or fails, so caller can fallback to secondary pipeline if desired.
 */
export async function extractTimetableWithAWS(
  fileBuffer: Buffer,
  mimeType: string,
  fileName: string,
  fileHash: string
): Promise<{ entries: ExtractedEntry[]; cached?: boolean } | null> {
  if (!isAWSConfigured()) {
    console.log("[AWS Service] AWS credentials not configured. Skipping AWS pipeline.");
    return null;
  }

  try {
    // 1. Check DynamoDB Cache
    const cachedEntries = await checkDynamoDBCache(fileHash);
    if (cachedEntries) {
      return { entries: cachedEntries, cached: true };
    }

    const isImage = mimeType.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(fileName);
    let rawResponse = "";

    // 2. Direct Bedrock Vision for Images OR Textract for Documents
    if (isImage) {
      try {
        const base64Data = fileBuffer.toString("base64");
        rawResponse = await invokeAWSBedrock(
          `Extract ALL class schedule entries from this timetable image "${fileName}" into a JSON array according to the rules.`,
          base64Data,
          mimeType || "image/png"
        );
      } catch (visionErr) {
        console.warn("[AWS Bedrock Vision Error]:", visionErr, "Falling back to AWS Textract...");
      }
    }

    if (!rawResponse || rawResponse.trim().length < 10) {
      const textractOutput = await extractWithAWSTextract(fileBuffer);
      rawResponse = await invokeAWSBedrock(
        `Here is the extracted layout and table data from the document "${fileName}":\n\n${textractOutput}\n\nParse this into a clean JSON array of timetable entries according to the rules.`
      );
    }

    // 3. Clean and parse JSON
    const parsed = cleanAndParseJSON(rawResponse);
    const validEntries = parsed.map(validateEntry).filter((e): e is ExtractedEntry => e !== null);

    if (validEntries.length > 0) {
      // 4. Cache valid entries in DynamoDB
      await writeDynamoDBCache(fileHash, validEntries);
      return { entries: validEntries };
    }

    return null;
  } catch (err) {
    console.error("[AWS Timetable Extraction Pipeline Error]:", err);
    return null;
  }
}
