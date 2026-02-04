import Link from "next/link";
import { Suspense } from "react";
import fs from "fs";
import path from "path";
import { Calendar, Clock, Mountain, MapPin, ChevronRight, Filter, PoundSterling } from "lucide-react";

interface ItineraryFrontmatter {
  slug: string;
  title: string;
  tagline?: string;
  region: string;
  duration_days: number;
  difficulty: string;
  best_season?: string;
  price_estimate_from?: number;
  price_estimate_to?: number;
}

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: ItineraryFrontmatter; body: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n*([\s\S]*)$/);
  if (!match) return null;

  const yamlContent = match[1];
  const body = match[2];
  
  const frontmatter: Record<string, any> = {};
  yamlContent.split("\n").forEach(line => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      value = value.replace(/^["'](.*)["']$/, "$1");
      // Parse numbers
      if (!isNaN(Number(value)) && value !== "") {
        frontmatter[key] = Number(value);
      } else {
        frontmatter[key] = value;
      }
    }
  });

  return { frontmatter: frontmatter as ItineraryFrontmatter, body };
}

function getAllItineraries(): ItineraryFrontmatter[] {
  const itinerariesDir = path.join(process.cwd(), "content", "itineraries");
  
  if (!fs.existsSync(itinerariesDir)) {
    return [];
  }

  const files = fs.readdirSync(itinerariesDir).filter(f => f.endsWith(".md"));
  
  const itineraries: ItineraryFrontmatter[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(itinerariesDir, file), "utf-8");
    const parsed = parseFrontmatter(content);
    if (parsed) {
      itineraries.push(parsed.frontmatter);
    }
  }

  return itineraries.sort((a, b) => a.title.localeCompare(b.title));
}

// Get unique regions and difficulties for filters
function getFilterOptions(itineraries: ItineraryFrontmatter[]) {
  const regions = [...new Set(itineraries.map(i => i.region))].sort();
  const difficulties = [...new Set(itineraries.map(i => i.difficulty))].sort();
  const durations = [...new Set(itineraries.map(i => i.duration_days))].sort((a, b) => a - b);
  return { regions, difficulties, durations };
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "moderate":
      return "bg-yellow-100 text-yellow-700";
    case "challenging":
    case "hard":
      return "bg-orange-100 text-orange-700";
    case "extreme":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatRegionName(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ItinerariesPage() {
  const itineraries = getAllItineraries();
  const { regions, difficulties, durations } = getFilterOptions(itineraries);

  return (
    <div className="min-h-screen pt-4 lg:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1e3a4c] font-medium">Itineraries</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a4c] mb-3">
            Tried & Tested Trip Plans
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Multi-day routes that account for drive times, booking windows, and Welsh weather.
            Each one tells you who it suits, what it costs, and what to do when it rains.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter Itineraries</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Region Filter */}
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{formatRegionName(region)}</option>
              ))}
            </select>
            
            {/* Duration Filter */}
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              <option value="">Any Duration</option>
              {durations.map(d => (
                <option key={d} value={d}>{d} Day{d > 1 ? "s" : ""}</option>
              ))}
            </select>
            
            {/* Difficulty Filter */}
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              <option value="">Any Difficulty</option>
              {difficulties.map(d => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {itineraries.length} itinerar{itineraries.length === 1 ? "y" : "ies"} available
        </p>

        {/* Itineraries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {itineraries.map((itinerary) => (
            <Link
              key={itinerary.slug}
              href={`/itineraries/${itinerary.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#1e3a4c]/30"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('/images/regions/${itinerary.region}-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-[#1e3a4c] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {itinerary.duration_days} DAY{itinerary.duration_days > 1 ? "S" : ""}
                </div>

                {/* Region Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-[#1e3a4c] text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {formatRegionName(itinerary.region)}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-[#1e3a4c] mb-2 group-hover:text-[#f97316] transition-colors line-clamp-2">
                  {itinerary.title}
                </h3>
                
                {itinerary.tagline && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{itinerary.tagline}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Difficulty */}
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(itinerary.difficulty)}`}>
                    {itinerary.difficulty.charAt(0).toUpperCase() + itinerary.difficulty.slice(1)}
                  </span>
                  
                  {/* Season */}
                  {itinerary.best_season && (
                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {itinerary.best_season}
                    </span>
                  )}
                </div>

                {/* Price */}
                {itinerary.price_estimate_from && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Estimated cost</span>
                    <span className="font-bold text-[#1e3a4c]">
                      £{itinerary.price_estimate_from}
                      {itinerary.price_estimate_to && itinerary.price_estimate_to !== itinerary.price_estimate_from && (
                        <span> - £{itinerary.price_estimate_to}</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {itineraries.length === 0 && (
          <div className="text-center py-16">
            <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No itineraries found</h3>
            <p className="text-gray-500">Check back soon for new adventure itineraries!</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-[#1e3a4c] rounded-2xl p-8 text-center text-white mb-8">
          <h2 className="text-2xl font-bold mb-3">Need something specific?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Tell us your dates, group, and what you're into. We'll build a route that actually works.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#f97316] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#f97316]/90 transition-colors"
          >
            Create Custom Itinerary
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Trip Plans | Adventure Wales",
  description: "15 tested multi-day Welsh adventure routes. Real logistics, honest difficulty ratings, weather backup plans, and who each trip actually suits.",
};
