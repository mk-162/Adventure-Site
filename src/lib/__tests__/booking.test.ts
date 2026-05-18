import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildBookingSearchUrl,
  hasAffiliateId,
  withAffiliateTag,
} from "../booking";

const ORIGINAL_AID = process.env.BOOKING_AFFILIATE_ID;

describe("buildBookingSearchUrl", () => {
  afterEach(() => {
    if (ORIGINAL_AID === undefined) delete process.env.BOOKING_AFFILIATE_ID;
    else process.env.BOOKING_AFFILIATE_ID = ORIGINAL_AID;
  });

  it("uses booking.com searchresults host and encodes destination", () => {
    const url = new URL(
      buildBookingSearchUrl({ destination: "Snowdonia Wales" }),
    );
    expect(url.hostname).toBe("www.booking.com");
    expect(url.pathname).toBe("/searchresults.html");
    expect(url.searchParams.get("ss")).toBe("Snowdonia Wales");
    expect(url.searchParams.get("label")).toBe("adventurewales");
  });

  it("includes affiliate id and label segment when configured", () => {
    process.env.BOOKING_AFFILIATE_ID = "1234567";
    const url = new URL(
      buildBookingSearchUrl({
        destination: "Pembrokeshire",
        labelSegment: "region-pembrokeshire",
        checkIn: "2026-06-01",
        checkOut: "2026-06-05",
      }),
    );
    expect(url.searchParams.get("aid")).toBe("1234567");
    expect(url.searchParams.get("label")).toBe(
      "adventurewales-region-pembrokeshire",
    );
    expect(url.searchParams.get("checkin")).toBe("2026-06-01");
    expect(url.searchParams.get("checkout")).toBe("2026-06-05");
  });

  it("sanitises label segments to URL-safe characters", () => {
    const url = new URL(
      buildBookingSearchUrl({
        destination: "Anywhere",
        labelSegment: "acc Plas y Brenin!",
      }),
    );
    expect(url.searchParams.get("label")).toBe(
      "adventurewales-acc-plas-y-brenin-",
    );
  });
});

describe("withAffiliateTag", () => {
  beforeEach(() => {
    process.env.BOOKING_AFFILIATE_ID = "9999";
  });
  afterEach(() => {
    if (ORIGINAL_AID === undefined) delete process.env.BOOKING_AFFILIATE_ID;
    else process.env.BOOKING_AFFILIATE_ID = ORIGINAL_AID;
  });

  it("returns null for empty input", () => {
    expect(withAffiliateTag(null)).toBeNull();
    expect(withAffiliateTag(undefined)).toBeNull();
  });

  it("appends affiliate tag to booking.com urls", () => {
    const result = withAffiliateTag(
      "https://www.booking.com/hotel/gb/abc.html",
      "acc-abc",
    );
    expect(result).not.toBeNull();
    const url = new URL(result!);
    expect(url.searchParams.get("aid")).toBe("9999");
    expect(url.searchParams.get("label")).toBe("adventurewales-acc-abc");
  });

  it("leaves non-booking urls untouched", () => {
    const original = "https://airbnb.com/rooms/123";
    expect(withAffiliateTag(original, "x")).toBe(original);
  });

  it("returns input unchanged when URL parsing fails", () => {
    expect(withAffiliateTag("not a url")).toBe("not a url");
  });
});

describe("hasAffiliateId", () => {
  afterEach(() => {
    if (ORIGINAL_AID === undefined) delete process.env.BOOKING_AFFILIATE_ID;
    else process.env.BOOKING_AFFILIATE_ID = ORIGINAL_AID;
  });

  it("reflects env var state", () => {
    delete process.env.BOOKING_AFFILIATE_ID;
    expect(hasAffiliateId()).toBe(false);
    process.env.BOOKING_AFFILIATE_ID = "abc";
    expect(hasAffiliateId()).toBe(true);
  });
});
