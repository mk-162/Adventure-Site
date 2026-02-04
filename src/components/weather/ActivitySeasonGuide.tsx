"use client";

import clsx from "clsx";

interface ActivitySeasonGuideProps {
  regionSlug?: string;
  activityTypes?: string[];
}

type SeasonRating = "ideal" | "good" | "possible";

interface ActivitySeason {
  name: string;
  months: (SeasonRating | null)[];
  description: string;
}

// Activity season matrix (0-11 for Jan-Dec)
const ACTIVITY_SEASONS: ActivitySeason[] = [
  {
    name: "Coasteering",
    months: [null, null, null, "possible", "ideal", "ideal", "ideal", "ideal", "good", "possible", null, null],
    description: "Best in summer when water temps are warmer",
  },
  {
    name: "Hiking",
    months: [null, "possible", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "possible", null],
    description: "Spring to autumn for best trail conditions",
  },
  {
    name: "Mountain Biking",
    months: ["possible", "possible", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "possible", "possible"],
    description: "Year-round, but drier months are more enjoyable",
  },
  {
    name: "Surfing",
    months: ["ideal", "ideal", "ideal", "good", "good", "possible", "possible", "possible", "good", "ideal", "ideal", "ideal"],
    description: "Best swells in autumn and winter",
  },
  {
    name: "Wild Swimming",
    months: [null, null, null, "possible", "good", "ideal", "ideal", "ideal", "good", "possible", null, null],
    description: "Summer months for comfortable water temps",
  },
  {
    name: "Kayaking",
    months: ["possible", "possible", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "good", "possible", "possible"],
    description: "Calmer waters in spring and summer",
  },
  {
    name: "Rock Climbing",
    months: ["possible", "possible", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "possible", "possible"],
    description: "Dry conditions essential for safety",
  },
  {
    name: "Caving",
    months: ["good", "good", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "ideal", "good", "good", "good"],
    description: "Year-round, though lower water in summer",
  },
];

const MONTH_ABBR = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const RATING_SYMBOLS = {
  ideal: "●",
  good: "○",
  possible: "·",
};

const RATING_COLORS = {
  ideal: "text-emerald-600",
  good: "text-blue-500",
  possible: "text-gray-400",
};

export function ActivitySeasonGuide({
  regionSlug,
  activityTypes,
}: ActivitySeasonGuideProps) {
  // Filter activities if specific types requested
  let activities = ACTIVITY_SEASONS;
  if (activityTypes && activityTypes.length > 0) {
    activities = activities.filter((a) =>
      activityTypes.some((type) =>
        a.name.toLowerCase().includes(type.toLowerCase())
      )
    );
  }

  if (activities.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-4">
        <h3 className="font-bold text-[#1e3a4c] text-lg">Activity Seasons</h3>
        <p className="text-sm text-gray-500">
          When to enjoy different activities in Wales
        </p>
      </div>

      {/* Mobile: Stacked cards */}
      <div className="lg:hidden space-y-4">
        {activities.map((activity) => (
          <div key={activity.name} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-[#1e3a4c] mb-2">{activity.name}</h4>
            <div className="flex gap-2 mb-2">
              {activity.months.map((rating, idx) => (
                <div key={idx} className="flex-1 text-center">
                  <div className="text-xs text-gray-400 mb-1">{MONTH_ABBR[idx]}</div>
                  <div
                    className={clsx(
                      "text-xl font-bold",
                      rating ? RATING_COLORS[rating] : "text-gray-200"
                    )}
                  >
                    {rating ? RATING_SYMBOLS[rating] : "·"}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">{activity.description}</p>
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-2 pr-4 font-bold text-[#1e3a4c]">
                Activity
              </th>
              {MONTH_ABBR.map((month, idx) => (
                <th key={idx} className="text-center pb-2 px-1 font-bold text-gray-500 text-xs">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium text-[#1e3a4c]">
                  {activity.name}
                </td>
                {activity.months.map((rating, idx) => (
                  <td
                    key={idx}
                    className="text-center px-1 py-3"
                  >
                    <span
                      className={clsx(
                        "text-2xl font-bold",
                        rating ? RATING_COLORS[rating] : "text-gray-200"
                      )}
                      title={rating || "Not recommended"}
                    >
                      {rating ? RATING_SYMBOLS[rating] : "·"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600">●</span>
          <span className="text-sm text-gray-600">Ideal conditions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-500">○</span>
          <span className="text-sm text-gray-600">Good conditions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-400">·</span>
          <span className="text-sm text-gray-600">Possible, not ideal</span>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-bold">Planning tip:</span> Book operators in advance for
          peak season (May-September). Winter activities offer better availability and
          fewer crowds.
        </p>
      </div>
    </div>
  );
}
