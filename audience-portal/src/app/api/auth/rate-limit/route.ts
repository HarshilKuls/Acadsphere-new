import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  attempts: number;
  resetTime: number;
}

const globalForRateLimit = global as unknown as {
  rateLimitStore?: Record<string, RateLimitRecord>;
};

if (!globalForRateLimit.rateLimitStore) {
  globalForRateLimit.rateLimitStore = {};
}

const store = globalForRateLimit.rateLimitStore;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email } = body;

    if (!type || !email) {
      return NextResponse.json({ error: "Type and email are required." }, { status: 400 });
    }

    if (type !== "login" && type !== "password_reset") {
      return NextResponse.json({ error: "Invalid type." }, { status: 400 });
    }

    // Extract client IP address
    const ip = request.headers.get("x-forwarded-for") || (request as { ip?: string }).ip || "127.0.0.1";
    const key = `${ip}:${type}`;

    const now = Date.now();
    const record = store[key];

    // Limits:
    // Login: 5 attempts per 20 minutes (1200000ms)
    // Password Reset: 3 attempts per 20 minutes (1200000ms)
    const limit = type === "login" ? 5 : 3;
    const windowMs = 20 * 60 * 1000;

    if (record) {
      if (now < record.resetTime) {
        if (record.attempts >= limit) {
          const waitMin = Math.ceil((record.resetTime - now) / 60000);
          return NextResponse.json(
            { error: `Too many attempts. Please try again after ${waitMin} minutes.` },
            { status: 429 }
          );
        }
        record.attempts += 1;
      } else {
        record.attempts = 1;
        record.resetTime = now + windowMs;
      }
    } else {
      store[key] = {
        attempts: 1,
        resetTime: now + windowMs
      };
    }

    return NextResponse.json({ success: true });
  } catch (_err: unknown) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
