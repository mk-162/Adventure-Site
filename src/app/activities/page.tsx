import Link from "next/link";
import { getActivities, getAllRegions, getAllActivityTypes } from "@/lib/queries";
import { ActivityCard } from "@/components/cards/activity-card";
import { ChevronRight, Filter, Search, Mountain } from "lucide-react";

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
            Adventure Activities
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Discover unforgettable experiences across Wales - from coasteering to mountain climbing, 
            caving to kayaking.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
          {/* Search */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search activities..."
              className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.id} value={region.slug}>{region.name}</option>
              ))}
            </select>
            
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              <option value="">All Activity Types</option>
              {activityTypes.map(type => (
                <option key={type.id} value={type.slug}>{type.name}</option>
              ))}
            </select>
            
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              <option value="">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
              <option value="extreme">Extreme</option>
            </select>
            
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              <option value="">Any Price</option>
              <option value="free">Free</option>
              <option value="budget">Under £50</option>
              <option value="mid">£50 - £100</option>
              <option value="premium">£100+</option>
            </select>
          </div>
        </div>

        {/* Activity Type Quick Links */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {activityTypes.slice(0, 10).map(type => (
            <Link
              key={type.id}
              href={`/activities?type=${type.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm whitespace-nowrap hover:border-[#1e3a4c] hover:text-[#1e3a4c] transition-colors"
            >
              {type.name}
            </Link>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">
          {activities.length} activities found
        </p>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activities.map((item) => (
            <ActivityCard
              key={item.activity.id}
              activity={item.activity}
              region={item.region}
              operator={item.operator}
              activityType={item.activityType}
            />
          ))}
        </div>

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-16">
            <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No activities found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}

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
  description: "Discover unforgettable adventure activities across Wales - coasteering, climbing, kayaking, and more",
};
