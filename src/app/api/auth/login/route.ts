import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { operators, magicLinks } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { sendMagicLink } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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

    // Rate limiting logic could go here (5 per email per hour)

    // Send link for each operator (or just the first one if we assume unique)
    // To avoid spam, if > 3 maybe we group them?
    // For now, I'll just handle the first one or loop.
    // The prompt implies a simple login flow.
    // I'll send for ALL matching operators.

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
