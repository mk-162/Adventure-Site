import { getOperators, getAllRegions, getAllActivityTypes, getFeaturedItineraries } from "@/lib/queries";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { ButtonLink } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";
import { FeaturedItineraries } from "@/components/home/featured-itineraries";
import { ActivitiesRow } from "@/components/home/activities-row";

interface DirectoryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = 24;
  const offset = (page - 1) * limit;

  // Extract filters
  const region = typeof params.region === 'string' ? params.region : undefined;
  const activity = typeof params.activity === 'string' ? params.activity : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const rating = typeof params.rating === 'string' ? params.rating : undefined;
  const query = typeof params.q === 'string' ? params.q : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'recommended';
  const distance = typeof params.distance === 'string' && params.distance ? parseFloat(params.distance) : undefined;
  const lat = typeof params.lat === 'string' && params.lat ? parseFloat(params.lat) : undefined;
  const lng = typeof params.lng === 'string' && params.lng ? parseFloat(params.lng) : undefined;

  const minRating = rating ? parseFloat(rating.replace('+', '')) : undefined;

  const [{ operators, total }, regions, activityTypes, featuredItineraries] = await Promise.all([
    getOperators({
      limit,
      offset,
      regionSlug: region,
      activityTypeSlug: activity,
      category,
      minRating,
      query,
      sortBy: sort as "recommended" | "rating" | "name" | "distance",
      maxDistanceKm: distance,
      lat,
      lng,
    }),
    getAllRegions(),
    getAllActivityTypes(),
    getFeaturedItineraries(3),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen pt-16">
      <DirectoryFilters
        operators={operators}
        regions={regions}
        activityTypes={activityTypes}
        totalCount={total}
      />

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/directory"
          searchParams={params}
        />

        <section className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">Grow Your Adventure Business</p>
          <h3 className="text-2xl font-bold text-primary mb-3">
            Add your listing or claim your profile
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get discovered by travelers searching by location, activity, and service type. Premium partners get priority placement, sponsored badges, and upgraded cards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ButtonLink href="/advertise" variant="accent">
              Add Your Listing
            </ButtonLink>
            <ButtonLink href="/directory/claim" variant="outline">
              Claim Your Listing
            </ButtonLink>
          </div>
        </section>

        <section className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-primary mb-2">
            Run an adventure business in Wales?
          </h3>
          <p className="text-gray-600 mb-4">
            Free listing if you're qualified and insured. We want every good provider on here.
          </p>
          <ButtonLink href="/directory/claim" variant="accent">
            Claim Your Listing
          </ButtonLink>
        </section>

        {featuredItineraries.length > 0 && (
          <div className="mt-12">
            <FeaturedItineraries itineraries={featuredItineraries} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <ActivitiesRow />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Adventure Directory Wales — Operators by Location & Activity | Adventure Wales",
  description: "Discover adventure operators in Wales by location, activity, and service type. Compare trusted guides, gear hire, transport, and accommodation with ratings, distance sorting, and sponsored partners.",
};
