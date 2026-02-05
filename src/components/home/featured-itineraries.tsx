import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

interface Itinerary {
  id: number;
  title: string;
  slug: string;
  tagline: string | null;
  durationDays: number | null;
  difficulty: string | null;
  priceEstimateFrom: string | null;
  regionId: number | null;
}

interface Region {
  id: number;
  name: string;
  slug: string;
}

interface FeaturedItinerariesProps {
  itineraries: Array<{
    itinerary: Itinerary;
    region: Region | null;
    stopCount: number;
  }>;
}

export function FeaturedItineraries({ itineraries }: FeaturedItinerariesProps) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-accent-hover font-bold uppercase tracking-wider text-sm">Tried & Tested Routes</span>
            <h2 className="mt-2 text-3xl font-bold text-primary">Ready-Made Adventures</h2>
          </div>
          <Link href="/itineraries" className="hidden sm:flex items-center text-primary font-bold hover:underline">
            View All <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-0">
            {itineraries.map(({ itinerary, region }) => (
              <Link
                key={itinerary.id}
                href={`/itineraries/${itinerary.slug}`}
                className="flex-shrink-0 w-[260px] sm:w-auto group"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url('/images/regions/${region?.slug || 'default'}-hero.jpg')` }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold uppercase text-primary">
                    {itinerary.durationDays ?? 1} DAY{(itinerary.durationDays ?? 1) > 1 ? 'S' : ''}
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-lg font-bold text-primary group-hover:text-primary transition-colors">
                    {itinerary.title}
                  </h3>
                  {itinerary.tagline && (
                    <p className="text-slate-500 text-sm mt-1 line-clamp-2">{itinerary.tagline}</p>
                  )}
                  <p className="text-slate-600 text-sm mt-2">{region?.name || 'Wales'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link href="/itineraries" className="sm:hidden block w-full mt-6 py-3 text-center text-primary font-bold border border-slate-200 rounded-xl hover:bg-slate-50">
          View All Itineraries
        </Link>
      </div>
    </section>
  );
}
