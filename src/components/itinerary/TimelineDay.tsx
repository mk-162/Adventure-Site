"use client";

import Image from "next/image";
import { ItineraryStop } from "@/types/itinerary";
import { Flag, Bed, Utensils, Car, CloudRain, PiggyBank, MapPin, Home } from "lucide-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { accommodation } from "@/db/schema";
import { calculateDistance, calculateDrivingTime } from "@/lib/travel-utils";
import { getActivityHeroImage } from "@/lib/activity-images";

type AccommodationData = typeof accommodation.$inferSelect;

interface TimelineDayProps {
  dayNumber: number;
  stops: ItineraryStop[];
  mode: "standard" | "wet" | "budget";
  basecamp?: AccommodationData | null;
}

export function TimelineDay({ dayNumber, stops, mode, basecamp }: TimelineDayProps) {
  // Calculate travel time from basecamp to first stop
  const firstStop = stops[0];
  const lastStop = stops[stops.length - 1];
  
  let travelFromBasecamp: string | null = null;
  let travelToBasecamp: string | null = null;

  if (basecamp && basecamp.lat && basecamp.lng) {
    // Travel FROM basecamp
    if (firstStop?.lat && firstStop?.lng) {
      const distance = calculateDistance(
        Number(basecamp.lat),
        Number(basecamp.lng),
        Number(firstStop.lat),
        Number(firstStop.lng)
      );
      travelFromBasecamp = calculateDrivingTime(distance);
    }

    // Travel TO basecamp
    if (lastStop?.lat && lastStop?.lng) {
      const distance = calculateDistance(
        Number(lastStop.lat),
        Number(lastStop.lng),
        Number(basecamp.lat),
        Number(basecamp.lng)
      );
      travelToBasecamp = calculateDrivingTime(distance);
    }
  }

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
            {/* Travel FROM Basecamp */}
            {travelFromBasecamp && (
                <div className="relative pl-8 pb-4">
                    <div className="absolute left-[-5px] top-6 w-3 h-3 bg-white border-2 border-[#f97316] rounded-full z-10"></div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-[#f97316] p-1.5 rounded-lg">
                            <Home className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold text-gray-500 uppercase">From Basecamp</div>
                            <div className="text-sm font-bold text-[#1e3a4c]">{basecamp?.name}</div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium pl-1">
                        <Car className="w-4 h-4" />
                        <span>{travelFromBasecamp} drive</span>
                    </div>
                </div>
            )}

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

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            {/* Thumbnail + Content row */}
                            <div className="flex">
                                {/* Thumbnail — shown for every stop */}
                                {(() => {
                                    // Resolve image: use activity data if available, otherwise derive from stop title
                                    const slug = stop.activity?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                    const typeSlug = stop.activityType?.slug || null;
                                    const heroImg = getActivityHeroImage(slug, typeSlug);

                                    const iconMap = {
                                        activity: { icon: <Flag className="w-4 h-4 text-blue-600" />, bg: "bg-blue-50", iconLg: <Flag className="w-8 h-8 text-blue-200" /> },
                                        accommodation: { icon: <Bed className="w-4 h-4 text-green-600" />, bg: "bg-green-50", iconLg: <Bed className="w-8 h-8 text-green-200" /> },
                                        food: { icon: <Utensils className="w-4 h-4 text-orange-600" />, bg: "bg-orange-50", iconLg: <Utensils className="w-8 h-8 text-orange-200" /> },
                                        transport: { icon: <Car className="w-4 h-4 text-gray-600" />, bg: "bg-gray-100", iconLg: <Car className="w-8 h-8 text-gray-300" /> },
                                    };
                                    const stopIcon = iconMap[type as keyof typeof iconMap] || iconMap.activity;

                                    // Activity-type stops always get a photo thumbnail
                                    const usePhoto = type === "activity";

                                    return (
                                        <div className={`hidden sm:block relative w-32 lg:w-40 shrink-0 ${usePhoto ? "" : stopIcon.bg}`}>
                                            {usePhoto ? (
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center"
                                                    style={{ backgroundImage: `url('${heroImg}')` }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {stopIcon.iconLg}
                                                </div>
                                            )}
                                            {/* Type icon badge */}
                                            <div className="absolute bottom-2 left-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                                                {stopIcon.icon}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Content */}
                                <div className="flex-1 p-5">
                                    <h4 className="font-bold text-[#1e3a4c] text-lg flex flex-wrap items-center gap-2">
                                        {/* Mobile-only type icon */}
                                        <span className="sm:hidden">
                                            {type === 'activity' && <Flag className="w-4 h-4 text-blue-600 inline" />}
                                            {type === 'accommodation' && <Bed className="w-4 h-4 text-green-600 inline" />}
                                            {type === 'food' && <Utensils className="w-4 h-4 text-orange-600 inline" />}
                                            {type === 'transport' && <Car className="w-4 h-4 text-gray-600 inline" />}
                                        </span>
                                        {title}
                                        {stop.operator?.claimStatus && (
                                            <VerifiedBadge 
                                                claimStatus={stop.operator.claimStatus} 
                                                size="sm" 
                                                showLabel={false}
                                            />
                                        )}
                                        {isAlt && (
                                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                                                {mode === "wet" ? <CloudRain className="w-3 h-3" /> : <PiggyBank className="w-3 h-3" />}
                                                Alternative
                                            </span>
                                        )}
                                    </h4>
                                    {stop.operator && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            by {stop.operator.name}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-1 mb-3 text-sm text-gray-500">
                                        {stop.duration && <span>{stop.duration}</span>}
                                        {cost && <span>• {cost}</span>}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {description}
                                    </p>

                                    {/* Actions / Links */}
                                    <div className="mt-4 flex gap-3">
                                        {(stop.activityId || (mode === "wet" && stop.wetAltActivityId) || (mode === "budget" && stop.budgetAltActivityId)) && (
                                            <button className="text-xs font-bold bg-[#1e3a4c] text-white px-3 py-1.5 rounded-lg hover:bg-[#1e3a4c]/90 transition-colors">
                                                View Details
                                            </button>
                                        )}
                                        <button className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Map
                                        </button>
                                    </div>
                                </div>
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

            {/* Travel TO Basecamp */}
            {travelToBasecamp && (
                <div className="relative pl-8 pt-4">
                    <div className="absolute left-[-5px] top-6 w-3 h-3 bg-white border-2 border-[#f97316] rounded-full z-10"></div>
                    <div className="mt-4 mb-4 flex items-center gap-2 text-xs text-gray-500 font-medium pl-1">
                        <Car className="w-4 h-4" />
                        <span>{travelToBasecamp} drive</span>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-[#f97316] p-1.5 rounded-lg">
                            <Home className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold text-gray-500 uppercase">Return to Basecamp</div>
                            <div className="text-sm font-bold text-[#1e3a4c]">{basecamp?.name}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
