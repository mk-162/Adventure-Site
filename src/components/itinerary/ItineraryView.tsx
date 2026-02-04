"use client";

import { useState } from "react";
import { ItineraryMap } from "./ItineraryMap";
import { TimelineDay } from "./TimelineDay";
import { CostBreakdown } from "./CostBreakdown";
import { BasecampPicker } from "./BasecampPicker";
import { ItineraryStop } from "@/types/itinerary";
import { CloudRain, PiggyBank, Star, Home, MapPin } from "lucide-react";
import { accommodation } from "@/db/schema";
import clsx from "clsx";

type AccommodationData = typeof accommodation.$inferSelect;

interface ItineraryViewProps {
  stops: ItineraryStop[];
  accommodations?: AccommodationData[];
  itineraryName?: string;
}

export function ItineraryView({ stops, accommodations = [], itineraryName }: ItineraryViewProps) {
  const [mode, setMode] = useState<"standard" | "wet" | "budget">("standard");
  const [basecamp, setBasecamp] = useState<AccommodationData | null>(null);
  const [showBasecampPicker, setShowBasecampPicker] = useState(false);

  const days = Array.from(new Set(stops.map(s => s.dayNumber))).sort((a,b) => a-b);
  const stopsByDay = days.map(day => ({
    dayNumber: day,
    stops: stops.filter(s => s.dayNumber === day)
  }));

  // Get first activity coordinates for distance calculation
  const firstActivity = stops.find(s => s.lat && s.lng);
  const firstActivityLat = firstActivity?.lat ? Number(firstActivity.lat) : null;
  const firstActivityLng = firstActivity?.lng ? Number(firstActivity.lng) : null;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">
          
          {/* Basecamp Prompt */}
          {!basecamp && accommodations.length > 0 && (
            <button
              onClick={() => setShowBasecampPicker(true)}
              className="bg-gradient-to-r from-[#1e3a4c] to-[#2d5466] text-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">📍 Select your basecamp</div>
                    <div className="text-sm text-gray-200">See personalised travel times from your accommodation</div>
                  </div>
                </div>
                <MapPin className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          )}

          {/* Basecamp Selected Banner */}
          {basecamp && (
            <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-[#f97316]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f97316] p-2 rounded-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#f97316] uppercase tracking-wider">Your Basecamp</div>
                    <div className="font-bold text-[#1e3a4c]">{basecamp.name}</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowBasecampPicker(true)}
                  className="text-sm font-bold text-[#f97316] hover:text-[#f97316]/80 transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
          )}
          
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
        <ItineraryMap stops={stops} mode={mode} basecamp={basecamp} className="w-full shadow-lg border border-gray-200" />

        {/* Timeline */}
        <section>
             <h2 className="text-2xl font-bold text-[#1e3a4c] mb-8">Your Itinerary</h2>
             {stopsByDay.map(day => (
                <TimelineDay key={day.dayNumber} dayNumber={day.dayNumber} stops={day.stops} mode={mode} basecamp={basecamp} />
             ))}
        </section>

      </div>

      {/* Right Column: Sidebar */}
      <aside className="hidden lg:block lg:col-span-4">
         <CostBreakdown stops={stops} mode={mode} itineraryName={itineraryName} />
      </aside>
    </div>

      {/* Basecamp Picker Modal */}
      {showBasecampPicker && (
        <BasecampPicker
          accommodations={accommodations}
          firstActivityLat={firstActivityLat}
          firstActivityLng={firstActivityLng}
          currentBasecamp={basecamp}
          onSelect={(selected) => {
            setBasecamp(selected);
            setShowBasecampPicker(false);
          }}
          onClose={() => setShowBasecampPicker(false)}
        />
      )}
    </>
  );
}
