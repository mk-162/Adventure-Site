import { getOperators, getAllRegions, getAllActivityTypes } from "@/lib/queries";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { ButtonLink } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";

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

  const minRating = rating ? parseFloat(rating.replace('+', '')) : undefined;

  const [{ operators, total }, regions, activityTypes] = await Promise.all([
    getOperators({
      limit,
      offset,
      regionSlug: region,
      activityTypeSlug: activity,
      category,
      minRating,
      query
    }),
    getAllRegions(),
    getAllActivityTypes(),
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
      </div>
    </div>
  );
}

export const metadata = {
  title: "Adventure Companies & Guides in Wales — Trusted Local Providers | Adventure Wales",
  description: "30+ vetted Welsh adventure providers with Google reviews and ratings. Find qualified guides for coasteering, hiking, climbing, kayaking, and mountain biking across Wales.",
};
