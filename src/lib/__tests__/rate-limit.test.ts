import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { checkRateLimit } from "../rate-limit";

// The limiter keeps buckets in module-level state and reads Date.now(),
// so we control the clock with fake timers and use a unique key per test.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour, as used by admin-login

let testKey = 0;
function uniqueKey() {
  testKey += 1;
  return `test-key-${testKey}`;
}

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit", () => {
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 5, WINDOW_MS), `request ${i + 1}`).toBe(true);
    }
  });

  it("blocks the request after the limit is reached", () => {
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 5, WINDOW_MS)).toBe(true);
    }
    expect(checkRateLimit(key, 5, WINDOW_MS)).toBe(false);
    // Stays blocked on subsequent attempts within the window
    expect(checkRateLimit(key, 5, WINDOW_MS)).toBe(false);
  });

  it("refills after the window has elapsed", () => {
    const key = uniqueKey();
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, 3, WINDOW_MS)).toBe(true);
    }
    expect(checkRateLimit(key, 3, WINDOW_MS)).toBe(false);

    // Just before the window ends: still blocked
    vi.setSystemTime(Date.now() + WINDOW_MS - 1);
    expect(checkRateLimit(key, 3, WINDOW_MS)).toBe(false);

    // After the full window: bucket refills to the limit again
    vi.setSystemTime(Date.now() + 1);
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, 3, WINDOW_MS), `refilled ${i + 1}`).toBe(true);
    }
    expect(checkRateLimit(key, 3, WINDOW_MS)).toBe(false);
  });

  it("tracks separate keys independently", () => {
    const a = uniqueKey();
    const b = uniqueKey();
    expect(checkRateLimit(a, 1, WINDOW_MS)).toBe(true);
    expect(checkRateLimit(a, 1, WINDOW_MS)).toBe(false);
    // Key b is unaffected by key a's exhaustion
    expect(checkRateLimit(b, 1, WINDOW_MS)).toBe(true);
  });
});
