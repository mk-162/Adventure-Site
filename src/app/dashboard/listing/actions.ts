"use server";

import { getOperatorSession } from "@/lib/auth";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { updateListingSchema } from "@/lib/api/validate";

// Keys the operator dashboard's edit-listing form is allowed to submit.
// Kept in sync with updateListingSchema in src/lib/api/validate.ts.
const LISTING_FIELDS = [
  "tagline",
  "description",
  "website",
  "tripadvisorUrl",
  "bookingWidgetUrl",
  "email",
  "phone",
  "address",
  "logoUrl",
  "coverImage",
  "priceRange",
  "uniqueSellingPoint",
] as const;

export async function updateListing(formData: FormData) {
  const session = await getOperatorSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // formData.get() returns null for a key that was never submitted, which is
  // indistinguishable from "" (a field the user deliberately cleared) once
  // cast to string. Only pick up keys that were actually present so we never
  // silently null out a column the form didn't render/submit this time.
  const raw: Record<string, unknown> = {};
  for (const field of LISTING_FIELDS) {
    if (formData.has(field)) {
      raw[field] = formData.get(field);
    }
  }

  const result = updateListingSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map(
      (i) => `${i.path.join(".") || "field"}: ${i.message}`
    );
    // Thrown so the calling client component's try/catch surfaces it (see
    // edit-listing-form.tsx). A structured { success, fieldErrors } return
    // would let the form render inline errors, but that requires a form
    // change out of scope here.
    throw new Error(`Validation failed: ${issues.join("; ")}`);
  }

  // Strip undefined so keys that weren't submitted are never included in
  // the update (defence in depth on top of the `raw` filtering above).
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(result.data)) {
    if (v !== undefined) data[k] = v;
  }

  if (Object.keys(data).length === 0) {
    return;
  }

  await db.update(operators)
    .set(data)
    .where(eq(operators.id, session.operatorId));

  revalidatePath("/dashboard/listing");
  revalidatePath("/dashboard");
}
