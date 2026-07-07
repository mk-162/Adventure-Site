"use server";

import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Soft-archive: hides the activity from the public site without deleting it. */
export async function archiveActivity(activityId: number) {
  await db
    .update(activities)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(activities.id, activityId));

  revalidatePath("/admin/content/activities");
  revalidatePath(`/admin/content/activities/${activityId}`);
}
