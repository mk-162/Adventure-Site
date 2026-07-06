/**
 * Absolute base URL for links that leave the request context (emails, Stripe
 * redirect URLs). Never returns undefined: falls back to the Vercel deployment
 * URL, then localhost in dev, and fails loudly in production rather than
 * emitting literal "undefined/..." links.
 */
export function getAppUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  if (url) return url.replace(/\/+$/, "");
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  throw new Error(
    "NEXT_PUBLIC_APP_URL is not set — required for email links and Stripe redirect URLs"
  );
}
