import Stripe from "stripe";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
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

/** Price IDs from env */
export const STRIPE_PRICES = {
  enhanced: process.env.STRIPE_ENHANCED_PRICE_ID || "",
  premium: process.env.STRIPE_PREMIUM_PRICE_ID || "",
} as const;

/** Map a Stripe price ID to a billing tier */
export function priceIdToTier(priceId: string): "free" | "verified" | "premium" {
  if (priceId === STRIPE_PRICES.enhanced) return "verified"; // "Enhanced" maps to "verified" in DB
  if (priceId === STRIPE_PRICES.premium) return "premium";
  return "free";
}
