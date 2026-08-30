/**
 * Shared vocabulary for the durable content-ops review layer.
 *
 * Boundary this module exists to enforce: everything here records *what a human
 * decided or reviewed*. Nothing here applies research to domain content,
 * publishes a page, changes operator tier/status, or deploys. The dashboard and
 * its two POST routes are the only consumers.
 */
import { contentReviewStatusEnum, opsDecisionEnum } from "@/db/schema";
import {
  OPERATOR_ENTITY_TYPE,
  countVerifiedEvidenceByItem,
  describeEvidenceTarget,
  resolveEvidenceTargetRequest,
  type ResolvedEvidenceTarget,
} from "./evidence-target";

export type CommercialDecisionOption = (typeof opsDecisionEnum.enumValues)[number];
export type ContentReviewStatus = (typeof contentReviewStatusEnum.enumValues)[number];

export interface CommercialDecisionOptionRecord {
  id: CommercialDecisionOption;
  label: string;
  meaning: string;
}

/** Canonical option set — mirrors ops_decisions.decision, which is the enum of record. */
export const COMMERCIAL_DECISION_OPTIONS: CommercialDecisionOptionRecord[] = [
  { id: "strategic_anchor", label: "Strategic Anchor", meaning: "Free enhanced treatment because it materially improves Adventure Wales launch credibility." },
  { id: "premium_sales_lure", label: "Premium Sales Lure", meaning: "Premium-quality preview for sales outreach; not a free published premium listing." },
  { id: "claimed_basic", label: "Claimed/Basic", meaning: "Verified basic listing only; no unpaid premium placement." },
  { id: "stub_only", label: "Stub Only", meaning: "Minimal claim-CTA page until claimed or paid." },
  { id: "remove_or_block", label: "Remove/Block", meaning: "Hold or remove because evidence, safety, identity, or permission is unresolved." },
  { id: "needs_human_permission", label: "Needs Permission", meaning: "Explicit operator/source/media permission needed before using assets or claims." },
];

export function isCommercialDecisionOption(value: unknown): value is CommercialDecisionOption {
  return typeof value === "string" && (opsDecisionEnum.enumValues as readonly string[]).includes(value);
}

/**
 * The subset of content_review_status a reviewer may set from the dashboard.
 *
 * Deliberately excludes `published` (and the machine-owned lifecycle states):
 * publishing is not a review action and must never be reachable from here.
 */
export const REVIEW_ACTION_STATUSES = [
  "researched",
  "qa_needed",
  "reviewed",
  "signed_off",
  "blocked",
] as const;

export type ReviewActionStatus = (typeof REVIEW_ACTION_STATUSES)[number];

export function isReviewActionStatus(value: unknown): value is ReviewActionStatus {
  return typeof value === "string" && (REVIEW_ACTION_STATUSES as readonly string[]).includes(value);
}

export const REVIEW_ACTION_LABELS: Record<ReviewActionStatus, string> = {
  researched: "Researched",
  qa_needed: "QA needed",
  reviewed: "Reviewed",
  signed_off: "Signed off",
  blocked: "Blocked",
};

/** Guardrails stamped onto every durable decision row, so the record itself states its limits. */
export const DECISION_GUARDRAILS = [
  "does_not_publish_content",
  "does_not_change_operator_tier_automatically",
] as const;

// ---------------------------------------------------------------------------
// Durable read model for /admin/content-ops
// ---------------------------------------------------------------------------

export interface DurableDecision {
  contentItemId: string;
  decision: CommercialDecisionOption;
  decidedByEmail: string;
  decidedAt: Date;
  rationale: string | null;
  nextAction: string | null;
}

export interface DurableReview {
  contentItemId: string;
  status: ContentReviewStatus;
  reviewedByEmail: string | null;
  reviewedAt: Date | null;
  notes: string | null;
}

/** The queue item fields the durable loader needs: the id to key state by, and enough to find its evidence. */
export interface DurableContentOpsItem {
  contentItemId: string;
  contentType: string;
  routeOrSlug: string;
}

