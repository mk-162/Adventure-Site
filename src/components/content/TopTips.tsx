"use client";

import { useState } from "react";
import { Lightbulb, Compass, Trophy } from "lucide-react";

interface TopTipsProps {
  tips: string[];
  title?: string;
  /** Tiered tips — if provided, renders tabbed view instead of flat list */
  tieredTips?: {
    firstTimer: string[];
    regular: string[];
  };
}

export function TopTips({ tips, title = "Top Tips", tieredTips }: TopTipsProps) {
  // If tiered tips provided, render tabbed version
  if (tieredTips && (tieredTips.firstTimer.length > 0 || tieredTips.regular.length > 0)) {
    return <TieredTopTips tieredTips={tieredTips} title={title} />;
  }

  // Flat list fallback (backward compatible)
  return (
    <div className="bg-white rounded-2xl border-l-4 border-accent p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-primary">{title}</h3>
      </div>

      <TipList tips={tips} />
    </div>
  );
}

function TieredTopTips({
  tieredTips,
  title,
}: {
  tieredTips: { firstTimer: string[]; regular: string[] };
  title: string;
}) {
  const [activeTab, setActiveTab] = useState<"firstTimer" | "regular">("firstTimer");

  return (
    <div className="bg-white rounded-2xl border-l-4 border-accent p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-primary">{title}</h3>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("firstTimer")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "firstTimer"
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Compass className="w-4 h-4" />
          First Visit
        </button>
        <button
          onClick={() => setActiveTab("regular")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "regular"
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Trophy className="w-4 h-4" />
          Been Before
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "firstTimer" && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            The practical stuff nobody tells you but everyone needs on their first visit.
          </p>
          <TipList tips={tieredTips.firstTimer} />
        </div>
      )}

      {activeTab === "regular" && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Insider knowledge for experienced visitors looking to get more out of the area.
          </p>
          <TipList tips={tieredTips.regular} />
        </div>
      )}
    </div>
  );
}

function TipList({ tips }: { tips: string[] }) {
  return (
    <div className="space-y-4">
      {tips.map((tip, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0 font-bold text-sm">
            {index + 1}
          </div>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base pt-0.5">
            {tip}
          </p>
        </div>
      ))}
    </div>
  );
}
