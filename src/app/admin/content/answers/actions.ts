"use server";

import { db } from "@/db";
import { answers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Soft-archive: hides the FAQ answer from the public site without deleting it. */
export async function archiveAnswer(answerId: number) {
  await db
    .update(answers)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(answers.id, answerId));

  revalidatePath("/admin/content/answers");
  revalidatePath(`/admin/content/answers/${answerId}`);
}
