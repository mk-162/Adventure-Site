"use client";

import clsx from "clsx";

interface ActivitySeasonGuideProps {
  regionSlug?: string;
  activityTypes?: string[];
}

type SeasonRating = "ideal" | "good" | "possible";

interface ActivitySeason {
  name: string;
  emoji: string;
  months: (SeasonRating | null)[];
  peak: string;
}

const ACTIVITY_SEASONS: ActivitySeason[] = [
  {
    name: "Coasteering",
    emoji: "🌊",
    months: [null, null, null, "possible", "ideal", "ideal", "ideal", "ideal", "good", "possible", null, null],
    peak: "Jun–Aug",
  },
  {
    name: "Hiking",
    emoji: "🥾",
    months: [null, "possible", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "possible", null],
    peak: "Apr–Sep",
  },
  {
    name: "Mountain Biking",
    emoji: "🚵",
    months: ["possible", "possible", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "possible", "possible"],
    peak: "Apr–Sep",
  },
  {
    name: "Surfing",
    emoji: "🏄",
    months: ["ideal", "ideal", "ideal", "good", "good", "possible", "possible", "possible", "good", "ideal", "ideal", "ideal"],
    peak: "Oct–Mar",
  },
  {
    name: "Wild Swimming",
    emoji: "🏊",
    months: [null, null, null, "possible", "good", "ideal", "ideal", "ideal", "good", "possible", null, null],
    peak: "Jun–Aug",
  },
  {
    name: "Kayaking",
    emoji: "🛶",
    months: ["possible", "possible", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "good", "possible", "possible"],
    peak: "Apr–Aug",
  },
  {
    name: "Rock Climbing",
    emoji: "🧗",
    months: ["possible", "possible", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "possible", "possible"],
    peak: "Apr–Sep",
  },
  {
    name: "Caving",
    emoji: "🦇",
    months: ["good", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "good", "good"],
    peak: "Year-round",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RATING_BG = {
  ideal: "bg-emerald-500",
  good: "bg-blue-400",
  possible: "bg-gray-300",
};

export function ActivitySeasonGuide({
  activityTypes,
}: ActivitySeasonGuideProps) {
  let activities = ACTIVITY_SEASONS;
  if (activityTypes && activityTypes.length > 0) {
    activities = activities.filter((a) =>
      activityTypes.some((type) =>
        a.name.toLowerCase().includes(type.toLowerCase())
      )
    );
  }

  if (activities.length === 0) return null;

  // Current month highlight
  const currentMonth = new Date().getMonth();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100">
        <h3 className="font-bold text-primary">Best Time to Visit</h3>
        <p className="text-xs text-gray-500 mt-0.5">Activity conditions by month</p>
      </div>

      {/* Season bars */}
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.name} className="px-4 sm:px-5 py-3 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{activity.emoji}</span>
                <span className="text-sm font-semibold text-primary">{activity.name}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">{activity.peak}</span>
            </div>
            {/* Month bar */}
            <div className="flex gap-0.5 sm:gap-1">
              {activity.months.map((rating, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "flex-1 h-3 sm:h-4 rounded-sm transition-all relative group",
                    rating ? RATING_BG[rating] : "bg-gray-100",
                    idx === currentMonth && "ring-2 ring-accent-hover ring-offset-1"
                  )}
                  title={`${MONTHS[idx]}: ${rating || "Not recommended"}`}
                />
              ))}
            </div>
            {/* Month labels (desktop only) */}
            {activity === activities[activities.length - 1] && (
              <div className="hidden sm:flex gap-0.5 sm:gap-1 mt-1">
                {MONTHS.map((m, idx) => (
                  <div key={idx} className={clsx("flex-1 text-center text-[10px]", idx === currentMonth ? "text-accent-hover font-bold" : "text-gray-400")}>
                    {m.charAt(0)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="px-4 sm:px-5 py-3 bg-gray-50 flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs text-gray-600">Ideal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-400" />
          <span className="text-xs text-gray-600">Good</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-300" />
          <span className="text-xs text-gray-600">Possible</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-3 h-3 rounded-sm ring-2 ring-accent-hover ring-offset-1 bg-gray-200" />
          <span className="text-xs text-gray-500">Now</span>
        </div>
      </div>
    </div>
  );
}
