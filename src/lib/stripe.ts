import Stripe from "stripe";

// Pinned to the API version shipped by stripe SDK 20.3.0 (Stripe.LatestApiVersion).
// NOTE: this SDK's "clover" surface moved `current_period_end` off the top-level
// Subscription object and onto each subscription item (see extractPeriodEnd below).
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2026-01-28.clover" as Stripe.LatestApiVersion,
  });
}

export const stripe = getStripe();

/** Check if Stripe is configured */
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

/** Check if running in test mode */
export function isStripeTestMode(): boolean {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_test") ?? true;
}

/** Get the Stripe dashboard URL for the current mode */
export function getStripeDashboardUrl(path: string = ""): string {
  const prefix = isStripeTestMode() ? "test/" : "";
  return `https://dashboard.stripe.com/${prefix}${path}`;
}

/**
 * Price IDs from env — single source of truth for tier <-> price mapping.
 *
 * Every consumer (admin sync, webhook, checkout allowlist) must read tiers
 * through this map / priceIdToTier() rather than re-reading env vars
 * directly, so a renamed or missing env var fails the same way everywhere
 * instead of silently downgrading subscribers in one code path but not
 * another. There is intentionally no STRIPE_VERIFIED_PRICE_ID — the
 * "Enhanced" Stripe product maps to the "verified" DB tier via
 * STRIPE_ENHANCED_PRICE_ID.
 */
export const STRIPE_PRICES = {
  enhanced: process.env.STRIPE_ENHANCED_PRICE_ID || "",
  premium: process.env.STRIPE_PREMIUM_PRICE_ID || "",
} as const;

export type BillingTier = "free" | "verified" | "premium";

/**
 * Standard monthly GBP amount for each paid tier — the single constant that
 * admin MRR calculations (and anything else needing "how much is this tier")
 * should read from, instead of hardcoding numbers per-page. Per-operator
 * overrides live in `operators.billingCustomAmount`; callers should prefer
 * that value when set and fall back to this constant otherwise.
 */
export const TIER_PRICES_GBP: Record<"verified" | "premium", number> = {
  verified: 9.99, // "Enhanced" tier in the UI
  premium: 29.99,
};

/**
 * Map a Stripe price ID to a billing tier.
 *
 * Accepts an explicit price map (defaults to STRIPE_PRICES) purely so this
 * stays a pure, unit-testable function — production callers should never
 * need to pass the second argument.
 */
export function priceIdToTier(
  priceId: string | null | undefined,
  prices: { enhanced: string; premium: string } = STRIPE_PRICES
): BillingTier {
  if (!priceId) return "free";
  if (prices.enhanced && priceId === prices.enhanced) return "verified"; // "Enhanced" maps to "verified" in DB
  if (prices.premium && priceId === prices.premium) return "premium";
  return "free";
}

/** Structural shape needed to extract a subscription's current period end. */
export interface SubscriptionPeriodLike {
  current_period_end?: number | null;
  items?: {
    data?: Array<{ current_period_end?: number | null }>;
  };
}

/**
 * Extract a subscription's current period end (unix seconds), defensively.
 *
 * On the "clover" API version (SDK 20.3.0+), `current_period_end` moved from
 * the top-level Subscription object to each item in
 * `subscription.items.data[]`. We try the new location first and fall back
 * to the legacy top-level field for older payloads/mocks.
 */
export function extractPeriodEnd(subscription: SubscriptionPeriodLike): number | null {
  const itemPeriodEnd = subscription.items?.data?.[0]?.current_period_end;
  if (typeof itemPeriodEnd === "number") return itemPeriodEnd;
  if (typeof subscription.current_period_end === "number") return subscription.current_period_end;
  return null;
}

/** Convert a subscription's period end to a Date, or null if unavailable. */
export function periodEndToDate(subscription: SubscriptionPeriodLike): Date | null {
  const seconds = extractPeriodEnd(subscription);
  return seconds ? new Date(seconds * 1000) : null;
}
