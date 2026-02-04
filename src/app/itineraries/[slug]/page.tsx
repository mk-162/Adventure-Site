import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  MapPin, 
  Mountain, 
  Calendar,
  Share2,
  Heart
} from "lucide-react";
import { ItineraryView } from "@/components/itinerary/ItineraryView";
import { EnquireAllVendors } from "@/components/itinerary/EnquireAllVendors";
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
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/itineraries" className="hover:text-[#1e3a4c]">Itineraries</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1e3a4c] font-medium truncate">{itinerary.title}</span>
        </div>

        {/* Hero Section */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-6 lg:mb-10 group h-[300px] sm:h-[400px] lg:h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('/images/regions/${region?.slug || 'default'}-hero.jpg')` }}
          />

          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-[#1e3a4c] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20">
            {itinerary.durationDays} DAY{itinerary.durationDays > 1 ? "S" : ""}
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
                {itinerary.difficulty?.charAt(0).toUpperCase() + itinerary.difficulty?.slice(1)}
              </span>
              {itinerary.bestSeason && (
                <span className="hidden sm:flex bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {itinerary.bestSeason}
                </span>
              )}
            </div>

            <h1 className="text-white text-2xl sm:text-3xl lg:text-5xl font-black leading-tight mb-2 lg:mb-3">
              {itinerary.title}
            </h1>
            {itinerary.tagline && (
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-2xl">
                {itinerary.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Row (mobile only) */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex justify-between divide-x divide-gray-200">
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-[#1e3a4c]">{stops?.filter(i => i.stopType === "activity").length || 0}</span>
              <span className="text-xs text-gray-500 uppercase">Activities</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-[#1e3a4c]">{Math.max(0, itinerary.durationDays - 1)}</span>
              <span className="text-xs text-gray-500 uppercase">Nights</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-xl font-bold text-[#1e3a4c]">
                £{itinerary.priceEstimateFrom || "TBC"}
              </span>
              <span className="text-xs text-gray-500 uppercase">From</span>
            </div>
          </div>
        </div>
        
        {/* Intro */}
        {itinerary.description && (
           <div className="prose prose-lg max-w-none mb-6 text-gray-600">
               <p>{itinerary.description}</p>
           </div>
        )}

        {/* Best Time to Visit */}
        {itinerary.bestSeason && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-10 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-900">
                <span className="font-bold">Best time for this trip:</span> {itinerary.bestSeason}
              </p>
            </div>
          </div>
        )}

        {/* Main View Component */}
        <ItineraryView 
          stops={stops || []} 
          itineraryName={itinerary.title} 
          accommodations={accommodations} 
          region={region}
        />

        {/* Enquire All Vendors CTA */}
        {uniqueOperators.length > 0 && (
          <div className="mt-10 lg:mt-16">
            <EnquireAllVendors 
              operators={uniqueOperators}
              itineraryName={itinerary.title}
            />
          </div>
        )}

      </div>

      {/* Sticky Bottom Bar (mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button className="flex flex-col items-center justify-center w-14 gap-1 text-gray-500 hover:text-[#1e3a4c] transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Share</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14 gap-1 text-gray-500 hover:text-[#1e3a4c] transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Save</span>
          </button>
          {uniqueOperators.length > 0 ? (
            <EnquireAllVendors 
              operators={uniqueOperators}
              itineraryName={itinerary.title}
              variant="mobile"
            />
          ) : (
            <button className="flex-1 bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 shadow-lg shadow-[#f97316]/20 transition-all active:scale-95">
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
  return {
    title: `Itinerary: ${slug} | Adventure Wales`,
  };
}
