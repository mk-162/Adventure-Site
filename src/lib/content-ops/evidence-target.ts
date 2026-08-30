/**
 * Maps a Content Ops queue item to its `listing_evidence` target.
 *
 * `listing_evidence` is polymorphic: a row is addressed by the pair
 * (`entity_type`, `entity_id`) and never by `entity_id` alone, because a
 * numeric id is only unique within its own entity type. The content-ops
 * `content_item_id` (e.g. `operator-gower-surf-academy`) is a control-plane
 * identifier for the file-backed queue — it is not an evidence entity id and
 * must never be used as one.
 *
 * For an operator the evidence entity id is the canonical `operators.id`, held
 * as a string. Resolution goes through the item's `/directory/<slug>` route,
 * which is the address the site actually serves, rather than by chopping a
 * prefix off the queue id. Content types with no explicit mapper resolve to
 * nothing: an unknown identity is reported as unknown, not guessed.
 */
import { canPublishVerification, type EvidenceSourceType, type EvidenceVerdict } from "./evidence";

export const OPERATOR_ENTITY_TYPE = "operator";

/** An evidence target whose natural key still has to be resolved against its own table. */
export interface EvidenceTargetRequest {
  entityType: typeof OPERATOR_ENTITY_TYPE;
  /** `operators.slug`, taken from the item's `/directory/<slug>` route. */
  operatorSlug: string;
}

/** A fully resolved `listing_evidence` address. */
export interface ResolvedEvidenceTarget {
  entityType: string;
  /** The entity's own primary key as stored in `listing_evidence.entity_id`. */
  entityId: string;
}

/** Matches exactly one non-empty path segment under /directory. */
const DIRECTORY_ROUTE = /^\/directory\/([^/?#]+)\/?$/;

/** Returns the operator slug an item's route points at, or null if the route is not a directory page. */
export function operatorSlugFromDirectoryRoute(routeOrSlug: string): string | null {
  const match = DIRECTORY_ROUTE.exec(routeOrSlug.trim());
  return match ? match[1] : null;
}

/**
 * The one explicit mapper: an `operator` item addressed by `/directory/<slug>`.
 * Everything else returns null so the dashboard reports the evidence state as
 * unknown rather than reading some other entity's rows.
 */
export function resolveEvidenceTargetRequest(item: {
  contentType: string;
  routeOrSlug: string;
}): EvidenceTargetRequest | null {
  if (item.contentType !== OPERATOR_ENTITY_TYPE) return null;

  const operatorSlug = operatorSlugFromDirectoryRoute(item.routeOrSlug);
  return operatorSlug ? { entityType: OPERATOR_ENTITY_TYPE, operatorSlug } : null;
}

/** Collision-free lookup key for a target — the entity type is part of the identity, not decoration. */
export function evidenceTargetKey(target: ResolvedEvidenceTarget): string {
  return `${target.entityType} ${target.entityId}`;
}

/** Human-readable form of a target, for dashboard copy (e.g. "operator #42"). */
export function describeEvidenceTarget(target: ResolvedEvidenceTarget): string {
  return `${target.entityType} #${target.entityId}`;
}

export interface EvidenceRowForCounting {
  entityType: string;
  entityId: string;
  sourceType: EvidenceSourceType;
  verdict: EvidenceVerdict;
}

/**
 * Counts publishable verifications per content item.
 *
 * Rows are matched on the full (entity_type, entity_id) pair, so evidence
 * recorded against a different entity type that happens to share a numeric id
 * cannot leak into an operator's count. Items with no resolved target get no
 * entry at all.
 */
export function countVerifiedEvidenceByItem(
  targetByItem: Map<string, ResolvedEvidenceTarget>,
  rows: readonly EvidenceRowForCounting[],
): Map<string, number> {
  const itemsByTargetKey = new Map<string, string[]>();
  for (const [contentItemId, target] of targetByItem) {
    const key = evidenceTargetKey(target);
    const existing = itemsByTargetKey.get(key);
    if (existing) existing.push(contentItemId);
    else itemsByTargetKey.set(key, [contentItemId]);
  }

  const counts = new Map<string, number>();
  for (const row of rows) {
    if (!canPublishVerification({ sourceType: row.sourceType, verdict: row.verdict })) continue;
    const contentItemIds = itemsByTargetKey.get(
      evidenceTargetKey({ entityType: row.entityType, entityId: row.entityId }),
    );
    if (!contentItemIds) continue;
    for (const contentItemId of contentItemIds) {
      counts.set(contentItemId, (counts.get(contentItemId) ?? 0) + 1);
    }
  }

  return counts;
}