export interface DurableContentOpsState {
  /** False when the fact-check tables are missing or the database is unreachable. */
  available: boolean;
  unavailableReason: string | null;
  latestDecisionByItem: Map<string, DurableDecision>;
  reviewByItem: Map<string, DurableReview>;
  /** Keyed by content_item_id; only ever populated for items with a resolved evidence target. */
  verifiedEvidenceCountByItem: Map<string, number>;
  /** The listing_evidence address each item resolved to. Absent means "identity unknown", not "no evidence". */
  evidenceTargetByItem: Map<string, ResolvedEvidenceTarget>;
}

function emptyState(available: boolean, unavailableReason: string | null): DurableContentOpsState {
  return {
    available,
    unavailableReason,
    latestDecisionByItem: new Map(),
    reviewByItem: new Map(),
    verifiedEvidenceCountByItem: new Map(),
    evidenceTargetByItem: new Map(),
  };
}

function unavailableReasonFrom(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return (
    `Durable review tables could not be read (${message}). The most likely cause is that the ` +
    "fact-check migrations have not been applied to this database."
  );
}

function toTime(value: Date | string | null): number {
  if (!value) return 0;
  const time = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

/**
 * Reads durable decision/review/evidence state for the given content items.
 *
 * Read-only by construction, and never throws: any failure (tables not
 * migrated, database unreachable, DATABASE_URL unset) returns
 * `available: false` with a reason so the dashboard can keep rendering the
 * file-backed queue and say plainly that durable data is missing.
 */
export async function loadDurableContentOpsState(
  items: DurableContentOpsItem[],
): Promise<DurableContentOpsState> {
  const itemsById = new Map<string, DurableContentOpsItem>();
  for (const item of items) {
    if (item.contentItemId && item.contentItemId.trim().length > 0) {
      itemsById.set(item.contentItemId, item);
    }
  }
  const ids = Array.from(itemsById.keys());

  try {
    // Imported lazily and inside the try so an unset DATABASE_URL (which throws
    // at module load) degrades like any other store failure instead of 500ing.
    const { db } = await import("@/db");
    const { contentReviewState, listingEvidence, operators, opsDecisions } = await import("@/db/schema");
    const { and, desc, eq, inArray } = await import("drizzle-orm");

    if (ids.length === 0) {
      // Nothing to look up, but still confirm the durable store answers so the
      // availability banner is truthful on an empty queue.
      await db.select().from(opsDecisions).limit(1);
      return emptyState(true, null);
    }

    // Evidence identity is resolved per item before any evidence is read. Items
    // whose content type has no explicit mapper contribute nothing here — their
    // identity stays unknown rather than being guessed from the queue id.
    const operatorSlugByItem = new Map<string, string>();
    for (const [contentItemId, item] of itemsById) {
      const request = resolveEvidenceTargetRequest(item);
      if (request) operatorSlugByItem.set(contentItemId, request.operatorSlug);
    }
    const operatorSlugs = Array.from(new Set(operatorSlugByItem.values()));

    const [decisionRows, reviewRows, operatorRows] = await Promise.all([
      db
        .select()
        .from(opsDecisions)
        .where(inArray(opsDecisions.contentItemId, ids))
        .orderBy(desc(opsDecisions.decidedAt)),
      db.select().from(contentReviewState).where(inArray(contentReviewState.contentItemId, ids)),
      operatorSlugs.length > 0
        ? db
            .select({ id: operators.id, slug: operators.slug })
            .from(operators)
            .where(inArray(operators.slug, operatorSlugs))
        : Promise.resolve([] as { id: number; slug: string }[]),
    ]);

    const state = emptyState(true, null);

    // An operator's evidence entity id is its canonical operators.id as a
    // string. A slug with no operators row stays unmapped, so the dashboard
    // reports "identity unknown" instead of reading someone else's evidence.
    const operatorIdBySlug = new Map(operatorRows.map((row) => [row.slug, String(row.id)]));
    for (const [contentItemId, slug] of operatorSlugByItem) {
      const entityId = operatorIdBySlug.get(slug);
      if (entityId) {
        state.evidenceTargetByItem.set(contentItemId, { entityType: OPERATOR_ENTITY_TYPE, entityId });
      }
    }

    // Always scoped by entity_type as well as entity_id: listing_evidence is
    // polymorphic, so a bare entity_id would collide across entity types.
    const operatorEntityIds = Array.from(
      new Set(Array.from(state.evidenceTargetByItem.values()).map((target) => target.entityId)),
    );
    const evidenceRows =
      operatorEntityIds.length > 0
        ? await db
            .select()
            .from(listingEvidence)
            .where(
              and(
                eq(listingEvidence.entityType, OPERATOR_ENTITY_TYPE),
                inArray(listingEvidence.entityId, operatorEntityIds),
              ),
            )
        : [];

    // ops_decisions is append-only, so "the current decision" is the newest row
    // per item. Resolved here rather than in SQL so the answer does not depend
    // on row order.
    for (const row of decisionRows) {
      const current = state.latestDecisionByItem.get(row.contentItemId);
      if (!current || toTime(row.decidedAt) >= toTime(current.decidedAt)) {
        state.latestDecisionByItem.set(row.contentItemId, {
          contentItemId: row.contentItemId,
          decision: row.decision,
          decidedByEmail: row.decidedByEmail,
          decidedAt: row.decidedAt,
          rationale: row.rationale ?? null,
          nextAction: row.nextAction ?? null,
        });
      }
    }

    for (const row of reviewRows) {
      state.reviewByItem.set(row.contentItemId, {
        contentItemId: row.contentItemId,
        status: row.status,
        reviewedByEmail: row.reviewedByEmail ?? null,
        reviewedAt: row.reviewedAt ?? null,
        notes: row.notes ?? null,
      });
    }

    // Counts are keyed back to the dashboard's content_item_id from the full
    // (entity_type, entity_id) pair. A CSV seed row can never count as
    // verification, so an item with only seeded rows stays unverified rather
    // than scoring green.
    state.verifiedEvidenceCountByItem = countVerifiedEvidenceByItem(state.evidenceTargetByItem, evidenceRows);

    return state;
  } catch (error) {
    console.error("[content-ops] Durable review store unavailable; falling back to file-backed queue.", error);
    return emptyState(false, unavailableReasonFrom(error));
  }
}

export interface DurableStoreDescription {
  tone: "green" | "red";
  headline: string;
  detail: string;
}

/** User-facing wording for the dashboard's durable-store availability banner. */
export function describeDurableStore(state: DurableContentOpsState): DurableStoreDescription {
  if (state.available) {
    return {
      tone: "green",
      headline: "Durable review store connected",
      detail:
        "Decisions and review states below are read from ops_decisions and content_review_state, " +
        "so they survive deploys.",
    };
  }

  return {
    tone: "red",
    headline: "Durable review data is unavailable",
    detail:
      "Showing the file-backed queue only — durable decisions, review states and verified evidence " +
      `cannot be read, so treat every quality score below as unknown. ${state.unavailableReason ?? ""}`.trim(),
  };
}

// ---------------------------------------------------------------------------
// Per-item quality scorecard
// ---------------------------------------------------------------------------

export type ScorecardTone = "green" | "amber" | "red";

export type ScorecardKey =
  | "evidence"
  | "accuracy"
  | "image_rights"
  | "editorial"
  | "technical"
  | "approval";

export interface ScorecardCategory {
  key: ScorecardKey;
  label: string;
  tone: ScorecardTone;
  detail: string;
}

export interface ScorecardInput {
  item: {
    status: string;
    evidenceStatus: string;
    imageStatus: string;
    copyStatus: string;
    seoStatus: string;
    routeOrSlug: string;
    sourceCount: number;
  };
  research: { sourceCount: number; imageStatus: string; humanReviewFlags: number } | null;
  durable: {
    available: boolean;
    decision: Pick<DurableDecision, "decision" | "decidedByEmail" | "decidedAt"> | null;
    review: Pick<DurableReview, "status" | "reviewedByEmail" | "reviewedAt"> | null;
    verifiedEvidenceCount: number;
    /** Which listing_evidence row set the count came from; null when this item has no mapped evidence identity. */
    evidenceTarget: ResolvedEvidenceTarget | null;
  };
}

const IMAGE_RIGHTS_RED = ["missing", "blocked", "blocked_or_missing", "needs_permission"];
const IMAGE_RIGHTS_GREEN = ["approved", "licensed", "ok", "usable_recorded", "ready"];
const COPY_READY = ["approved", "ready", "complete", "done", "signed_off"];
const COPY_BLOCKED = ["missing", "blocked", "not_started"];
const SEO_READY = ["ready", "complete", "approved", "ok", "done"];
const SEO_BLOCKED = ["missing", "blocked"];

const STORE_UNAVAILABLE_DETAIL = "Durable store unavailable — state unknown, not assumed good.";
// Covers both "this content type has no mapper yet" and "the operator slug
// matched no operators row" — either way the identity is unknown, not absent.
const NO_EVIDENCE_TARGET_DETAIL =
  "No listing_evidence entity is mapped for this item, so verification cannot be read.";

/**
 * Six founder-visible quality categories for one content item.
 *
 * Scoring rule: missing or unreadable data is amber (unknown) or red (recorded
 * blocker). Green is only ever returned from state that was actually recorded —
 * never inferred from an absence.
 */
export function buildQualityScorecard(input: ScorecardInput): ScorecardCategory[] {
  const { item, research, durable } = input;

  return [
    evidenceCategory(item, research, durable),
    accuracyCategory(durable),
    imageRightsCategory(item, research),
    editorialCategory(item),
    technicalCategory(item),
    approvalCategory(durable),
  ];
}

function evidenceCategory(
  item: ScorecardInput["item"],
  research: ScorecardInput["research"],
  durable: ScorecardInput["durable"],
): ScorecardCategory {
  const totalSources = item.sourceCount + (research?.sourceCount ?? 0);
  const flags = research?.humanReviewFlags ?? 0;
  const flagNote = flags > 0 ? ` ${flags} research passage(s) flagged for human review.` : "";

  // Green requires a resolved evidence target: a count with no identity behind
  // it says nothing about this item.
  if (durable.available && durable.evidenceTarget && durable.verifiedEvidenceCount > 0) {
    return {
      key: "evidence",
      label: "Evidence",
      tone: "green",
      detail: `${durable.verifiedEvidenceCount} verified evidence row(s) in listing_evidence for ${describeEvidenceTarget(durable.evidenceTarget)}, plus ${totalSources} recorded source(s).${flagNote}`,
    };
  }

  if (totalSources === 0) {
    return {
      key: "evidence",
      label: "Evidence",
      tone: "red",
      detail: "No sources recorded in the inventory or a research file.",
    };
  }

  if (!durable.available) {
    return {
      key: "evidence",
      label: "Evidence",
      tone: "amber",
      detail: `${totalSources} source(s) recorded. ${STORE_UNAVAILABLE_DETAIL}`,
    };
  }

  if (!durable.evidenceTarget) {
    return {
      key: "evidence",
      label: "Evidence",
      tone: "amber",
      detail: `${totalSources} source(s) recorded. ${NO_EVIDENCE_TARGET_DETAIL}${flagNote}`,
    };
  }

  return {
    key: "evidence",
    label: "Evidence",
    tone: "amber",
    detail: `${totalSources} source(s) recorded but none human-verified in listing_evidence for ${describeEvidenceTarget(durable.evidenceTarget)}.${flagNote}`,
  };
}

function accuracyCategory(durable: ScorecardInput["durable"]): ScorecardCategory {
  const label = "Accuracy / review";

  if (!durable.available) {
    return { key: "accuracy", label, tone: "amber", detail: STORE_UNAVAILABLE_DETAIL };
  }

  const review = durable.review;
  if (!review) {
    return { key: "accuracy", label, tone: "red", detail: "No durable review state recorded for this item." };
  }

  const who = review.reviewedByEmail ?? "unknown reviewer";
  const detail = `${review.status.replace(/_/g, " ")} — recorded by ${who}.`;

  if (review.status === "blocked") return { key: "accuracy", label, tone: "red", detail };
  if (review.status === "reviewed" || review.status === "signed_off") {
    return { key: "accuracy", label, tone: "green", detail };
  }
  return { key: "accuracy", label, tone: "amber", detail };
}

function imageRightsCategory(
  item: ScorecardInput["item"],
  research: ScorecardInput["research"],
): ScorecardCategory {
  const label = "Image rights";
  const recorded = [item.imageStatus, research?.imageStatus ?? ""].filter(Boolean).map((v) => v.toLowerCase());

  if (recorded.some((status) => IMAGE_RIGHTS_RED.includes(status))) {
    return { key: "image_rights", label, tone: "red", detail: `Image rights blocked or missing (${recorded.join(", ")}).` };
  }

  if (IMAGE_RIGHTS_GREEN.includes(item.imageStatus.toLowerCase())) {
    return { key: "image_rights", label, tone: "green", detail: `Usable image provenance recorded (${recorded.join(", ")}).` };
  }

  return {
    key: "image_rights",
    label,
    tone: "amber",
    detail: recorded.length
      ? `Image provenance not confirmed (${recorded.join(", ")}).`
      : "No image status or provenance recorded.",
  };
}

function editorialCategory(item: ScorecardInput["item"]): ScorecardCategory {
  const label = "Editorial";
  const copyStatus = item.copyStatus.toLowerCase();

  if (item.status === "research_needed" || item.status === "blocked" || COPY_BLOCKED.includes(copyStatus)) {
    return {
      key: "editorial",
      label,
      tone: "red",
      detail: `Copy not usable yet (status ${item.status || "not recorded"}, copy ${item.copyStatus || "not recorded"}).`,
    };
  }

  if (COPY_READY.includes(copyStatus)) {
    return { key: "editorial", label, tone: "green", detail: `Copy status ${item.copyStatus}.` };
  }

  return {
    key: "editorial",
    label,
    tone: "amber",
    detail: `Copy status ${item.copyStatus || "not recorded"} (item status ${item.status || "not recorded"}).`,
  };
}

function technicalCategory(item: ScorecardInput["item"]): ScorecardCategory {
  const label = "Technical / schema";
  const seoStatus = item.seoStatus.toLowerCase();

  if (!item.routeOrSlug.trim()) {
    return { key: "technical", label, tone: "red", detail: "No route or slug recorded — the page has no address." };
  }

  if (SEO_BLOCKED.includes(seoStatus)) {
    return { key: "technical", label, tone: "red", detail: `SEO/schema status ${item.seoStatus}.` };
  }

  if (SEO_READY.includes(seoStatus)) {
    return { key: "technical", label, tone: "green", detail: `Route ${item.routeOrSlug}, SEO/schema ${item.seoStatus}.` };
  }

  return {
    key: "technical",
    label,
    tone: "amber",
    detail: `Route ${item.routeOrSlug}, SEO/schema status ${item.seoStatus || "not recorded"}.`,
  };
}

function approvalCategory(durable: ScorecardInput["durable"]): ScorecardCategory {
  const label = "Approval";

  if (!durable.available) {
    return { key: "approval", label, tone: "amber", detail: STORE_UNAVAILABLE_DETAIL };
  }

  const decision = durable.decision;
  if (!decision) {
    return { key: "approval", label, tone: "red", detail: "No durable commercial decision recorded." };
  }

  const detail = `${decision.decision.replace(/_/g, " ")} — decided by ${decision.decidedByEmail}.`;
  if (decision.decision === "remove_or_block" || decision.decision === "needs_human_permission") {
    return { key: "approval", label, tone: "red", detail };
  }
  return { key: "approval", label, tone: "green", detail };
}
