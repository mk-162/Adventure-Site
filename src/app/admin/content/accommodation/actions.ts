"use server";

import { db } from "@/db";
import { accommodation } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Soft-archive: hides the accommodation listing from the public site without deleting it. */
export async function archiveAccommodation(accommodationId: number) {
  await db
    .update(accommodation)
    .set({ status: "archived" })
    .where(eq(accommodation.id, accommodationId));

  revalidatePath("/admin/content/accommodation");
  revalidatePath(`/admin/content/accommodation/${accommodationId}`);
}
