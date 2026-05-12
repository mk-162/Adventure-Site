/**
 * Lightweight in-memory token-bucket rate limiter.
 *
 * Production note: replace with @upstash/ratelimit (or similar) backed by
 * Redis so limits survive restarts and work across multiple instances.
 * In-memory is fine for single-instance dev and low-traffic deployments.
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Check and consume one token from the bucket for `key`.
 *
 * @param key        Unique bucket identifier (e.g. email or IP)
 * @param limit      Max tokens per window
 * @param windowMs   Window size in milliseconds
 * @returns true if the request is allowed, false if rate-limited
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    buckets.set(key, bucket);
  }

  // Refill proportionally to elapsed time
  const elapsed = now - bucket.lastRefill;
  if (elapsed >= windowMs) {
    bucket.tokens = limit;
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) return false;
  bucket.tokens -= 1;
  return true;
}

// Periodically purge old buckets to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    // Remove buckets that haven't been touched in 2 hours
    if (now - bucket.lastRefill > 2 * 60 * 60 * 1000) {
      buckets.delete(key);
    }
  }
}, 30 * 60 * 1000);
