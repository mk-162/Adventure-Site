import { describe, it, expect } from "vitest";
import {
  priceIdToTier,
  extractPeriodEnd,
  periodEndToDate,
  TIER_PRICES_GBP,
} from "../stripe";

const prices = { enhanced: "price_enhanced_123", premium: "price_premium_456" };

describe("priceIdToTier", () => {
  it("maps the enhanced price to the verified DB tier", () => {
    expect(priceIdToTier("price_enhanced_123", prices)).toBe("verified");
  });

  it("maps the premium price to the premium tier", () => {
    expect(priceIdToTier("price_premium_456", prices)).toBe("premium");
  });

  it("falls back to free for an unrecognized price id", () => {
    expect(priceIdToTier("price_unknown_999", prices)).toBe("free");
  });

  it("falls back to free for null/undefined price ids", () => {
    expect(priceIdToTier(null, prices)).toBe("free");
    expect(priceIdToTier(undefined, prices)).toBe("free");
  });

  it("never matches an empty string against an unconfigured (empty) env price", () => {
    // Regression guard: if STRIPE_ENHANCED_PRICE_ID is unset, STRIPE_PRICES.enhanced
    // is "" — an empty/undefined priceId must not be treated as a match.
    expect(priceIdToTier("", { enhanced: "", premium: "" })).toBe("free");
    expect(priceIdToTier(undefined, { enhanced: "", premium: "" })).toBe("free");
  });

  it("keeps the same tier mapping used by both the webhook and admin sync", () => {
    // Both call sites pass no explicit price map, i.e. rely on the module's
    // STRIPE_PRICES — this just documents that the default param exists and
    // resolves without throwing when env vars are unset.
    expect(priceIdToTier("anything")).toBe("free");
  });
});

describe("extractPeriodEnd", () => {
  it("prefers the clover-era subscription item location", () => {
    const subscription = {
      current_period_end: 1000, // legacy field, should be ignored when item value present
      items: { data: [{ current_period_end: 2000 }] },
    };
    expect(extractPeriodEnd(subscription)).toBe(2000);
  });

  it("falls back to the legacy top-level field when items are absent", () => {
    const subscription = { current_period_end: 1500 };
    expect(extractPeriodEnd(subscription)).toBe(1500);
  });

  it("falls back to the legacy top-level field when the item has no period end", () => {
    const subscription = {
      current_period_end: 1500,
      items: { data: [{}] },
    };
    expect(extractPeriodEnd(subscription)).toBe(1500);
  });

  it("returns null when neither location has a value", () => {
    expect(extractPeriodEnd({})).toBeNull();
    expect(extractPeriodEnd({ items: { data: [] } })).toBeNull();
  });
});

describe("periodEndToDate", () => {
  it("converts unix seconds to a Date", () => {
    const subscription = { items: { data: [{ current_period_end: 1700000000 }] } };
    expect(periodEndToDate(subscription)).toEqual(new Date(1700000000 * 1000));
  });

  it("returns null when no period end is available", () => {
    expect(periodEndToDate({})).toBeNull();
  });
});

describe("TIER_PRICES_GBP", () => {
  it("matches the published business-model pricing", () => {
    expect(TIER_PRICES_GBP.verified).toBe(9.99);
    expect(TIER_PRICES_GBP.premium).toBe(29.99);
  });
});
