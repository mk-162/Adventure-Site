import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { operators, magicLinks } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { sendMagicLink } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_EMAIL = { limit: 5, windowMs: 60 * 60 * 1000 };   // 5 per email per hour
const RATE_LIMIT_IP    = { limit: 20, windowMs: 60 * 60 * 1000 };  // 20 per IP per hour

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(`login:email:${email}`, RATE_LIMIT_EMAIL.limit, RATE_LIMIT_EMAIL.windowMs)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }
    if (!checkRateLimit(`login:ip:${ip}`, RATE_LIMIT_IP.limit, RATE_LIMIT_IP.windowMs)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // Find operators associated with this email
    const matchingOperators = await db.select().from(operators).where(
      or(
        eq(operators.verifiedByEmail, email),
        eq(operators.billingEmail, email)
      )
    );

    if (matchingOperators.length === 0) {
      // Security: Don't reveal if email exists or not.
      // But maybe return success anyway?
      // "Returns success"
      return NextResponse.json({ success: true });
    }

    for (const operator of matchingOperators) {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

      await db.insert(magicLinks).values({
        email,
        token,
        operatorId: operator.id,
        purpose: "login",
        expiresAt,
      });

      await sendMagicLink({
        to: email,
        operatorName: operator.name,
        token,
        purpose: "login",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
