import { notFound } from "next/navigation";
import { getRegionBySlug, getActivitiesByRegion, getAllActivityTypes } from "@/lib/queries";
import { ActivityCard } from "@/components/cards/activity-card";
import { Badge } from "@/components/ui/badge";

interface ActivitiesPageProps {
  params: Promise<{ region: string }>;
}

export default async function ActivitiesPage({ params }: ActivitiesPageProps) {
  const { region: regionSlug } = await params;
  const region = await getRegionBySlug(regionSlug);

  if (!region) {
    notFound();
  }

  const [activities, activityTypes] = await Promise.all([
    getActivitiesByRegion(regionSlug),
    getAllActivityTypes(),
  ]);

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-[#1e3a4c] py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-white/70 text-sm mb-4">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">›</span>
            <a href={`/${regionSlug}`} className="hover:text-white">{region.name}</a>
            <span className="mx-2">›</span>
            <span className="text-white">Things to Do</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Things to Do in {region.name}
          </h1>
          <p className="text-white/80">
            {activities.length} activities and experiences
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            <FilterChip active>All</FilterChip>
            {activityTypes.slice(0, 8).map((type) => (
              <FilterChip key={type.id} href={`/${regionSlug}/things-to-do/${type.slug}`}>
                {type.name}
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            Showing {activities.length} results
          </p>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((item) => (
            <ActivityCard
              key={item.activity.id}
              activity={item.activity}
              region={item.region}
              operator={item.operator}
            />
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No activities found in this region.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ 
  children, 
  active = false, 
  href 
}: { 
  children: React.ReactNode; 
  active?: boolean; 
  href?: string 
}) {
  const classes = `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
    active
      ? "bg-[#1e3a4c] text-white"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
  }`;

  if (href) {
    return <a href={href} className={classes}>{children}</a>;
  }

  return <button className={classes}>{children}</button>;
}
