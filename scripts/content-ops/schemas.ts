import { z } from "zod";

/**
 * Zod schemas for the content-ops pipeline.
 *
 * Shapes are derived from the TypeScript interfaces in scripts/content-ops/shared.ts
 * and from the real data files:
 *   - content/ops/content-inventory.json
 *   - content/ops/task-queue.json
 *   - content/content-gap-audit.json
 *   - data/research/content-ops/*.json
 */

// ---------------------------------------------------------------------------
// Shared enums (mirror ContentChannel / ContentStatus / EvidenceStatus / GateStatus)
// ---------------------------------------------------------------------------

export const contentChannelSchema = z.enum(["evergreen", "commercial", "dynamic"]);

export const contentStatusSchema = z.enum([
  "discovered",
  "triaged",
  "research_needed",
  "researched",
  "generated",
  "qa_needed",
  "reviewed",
  "signed_off",
  "published",
  "refresh_due",
  "blocked",
  "archived",
]);

export const evidenceStatusSchema = z.enum(["missing", "partial", "sourced", "verified"]);

export const gateStatusSchema = z.enum(["missing", "needs_review", "pass", "not_applicable"]);

// ---------------------------------------------------------------------------
// ContentInventoryItem (mirrors the interface in shared.ts)
// ---------------------------------------------------------------------------

export const contentInventoryItemSchema = z.object({
  id: z.string().min(1),
  channel: contentChannelSchema,
  content_type: z.string(),
  route_or_slug: z.string(),
  title: z.string(),
  region: z.string(),
  activity: z.string(),
  commercial_tier: z.string(),
  priority: z.number(),
  status: contentStatusSchema,
  launch_visible: z.boolean(),
  owner: z.string(),
  assigned_agent: z.string(),
  source_count: z.number(),
  source_urls: z.array(z.string()),
  evidence_status: evidenceStatusSchema,
  image_status: gateStatusSchema,
  image_source_url: z.string(),
  copy_status: gateStatusSchema,
  seo_status: gateStatusSchema,
  schema_status: gateStatusSchema,
  commercial_review_status: gateStatusSchema,
  safety_or_legal_status: gateStatusSchema,
  last_generated_at: z.string(),
  last_reviewed_at: z.string(),
  next_review_due: z.string(),
  published_at: z.string(),
  blocker_reason: z.string(),
  review_notes: z.string(),
  quality_score: z.number(),
  confidence_score: z.number(),
});

export type ContentInventoryItemShape = z.infer<typeof contentInventoryItemSchema>;

/** Envelope written to content/ops/content-inventory.json */
export const contentInventoryFileSchema = z.object({
  generatedAt: z.string(),
  sourceAuditGeneratedAt: z.string().nullable(),
  items: z.array(contentInventoryItemSchema),
});

// ---------------------------------------------------------------------------
// Task queue entry (mirrors TaskQueueItem in shared.ts / content/ops/task-queue.json)
// ---------------------------------------------------------------------------

export const taskQueueItemSchema = z.object({
  id: z.string().min(1),
  content_item_id: z.string().min(1),
  channel: contentChannelSchema,
  content_type: z.string(),
  route_or_slug: z.string(),
  title: z.string(),
  priority: z.number(),
  status: contentStatusSchema,
  recommended_skill: z.string(),
  task_type: z.enum(["research", "generation", "qa", "commercial_review", "refresh"]),
  brief: z.string(),
  acceptance_criteria: z.array(z.string()),
  source_requirements: z.array(z.string()),
  output_path: z.string(),
});

export type TaskQueueItemShape = z.infer<typeof taskQueueItemSchema>;

/** Envelope written to content/ops/task-queue.json */
export const taskQueueFileSchema = z.object({
  generatedAt: z.string(),
  tasks: z.array(taskQueueItemSchema),
});

// ---------------------------------------------------------------------------
// content/content-gap-audit.json (mirrors AuditFile + AuditGap)
// ---------------------------------------------------------------------------

export const auditGapSchema = z.object({
  category: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  page: z.string(),
  slug: z.string(),
  issue: z.string(),
  fix: z.string(),
  autoFixable: z.boolean(),
});

export type AuditGapShape = z.infer<typeof auditGapSchema>;

export const contentGapAuditSchema = z.object({
  generatedAt: z.string().optional(),
  stats: z.record(z.string(), z.unknown()).optional(),
  gaps: z.array(auditGapSchema).optional(),
});

export type ContentGapAuditShape = z.infer<typeof contentGapAuditSchema>;

// ---------------------------------------------------------------------------
// Research output files (data/research/content-ops/*.json)
//
// Deliberately lenient: research outputs vary per content type and agent run,
// so we validate the envelope only — the file must be a JSON object, and the
// fields the pipeline actually reads must have the expected types when present.
// Unknown extra fields are allowed (loose objects).
// ---------------------------------------------------------------------------

export const researchMetaSchema = z.looseObject({
  task: z.string().optional(),
  contentItem: z.string().optional(),
  contentType: z.string().optional(),
  slug: z.string().optional(),
  route: z.string().optional(),
  researchedAt: z.string().optional(),
  recommendedNextStatus: z.string().optional(),
  researchOutcome: z.string().optional(),
});

export const researchOutputSchema = z.looseObject({
  _meta: researchMetaSchema.optional(),
  recommendedNextStatus: z.string().optional(),
  recommended_next_status: z.string().optional(),
  recommendedNextStatusRationale: z.string().optional(),
  recommendedNextStatusReason: z.string().optional(),
  claimsNeedingHumanReview: z.array(z.unknown()).optional(),
  sourcesUsed: z.array(z.unknown()).optional(),
  sources: z.array(z.unknown()).optional(),
  images: z.unknown().optional(),
  imageResearch: z.unknown().optional(),
  imageProvenance: z.unknown().optional(),
  image_provenance: z.unknown().optional(),
});

export type ResearchOutputShape = z.infer<typeof researchOutputSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render a ZodError as a compact, human-readable issue list. */
export function formatValidationError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.length > 0 ? issue.path.join(".") : "(root)"}: ${issue.message}`)
    .join("\n");
}
