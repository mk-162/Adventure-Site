import type { evidenceSourceTypeEnum, evidenceVerdictEnum } from "@/db/schema";

export type EvidenceSourceType = (typeof evidenceSourceTypeEnum.enumValues)[number];
export type EvidenceVerdict = (typeof evidenceVerdictEnum.enumValues)[number];

/**
 * The CSV seed is the original spreadsheet import, not a human check — it can
 * describe a claim but can never be the source that makes a claim publishable
 * as verified.
 */
export function isPublishableEvidenceSource(sourceType: EvidenceSourceType): boolean {
  return sourceType !== "csv_seed";
}

export function canPublishVerification(evidence: {
  sourceType: EvidenceSourceType;
  verdict: EvidenceVerdict;
}): boolean {
  return evidence.verdict === "verified" && isPublishableEvidenceSource(evidence.sourceType);
}
