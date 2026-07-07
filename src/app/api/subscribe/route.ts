import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { subscribeSchema, validateJsonBody, isUniqueViolationError } from "@/lib/api/validate";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_IP = { limit: 10, windowMs: 60 * 60 * 1000 }; // 10 per IP per hour

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(`subscribe:ip:${ip}`, RATE_LIMIT_IP.limit, RATE_LIMIT_IP.windowMs)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(RATE_LIMIT_IP.windowMs / 1000)) } }
      );
    }

    const v = await validateJsonBody(request, subscribeSchema);
    if (!v.ok) return v.response;

    const { email, source } = v.data;
    const normalizedEmail = email.toLowerCase();

    // Check for existing subscriber
    const existing = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "You're already subscribed!" },
        { status: 400 }
      );
    }

    // Insert new subscriber. The email column is unique at the DB level, so
    // a concurrent request that also passed the check above can still lose
    // this race — treat that as "already subscribed" rather than a 500.
    try {
      await db.insert(newsletterSubscribers).values({
        email: normalizedEmail,
        source: source || "website",
      });
    } catch (insertError) {
      if (isUniqueViolationError(insertError)) {
        return NextResponse.json(
          { error: "You're already subscribed!" },
          { status: 400 }
        );
      }
      throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
