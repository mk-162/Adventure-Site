import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { magicLinks, operatorSessions, operators, operatorClaims } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { setOperatorSession } from "@/lib/auth";

/**
 * Clicking a magic link only proves the claimant owns the EMAIL. Instant
 * approval additionally requires the email's domain to match the operator's
 * website domain; anything else goes to the /admin/commercial/claims queue.
 */
function emailMatchesWebsiteDomain(email: string, website: string | null): boolean {
  if (!website) return false;
  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (!emailDomain) return false;
  try {
    const host = new URL(/^https?:\/\//.test(website) ? website : `https://${website}`)
      .hostname.toLowerCase()
      .replace(/^www\./, "");
    return host === emailDomain || host.endsWith(`.${emailDomain}`) || emailDomain.endsWith(`.${host}`);
  } catch {
    return false;
  }
}

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

    if (new Date() > magicLink.expiresAt) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const operator = await db.query.operators.findFirst({
      where: eq(operators.id, magicLink.operatorId!),
    });

    if (!operator) {
      return NextResponse.json({ error: "Operator not found" }, { status: 404 });
    }

    // Idempotent for LOGIN links: if token already used, still create a session
    // and succeed. This handles double-clicks, email previews, browser prefetch.
    // Claim links fall through to the claim-state logic below so a re-click
    // can't mint a session for a claim that is still pending or was rejected.
    if (magicLink.used && magicLink.purpose === "login") {
      await setOperatorSession({
        operatorId: operator.id,
        email: magicLink.email,
        name: operator.name,
      });
      return NextResponse.json({ success: true, status: "verified" });
    }

    // Mark as used
    if (!magicLink.used) {
      await db.update(magicLinks).set({ used: true }).where(eq(magicLinks.id, magicLink.id));
    }

    if (magicLink.purpose === "login") {
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

      return NextResponse.json({ success: true, status: "verified" });
    }

    if (magicLink.purpose === "claim") {
      // Find the latest claim for this operator+email, whatever its state
      const claim = await db.query.operatorClaims.findFirst({
        where: and(
          eq(operatorClaims.operatorId, operator.id),
          eq(operatorClaims.claimantEmail, magicLink.email)
        ),
        orderBy: desc(operatorClaims.createdAt),
      });

      if (!claim) {
        // Token valid but no claim record. Only let them in if this email was
        // already approved as the operator's verified contact.
        if (operator.claimStatus !== "stub" && operator.verifiedByEmail === magicLink.email) {
          await setOperatorSession({
            operatorId: operator.id,
            email: magicLink.email,
            name: operator.name,
          });
          return NextResponse.json({ success: true, status: "verified" });
        }
        return NextResponse.json({ error: "No claim found for this link" }, { status: 400 });
      }

      if (claim.status === "rejected") {
        return NextResponse.json({ error: "This claim was rejected" }, { status: 403 });
      }

      if (claim.status === "verified") {
        // Re-click after approval (auto or via admin queue) — start a session
        await setOperatorSession({
          operatorId: operator.id,
          email: magicLink.email,
          name: claim.claimantName,
        });
        return NextResponse.json({ success: true, status: "verified" });
      }

      // Pending claim: email ownership is now proven. Instant approval only
      // when the email domain matches the operator's website domain.
      if (!emailMatchesWebsiteDomain(magicLink.email, operator.website)) {
        await db.update(operatorClaims).set({
          verificationMethod: "email_match", // email verified, awaiting manual review
        }).where(eq(operatorClaims.id, claim.id));
        return NextResponse.json({ success: true, status: "pending_approval" });
      }

      await db.update(operatorClaims).set({
        status: "verified",
        verificationMethod: "domain_match",
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
