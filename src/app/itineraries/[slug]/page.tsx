import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  MapPin, 
  Mountain, 
  Calendar,
  Share2,
} from "lucide-react";
import { ItineraryView } from "@/components/itinerary/ItineraryView";
import { ItineraryFactSheet } from "@/components/itinerary/ItineraryFactSheet";
import { EnquireAllVendors } from "@/components/itinerary/EnquireAllVendors";
import { ItinerarySocialShare } from "@/components/itinerary/ItinerarySocialShare";
import { ItineraryPrintButton } from "@/components/itinerary/ItineraryPrintButton";
import { ItineraryQuickNav } from "@/components/itinerary/ItineraryQuickNav";
import { ShareButton } from "@/components/ui/ShareButton";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { getItineraryWithStops, getAccommodation, getAllItinerarySlugs } from "@/lib/queries";

function getDifficultyColor(difficulty: string): string {
  switch (difficulty?.toLowerCase()) {
    case "easy": return "bg-green-100 text-green-700 border-green-200";
    case "moderate": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "challenging":
    case "hard": return "bg-orange-100 text-orange-700 border-orange-200";
    case "extreme": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ItineraryDetailPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch itinerary from DB
  const data = await getItineraryWithStops(slug);

  if (!data) {
    notFound();
  }

  const { itinerary, stops, region } = data;

  // Fetch accommodation for this region (for basecamp selection)
  let accommodations: any[] = [];
  if (itinerary.regionId) {
    try {
      const accommodationResults = await getAccommodation({ regionId: itinerary.regionId });
      accommodations = accommodationResults.map(r => r.accommodation);
    } catch (e) {
      console.error("Error fetching accommodation:", e);
    }
  }

  // Extract unique operators from stops
  const uniqueOperators = Array.from(
    new Map(
      (stops || [])
        .filter(stop => stop.operator)
        .map(stop => [stop.operator!.id, stop.operator!])
    ).values()
  );

  return (
    <div className="min-h-screen pt-4 lg:pt-6 pb-24 lg:pb-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 lg:mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/itineraries" className="hover:text-primary">Itineraries</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-medium truncate">{itinerary.title}</span>
        </div>

        {/* Hero Section */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-6 lg:mb-10 group h-[300px] sm:h-[400px] lg:h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('/images/regions/${region?.slug || 'default'}-hero.jpg')` }}
          />

          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20">
            {itinerary.durationDays ?? 1} DAY{(itinerary.durationDays ?? 1) > 1 ? "S" : ""}
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 lg:p-10 z-20">
            {/* Info Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {region?.name || "Wales"}
              </span>
              <span className={`backdrop-blur-md text-xs sm:text-sm font-semibold px-3 py-1 rounded-full border ${getDifficultyColor(itinerary.difficulty || "")}`}>
                <Mountain className="w-4 h-4 inline mr-1" />
                {itinerary.difficulty ? itinerary.difficulty.charAt(0).toUpperCase() + itinerary.difficulty.slice(1) : 'Moderate'}
              </span>
              {itinerary.bestSeason && (
                <span className="hidden sm:flex bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {itinerary.bestSeason}
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <h1 className="text-white text-2xl sm:text-3xl lg:text-5xl font-black leading-tight mb-2 lg:mb-3">
                {itinerary.title}
              </h1>
              <div className="hidden sm:flex items-center gap-2 shrink-0 mt-1 print:hidden" data-print-hide>
                <ShareButton title={itinerary.title} variant="button" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold text-sm rounded-full border border-white/30 transition-colors" />
                <ItinerarySocialShare
                  itineraryName={itinerary.title}
                  durationDays={itinerary.durationDays ?? 1}
                  stopCount={stops?.length ?? 0}
                  highlightStops={(stops || []).filter(s => s.stopType === "activity").slice(0, 3).map(s => s.title)}
                />
                <ItineraryPrintButton />
              </div>
            </div>
            {itinerary.tagline && (
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-2xl">
                {itinerary.tagline}
              </p>
            )}
            {/* Quick navigation links */}
            <div className="mt-3 print:hidden">
              <ItineraryQuickNav
                hasMap={true}
                hasCosts={true}
                hasEnquiry={uniqueOperators.length > 0}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Row (mobile only) */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between divide-x divide-gray-200">
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-primary">{stops?.filter(i => i.stopType === "activity").length || 0}</span>
              <span className="text-xs text-gray-500 uppercase">Activities</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-primary">{Math.max(0, (itinerary.durationDays ?? 1) - 1)}</span>
              <span className="text-xs text-gray-500 uppercase">Nights</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-primary">
                £{itinerary.priceEstimateFrom || "TBC"}
              </span>
              <span className="text-xs text-gray-500 uppercase">From</span>
            </div>
          </div>
        </div>
        
        {/* Trip Fact Sheet */}
        {itinerary.description && (
          <div className="mb-8">
            <ItineraryFactSheet 
              description={itinerary.description} 
              title={itinerary.title} 
            />
          </div>
        )}

        {/* Main View Component */}
        <ItineraryView 
          stops={stops || []} 
          itineraryName={itinerary.title}
          itinerarySlug={slug}
          itineraryId={itinerary.id}
          accommodations={accommodations} 
          region={region}
          durationDays={itinerary.durationDays}
          difficulty={itinerary.difficulty}
          bestSeason={itinerary.bestSeason}
          priceEstimateFrom={itinerary.priceEstimateFrom}
          priceEstimateTo={itinerary.priceEstimateTo}
        />

        {/* Enquire All Vendors CTA */}
        {uniqueOperators.length > 0 && (
          <div id="itinerary-enquiry" className="mt-10 lg:mt-16">
            <EnquireAllVendors 
              operators={uniqueOperators}
              itineraryName={itinerary.title}
            />
          </div>
        )}

        {/* Print-only footer branding */}
        <div className="print-footer hidden print:block mt-8">
          <p>Generated from Adventure Wales — adventurewales.co.uk</p>
          <p>Plan your own Welsh adventure at adventurewales.co.uk/itineraries</p>
        </div>

      </div>

      {/* Sticky Bottom Bar (mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex gap-3 max-w-lg mx-auto">
          <ShareButton title={itinerary.title} variant="icon" />
          <FavoriteButton
            itemId={itinerary.id}
            itemType="itinerary"
            className="flex flex-col items-center justify-center w-14 gap-1 text-gray-500 hover:text-primary transition-colors"
            iconClassName="w-5 h-5"
          />
          {uniqueOperators.length > 0 ? (
            <EnquireAllVendors 
              operators={uniqueOperators}
              itineraryName={itinerary.title}
              variant="mobile"
            />
          ) : (
            <button className="flex-1 bg-accent-hover hover:bg-accent-hover/90 text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 shadow-lg shadow-accent-hover/20 transition-all active:scale-95">
              <span>Enquire</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">
                From £{itinerary.priceEstimateFrom || "TBC"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllItinerarySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getItineraryWithStops(slug);
  if (!data) {
    return { title: `Itinerary Not Found | Adventure Wales` };
  }

  const { itinerary, region, stops } = data;
  const activityCount = stops?.filter(s => s.stopType === "activity").length || 0;
  const regionName = region?.name || "Wales";
  const days = itinerary.durationDays ?? 1;
  const difficulty = itinerary.difficulty
    ? itinerary.difficulty.charAt(0).toUpperCase() + itinerary.difficulty.slice(1)
    : "";

  const title = `${itinerary.title} — ${days}-Day ${regionName} Itinerary | Adventure Wales`;
  const description = itinerary.tagline
    || `${days}-day ${difficulty.toLowerCase()} itinerary in ${regionName} with ${activityCount} activities. ${itinerary.description?.slice(0, 120) || "Plan your Welsh adventure."}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Adventure Wales",
    },
  };
}
