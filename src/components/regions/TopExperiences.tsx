"use client";

import { useState } from "react";
import { ArrowRight, Camera, Map, Mountain, Ticket } from "lucide-react";
import { UniversalCard } from "@/components/ui/universal-card";
import { ButtonLink } from "@/components/ui/button";
import { Badge, DifficultyBadge } from "@/components/ui/badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActivityRow = any;

interface TopExperiencesProps {
  activities: ActivityRow[];
  regionSlug: string;
}

// Activity types with local hero imagery, and per-type variant sets used to
// rotate images (by activity ID) so listing grids don't repeat one photo
// across every card of the same type. Mirrors the set used by ActivityCard.
const localActivityImages = new Set([
  "archery", "boat-tour", "caving", "climbing", "coasteering",
  "gorge-scrambling", "gorge-walking", "high-ropes", "hiking",
  "hiking-scrambling", "kayaking", "mine-exploration", "mountain-biking",
  "paddleboarding", "rafting", "sea-kayaking", "sup", "surfing",
  "trail-running", "wildlife-boat-tour", "wild-swimming", "windsurfing",
  "zip-lining",
]);

const activityImageVariants: Record<string, string[]> = {
  caving: ["02-458228b9", "03-fb4d036f", "04-8d6bb2da", "05-95ef7683", "06-70411151"],
  climbing: ["02-c2c33740", "03-769d8444", "04-a6c69ad4", "05-62ff29a8", "06-a0eb9a7d"],
  coasteering: ["02-519a34c0", "03-b5583981", "04-16568470", "05-d7153020", "06-d7bec2a8"],
  "gorge-walking": ["02-0027dfcc", "03-6eada4af", "04-d40b6bff", "05-507fc51c", "06-956385b9"],
  hiking: ["03-96151002", "04-2bf15ed9", "05-c7cb2f1e", "06-74fc1189"],
  kayaking: ["02-570fb957", "03-bcd19dc4", "04-ba6d1e33", "05-758c3658", "06-656475f5"],
  "mountain-biking": ["02-lVq9vpdf", "03-8Z9MYc5e", "04-ADyXnVJU", "05-iNB2KQS8", "06-ZGNKvarK"],
  paddleboarding: ["02-30a88c24", "03-02927bb8", "04-c0cf2a01", "05-46f4408f", "06-f35e1c4d"],
  rafting: ["02-0d9b00f9", "03-3b5d5ae0", "04-bd3fe82b", "05-ed393aad", "06-e544a7c2"],
  surfing: ["02-1ef1420b", "03-fc8506a1", "04-9bfdc377", "05-1b64a41d", "06-74705f6a"],
  "wild-swimming": ["02-bc83a30d", "03-9c4fdbe0", "04-aaaffc2e", "05-9ded1f48", "06-d4165348"],
  "zip-lining": ["02-dad94e84", "03-b56e3ec0", "04-534600ba", "05-d5ecfeb3", "06-15cc8072"],
  "sea-kayaking": ["02-570fb957", "03-bcd19dc4", "04-ba6d1e33", "05-758c3658", "06-656475f5"],
};

/**
 * Image fallback chain for a Top Experiences card. Rotates through the
 * per-type variant set (keyed by activity ID) so a page full of "hiking"
 * activities doesn't render the same photo six times.
 */
function resolveImage(item: ActivityRow, regionSlug: string): string {
  if (item.activity?.heroImage) return item.activity.heroImage;

  const typeSlug: string | undefined = item.activityType?.slug;
  if (typeSlug) {
    const variants = activityImageVariants[typeSlug];
    if (variants?.length) {
      const variantIndex = item.activity.id % variants.length;
      return `/images/activities/${typeSlug}-${variants[variantIndex]}.jpg`;
    }
    if (localActivityImages.has(typeSlug)) {
      return `/images/activities/${typeSlug}-hero.jpg`;
    }
  }

  if (item.activityType?.heroImage) return item.activityType.heroImage;

  return `/images/regions/${regionSlug}-hero.jpg`;
}

export function TopExperiences({ activities, regionSlug }: TopExperiencesProps) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All", icon: Map },
    { id: "adventures", label: "Adventures", icon: Mountain },
    { id: "attractions", label: "Attractions", icon: Ticket },
    { id: "sightseeing", label: "Sightseeing", icon: Camera },
  ];

  // Filter activities based on active tab
  const filteredActivities = activities.filter((item) => {
    const typeSlug = item.activityType?.slug;

    if (activeTab === "all") return true;

    if (activeTab === "attractions") return typeSlug === "attractions";

    if (activeTab === "sightseeing") return typeSlug === "sightseeing";

    if (activeTab === "adventures") {
      return (
        typeSlug !== "attractions" &&
        typeSlug !== "sightseeing" &&
        typeSlug !== "beaches"
      );
    }

    return true;
  });

  // Only show tabs if there are activities for that category
  const visibleTabs = tabs.filter((tab) => {
    if (tab.id === "all") return true;

    // Check if any activity matches this tab
    const hasActivities = activities.some((item) => {
        const typeSlug = item.activityType?.slug;
        if (tab.id === "attractions") return typeSlug === "attractions";
        if (tab.id === "sightseeing") return typeSlug === "sightseeing";
        if (tab.id === "adventures") return typeSlug !== "attractions" && typeSlug !== "sightseeing" && typeSlug !== "beaches";
        return false;
    });

    return hasActivities;
  });

  return (
    <section id="activities" className="scroll-mt-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-primary sm:text-3xl">Top Experiences</h2>

        {/* Tabs */}
        {visibleTabs.length > 2 && (
          <div className="flex p-1 bg-slate-100 rounded-lg overflow-x-auto no-scrollbar">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        {filteredActivities.slice(0, 6).map((item) => {
          const { activity, activityType, operator } = item;
          const isPassive = activityType?.slug === "attractions" || activityType?.slug === "sightseeing";
          const rating = operator?.googleRating != null ? parseFloat(operator.googleRating) : null;
          const reviewCount = operator?.reviewCount ?? null;

          return (
            <UniversalCard
              key={activity.id}
              image={resolveImage(item, regionSlug)}
              imageAlt={activity.name}
              title={activity.name}
              href={`/activities/${activity.slug}`}
              pill={
                !isPassive && activity.difficulty ? (
                  <DifficultyBadge level={activity.difficulty} />
                ) : isPassive ? (
                  <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                    {activityType?.slug === "attractions" ? "Attraction" : "Sightseeing"}
                  </Badge>
                ) : undefined
              }
              meta={[activityType?.name, activity.duration].filter(Boolean).join(" · ") || undefined}
              // Rating reflects the operator's real, verified review data — never fabricated.
              rating={rating}
              reviewCount={reviewCount}
              priceFrom={activity.priceFrom ? parseFloat(activity.priceFrom) : null}
              priceUnit={isPassive ? "entry" : "pp"}
              action={
                <ButtonLink href={`/activities/${activity.slug}`} variant="outline" size="sm">
                  Details
                </ButtonLink>
              }
            />
          );
        })}
        {filteredActivities.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
                No experiences found in this category.
            </div>
        )}
      </div>

      <div className="mt-6 text-center sm:text-right">
         <ButtonLink href={`/${regionSlug}`} variant="ghost" size="sm" className="inline-flex">
            View all {activeTab !== "all" ? activeTab : "experiences"}
            <ArrowRight className="w-4 h-4" />
         </ButtonLink>
      </div>
    </section>
  );
}
