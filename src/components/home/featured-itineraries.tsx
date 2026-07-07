import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

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
        <SectionHeader
          eyebrow="Tried & Tested Routes"
          title="Ready-Made Adventures"
          action={{ label: "View All", href: "/itineraries" }}
        />

        {/* 2-col grid on mobile, 3-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {itineraries.map(({ itinerary, region }) => (
              <Link
                key={itinerary.id}
                href={`/itineraries/${itinerary.slug}`}
                className="group"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1">
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

        <ButtonLink href="/itineraries" variant="outline" size="md" fullWidth className="mt-6 sm:hidden">
          View All Itineraries
        </ButtonLink>
      </div>
    </section>
  );
}
