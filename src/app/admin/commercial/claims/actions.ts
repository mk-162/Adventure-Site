"use server";

import { db } from "@/db";
import { operators, operatorClaims, magicLinks, operatorSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { setOperatorSession } from "@/lib/auth";
import { sendMagicLink } from "@/lib/email";

// ── Claim actions ──────────────────────────────────────

export async function approveClaim(claimId: number) {
  const claim = await db.query.operatorClaims.findFirst({
    where: eq(operatorClaims.id, claimId),
  });
  if (!claim) throw new Error("Claim not found");

  await db.update(operatorClaims)
    .set({ status: "verified", verifiedAt: new Date() })
    .where(eq(operatorClaims.id, claimId));

  await db.update(operators)
    .set({
      claimStatus: "claimed",
      verifiedAt: new Date(),
      verifiedByEmail: claim.claimantEmail,
      billingEmail: claim.claimantEmail,
      billingTier: "free",
    })
    .where(eq(operators.id, claim.operatorId));

  revalidateAll();
}

export async function rejectClaim(claimId: number) {
  await db.update(operatorClaims)
    .set({ status: "rejected" })
    .where(eq(operatorClaims.id, claimId));

  revalidateAll();
}

// ── Operator status actions ────────────────────────────

export async function upgradeToPremium(operatorId: number) {
  await db.update(operators)
    .set({ claimStatus: "premium", type: "primary" })
    .where(eq(operators.id, operatorId));
  revalidateAll();
}

export async function downgradeToClaimed(operatorId: number) {
  await db.update(operators)
    .set({ claimStatus: "claimed", type: "secondary" })
    .where(eq(operators.id, operatorId));
  revalidateAll();
}

export async function setClaimStatus(operatorId: number, status: "stub" | "claimed" | "premium") {
  await db.update(operators)
    .set({
      claimStatus: status,
      type: status === "premium" ? "primary" : "secondary",
    })
    .where(eq(operators.id, operatorId));
  revalidateAll();
}

// ── Reset claim (unclaim operator) ─────────────────────

export async function resetClaim(operatorId: number) {
  // Delete all claims, sessions, and magic links for this operator
  await db.delete(operatorSessions).where(eq(operatorSessions.operatorId, operatorId));
  await db.delete(magicLinks).where(eq(magicLinks.operatorId, operatorId));
  await db.delete(operatorClaims).where(eq(operatorClaims.operatorId, operatorId));

  // Reset operator to stub
  await db.update(operators)
    .set({
      claimStatus: "stub",
      type: "secondary",
      verifiedAt: null,
      verifiedByEmail: null,
      billingEmail: null,
      billingTier: null,
    })
    .where(eq(operators.id, operatorId));

  revalidateAll();
}

// ── Send magic link from admin ─────────────────────────

export async function sendAdminMagicLink(operatorId: number, email: string) {
  const operator = await db.query.operators.findFirst({
    where: eq(operators.id, operatorId),
  });
  if (!operator) throw new Error("Operator not found");

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  await db.insert(magicLinks).values({
    email,
    token,
    operatorId,
    purpose: "login",
    expiresAt,
  });

  await sendMagicLink({
    to: email,
    operatorName: operator.name,
    token,
    purpose: "login",
  });

  return { success: true };
}

// ── Impersonate operator (admin login as) ──────────────

export async function impersonateOperator(operatorId: number) {
  const operator = await db.query.operators.findFirst({
    where: eq(operators.id, operatorId),
  });
  if (!operator) throw new Error("Operator not found");

  await setOperatorSession({
    operatorId: operator.id,
    email: operator.billingEmail || operator.email || "admin@adventurewales.co.uk",
    name: operator.name,
  });

  return { success: true };
}

// ── Helpers ────────────────────────────────────────────

function revalidateAll() {
  revalidatePath("/admin/content/operators");
  revalidatePath("/admin/commercial/claims");
  revalidatePath("/directory");
}
