"use client";

import { useState } from "react";
import Image from "next/image";
import { ItineraryStop } from "@/types/itinerary";
import { Flag, Bed, Utensils, Car, CloudRain, PiggyBank, MapPin, Home, Phone, EyeOff, Eye, Shuffle, Loader2, X } from "lucide-react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { accommodation } from "@/db/schema";
import { calculateDistance, calculateDrivingTime } from "@/lib/travel-utils";
import { getActivityHeroImage } from "@/lib/activity-images";
import { CustomStopForm } from "./CustomStopForm";

interface AlternativeActivity {
  id: number;
  name: string;
  slug: string;
  priceFrom: string | null;
  operatorName: string | null;
}

type AccommodationData = typeof accommodation.$inferSelect;

interface SkippedStopsState {
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  loaded: boolean;
}

interface TimelineDayProps {
  dayNumber: number;
  stops: ItineraryStop[];
  mode: "standard" | "wet" | "budget";
  basecamp?: AccommodationData | null;
  skippedStops?: SkippedStopsState;
  itinerarySlug?: string;
}

export function TimelineDay({ dayNumber, stops, mode, basecamp, skippedStops, itinerarySlug }: TimelineDayProps) {
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
            <div className="bg-accent-hover text-white font-bold text-xl w-12 h-12 rounded-xl flex items-center justify-center shadow-md z-10 relative shrink-0">
                {String(dayNumber).padStart(2, '0')}
            </div>
            <h3 className="text-xl font-bold text-primary">Day {dayNumber}</h3>
        </div>

        <div className="border-l-2 border-gray-200 ml-6 space-y-8 pb-8 -mt-6 pt-10">
            {/* Travel FROM Basecamp */}
            {travelFromBasecamp && (
                <div className="relative pl-8 pb-4">
                    <div className="absolute left-[-5px] top-6 w-3 h-3 bg-white border-2 border-accent-hover rounded-full z-10"></div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-accent-hover p-1.5 rounded-lg">
                            <Home className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold text-gray-500 uppercase">From Basecamp</div>
                            <div className="text-sm font-bold text-primary">{basecamp?.name}</div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium pl-1">
                        <Car className="w-4 h-4" />
                        <span>{travelFromBasecamp} drive</span>
                    </div>
                </div>
            )}

            {stops.map((stop, index) => {
                // Check if this stop is skipped
                const isSkipped = skippedStops?.loaded && skippedStops.has(String(stop.id));

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
                    <div key={stop.id} className={`relative pl-8 ${isSkipped ? "opacity-50" : ""}`}>
                        {/* Dot on timeline */}
                        <div className={`absolute left-[-5px] top-6 w-3 h-3 bg-white border-2 rounded-full z-10 ${isSkipped ? "border-gray-300" : "border-primary"}`}></div>

                        {/* Time if available */}
                        {stop.startTime && (
                            <span className="text-xs font-bold text-gray-500 mb-1 block">
                                {stop.startTime}
                            </span>
                        )}

                        <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${isSkipped ? "border-gray-200/50" : "border-gray-200"}`}>
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
                                    <div className="flex items-start justify-between gap-2">
                                    <h4 className={`font-bold text-lg flex flex-wrap items-center gap-2 ${isSkipped ? "text-gray-400 line-through" : "text-primary"}`}>
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
                                    {/* Skip toggle */}
                                    {skippedStops && (
                                      <button
                                        onClick={() => skippedStops.toggle(String(stop.id))}
                                        className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                                          isSkipped
                                            ? "text-gray-400 hover:text-primary hover:bg-gray-100"
                                            : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                                        }`}
                                        title={isSkipped ? "Include this stop" : "Skip this stop"}
                                      >
                                        {isSkipped ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                      </button>
                                    )}
                                    </div>
                                    {isSkipped && (
                                      <p className="text-xs text-gray-400 italic mb-2">Skipped — click the eye icon to include again</p>
                                    )}
                                    {stop.operator && (
                                        <p className={`text-xs mt-0.5 ${isSkipped ? "text-gray-400" : "text-gray-500"}`}>
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
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {(stop.activityId || (mode === "wet" && stop.wetAltActivityId) || (mode === "budget" && stop.budgetAltActivityId)) && (
                                            <button className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                                                View Details
                                            </button>
                                        )}
                                        {stop.operator?.slug && (
                                            <Link
                                                href={`/directory/${stop.operator.slug}`}
                                                className="text-xs font-bold text-accent-hover bg-accent-hover/10 px-3 py-1.5 rounded-lg hover:bg-accent-hover/20 transition-colors flex items-center gap-1"
                                            >
                                                <Phone className="w-3 h-3" /> Contact / Book
                                            </Link>
                                        )}
                                        <button className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Map
                                        </button>
                                        {stop.activity && (
                                            <AlternativesButton
                                                activityTypeId={stop.activity.activityTypeId}
                                                regionId={stop.activity.regionId}
                                                excludeId={stop.activity.id}
                                            />
                                        )}
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
                    <div className="absolute left-[-5px] top-6 w-3 h-3 bg-white border-2 border-accent-hover rounded-full z-10"></div>
                    <div className="mt-4 mb-4 flex items-center gap-2 text-xs text-gray-500 font-medium pl-1">
                        <Car className="w-4 h-4" />
                        <span>{travelToBasecamp} drive</span>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-accent-hover p-1.5 rounded-lg">
                            <Home className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold text-gray-500 uppercase">Return to Basecamp</div>
                            <div className="text-sm font-bold text-primary">{basecamp?.name}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom stops */}
            {itinerarySlug && (
              <CustomStopForm itinerarySlug={itinerarySlug} dayNumber={dayNumber} />
            )}
        </div>
    </div>
  );
}

/* ─── Alternatives Button + Panel ─── */

function AlternativesButton({
  activityTypeId,
  regionId,
  excludeId,
}: {
  activityTypeId: number | null;
  regionId: number | null;
  excludeId: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<AlternativeActivity[]>([]);
  const [fetched, setFetched] = useState(false);

  async function handleClick() {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);

    if (fetched) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activityTypeId) params.set("activityTypeId", String(activityTypeId));
      if (regionId) params.set("regionId", String(regionId));
      params.set("excludeId", String(excludeId));

      const res = await fetch(`/api/alternatives?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAlternatives(data.alternatives ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
      >
        <Shuffle className="w-3 h-3" />
        Alternatives?
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-30 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Similar activities</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-4 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}

          {!loading && alternatives.length === 0 && (
            <p className="text-xs text-gray-400 py-3 text-center">No alternatives found in this area.</p>
          )}

          {!loading && alternatives.length > 0 && (
            <div className="space-y-2">
              {alternatives.map((alt) => (
                <Link
                  key={alt.id}
                  href={`/activities/${alt.slug}`}
                  className="block p-2.5 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group"
                >
                  <p className="text-sm font-bold text-primary group-hover:text-purple-700 leading-tight">
                    {alt.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {alt.operatorName || "Independent"}
                    </span>
                    {alt.priceFrom && (
                      <span className="text-xs font-bold text-green-700">
                        From £{alt.priceFrom}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-purple-500 mt-1 inline-block">
                    Swap to this →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
