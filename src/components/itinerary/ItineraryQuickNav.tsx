"use client";

interface ItineraryQuickNavProps {
  hasMap?: boolean;
  hasCosts?: boolean;
  hasEnquiry?: boolean;
}

export function ItineraryQuickNav({
  hasMap = true,
  hasCosts = true,
  hasEnquiry = true,
}: ItineraryQuickNavProps) {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm" data-print-hide>
      {hasMap && (
        <button
          onClick={() => scrollTo("itinerary-map")}
          className="text-gray-200 hover:text-white transition-colors font-medium"
        >
          📍 View on Map
        </button>
      )}
      {hasCosts && (
        <>
          {hasMap && <span className="text-gray-400/50 hidden sm:inline">·</span>}
          <button
            onClick={() => scrollTo("itinerary-costs")}
            className="text-gray-200 hover:text-white transition-colors font-medium"
          >
            💰 See Costs
          </button>
        </>
      )}
      {hasEnquiry && (
        <>
          {(hasMap || hasCosts) && <span className="text-gray-400/50 hidden sm:inline">·</span>}
          <button
            onClick={() => scrollTo("itinerary-enquiry")}
            className="text-gray-200 hover:text-white transition-colors font-medium"
          >
            📧 Enquire All Vendors
          </button>
        </>
      )}
    </div>
  );
}
