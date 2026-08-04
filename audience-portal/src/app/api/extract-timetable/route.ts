import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HUGGING_FACE || process.env.HUGGINGFACE;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// High-performance Hugging Face model for structured JSON parsing
const HUGGINGFACE_MODEL = "Qwen/Qwen2.5-72B-Instruct";

// Structured prompt for timetable extraction
const EXTRACTION_PROMPT = `You are an expert timetable schedule parser. Analyze the provided raw text extracted from a timetable (image OCR or PDF text) and convert ALL class/lecture entries into a structured JSON array.

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
3. Convert 12-hour times to 24-hour format (e.g., "2:00 PM" → "14:00").
4. If you cannot extract any timetable entries, return an empty array: []
5. Clean up subject names — capitalize properly, trim extra spaces.

Example output format:
[
  {"subject": "Computer Networks", "faculty": "Dr. Smith", "room": "Lab-304", "day": "Monday", "startTime": "09:00", "endTime": "10:00"},
  {"subject": "Data Structures", "faculty": "Prof. Johnson", "room": "Room-201", "day": "Tuesday", "startTime": "11:00", "endTime": "12:30"}
]`;

interface ExtractedEntry {
  subject: string;
  faculty: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

// Helper to normalize day string to valid full weekday name
function normalizeDay(dayRaw: string): string | null {
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
function normalizeTime(timeRaw: string, defaultTime: string): string {
  if (!timeRaw || typeof timeRaw !== "string") return defaultTime;
  let t = timeRaw.trim().toUpperCase().replace(/\./g, ":");

  // Check 12-hour AM/PM
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

  // If single integer e.g. "9" -> "09:00"
  const singleNum = parseInt(t, 10);
  if (!isNaN(singleNum) && singleNum >= 0 && singleNum <= 23) {
    return `${singleNum.toString().padStart(2, "0")}:00`;
  }

  return defaultTime;
}

function validateEntry(entry: ExtractedEntry): ExtractedEntry | null {
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

// --- SERVER-SIDE CACHING ---
const CACHE_TTL_MS = 15 * 60 * 1000;
const extractionCache = new Map<string, { entries: ExtractedEntry[]; timestamp: number }>();

// Comprehensive PDF Text & Scanned Image OCR Extractor using pdfjs-dist
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  let fullText = "";

  // 1. Try pdf2json first
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFParser = require("pdf2json");
    const pdfParser = new PDFParser(null, 1);
    const pdf2jsonText = await new Promise<string>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError || errData));
      pdfParser.on("pdfParser_dataReady", () => {
        try {
          resolve(pdfParser.getRawTextContent() || "");
        } catch (e) {
          reject(e);
        }
      });
      pdfParser.parseBuffer(buffer);
    });

    if (pdf2jsonText && pdf2jsonText.trim().length > 10) {
      return pdf2jsonText;
    }
  } catch (e) {
    console.warn("pdf2json extract failed:", e);
  }

  // 2. Try pdfjs-dist legacy loader for digital text and embedded image extraction
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { pathToFileURL } = require("url");
    const workerPath = path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdfDoc = await loadingTask.promise;
    const imageBuffers: Buffer[] = [];

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = textContent.items.map((item: any) => ("str" in item ? item.str : "")).join(" ");

      if (pageText && pageText.trim().length > 10) {
        fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
      } else {
        // Scanned image PDF page: Extract embedded images from operator list
        try {
          const operatorList = await page.getOperatorList();
          const validFns = [pdfjs.OPS.paintImageXObject, pdfjs.OPS.paintInlineImageXObject];
          for (let i = 0; i < operatorList.fnArray.length; i++) {
            if (validFns.includes(operatorList.fnArray[i])) {
              const imgName = operatorList.argsArray[i][0];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const imgObj = await new Promise<any>((res) => page.objs.get(imgName, res));
              if (imgObj && imgObj.data) {
                const imgBuf = Buffer.from(imgObj.data.buffer || imgObj.data);
                if (imgBuf.length > 500) {
                  imageBuffers.push(imgBuf);
                }
              }
            }
          }
        } catch (err) {
          console.warn(`Page ${pageNum} image extraction failed:`, err);
        }
      }
    }

    if (fullText.trim().length > 10) {
      return fullText;
    }

    // Run Tesseract OCR on extracted embedded images from scanned PDF pages
    if (imageBuffers.length > 0) {
      console.log(`[PDF Image OCR] Processing ${imageBuffers.length} embedded PDF page images...`);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createWorker } = require("tesseract.js");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      const workerPath = path.join(process.cwd(), "node_modules", "tesseract.js", "src", "worker-script", "node", "index.js");
      const worker = await createWorker("eng", 1, { workerPath });

      let ocrText = "";
      for (const imgBuf of imageBuffers) {
        try {
          const ret = await worker.recognize(imgBuf);
          if (ret.data?.text) {
            ocrText += `${ret.data.text}\n\n`;
          }
        } catch (ocrErr) {
          console.warn("PDF embedded image OCR error:", ocrErr);
        }
      }

      await worker.terminate();
      if (ocrText.trim().length > 5) {
        return ocrText;
      }
    }
  } catch (pdfjsErr) {
    console.warn("pdfjs-dist extract failed:", pdfjsErr);
  }

  if (fullText.trim().length > 5) {
    return fullText;
  }

  throw new Error("Could not extract readable text from PDF. Please ensure the PDF contains clear text or uncorrupted timetable images.");
}

