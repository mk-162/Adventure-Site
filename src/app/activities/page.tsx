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
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">Activities</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
            Single Activities & Experiences
          </h1>
          <p className="text-gray-600 max-w-2xl mb-4">
            Individual adventures you can book as standalone experiences — from coasteering and kayaking to mountain biking and gorge walking. Filter by region, type, difficulty, and budget.
          </p>
          <p className="text-sm text-gray-500">
            Looking for multi-day trips? Check out our <Link href="/itineraries" className="text-accent-hover font-semibold hover:underline">road trip itineraries</Link> instead.
          </p>
        </div>

        {/* Activity Mega Guides - prominent links to comprehensive pages */}
        <section className="mb-10 p-6 bg-gradient-to-br from-primary/5 to-accent-hover/5 rounded-2xl border border-primary/10">
          <h2 className="text-xl font-bold text-primary mb-2">📚 Complete Activity Guides</h2>
          <p className="text-gray-600 text-sm mb-4">Deep-dive guides with trail centres, spots, grading systems, and insider tips.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { href: "/mountain-biking", label: "Mountain Biking", emoji: "🚴" },
              { href: "/coasteering", label: "Coasteering", emoji: "🌊" },
              { href: "/hiking", label: "Hiking", emoji: "🥾" },
              { href: "/surfing", label: "Surfing", emoji: "🏄" },
              { href: "/caving", label: "Caving", emoji: "🦇" },
            ].map(({ href, label, emoji }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
              >
                <span className="text-xl">{emoji}</span>
                <span className="font-semibold text-gray-800 group-hover:text-primary">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Client-side filters and results */}
        <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-xl h-96" />}>
          <ActivityFilters
            initialActivities={activities}
            regions={regions}
            activityTypes={activityTypes}
          />
        </Suspense>

        {/* Popular Activity + Region combos (SEO keyword links) */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-primary mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { type: "coasteering", region: "pembrokeshire" },
              { type: "coasteering", region: "gower" },
              { type: "surfing", region: "anglesey" },
              { type: "surfing", region: "pembrokeshire" },
              { type: "climbing", region: "snowdonia" },
              { type: "mountain-biking", region: "brecon-beacons" },
              { type: "mountain-biking", region: "south-wales" },
              { type: "sea-kayaking", region: "pembrokeshire" },
              { type: "sea-kayaking", region: "anglesey" },
              { type: "hiking", region: "snowdonia" },
              { type: "zip-lining", region: "snowdonia" },
              { type: "sup", region: "gower" },
              { type: "sup", region: "mid-wales" },
              { type: "kayaking", region: "brecon-beacons" },
              { type: "wild-swimming", region: "pembrokeshire" },
              { type: "caving", region: "brecon-beacons" },
              { type: "surfing", region: "gower" },
              { type: "mountain-biking", region: "snowdonia" },
            ].map(({ type, region }) => {
              const typeName = activityTypes.find(t => t.slug === type)?.name || type.replace(/-/g, " ");
              const regionName = regions.find(r => r.slug === region)?.name || region.replace(/-/g, " ");
              return (
                <Link
                  key={`${type}-${region}`}
                  href={`/${region}/things-to-do/${type}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-accent-hover hover:text-accent-hover transition-colors"
                >
                  {typeName} in {regionName}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Browse by Region */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-primary mb-4">Browse by Region</h2>
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
  title: "Things to Do in Wales — Coasteering, Hiking, Surfing & More | Adventure Wales",
  description: "Browse 78+ outdoor activities across Wales with honest reviews, difficulty ratings, and prices. Coasteering in Pembrokeshire, hiking in Snowdonia, surfing in Anglesey, and more.",
};
