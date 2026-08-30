import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { contentReviewState } from "@/db/schema";
import { requireAdminRole, AdminAuthError } from "@/lib/admin-auth";
import { isReviewActionStatus } from "@/lib/content-ops/durable-review";

function text(value: FormDataEntryValue | null) {
  return value?.toString().trim() ?? "";
}

/**
 * Records one reviewer's lifecycle judgement as durable content_review_state.
 *
 * Durable boundary: this upserts a single content_review_state row keyed by
 * content_item_id and nothing else. `published` is rejected (see
 * REVIEW_ACTION_STATUSES — publishing is not a review action), no domain content
 * record is written, and no research JSON is applied to a listing.
 */
export async function POST(request: NextRequest) {
  let admin;
  try {
    admin = await requireAdminRole(["super", "admin", "editor"]);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      redirect(`/admin/content-ops?review=${error.status === 401 ? "unauthorized" : "forbidden"}`);
    }
    throw error;
  }

  const form = await request.formData();
  const status = text(form.get("review_status"));

  if (!isReviewActionStatus(status)) {
    redirect("/admin/content-ops?review=invalid-status");
  }

  const contentItemId = text(form.get("content_item_id"));
  if (!contentItemId) {
    redirect("/admin/content-ops?review=missing-item");
  }

  // Reviewer identity comes from the verified admin session only; any
  // client-supplied reviewer field is ignored.
  const reviewedAt = new Date();
  const notes = text(form.get("notes")) || null;

  let outcome: "recorded" | "store-unavailable" = "recorded";
  try {
    // Imported lazily so a missing/unreachable DATABASE_URL surfaces as an
    // honest "store unavailable" outcome rather than a module-load 500.
    const { db } = await import("@/db");
    await db
      .insert(contentReviewState)
      .values({
        contentItemId,
        status,
        reviewedByEmail: admin.email,
        reviewedAt,
        notes,
      })
      .onConflictDoUpdate({
        target: contentReviewState.contentItemId,
        set: {
          status,
          reviewedByEmail: admin.email,
          reviewedAt,
          notes,
          updatedAt: reviewedAt,
        },
      });
  } catch (error) {
    console.error(
      "[content-ops/review] Durable upsert into content_review_state failed. The review state was " +
        "NOT recorded — the most likely cause is that the fact-check migrations have not been " +
        "applied to this database.",
      error,
    );
    outcome = "store-unavailable";
  }

  redirect(`/admin/content-ops?review=${outcome}`);
}
