"use client";

import { useState } from "react";
import { ItineraryMap } from "./ItineraryMap";
import { TimelineDay } from "./TimelineDay";
import { CostBreakdown } from "./CostBreakdown";
import { ItineraryStop } from "@/types/itinerary";
import { CloudRain, PiggyBank, Star } from "lucide-react";
import clsx from "clsx";

interface ItineraryViewProps {
  stops: ItineraryStop[];
}

export function ItineraryView({ stops }: ItineraryViewProps) {
  const [mode, setMode] = useState<"standard" | "wet" | "budget">("standard");

  const days = Array.from(new Set(stops.map(s => s.dayNumber))).sort((a,b) => a-b);
  const stopsByDay = days.map(day => ({
    dayNumber: day,
    stops: stops.filter(s => s.dayNumber === day)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
      {/* Left Column: Main Content */}
      <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">
        
        {/* Toggle Controls */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-wrap sm:flex-nowrap gap-2">
            <button 
                onClick={() => setMode("standard")}
                className={clsx(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                    mode === "standard" 
                        ? "bg-[#1e3a4c] text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-100"
                )}
            >
                <Star className="w-4 h-4" />
                Standard
            </button>
            <button 
                onClick={() => setMode("wet")}
                className={clsx(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                    mode === "wet" 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-100"
                )}
            >
                <CloudRain className="w-4 h-4" />
                Wet Weather
            </button>
            <button 
                onClick={() => setMode("budget")}
                className={clsx(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                    mode === "budget" 
                        ? "bg-green-600 text-white shadow-md" 
                        : "text-gray-600 hover:bg-gray-100"
                )}
            >
                <PiggyBank className="w-4 h-4" />
                Budget Friendly
            </button>
        </div>

        {/* Map */}
        <ItineraryMap stops={stops} mode={mode} className="w-full shadow-lg border border-gray-200" />

        {/* Timeline */}
        <section>
             <h2 className="text-2xl font-bold text-[#1e3a4c] mb-8">Your Itinerary</h2>
             {stopsByDay.map(day => (
                <TimelineDay key={day.dayNumber} dayNumber={day.dayNumber} stops={day.stops} mode={mode} />
             ))}
        </section>

      </div>

      {/* Right Column: Sidebar */}
      <aside className="hidden lg:block lg:col-span-4">
         <CostBreakdown stops={stops} mode={mode} />
      </aside>
    </div>
  );
}
