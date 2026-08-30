import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { opsDecisions } from "@/db/schema";
import {
  DECISION_GUARDRAILS,
  isCommercialDecisionOption,
} from "@/lib/content-ops/durable-review";

const DEFAULT_RATIONALE =
  "Recorded from dashboard action. Add/expand rationale before downstream production work if needed.";
const DEFAULT_NEXT_ACTION =
  "Route to the appropriate Adventure Wales workflow; do not publish or change production operator tier without review gate.";

function parseNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function text(value: FormDataEntryValue | null, fallback = "") {
  return value?.toString().trim() || fallback;
}

/**
 * Records one human commercial decision as an append-only ops_decisions row.
 *
 * Durable boundary: this writes to ops_decisions and nothing else. It does not
 * touch operators, any public content table, `status='published'`, or operator
 * tier — the decision is evidence that a human chose an option, not an
 * instruction that anything is applied.
 */
export async function POST(request: NextRequest) {
  // Imported lazily, alongside the "@/db" import below, so merely loading this
  // route module (e.g. during `next build`'s page-data collection) does not
  // evaluate "@/db" through admin-auth's static import chain when
  // DATABASE_URL is absent.
  const { requireAdminRole, AdminAuthError } = await import("@/lib/admin-auth");

  let admin;
  try {
    admin = await requireAdminRole(["super", "admin", "editor"]);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      redirect(`/admin/content-ops?decision=${error.status === 401 ? "unauthorized" : "forbidden"}`);
    }
    throw error;
  }

  const form = await request.formData();
  const decision = text(form.get("decision"));

  if (!isCommercialDecisionOption(decision)) {
    redirect("/admin/content-ops?decision=invalid");
  }

  const contentItemId = text(form.get("content_item_id"));
  if (!contentItemId) {
    redirect("/admin/content-ops?decision=missing-item");
  }

  // Decider identity is taken from the verified admin session only; any
  // client-supplied decider field is ignored.
  let outcome: "recorded" | "store-unavailable" = "recorded";
  try {
    // Imported lazily so a missing/unreachable DATABASE_URL surfaces as an
    // honest "store unavailable" outcome rather than a module-load 500.
    const { db } = await import("@/db");
    await db.insert(opsDecisions).values({
      contentItemId,
      title: text(form.get("title")) || null,
      routeOrSlug: text(form.get("route_or_slug")) || null,
      decision,
      decidedByEmail: admin.email,
      rationale: text(form.get("rationale"), DEFAULT_RATIONALE),
      nextAction: text(form.get("next_action"), DEFAULT_NEXT_ACTION),
      evidenceSnapshot: {
        source_count: parseNumber(form.get("source_count")),
        research_source_count: parseNumber(form.get("research_source_count")),
        image_status: text(form.get("image_status"), "not_recorded"),
        research_image_status: text(form.get("research_image_status"), "not_recorded"),
        research_file: text(form.get("research_file")),
      },
      guardrails: [...DECISION_GUARDRAILS],
    });
  } catch (error) {
    console.error(
      "[content-ops/decisions] Durable insert into ops_decisions failed. The decision was NOT " +
        "recorded — the most likely cause is that the fact-check migrations have not been applied " +
        "to this database.",
      error,
    );
    outcome = "store-unavailable";
  }

  redirect(`/admin/content-ops?decision=${outcome}`);
}
