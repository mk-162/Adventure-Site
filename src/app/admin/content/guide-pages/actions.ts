"use server";

import { db } from "@/db";
import { guidePages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Soft-archive: hides the guide page from the public site without deleting it. */
export async function archiveGuidePage(guidePageId: number) {
  await db
    .update(guidePages)
    .set({ contentStatus: "archived", updatedAt: new Date() })
    .where(eq(guidePages.id, guidePageId));

  revalidatePath("/admin/content/guide-pages");
  revalidatePath(`/admin/content/guide-pages/${guidePageId}`);
}
