/**
 * Booking.com affiliate URL helpers.
 *
 * Set BOOKING_AFFILIATE_ID in your environment to monetise outbound links.
 * Without it, links still work — they just don't earn commission.
 *
 * Sign up: https://www.booking.com/affiliate-program/v2/index.html
 *
 * Once approved, Booking.com gives you an `aid` (affiliate ID). Drop it in
 * BOOKING_AFFILIATE_ID and every outbound Booking.com link on the site
 * picks it up automatically.
 */

const BOOKING_BASE_URL = "https://www.booking.com/searchresults.html";
const BOOKING_LABEL_PREFIX = "adventurewales";

export interface BookingSearchOptions {
  /** Free-text destination (region, city, accommodation name). */
  destination: string;
  /** YYYY-MM-DD */
  checkIn?: string;
  /** YYYY-MM-DD */
  checkOut?: string;
  /** Adults — defaults to 2. */
  adults?: number;
  /** Number of rooms — defaults to 1. */
  rooms?: number;
  /** Optional label segment for attribution (e.g. "region-snowdonia"). */
  labelSegment?: string;
}

function getAffiliateId(): string | null {
  if (typeof process !== "undefined" && process.env.BOOKING_AFFILIATE_ID) {
    return process.env.BOOKING_AFFILIATE_ID;
  }
  return null;
}

/**
 * Build a deep link into Booking.com search with affiliate attribution.
 */
export function buildBookingSearchUrl(options: BookingSearchOptions): string {
  const params = new URLSearchParams();
  params.set("ss", options.destination);
  if (options.checkIn) params.set("checkin", options.checkIn);
  if (options.checkOut) params.set("checkout", options.checkOut);
  if (options.adults) params.set("group_adults", String(options.adults));
  if (options.rooms) params.set("no_rooms", String(options.rooms));

  const aid = getAffiliateId();
  if (aid) params.set("aid", aid);

  if (options.labelSegment) {
    params.set(
      "label",
      `${BOOKING_LABEL_PREFIX}-${options.labelSegment.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`,
    );
  } else {
    params.set("label", BOOKING_LABEL_PREFIX);
  }

  return `${BOOKING_BASE_URL}?${params.toString()}`;
}

/**
 * Wraps any Booking.com URL the operator has supplied to ensure our affiliate
 * tag is present. If the URL already targets booking.com, we append/replace
 * the `aid` and `label` params. Other URLs pass through untouched.
 */
export function withAffiliateTag(
  url: string | null | undefined,
  labelSegment?: string,
): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!/booking\.com$/i.test(parsed.hostname) && !/\.booking\.com$/i.test(parsed.hostname)) {
      return url;
    }
    const aid = getAffiliateId();
    if (aid) parsed.searchParams.set("aid", aid);
    parsed.searchParams.set(
      "label",
      labelSegment
        ? `${BOOKING_LABEL_PREFIX}-${labelSegment.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`
        : BOOKING_LABEL_PREFIX,
    );
    return parsed.toString();
  } catch {
    return url;
  }
}

export function hasAffiliateId(): boolean {
  return Boolean(getAffiliateId());
}
