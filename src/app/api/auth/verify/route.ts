import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { magicLinks, operatorSessions, operators, operatorClaims } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { setOperatorSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    // Look up magic link
    const linkRecord = await db.select().from(magicLinks).where(eq(magicLinks.token, token)).limit(1);

    if (linkRecord.length === 0) {
       return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    const magicLink = linkRecord[0];

    if (magicLink.used) {
      return NextResponse.json({ error: "Token already used" }, { status: 400 });
    }

    if (new Date() > magicLink.expiresAt) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // Mark as used
    await db.update(magicLinks).set({ used: true }).where(eq(magicLinks.id, magicLink.id));

    const operator = await db.query.operators.findFirst({
      where: eq(operators.id, magicLink.operatorId!),
    });

    if (!operator) {
      return NextResponse.json({ error: "Operator not found" }, { status: 404 });
    }

    if (magicLink.purpose === "login") {
      // Create session
      await db.insert(operatorSessions).values({
        operatorId: operator.id,
        email: magicLink.email,
        name: operator.name,
      });

      await setOperatorSession({
        operatorId: operator.id,
        email: magicLink.email,
        name: operator.name,
      });

      return NextResponse.json({ success: true });
    }

    if (magicLink.purpose === "claim") {
      // Find the claim
      const claim = await db.query.operatorClaims.findFirst({
        where: and(
            eq(operatorClaims.operatorId, operator.id),
            eq(operatorClaims.claimantEmail, magicLink.email),
            eq(operatorClaims.status, "pending")
        )
      });

      if (!claim) {
          return NextResponse.json({ error: "No pending claim found" }, { status: 404 });
      }

      if (claim.verificationMethod === "manual") {
          return NextResponse.json({ success: true, status: "pending_approval" });
      }

      // Auto verify
      await db.update(operatorClaims).set({
          status: "verified",
          verifiedAt: new Date(),
      }).where(eq(operatorClaims.id, claim.id));

      await db.update(operators).set({
          claimStatus: "claimed",
          verifiedAt: new Date(),
          verifiedByEmail: magicLink.email,
          billingEmail: magicLink.email,
          billingTier: "free"
      }).where(eq(operators.id, operator.id));

      // Create session
      await db.insert(operatorSessions).values({
        operatorId: operator.id,
        email: magicLink.email,
        name: claim.claimantName,
        role: claim.claimantRole,
      });

      await setOperatorSession({
        operatorId: operator.id,
        email: magicLink.email,
        name: claim.claimantName,
      });

      return NextResponse.json({ success: true, status: "verified" });
    }

    return NextResponse.json({ error: "Invalid purpose" }, { status: 400 });

  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
