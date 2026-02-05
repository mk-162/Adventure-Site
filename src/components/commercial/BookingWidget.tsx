import Link from "next/link";
import { Bed, ExternalLink } from "lucide-react";

interface BookingWidgetProps {
  regionName: string;
  checkIn?: string;   // YYYY-MM-DD
  checkOut?: string;  // YYYY-MM-DD
}

/**
 * Booking.com affiliate search widget placeholder.
 *
 * To monetise: replace the link below with your Booking.com affiliate link.
 * Sign up at https://www.booking.com/affiliate-program/v2/index.html
 * Then set your affiliate ID (aid) in the URL:
 *   https://www.booking.com/searchresults.html?aid=YOUR_AFFILIATE_ID&ss=...
 */
export function BookingWidget({ regionName, checkIn, checkOut }: BookingWidgetProps) {
  const searchQuery = encodeURIComponent(`${regionName} Wales`);
  let bookingUrl = `https://www.booking.com/searchresults.html?ss=${searchQuery}`;

  // TODO: Add affiliate ID — &aid=YOUR_AFFILIATE_ID
  if (checkIn) bookingUrl += `&checkin=${checkIn}`;
  if (checkOut) bookingUrl += `&checkout=${checkOut}`;

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
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-sm py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
      >
        Search on Booking.com
        <ExternalLink className="w-4 h-4" />
      </a>

      <p className="text-[10px] text-gray-400 mt-2 text-center">
        {/* Affiliate disclosure — update when affiliate ID is set */}
        Powered by Booking.com
      </p>
    </div>
  );
}
