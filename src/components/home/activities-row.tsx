import Link from "next/link";
import { 
  Mountain, 
  Waves, 
  Bike, 
  Wind, 
  Tent, 
  TreePine,
  Anchor,
  Camera
} from "lucide-react";

const activities = [
  { name: "Hiking", slug: "hiking", icon: Mountain },
  { name: "Kayaking", slug: "kayaking", icon: Anchor },
  { name: "Biking", slug: "mountain-biking", icon: Bike },
  { name: "Surfing", slug: "surfing", icon: Waves },
  { name: "Camping", slug: "camping", icon: Tent },
  { name: "Climbing", slug: "climbing", icon: TreePine },
  { name: "Coasteering", slug: "coasteering", icon: Wind },
  { name: "Photography", slug: "photography", icon: Camera },
];

export function ActivitiesRow() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-2">
            Find Your Passion
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a4c]">
            Popular Activities
          </h2>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-8">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <Link
                key={activity.slug}
                href={`/activities/${activity.slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-[#1e3a4c] transition-all duration-300">
                  <IconComponent className="h-7 w-7 md:h-8 md:w-8 text-[#1e3a4c] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e3a4c] transition-colors">
                  {activity.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
