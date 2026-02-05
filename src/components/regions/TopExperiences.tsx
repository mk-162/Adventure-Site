"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mountain, Ticket, Camera, Map } from "lucide-react";
import { ActivityCard } from "@/components/cards/activity-card";

interface TopExperiencesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activities: any[];
  regionSlug: string;
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
        <h3 className="text-lg lg:text-xl font-bold text-primary">Top Experiences</h3>

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
        {filteredActivities.slice(0, 6).map((item) => (
          <ActivityCard
            key={item.activity.id}
            activity={item.activity}
            region={item.region}
            operator={item.operator}
            activityType={item.activityType}
            hideOperator={true}
          />
        ))}
        {filteredActivities.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
                No experiences found in this category.
            </div>
        )}
      </div>

      <div className="mt-6 text-center sm:text-right">
         <Link
            href={`/${regionSlug}/things-to-do`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-hover transition-colors"
         >
            View all {activeTab !== "all" ? activeTab : "experiences"}
            <ArrowRight className="w-4 h-4" />
         </Link>
      </div>
    </section>
  );
}
