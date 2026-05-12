import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { operators, operatorClaims, magicLinks } from "@/db/schema";
import { eq, and, gt, count } from "drizzle-orm";
import { sendMagicLink } from "@/lib/email";
import { z } from "zod";

const ClaimBody = z.object({
  operatorSlug: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  role: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = ClaimBody.safeParse(await req.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { operatorSlug, name, email, role } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Rate limiting: 3 per email per 24h
    const recentClaimsByEmail = await db
      .select({ count: count() })
      .from(operatorClaims)
      .where(
        and(
          eq(operatorClaims.claimantEmail, normalizedEmail),
          gt(operatorClaims.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        )
      );

    if (recentClaimsByEmail[0].count >= 3) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    // Rate limiting: 5 per IP per 24h
    const recentClaimsByIp = await db
      .select({ count: count() })
      .from(operatorClaims)
      .where(
        and(
          eq(operatorClaims.ipAddress, ip),
          gt(operatorClaims.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        )
      );

    if (recentClaimsByIp[0].count >= 5) {
      return NextResponse.json({ error: "Too many attempts from this IP." }, { status: 429 });
    }

    // Find operator
    const operator = await db.query.operators.findFirst({
      where: eq(operators.slug, operatorSlug),
    });

    if (!operator) {
      return NextResponse.json({ error: "Operator not found" }, { status: 404 });
    }

    // Check if already pending
    const existingClaim = await db.query.operatorClaims.findFirst({
      where: and(
        eq(operatorClaims.operatorId, operator.id),
        eq(operatorClaims.status, "pending")
      ),
    });

    if (existingClaim) {
      return NextResponse.json({ error: "This listing already has a pending claim." }, { status: 409 });
    }

    // Check if already claimed
    if (operator.claimStatus === "claimed" || operator.claimStatus === "premium") {
      return NextResponse.json({ error: "This listing has already been claimed." }, { status: 409 });
    }

    // All claims verified via email — click the link, you're in
    await db.insert(operatorClaims).values({
      operatorId: operator.id,
      claimantName: name,
      claimantEmail: normalizedEmail,
      claimantRole: role,
      verificationMethod: "email",
      status: "pending",
      ipAddress: ip,
    });

    // Create magic link
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    await db.insert(magicLinks).values({
      email: normalizedEmail,
      token,
      operatorId: operator.id,
      purpose: "claim",
      expiresAt,
    });

    // Send email
    await sendMagicLink({
      to: normalizedEmail,
      operatorName: operator.name,
      token,
      purpose: "claim",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