// Extract raw text from base64 buffer (PDF, Image, Excel, Word, or CSV)
async function extractRawText(buffer: Buffer, mimeType: string, fileName: string): Promise<string> {
  const ext = fileName.toLowerCase().split(".").pop() || "";

  // Polyfill DOM Matrix globals if missing in Node environment
  if (typeof globalThis.DOMMatrix === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMMatrix = class DOMMatrix {};
  }

  // 1. PDF Parsing (Digital text & scanned PDF image OCR)
  if (mimeType.includes("pdf") || ext === "pdf") {
    return await extractTextFromPdf(buffer);
  }

  // 2. Excel / Spreadsheet Parsing (.xlsx, .xls, .csv)
  if (ext === "xlsx" || ext === "xls" || ext === "csv" || mimeType.includes("sheet") || mimeType.includes("excel") || mimeType.includes("csv")) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const XLSX = require("xlsx");
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetTexts: string[] = [];
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const csvText = XLSX.utils.sheet_to_csv(sheet);
        if (csvText && csvText.trim()) {
          sheetTexts.push(`--- Sheet: ${sheetName} ---\n${csvText}`);
        }
      }
      if (sheetTexts.length > 0) {
        return sheetTexts.join("\n\n");
      }
    } catch (e) {
      console.warn("Excel parse failed:", e);
    }
  }

  // 3. Word Document Parsing (.docx, .doc)
  if (ext === "docx" || ext === "doc" || mimeType.includes("word")) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      if (result.value && result.value.trim().length > 5) {
        return result.value;
      }
    } catch (e) {
      console.warn("Word parse failed:", e);
    }
  }

  // 4. CSV / Plain Text Parsing
  if (mimeType.includes("text") || ext === "csv" || ext === "txt") {
    return buffer.toString("utf-8");
  }

// Preprocess image buffer with Sharp to maximize Tesseract OCR clarity
async function preprocessImageForOcr(inputBuffer: Buffer): Promise<Buffer> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sharp = require("sharp");
    const processed = await sharp(inputBuffer)
      .resize({ width: 2200, withoutEnlargement: false, fit: "inside" })
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();
    return processed;
  } catch (e) {
    console.warn("Sharp image preprocessing failed, using raw buffer:", e);
    return inputBuffer;
  }
}

  // 5. Image OCR via Tesseract.js (with Sharp high-contrast preprocessing)
  try {
    const ocrBuffer = await preprocessImageForOcr(buffer);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createWorker } = require("tesseract.js");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const workerPath = path.join(process.cwd(), "node_modules", "tesseract.js", "src", "worker-script", "node", "index.js");

    const worker = await createWorker("eng", 1, { workerPath });
    const ret = await worker.recognize(ocrBuffer);
    await worker.terminate();
    return ret.data?.text || "";
  } catch (err: unknown) {
    console.error("OCR error:", err);
    throw new Error("OCR engine failed to read file. Please ensure the file is a valid PDF, Image, Word document, or Excel spreadsheet.");
  }
}

// Robust JSON Repair & Sanitizer Helper
function cleanAndParseJSON(rawText: string): ExtractedEntry[] {
  if (!rawText) return [];
  let cleaned = rawText.trim();

  // 1. Remove markdown code fences ```json ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/gi, "").replace(/\s*```$/gi, "").trim();

  // 2. Extract JSON array substring [ ... ] if surrounding text exists
  const startIdx = cleaned.indexOf("[");
  const endIdx = cleaned.lastIndexOf("]");
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  // 3. Replace fancy smart quotes (“ ” ‘ ’) with standard quotes (" ')
  cleaned = cleaned
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  // 4. Remove trailing commas before closing braces/brackets e.g. {"a": 1,} -> {"a": 1}
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  // 5. Try direct parse
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.warn("Direct JSON parse failed, attempting sanitized parse:", e);
  }

  // 6. Fallback: Sanitize unescaped control characters inside strings
  try {
    const sanitized = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
    const parsedFallback = JSON.parse(sanitized);
    return Array.isArray(parsedFallback) ? parsedFallback : [];
  } catch (err) {
    console.error("JSON repair failed:", err, "Raw string was:", rawText.substring(0, 300));
    return [];
  }
}

