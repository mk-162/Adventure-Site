import Link from "next/link";
import { 
  Mountain, 
  Waves, 
  Bike, 
  Wind, 
  Droplets, 
  TreePine,
  Anchor,
  Footprints,
  ArrowRight
} from "lucide-react";

const activities = [
  { name: "Hiking", slug: "hiking", icon: Mountain },
  { name: "Kayaking", slug: "kayaking", icon: Anchor },
  { name: "Biking", slug: "mountain-biking", icon: Bike },
  { name: "Surfing", slug: "surfing", icon: Waves },
  { name: "Wild Swimming", slug: "wild-swimming", icon: Droplets },
  { name: "Climbing", slug: "climbing", icon: TreePine },
  { name: "Coasteering", slug: "coasteering", icon: Wind },
  { name: "Gorge Walking", slug: "gorge-walking", icon: Footprints },
];

export function ActivitiesRow() {
  return (
    <section className="py-12 sm:py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-primary font-bold uppercase tracking-wider text-sm">What Gets You Moving</span>
          <h2 className="mt-2 text-3xl font-bold text-primary">Pick Your Adventure</h2>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <Link
                key={activity.slug}
                href={`/${activity.slug}`}
                className="flex flex-col items-center gap-2 sm:gap-3 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-center text-slate-900">
                  {activity.name}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <Link 
            href="/activities" 
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent-hover transition-colors"
          >
            View all 18 activity types <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
