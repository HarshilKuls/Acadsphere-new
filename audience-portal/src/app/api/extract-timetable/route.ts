import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Structured prompt for timetable extraction
const EXTRACTION_PROMPT = `You are a timetable extraction assistant. Analyze the uploaded file (it may be a PDF, image of a timetable, spreadsheet, or document) and extract ALL class/lecture entries.

For each class entry, extract:
- subject: The course/subject name (e.g., "Computer Networks", "Data Structures")
- faculty: The instructor/professor name. If not visible, use "TBD"
- room: The room/lab number. If not visible, use "TBD"
- day: The weekday (must be exactly one of: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
- startTime: In 24-hour "HH:MM" format (e.g., "09:00", "14:30")
- endTime: In 24-hour "HH:MM" format (e.g., "10:00", "16:00")

IMPORTANT RULES:
1. Return ONLY a valid JSON array. No markdown, no code fences, no explanation text.
2. If a class repeats on multiple days, create a SEPARATE entry for each day.
3. Convert 12-hour times to 24-hour format (e.g., "2:00 PM" → "14:00").
4. If you cannot extract any timetable data, return an empty array: []
5. Clean up subject names — capitalize properly, remove extra whitespace.

Example output format:
[
  {"subject": "Computer Networks", "faculty": "Dr. Smith", "room": "Lab-304", "day": "Monday", "startTime": "09:00", "endTime": "10:00"},
  {"subject": "Data Structures", "faculty": "Prof. Johnson", "room": "Room-201", "day": "Tuesday", "startTime": "11:00", "endTime": "12:30"}
]`;

// Map MIME types for Gemini
function getGeminiMimeType(fileName: string, originalType: string): string {
  const ext = fileName.toLowerCase().split(".").pop() || "";
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    csv: "text/csv",
  };
  return mimeMap[ext] || originalType || "application/octet-stream";
}

// Validate extracted entries
interface ExtractedEntry {
  subject: string;
  faculty: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

const VALID_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function validateEntry(entry: ExtractedEntry): ExtractedEntry | null {
  if (!entry.subject || typeof entry.subject !== "string") return null;
  if (!VALID_DAYS.includes(entry.day)) return null;
  if (!TIME_REGEX.test(entry.startTime) || !TIME_REGEX.test(entry.endTime)) return null;

  return {
    subject: entry.subject.trim(),
    faculty: (entry.faculty || "TBD").trim(),
    room: (entry.room || "TBD").trim(),
    day: entry.day,
    startTime: entry.startTime,
    endTime: entry.endTime,
  };
}

// --- SERVER-SIDE RATE LIMITING & CACHING ---
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const extractionCache = new Map<string, { entries: ExtractedEntry[]; timestamp: number }>();

const MAX_RPM = 12; // Stay safely under Gemini Free Tier's 15 RPM limit
const requestTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  // Filter timestamps within last 60 seconds
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 60000) {
    requestTimestamps.shift();
  }
  return requestTimestamps.length >= MAX_RPM;
}

function recordRequest(): void {
  requestTimestamps.push(Date.now());
}

// Exponential backoff helper for Gemini API calls
async function generateContentWithRetry(ai: GoogleGenAI, params: any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const is429 = errMsg.includes("429") || err?.status === 429 || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("rate");
      
      if (is429 && attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1500 + Math.floor(Math.random() * 500); // 3s, 6s jittered
        console.warn(`[Gemini API] 429 Rate Limit hit. Retrying in ${backoffMs}ms (Attempt ${attempt}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Maximum retry attempts exceeded.");
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validate API key
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to environment variables." },
        { status: 500 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { fileData, fileName, mimeType } = body;

    if (!fileData || !fileName) {
      return NextResponse.json(
        { error: "Missing file data or file name." },
        { status: 400 }
      );
    }

    // 3. Check duplicate request cache (SHA-256 hash of file content)
    const fileHash = crypto.createHash("sha256").update(fileData).digest("hex");
    const cached = extractionCache.get(fileHash);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log(`[Cache Hit] Returning cached timetable for ${fileName}`);
      return NextResponse.json({
        entries: cached.entries,
        totalExtracted: cached.entries.length,
        totalValid: cached.entries.length,
        cached: true,
      });
    }

    // 4. Check server-side RPM limit guard
    if (isRateLimited()) {
      return NextResponse.json(
        { error: "Server rate limit guard reached (12 RPM). Please wait 10 seconds before trying again." },
        { status: 429 }
      );
    }

    // 5. Validate file size (base64 string ~1.33x original; limit to ~10MB original)
    const estimatedSize = (fileData.length * 3) / 4;
    if (estimatedSize > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // 6. Determine MIME type & record request timestamp
    const resolvedMime = getGeminiMimeType(fileName, mimeType);
    recordRequest();

    // 7. Call Gemini API with Exponential Backoff Retries
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const response = await generateContentWithRetry(ai, {
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: resolvedMime,
                data: fileData,
              },
            },
            {
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    // 8. Parse Gemini response
    const rawText = response.text?.trim() || "";
    
    if (!rawText) {
      return NextResponse.json(
        { error: "Gemini returned an empty response. The file may not contain a readable timetable." },
        { status: 422 }
      );
    }

    // Clean potential markdown code fences
    let jsonText = rawText;
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }

    let parsed: ExtractedEntry[];
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      console.error("Gemini response was not valid JSON:", rawText.substring(0, 500));
      return NextResponse.json(
        { error: "Could not parse the AI response. Please try again or use a clearer timetable image." },
        { status: 422 }
      );
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json(
        { error: "Unexpected response format from AI." },
        { status: 422 }
      );
    }

    // 9. Validate and clean entries
    const validEntries = parsed
      .map(validateEntry)
      .filter((e): e is ExtractedEntry => e !== null);

    if (validEntries.length === 0 && parsed.length > 0) {
      return NextResponse.json(
        { error: "AI extracted data but entries had invalid formats. Please try a clearer file." },
        { status: 422 }
      );
    }

    // 10. Cache valid entries
    extractionCache.set(fileHash, {
      entries: validEntries,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      entries: validEntries,
      totalExtracted: parsed.length,
      totalValid: validEntries.length,
    });

  } catch (error: unknown) {
    console.error("Timetable extraction error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";

    // Detect quota/rate-limit errors from Gemini
    if (message.includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate")) {
      return NextResponse.json(
        { error: "Gemini API quota exceeded. Please wait a minute and try again, or check your plan at ai.google.dev." },
        { status: 429 }
      );
    }

    // Detect invalid API key errors
    if (message.includes("401") || message.includes("403") || message.toLowerCase().includes("api key")) {
      return NextResponse.json(
        { error: "Gemini API key is invalid or expired. Please update GEMINI_API_KEY in your environment variables." },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

