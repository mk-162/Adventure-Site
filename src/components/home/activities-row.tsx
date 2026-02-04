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
    <section className="py-12 sm:py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[#1e3a4c] font-bold uppercase tracking-wider text-sm">What Gets You Moving</span>
          <h2 className="mt-2 text-3xl font-bold text-[#1e3a4c]">Pick Your Adventure</h2>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <Link
                key={activity.slug}
                href={`/activities/${activity.slug}`}
                className="flex flex-col items-center gap-2 sm:gap-3 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-50 flex items-center justify-center text-[#1e3a4c] group-hover:bg-[#1e3a4c] group-hover:text-white transition-all">
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-center text-slate-900">
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