// OpenRouter Vision AI Helper (Google Gemma 4 26B & NVIDIA Nemotron VL)
async function extractWithOpenRouterVision(fileData: string, mimeType: string, fileName: string): Promise<ExtractedEntry[] | null> {
  const apiKey = OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const candidateModels = [
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "google/gemma-4-31b-it:free",
  ];

  const dataUrl = fileData.startsWith("data:") ? fileData : `data:${mimeType || "image/png"};base64,${fileData}`;

  for (const model of candidateModels) {
    try {
      console.log(`[OpenRouter Vision AI] Attempting vision extraction with model: ${model}...`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://acadsphere.app",
          "X-OpenRouter-Title": "Acadsphere Timetable",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: EXTRACTION_PROMPT,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this image timetable file ("${fileName}") and extract ALL class/lecture entries into a clean JSON array according to the rules.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: dataUrl,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[OpenRouter Vision AI] Model ${model} HTTP ${response.status}:`, errText);
        continue;
      }

      const resData = await response.json();
      const rawText = resData.choices?.[0]?.message?.content?.trim();
      if (!rawText || rawText.length < 10) continue;

      const parsed = cleanAndParseJSON(rawText);
      if (parsed.length > 0) {
        const validEntries = parsed.map(validateEntry).filter((e): e is ExtractedEntry => e !== null);
        if (validEntries.length > 0) {
          console.log(`[OpenRouter Vision AI Success] Successfully extracted ${validEntries.length} entries via ${model}`);
          return validEntries;
        }
      }
    } catch (e) {
      console.warn(`[OpenRouter Vision AI] Model ${model} extraction failed:`, e);
    }
  }

  return null;
}

// Candidate Hugging Face models ordered by response speed & JSON format reliability
const CANDIDATE_MODELS = [
  "Qwen/Qwen2.5-Coder-32B-Instruct",
  "Qwen/Qwen2.5-72B-Instruct",
  "mistralai/Mistral-7B-Instruct-v0.3",
];

// Text AI completion fallback chain (OpenRouter Google Gemma 26B -> Hugging Face Qwen2.5-32B)
async function chatCompletionWithFallback(hf: HfInference, userMessageContent: string): Promise<string> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  // 1. Try OpenRouter free text models first
  if (openRouterKey) {
    const openRouterTextModels = [
      "google/gemma-4-26b-a4b-it:free",
      "nvidia/nemotron-3-nano-30b-a3b:free",
      "google/gemma-4-31b-it:free",
    ];

    for (const model of openRouterTextModels) {
      try {
        console.log(`[OpenRouter Text AI] Attempting extraction with model: ${model}...`);
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://acadsphere.app",
            "X-OpenRouter-Title": "Acadsphere Timetable",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: EXTRACTION_PROMPT },
              { role: "user", content: userMessageContent },
            ],
            temperature: 0.1,
            max_tokens: 2048,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content && content.length > 10) {
            return content;
          }
        }
      } catch (e) {
        console.warn(`[OpenRouter Text AI] Model ${model} failed:`, e);
      }
    }
  }

  // 2. Fallback to Hugging Face models
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`[Hugging Face AI] Attempting text extraction with model: ${model}...`);
      const response = await hf.chatCompletion({
        model,
        messages: [
          { role: "system", content: EXTRACTION_PROMPT },
          { role: "user", content: userMessageContent },
        ],
        temperature: 0.1,
        max_tokens: 2048,
      });

      const content = response.choices?.[0]?.message?.content?.trim();
      if (content) {
        return content;
      }
    } catch (err: any) {
      console.warn(`[Hugging Face AI] Model ${model} failed (${err.message || err}), trying next fallback model...`);
      lastError = err;
    }
  }

  throw lastError || new Error("All AI text models timed out or failed to respond. Please try again.");
}

interface ExtractRateLimitRecord {
  attempts: number;
  resetTime: number;
}

const globalForExtractRateLimit = global as unknown as {
  extractRateLimitStore?: Record<string, ExtractRateLimitRecord>;
};

if (!globalForExtractRateLimit.extractRateLimitStore) {
  globalForExtractRateLimit.extractRateLimitStore = {};
}

const extractStore = globalForExtractRateLimit.extractRateLimitStore;

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session independently on the server side
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Access Denied: Unauthenticated." },
        { status: 401 }
      );
    }
    const token = authHeader.substring(7);
    const supabaseServer = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Access Denied: Invalid or expired session." },
        { status: 401 }
      );
    }

    // 1.5 Rate Limiting (5 extractions per hour)
    const now = Date.now();
    const limit = 5;
    const windowMs = 60 * 60 * 1000;
    const record = extractStore[user.id];
    
    if (record) {
      if (now < record.resetTime) {
        if (record.attempts >= limit) {
          const waitMin = Math.ceil((record.resetTime - now) / 60000);
          return NextResponse.json(
            { error: `Too many extractions. Please try again after ${waitMin} minutes.` },
            { status: 429 }
          );
        }
        record.attempts += 1;
      } else {
        record.attempts = 1;
        record.resetTime = now + windowMs;
      }
    } else {
      extractStore[user.id] = {
        attempts: 1,
        resetTime: now + windowMs
      };
    }

    // 2. Validate API key configuration
    if (!HUGGINGFACE_API_KEY && !OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "AI API keys are not configured. Please add OPENROUTER_API_KEY or HUGGINGFACE_API_KEY to environment variables." },
        { status: 500 }
      );
    }

    // 3. Parse request body
    const body = await request.json();
    const { fileData, fileName, mimeType } = body;

    if (!fileData || !fileName) {
      return NextResponse.json(
        { error: "Missing file data or file name." },
        { status: 400 }
      );
    }

    // 4. Check SHA-256 duplicate cache
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

    // 5. Validate file size limit (20MB)
    const estimatedSize = (fileData.length * 3) / 4;
    if (estimatedSize > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File is too large. Maximum upload limit is 20MB." },
        { status: 400 }
      );
    }

    // 5.5 If uploading an Image, try OpenRouter Vision AI (Google Gemma 4 26B & NVIDIA Nemotron VL) first!
    const isImage = (mimeType && mimeType.startsWith("image/")) || /\.(png|jpe?g|webp)$/i.test(fileName);
    if (isImage) {
      const visionEntries = await extractWithOpenRouterVision(fileData, mimeType || "image/png", fileName);
      if (visionEntries && visionEntries.length > 0) {
        extractionCache.set(fileHash, {
          entries: visionEntries,
          timestamp: Date.now(),
        });
        return NextResponse.json({
          entries: visionEntries,
          totalExtracted: visionEntries.length,
          totalValid: visionEntries.length,
        });
      }
      console.log("[Fallback Pipeline] OpenRouter Vision AI returned 0 entries or reached limit, falling back to Sharp + Tesseract + Hugging Face...");
    }

    // 6. Convert base64 to buffer & extract raw text
    const fileBuffer = Buffer.from(fileData, "base64");
    const extractedText = await extractRawText(fileBuffer, mimeType || "", fileName);

    if (!extractedText || extractedText.trim().length < 5) {
      return NextResponse.json(
        { error: "Could not read text from the file. Please upload a clearer document or image." },
        { status: 422 }
      );
    }

    // 7. Call AI text model chain (OpenRouter Gemma 26B -> Hugging Face Qwen2.5-32B)
    const hf = new HfInference(HUGGINGFACE_API_KEY);
    const userPrompt = `Here is the extracted text from the timetable file ("${fileName}"):\n\n${extractedText}\n\nParse this into a clean JSON array of timetable entries according to the rules.`;
    const rawText = await chatCompletionWithFallback(hf, userPrompt);

    if (!rawText) {
      return NextResponse.json(
        { error: "AI returned an empty response. The file text could not be parsed." },
        { status: 422 }
      );
    }

    // 8. Clean and parse JSON array
    const parsed = cleanAndParseJSON(rawText);

    if (parsed.length === 0) {
      console.error("AI text completion was not valid JSON array:", rawText.substring(0, 300));
      return NextResponse.json(
        { error: "Could not parse AI output into JSON. Please try uploading a clearer timetable image or PDF." },
        { status: 422 }
      );
    }

    // 9. Validate entries
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

    if (message.includes("429") || message.toLowerCase().includes("rate") || message.toLowerCase().includes("quota")) {
      return NextResponse.json(
        { error: "Hugging Face API rate limit reached. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    if (message.includes("401") || message.includes("403") || message.toLowerCase().includes("api key")) {
      return NextResponse.json(
        { error: "Hugging Face API key is invalid or expired. Please update HUGGINGFACE_API_KEY in environment variables." },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
