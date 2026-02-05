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
