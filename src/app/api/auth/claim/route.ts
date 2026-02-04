import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { operators, operatorClaims, magicLinks } from "@/db/schema";
import { eq, and, gt, count, sql } from "drizzle-orm";
import { sendMagicLink } from "@/lib/email";
import { emailMatchesDomain } from "@/lib/verification";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { operatorSlug, name, email, role } = body;

    if (!operatorSlug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Rate limiting: 3 per email per 24h
    const recentClaimsByEmail = await db
      .select({ count: count() })
      .from(operatorClaims)
      .where(
        and(
          eq(operatorClaims.claimantEmail, email),
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

    // Determine verification method
    let verificationMethod = "manual";
    if (operator.website && emailMatchesDomain(email, operator.website)) {
      verificationMethod = "domain_match";
    } else if (operator.email === email) {
      verificationMethod = "email_match";
    }

    // Create claim
    await db.insert(operatorClaims).values({
      operatorId: operator.id,
      claimantName: name,
      claimantEmail: email,
      claimantRole: role,
      verificationMethod,
      status: "pending",
      ipAddress: ip,
    });

    // Create magic link
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    await db.insert(magicLinks).values({
      email,
      token,
      operatorId: operator.id,
      purpose: "claim",
      expiresAt,
    });

    // Send email
    await sendMagicLink({
      to: email,
      operatorName: operator.name,
      token,
      purpose: "claim",
    });

    // TODO: If manual review needed, also sends notification email to admin (Skipping for now as per minimal viable plan)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
