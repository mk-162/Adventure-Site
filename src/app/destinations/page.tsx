import Link from "next/link";
import { getAllRegions, getAllRegionsWithCoordinates } from "@/lib/queries";
import { MapPin, ChevronRight, Compass } from "lucide-react";
import { Newsletter } from "@/components/commercial/Newsletter";
import { RegionMap } from "@/components/ui/RegionMap";
import type { MapMarker } from "@/components/ui/MapView";

export default async function DestinationsPage() {
  const [regions, regionsWithCoordinates] = await Promise.all([
    getAllRegions(),
    getAllRegionsWithCoordinates(),
  ]);

  // Prepare map markers for all regions
  const regionMarkers: MapMarker[] = regionsWithCoordinates
    .filter((region) => region.lat && region.lng)
    .map((region) => ({
      id: `region-${region.id}`,
      lat: parseFloat(String(region.lat)),
      lng: parseFloat(String(region.lng)),
      type: "location" as const,
      title: region.name,
      link: `/${region.slug}`,
      subtitle: "Explore this region",
    }));

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1e3a4c] font-medium">Destinations</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a4c] mb-3">
            Where in Wales
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Each region has its own character, weather, and speciality. Snowdonia for mountains,
            Pembrokeshire for coast, Brecon Beacons for peace and quiet. Pick the one that fits.
          </p>
        </div>

        {/* Featured Region */}
        {regions[0] && (
          <Link 
            href={`/${regions[0].slug}`}
            className="block relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden mb-8 group"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('/images/regions/${regions[0].slug}-hero.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 lg:p-10">
              <span className="bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                Featured
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-2">{regions[0].name}</h2>
              <p className="text-white/80 max-w-lg line-clamp-2">
                {regions[0].description?.split(".")[0] || "Discover adventure in this stunning region"}
              </p>
            </div>
          </Link>
        )}

        {/* Explore the Map Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-2">
              Explore the Map
            </h2>
            <p className="text-gray-600">
              Click on any region to start planning your adventure
            </p>
          </div>
          
          <RegionMap
            markers={regionMarkers}
            center={[52.4, -3.6]}
            zoom={8}
            height="500px"
            className="shadow-lg"
          />
          
          {/* Map Legend */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#a855f7] border-2 border-white shadow-sm"></span>
              Regions
            </span>
          </div>
        </section>

        {/* All Regions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.slice(1).map(region => (
            <Link
              key={region.id}
              href={`/${region.slug}`}
              className="group relative h-64 rounded-2xl overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('/images/regions/${region.slug}-hero.jpg')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-xl font-bold text-white mb-1">{region.name}</h3>
                <p className="text-white/70 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Explore region
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA & Newsletter Section */}
        <div className="mt-12 space-y-8">
          <div className="bg-[#1e3a4c] rounded-2xl p-8 lg:p-12 text-center">
            <Compass className="w-12 h-12 text-[#ea580c] mx-auto mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              Not sure which region?
            </h2>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">
              Tell us what you're into and how long you've got. We'll match you to the right part of Wales.
            </p>
            <Link
              href="/trip-planner"
              className="inline-flex items-center gap-2 bg-[#ea580c] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#ea580c]/90 transition-colors"
            >
              Start Planning
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <Newsletter source="destinations" />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Destinations | Adventure Wales",
  description: "11 Welsh regions compared - weather, crowds, specialities, and which suits your trip. From Snowdonia's peaks to Pembrokeshire's coast.",
};
