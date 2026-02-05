"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ItineraryCard } from "@/components/cards/itinerary-card";
import { Newsletter } from "@/components/commercial/Newsletter";
import { 
  Filter, 
  Map as MapIcon, 
  Grid, 
  Mountain, 
  Clock, 
  MapPin, 
  Calendar,
  ChevronRight,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for MapView
const MapView = dynamic(() => import("@/components/ui/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-400 font-medium">Loading map...</span>
    </div>
  ),
});

interface Itinerary {
  id: number;
  title: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  durationDays?: number | null;
  difficulty?: string | null;
  priceEstimateFrom?: string | null;
  priceEstimateTo?: string | null;
  heroImage?: string | null;
  bestSeason?: string | null;
  region: {
    name: string;
    slug: string;
  } | null;
  itineraryTags: {
    tag: {
      name: string;
      slug: string;
    };
  }[];
  stops?: {
    lat: string | null;
    lng: string | null;
  }[];
}

interface Region {
  id: number;
  name: string;
  slug: string;
}

interface ItineraryDiscoveryProps {
  initialItineraries: Itinerary[];
  regions: Region[];
}

export function ItineraryDiscovery({ initialItineraries, regions }: ItineraryDiscoveryProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Filter Logic
  const filteredItineraries = useMemo(() => {
    return initialItineraries.filter((itinerary) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !itinerary.title.toLowerCase().includes(query) &&
          !itinerary.tagline?.toLowerCase().includes(query) &&
          !itinerary.description?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Region
      if (selectedRegion && itinerary.region?.slug !== selectedRegion) {
        return false;
      }

      // Difficulty
      if (selectedDifficulty && itinerary.difficulty?.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // Duration
      if (selectedDuration) {
        const days = itinerary.durationDays || 0;
        switch (selectedDuration) {
          case "weekend":
            if (days > 3) return false;
            break;
          case "week":
            if (days < 4 || days > 7) return false;
            break;
          case "extended":
            if (days <= 7) return false;
            break;
        }
      }

      // Budget (Using priceEstimateFrom)
      if (selectedBudget) {
        const price = itinerary.priceEstimateFrom ? parseFloat(itinerary.priceEstimateFrom) : 0;
        switch (selectedBudget) {
          case "budget":
            if (price >= 500) return false;
            break;
          case "mid":
            if (price < 500 || price >= 1500) return false;
            break;
          case "luxury":
            if (price < 1500) return false;
            break;
        }
      }

      return true;
    });
  }, [initialItineraries, searchQuery, selectedRegion, selectedDifficulty, selectedDuration, selectedBudget]);

  // Map Markers
  const mapMarkers = useMemo(() => {
    return filteredItineraries
      .filter(i => i.stops && i.stops.length > 0 && i.stops[0].lat && i.stops[0].lng)
      .map(i => {
        // Use first stop as start point
        const startPoint = i.stops![0];
        return {
          id: `itinerary-${i.id}`,
          lat: parseFloat(startPoint.lat!),
          lng: parseFloat(startPoint.lng!),
          type: 'activity' as const, // Reusing activity type color for itineraries or could add new type
          title: i.title,
          link: `/itineraries/${i.slug}`,
          subtitle: i.region?.name,
          price: i.priceEstimateFrom ? `From £${i.priceEstimateFrom}` : undefined,
          image: i.region ? `/images/regions/${i.region.slug}-hero.jpg` : undefined
        };
      });
  }, [filteredItineraries]);

  // Featured Itinerary (First one of the filtered list, or null if empty)
  // Or maybe always show the absolute first one from initial list if no filters active?
  // Let's show the first filtered one as "Featured" if user is filtering, 
  // or just the first one generally. 
  // Actually, standard pattern is to have the list.
  // The requirements say "Featured itinerary as large hero card".
  // I will pick the first itinerary from the *initial* list as the "Global Feature" 
  // unless I want it to be dynamic. 
  // Let's make it the first one of the *filtered* list to be more responsive to user intent?
  // But if I show it as a hero, I shouldn't duplicate it in the grid.
  
  // Let's just pick index 0 of filtered list as featured, and show the rest in grid.
  // If filtered list is empty, show nothing.
  const featuredItinerary = filteredItineraries[0];
  const gridItineraries = filteredItineraries.slice(1);

  // Helper to format difficulty color
  const difficultyColor = (difficulty?: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-700";
      case "moderate": return "bg-yellow-100 text-yellow-700";
      case "challenging":
      case "hard": return "bg-orange-100 text-orange-700";
      case "extreme": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-4">
              Multi-Day Road Trips & Itineraries
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ve reviewed the best, and bring you fantastic plans that are editable and shareable. From weekend getaways to epic multi-day expeditions across Wales.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Region */}
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl text-[#1e3a4c] font-medium focus:ring-2 focus:ring-[#f97316] focus:bg-white transition-all"
              >
                <option value="">All Regions</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.slug}>{r.name}</option>
                ))}
              </select>

              {/* Difficulty */}
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl text-[#1e3a4c] font-medium focus:ring-2 focus:ring-[#f97316] focus:bg-white transition-all"
              >
                <option value="">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            
            {/* Results count */}
            <div className="mt-3 text-center text-sm text-gray-400">
              {filteredItineraries.length} itineraries
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-6">
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                viewMode === "grid" 
                  ? "bg-white text-[#1e3a4c] shadow-sm" 
                  : "text-gray-500 hover:text-[#1e3a4c]"
              )}
            >
              <Grid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                viewMode === "map" 
                  ? "bg-white text-[#1e3a4c] shadow-sm" 
                  : "text-gray-500 hover:text-[#1e3a4c]"
              )}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        {viewMode === "map" ? (
          <div className="mb-16">
             <MapView 
               markers={mapMarkers}
               className="rounded-2xl shadow-xl border border-gray-200"
               height="600px"
             />
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Itinerary Hero Card */}
            {featuredItinerary && (
              <div className="relative rounded-3xl overflow-hidden bg-[#1e3a4c] text-white shadow-2xl">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto min-h-[400px]">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url('${featuredItinerary.region ? `/images/regions/${featuredItinerary.region.slug}-hero.jpg` : '/images/placeholder-hero.jpg'}')` 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a4c]/80 to-transparent lg:hidden" />
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-[#f97316] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Featured Adventure
                      </span>
                      {featuredItinerary.region && (
                        <span className="flex items-center gap-1 text-sm font-medium text-gray-300">
                          <MapPin className="w-4 h-4" />
                          {featuredItinerary.region.name}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                      {featuredItinerary.title}
                    </h2>
                    
                    {featuredItinerary.tagline && (
                      <p className="text-xl text-gray-300 mb-6 font-light">
                        {featuredItinerary.tagline}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                       <div className="flex items-center gap-3">
                         <div className="bg-white/10 p-2 rounded-lg">
                           <Clock className="w-5 h-5 text-[#f97316]" />
                         </div>
                         <div>
                           <div className="text-xs text-gray-400 uppercase tracking-wider">Duration</div>
                           <div className="font-semibold">{featuredItinerary.durationDays} Days</div>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                         <div className="bg-white/10 p-2 rounded-lg">
                           <Mountain className="w-5 h-5 text-[#f97316]" />
                         </div>
                         <div>
                           <div className="text-xs text-gray-400 uppercase tracking-wider">Difficulty</div>
                           <div className="font-semibold capitalize">{featuredItinerary.difficulty}</div>
                         </div>
                       </div>

                       {featuredItinerary.priceEstimateFrom && (
                         <div className="flex items-center gap-3">
                           <div className="bg-white/10 p-2 rounded-lg">
                             <div className="w-5 h-5 flex items-center justify-center text-[#f97316] font-bold">£</div>
                           </div>
                           <div>
                             <div className="text-xs text-gray-400 uppercase tracking-wider">From</div>
                             <div className="font-semibold">£{featuredItinerary.priceEstimateFrom}</div>
                           </div>
                         </div>
                       )}

                       {featuredItinerary.bestSeason && (
                         <div className="flex items-center gap-3">
                           <div className="bg-white/10 p-2 rounded-lg">
                             <Calendar className="w-5 h-5 text-[#f97316]" />
                           </div>
                           <div>
                             <div className="text-xs text-gray-400 uppercase tracking-wider">Best Season</div>
                             <div className="font-semibold">{featuredItinerary.bestSeason}</div>
                           </div>
                         </div>
                       )}
                    </div>
                    
                    <Link 
                      href={`/itineraries/${featuredItinerary.slug}`}
                      className="inline-flex items-center gap-2 bg-[#f97316] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#ea580c] transition-colors self-start"
                    >
                      View Itinerary
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridItineraries.map((itinerary) => (
                <ItineraryCard 
                  key={itinerary.id} 
                  itinerary={itinerary} 
                  region={itinerary.region}
                  tags={itinerary.itineraryTags}
                  className="h-full"
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredItineraries.length === 0 && (
               <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                 <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-gray-700 mb-2">No itineraries found</h3>
                 <p className="text-gray-500 mb-6">We couldn't find any itineraries matching your filters.</p>
                 <button
                   onClick={() => {
                     setSearchQuery("");
                     setSelectedRegion("");
                     setSelectedDifficulty("");
                     setSelectedDuration("");
                     setSelectedBudget("");
                   }}
                   className="text-[#f97316] font-medium hover:underline"
                 >
                   Clear all filters
                 </button>
               </div>
            )}
          </div>
        )}

        {/* NEWSLETTER CTA */}
        <div className="mt-20">
          <Newsletter className="w-full" />
        </div>
      </div>
    </div>
  );
}
