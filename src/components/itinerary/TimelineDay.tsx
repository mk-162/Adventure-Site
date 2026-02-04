"use client";

import { ItineraryStop } from "@/types/itinerary";
import { Flag, Bed, Utensils, Car, CloudRain, PiggyBank, MapPin } from "lucide-react";

interface TimelineDayProps {
  dayNumber: number;
  stops: ItineraryStop[];
  mode: "standard" | "wet" | "budget";
}

export function TimelineDay({ dayNumber, stops, mode }: TimelineDayProps) {
  return (
    <div className="mb-8 relative pl-0 sm:pl-4">
        {/* Day Header */}
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#f97316] text-white font-bold text-xl w-12 h-12 rounded-xl flex items-center justify-center shadow-md z-10 relative shrink-0">
                {String(dayNumber).padStart(2, '0')}
            </div>
            <h3 className="text-xl font-bold text-[#1e3a4c]">Day {dayNumber}</h3>
        </div>

        <div className="border-l-2 border-gray-200 ml-6 space-y-8 pb-8 -mt-6 pt-10">
            {stops.map((stop, index) => {
                // Determine content based on mode
                let title = stop.title;
                let description = stop.description;
                const cost = stop.costFrom ? `£${stop.costFrom}` : '';
                const type = stop.stopType;
                let isAlt = false;

                if (mode === "wet" && stop.wetAltTitle) {
                    title = stop.wetAltTitle;
                    description = stop.wetAltDescription || "";
                    isAlt = true;
                } else if (mode === "budget" && stop.budgetAltTitle) {
                    title = stop.budgetAltTitle;
                    description = stop.budgetAltDescription || "";
                    isAlt = true;
                }

                return (
                    <div key={stop.id} className="relative pl-8">
                        {/* Dot on timeline */}
                        <div className="absolute left-[-5px] top-6 w-3 h-3 bg-white border-2 border-[#1e3a4c] rounded-full z-10"></div>

                        {/* Time if available */}
                        {stop.startTime && (
                            <span className="text-xs font-bold text-gray-500 mb-1 block">
                                {stop.startTime}
                            </span>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <h4 className="font-bold text-[#1e3a4c] text-lg flex flex-wrap items-center gap-2">
                                        {title}
                                        {isAlt && (
                                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                                                {mode === "wet" ? <CloudRain className="w-3 h-3" /> : <PiggyBank className="w-3 h-3" />}
                                                Alternative
                                            </span>
                                        )}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1 mb-3 text-sm text-gray-500">
                                        {stop.duration && <span>{stop.duration}</span>}
                                        {cost && <span>• {cost}</span>}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {description}
                                    </p>
                                </div>
                                <div className="shrink-0 self-start sm:self-auto hidden sm:block">
                                    {/* Icon based on type */}
                                    {type === 'activity' && <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Flag className="w-6 h-6" /></div>}
                                    {type === 'accommodation' && <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Bed className="w-6 h-6" /></div>}
                                    {type === 'food' && <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Utensils className="w-6 h-6" /></div>}
                                    {type === 'transport' && <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><Car className="w-6 h-6" /></div>}
                                </div>
                            </div>

                            {/* Actions / Links */}
                            <div className="mt-4 flex gap-3">
                                {(stop.activityId || (mode === "wet" && stop.wetAltActivityId) || (mode === "budget" && stop.budgetAltActivityId)) && (
                                    <button className="text-xs font-bold bg-[#1e3a4c] text-white px-3 py-1.5 rounded-lg hover:bg-[#1e3a4c]/90 transition-colors">
                                        Book Now
                                    </button>
                                )}
                                <button className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Map
                                </button>
                            </div>
                        </div>

                        {/* Travel to next */}
                        {stop.travelToNext && index < stops.length - 1 && (
                            <div className="mt-4 mb-4 flex items-center gap-2 text-xs text-gray-500 font-medium pl-1">
                                <Car className="w-4 h-4" />
                                <span>{stop.travelToNext}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
}
