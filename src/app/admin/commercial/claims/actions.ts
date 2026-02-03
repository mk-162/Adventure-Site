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
}
