"use server";

import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveClaim(operatorId: number) {
  await db
    .update(operators)
    .set({ claimStatus: "claimed" })
    .where(eq(operators.id, operatorId));
  
  revalidatePath("/admin/commercial/claims");
  revalidatePath("/admin/content/operators");
}

export async function rejectClaim(operatorId: number) {
  await db
    .update(operators)
    .set({ 
      claimedByEmail: null,
      claimedAt: null 
    })
    .where(eq(operators.id, operatorId));

  revalidatePath("/admin/commercial/claims");
  revalidatePath("/admin/content/operators");
}

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
