import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { newsletterSchema, validateJsonBody, isUniqueViolationError } from "@/lib/api/validate";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_IP = { limit: 10, windowMs: 60 * 60 * 1000 }; // 10 per IP per hour

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(`newsletter:ip:${ip}`, RATE_LIMIT_IP.limit, RATE_LIMIT_IP.windowMs)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(RATE_LIMIT_IP.windowMs / 1000)) } }
      );
    }

    const v = await validateJsonBody(request, newsletterSchema);
    if (!v.ok) return v.response;

    const email = v.data.email.toLowerCase();

    // Check if email already exists
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You're already subscribed!" },
        { status: 200 }
      );
    }

    // Insert new subscriber. The email column is unique at the DB level, so
    // a concurrent request that also passed the check above can still lose
    // this race — treat that as "already subscribed" rather than a 500.
    try {
      await db.insert(newsletterSubscribers).values({
        email,
        source: "homepage",
      });
    } catch (insertError) {
      if (isUniqueViolationError(insertError)) {
        return NextResponse.json(
          { message: "You're already subscribed!" },
          { status: 200 }
        );
      }
      throw insertError;
    }

    return NextResponse.json(
      { message: "Thanks! You're on the list." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
