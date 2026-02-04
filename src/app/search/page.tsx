import { Suspense } from "react";
import { db } from "@/db";
import { activities, regions, activityTypes, itineraries, accommodation } from "@/db/schema";
import { eq, and, or, ilike, sql } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Compass, Calendar, ArrowRight, Search as SearchIcon } from "lucide-react";

interface SearchPageProps {
  searchParams: {
    region?: string;
    activity?: string;
  };
}

async function getSearchResults(filters: {
  regionSlug?: string;
  activitySlug?: string;
}) {
  const { regionSlug, activitySlug } = filters;

  // Get region if specified
  let region = null;
  if (regionSlug) {
    const regionResult = await db
      .select()
      .from(regions)
      .where(and(eq(regions.slug, regionSlug), eq(regions.status, "published")))
      .limit(1);
    region = regionResult[0] || null;
  }

  // Get activity type if specified
  let activityType = null;
  if (activitySlug) {
    const activityTypeResult = await db
      .select()
      .from(activityTypes)
      .where(eq(activityTypes.slug, activitySlug))
      .limit(1);
    activityType = activityTypeResult[0] || null;
  }

  // Build activity conditions
  const activityConditions = [eq(activities.status, "published")];
  if (region) activityConditions.push(eq(activities.regionId, region.id));
  if (activityType) activityConditions.push(eq(activities.activityTypeId, activityType.id));

  // Fetch activities with joins
  const activitiesResults = await db
    .select({
      activity: activities,
      region: regions,
      activityType: activityTypes,
    })
    .from(activities)
    .leftJoin(regions, eq(activities.regionId, regions.id))
    .leftJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(and(...activityConditions))
    .limit(50);

  // Build itinerary conditions
  const itineraryConditions = [eq(itineraries.status, "published")];
  if (region) itineraryConditions.push(eq(itineraries.regionId, region.id));

  // Fetch itineraries
  const itinerariesResults = await db
    .select({
      itinerary: itineraries,
      region: regions,
    })
    .from(itineraries)
    .leftJoin(regions, eq(itineraries.regionId, regions.id))
    .where(and(...itineraryConditions))
    .limit(20);

  // Build accommodation conditions
  const accommodationConditions = [eq(accommodation.status, "published")];
  if (region) accommodationConditions.push(eq(accommodation.regionId, region.id));

  // Fetch accommodation
  const accommodationResults = await db
    .select({
      accommodation: accommodation,
      region: regions,
    })
    .from(accommodation)
    .leftJoin(regions, eq(accommodation.regionId, regions.id))
    .where(and(...accommodationConditions))
    .limit(20);

  return {
    activities: activitiesResults,
    itineraries: itinerariesResults,
    accommodation: accommodationResults,
    region,
    activityType,
  };
}

function ResultCard({ 
  title, 
  description, 
  image, 
  href, 
  badge,
  location 
}: { 
  title: string; 
  description: string | null; 
  image: string | null; 
  href: string;
  badge: string;
  location?: string;
}) {
  return (
    <Link 
      href={href}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
    >
      <div className="relative h-48 bg-gradient-to-br from-[#1e3a4c] to-slate-700">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <Compass className="h-16 w-16" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-[#1e3a4c] px-3 py-1 rounded-full text-xs font-bold">
            {badge}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-[#f97316] transition-colors line-clamp-1">
          {title}
        </h3>
        {location && (
          <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </p>
        )}
        <p className="text-sm text-slate-600 line-clamp-2">
          {description || "Discover this amazing Welsh adventure"}
        </p>
      </div>
    </Link>
  );
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const results = await getSearchResults({
    regionSlug: searchParams.region,
    activitySlug: searchParams.activity,
  });

  const totalResults = 
    results.activities.length + 
    results.itineraries.length + 
    results.accommodation.length;

  const hasFilters = searchParams.region || searchParams.activity;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a4c] to-slate-700 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="h-8 w-8" />
            <h1 className="text-3xl sm:text-4xl font-bold">Search Results</h1>
          </div>
          
          {/* Active Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {results.region && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{results.region.name}</span>
              </div>
            )}
            {results.activityType && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Compass className="h-4 w-4" />
                <span className="font-medium">{results.activityType.name}</span>
              </div>
            )}
            {!hasFilters && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-medium">All Adventures</span>
              </div>
            )}
          </div>

          <p className="mt-6 text-white/80 text-lg">
            Found <span className="font-bold text-[#f97316]">{totalResults}</span> results
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {totalResults === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
              <SearchIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No exact matches</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              We couldn't find anything matching your search. Try adjusting your filters or browse all adventures.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Back to Home
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Activities */}
            {results.activities.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Compass className="h-6 w-6 text-[#f97316]" />
                  Activities
                  <span className="text-base font-normal text-slate-500">
                    ({results.activities.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.activities.map(({ activity, region: activityRegion, activityType: type }) => (
                    <ResultCard
                      key={activity.id}
                      title={activity.name}
                      description={activity.description}
                      image={activity.heroImage}
                      href={`/activities/${activity.slug}`}
                      badge="Activity"
                      location={activityRegion?.name}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Itineraries */}
            {results.itineraries.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-[#f97316]" />
                  Itineraries
                  <span className="text-base font-normal text-slate-500">
                    ({results.itineraries.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.itineraries.map(({ itinerary, region: itineraryRegion }) => (
                    <ResultCard
                      key={itinerary.id}
                      title={itinerary.title}
                      description={itinerary.description}
                      image={itinerary.heroImage}
                      href={`/itineraries/${itinerary.slug}`}
                      badge={`${itinerary.durationDays || "Multi"}-Day`}
                      location={itineraryRegion?.name}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Accommodation */}
            {results.accommodation.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-[#f97316]" />
                  Accommodation
                  <span className="text-base font-normal text-slate-500">
                    ({results.accommodation.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.accommodation.map(({ accommodation: acc, region: accRegion }) => (
                    <ResultCard
                      key={acc.id}
                      title={acc.name}
                      description={acc.description}
                      image={null}
                      href={`/accommodation/${acc.slug}`}
                      badge={acc.type || "Stay"}
                      location={accRegion?.name}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f97316]"></div>
      </div>
    }>
      <SearchResults {...props} />
    </Suspense>
  );
}

export const metadata = {
  title: "Search Adventures | Adventure Wales",
  description: "Find your perfect Welsh adventure - activities, itineraries, and accommodation",
};
