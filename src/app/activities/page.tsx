import { Suspense } from "react";
import Link from "next/link";
import { getActivities, getAllRegions, getAllActivityTypes } from "@/lib/queries";
import { ActivityFilters } from "@/components/activities/ActivityFilters";
import { ChevronRight } from "lucide-react";

export default async function ActivitiesPage() {
  const [activities, regions, activityTypes] = await Promise.all([
    getActivities({ limit: 50 }),
    getAllRegions(),
    getAllActivityTypes()
  ]);

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1e3a4c] font-medium">Activities</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a4c] mb-3">
            Single Activities & Experiences
          </h1>
          <p className="text-gray-600 max-w-2xl mb-4">
            Individual adventures you can book as standalone experiences — from coasteering and kayaking to mountain biking and gorge walking. Filter by region, type, difficulty, and budget.
          </p>
          <p className="text-sm text-gray-500">
            Looking for multi-day trips? Check out our <Link href="/itineraries" className="text-[#f97316] font-semibold hover:underline">road trip itineraries</Link> instead.
          </p>
        </div>

        {/* Client-side filters and results */}
        <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-xl h-96" />}>
          <ActivityFilters
            initialActivities={activities}
            regions={regions}
            activityTypes={activityTypes}
          />
        </Suspense>

        {/* Browse by Region */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Browse by Region</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {regions.slice(0, 8).map(region => (
              <Link
                key={region.id}
                href={`/${region.slug}/things-to-do`}
                className="relative h-28 rounded-xl overflow-hidden group"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('/images/regions/${region.slug}-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{region.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Adventure Activities | Adventure Wales",
  description: "78 Welsh adventures with real suitability info - who it's for, who should skip it, difficulty, prices, and local tips. Filter by region and type.",
};
