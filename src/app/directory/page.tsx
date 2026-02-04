import { getOperators, getAllRegions, getAllActivityTypes } from "@/lib/queries";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { ButtonLink } from "@/components/ui/button";

export default async function DirectoryPage() {
  const [operators, regions, activityTypes] = await Promise.all([
    getOperators({ limit: 50 }),
    getAllRegions(),
    getAllActivityTypes(),
  ]);

  return (
    <div className="min-h-screen pt-16">
      <DirectoryFilters
        operators={operators}
        regions={regions}
        activityTypes={activityTypes}
      />

      {/* Claim CTA */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <section className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-[#1e3a4c] mb-2">
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
