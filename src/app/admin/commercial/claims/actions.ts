"use server";

import { db } from "@/db";
import { operators, operatorClaims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// New actions for Claim Queue (working with operatorClaims)
export async function approveClaim(claimId: number) {
  const claim = await db.query.operatorClaims.findFirst({
    where: eq(operatorClaims.id, claimId),
  });

  if (!claim) {
    throw new Error("Claim not found");
  }

  // Update claim
  await db.update(operatorClaims)
    .set({
        status: "verified",
        verifiedAt: new Date()
    })
    .where(eq(operatorClaims.id, claimId));

  // Update operator
  await db.update(operators)
    .set({
        claimStatus: "claimed",
        verifiedAt: new Date(),
        verifiedByEmail: claim.claimantEmail,
        billingEmail: claim.claimantEmail,
        billingTier: "free",
    })
    .where(eq(operators.id, claim.operatorId));

  // TODO: Send approval email

  revalidatePath("/admin/commercial/claims");
}

export async function rejectClaim(claimId: number) {
   // Ideally we'd accept a reason here, but for simple button action:
   await db.update(operatorClaims)
    .set({ 
        status: "rejected",
    })
    .where(eq(operatorClaims.id, claimId));

  // TODO: Send rejection email

  revalidatePath("/admin/commercial/claims");
}

// Restored actions for other admin pages (working with operators directly)
export async function upgradeToPremium(operatorId: number) {
  await db
    .update(operators)
    .set({ claimStatus: "premium", type: "primary" })
    .where(eq(operators.id, operatorId));

  revalidatePath("/admin/content/operators");
  revalidatePath("/admin/commercial/claims");
  revalidatePath("/directory");
}

export async function downgradeToClaimed(operatorId: number) {
  await db
    .update(operators)
    .set({ claimStatus: "claimed", type: "secondary" })
    .where(eq(operators.id, operatorId));

  revalidatePath("/admin/content/operators");
  revalidatePath("/directory");
}

export async function setClaimStatus(operatorId: number, status: "stub" | "claimed" | "premium") {
  await db
    .update(operators)
    .set({ 
      claimStatus: status,
      type: status === "premium" ? "primary" : "secondary",
    })
    .where(eq(operators.id, operatorId));

  revalidatePath("/admin/content/operators");
  revalidatePath("/admin/commercial/claims");
  revalidatePath("/directory");
}
