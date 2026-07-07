"use server";

import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type OperatorStatus = "draft" | "review" | "published" | "archived";

/**
 * Updates ONLY the publish status column for an operator. Deliberately kept
 * separate from the general operator update action (see operators/[id]/page.tsx)
 * so publish/unpublish is always an explicit, isolated action rather than a
 * side effect of an unrelated field edit. Publishing is the only thing that
 * makes an operator publicly reachable at /directory/{slug} — see
 * src/lib/queries/operators.ts which gates public queries on status='published'.
 */
export async function setOperatorStatus(
  operatorId: number,
  status: OperatorStatus
) {
  const [operator] = await db
    .select({ slug: operators.slug })
    .from(operators)
    .where(eq(operators.id, operatorId));

  await db
    .update(operators)
    .set({ status, updatedAt: new Date() })
    .where(eq(operators.id, operatorId));

  revalidatePath("/admin/content/operators");
  revalidatePath(`/admin/content/operators/${operatorId}`);
  revalidatePath("/directory");
  if (operator) revalidatePath(`/directory/${operator.slug}`);
}

/** Soft-archive: hides the operator from the public site without deleting it. */
export async function archiveOperator(operatorId: number) {
  await setOperatorStatus(operatorId, "archived");
}
