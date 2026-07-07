"use server";

import { db } from "@/db";
import { regions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Soft-archive: hides the region from the public site without deleting it. */
export async function archiveRegion(regionId: number) {
  await db
    .update(regions)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(regions.id, regionId));

  revalidatePath("/admin/content/regions");
  revalidatePath(`/admin/content/regions/${regionId}`);
}
