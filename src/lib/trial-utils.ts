/**
 * NOTE: trials are currently dormant. Nothing in the codebase writes
 * `trialStartedAt` / `trialExpiresAt` for an operator — there is no
 * self-service or admin activation path yet, so `isTrialActive` will
 * always return false in practice and `getEffectiveTier` always falls
 * through to `billingTier`. These functions are kept (and still used by
 * the homepage and directory listing pages to render trial badges/sort
 * order) so that whenever an activation path is built, trials work
 * immediately without further changes here. Do not remove the
 * trial_tier/trial_started_at/trial_expires_at/trial_converted_at columns.
 */
export function isTrialActive(operator: { trialTier: string | null; trialExpiresAt: Date | null }): boolean {
  if (!operator.trialTier || !operator.trialExpiresAt) return false;
  return new Date() < operator.trialExpiresAt;
}

export function getEffectiveTier(operator: {
  billingTier: string | null;
  trialTier: string | null;
  trialExpiresAt: Date | null
}): string {
  if (isTrialActive(operator)) return operator.trialTier!;
  return operator.billingTier || "free";
}
