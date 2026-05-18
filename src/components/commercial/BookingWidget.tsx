import { Bed, ExternalLink } from "lucide-react";
import { buildBookingSearchUrl, hasAffiliateId } from "@/lib/booking";

interface BookingWidgetProps {
  regionName: string;
  checkIn?: string;   // YYYY-MM-DD
  checkOut?: string;  // YYYY-MM-DD
  labelSegment?: string;
}

/**
 * Booking.com affiliate search widget. URL is built by
 * `buildBookingSearchUrl` which picks up the BOOKING_AFFILIATE_ID env var
 * automatically — no edits needed when monetisation is enabled.
 */
export function BookingWidget({
  regionName,
  checkIn,
  checkOut,
  labelSegment,
}: BookingWidgetProps) {
  const bookingUrl = buildBookingSearchUrl({
    destination: `${regionName} Wales`,
    checkIn,
    checkOut,
    labelSegment: labelSegment ?? `region-${regionName}`,
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 lg:p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Bed className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-primary text-sm lg:text-base">
            Find accommodation in {regionName}
          </h4>
          <p className="text-xs text-gray-500">
            Hotels, B&amp;Bs, cottages &amp; more
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Compare prices and availability for places to stay near your adventure.
      </p>

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-sm py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
      >
        Search on Booking.com
        <ExternalLink className="w-4 h-4" />
      </a>

      <p className="text-[10px] text-gray-400 mt-2 text-center">
        {hasAffiliateId()
          ? "Affiliate link — we may earn a small commission at no cost to you."
          : "Powered by Booking.com"}
      </p>
    </div>
  );
}
