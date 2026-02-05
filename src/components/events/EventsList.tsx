"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { events, regions } from "@/db/schema";

type Event = typeof events.$inferSelect;
type Region = typeof regions.$inferSelect | null;

interface EventWithRegion {
  event: Event;
  region: Region;
}

interface EventsListProps {
  events: EventWithRegion[];
}

const SEASONS = [
  { value: "all", label: "All Year" },
  { value: "spring", label: "Spring (Mar-May)", months: ["march", "april", "may"] },
  { value: "summer", label: "Summer (Jun-Aug)", months: ["june", "july", "august"] },
  { value: "autumn", label: "Autumn (Sep-Nov)", months: ["september", "october", "november"] },
  { value: "winter", label: "Winter (Dec-Feb)", months: ["december", "january", "february"] },
] as const;

const MONTH_ORDER = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

function parseMonthFromTypical(monthTypical: string | null): string | null {
  if (!monthTypical) return null;
  
  const lower = monthTypical.toLowerCase();
  
  // Extract month name from strings like "April 19", "August (TBC)", "September 12-14 (TBC)"
  for (const month of MONTH_ORDER) {
    if (lower.includes(month)) {
      return month;
    }
  }
  
  return null;
}

function getSeasonFromMonth(month: string | null): string {
  if (!month) return "all";
  
  for (const season of SEASONS) {
    if (season.value !== "all" && "months" in season && (season.months as readonly string[]).includes(month)) {
      return season.value;
    }
  }
  
  return "all";
}

export function EventsList({ events }: EventsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Extract unique event types
  const eventTypes = useMemo(() => {
    const types = new Set<string>();
    events.forEach(({ event }) => {
      if (event.type) types.add(event.type);
    });
    return ["all", ...Array.from(types).sort()];
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(({ event, region }) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          event.name.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          region?.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (selectedType !== "all" && event.type !== selectedType) {
        return false;
      }

      // Season filter
      if (selectedSeason !== "all") {
        const month = parseMonthFromTypical(event.monthTypical);
        const eventSeason = getSeasonFromMonth(month);
        if (eventSeason !== selectedSeason) return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedSeason, selectedType]);

  // Group events by month
  const groupedEvents = useMemo(() => {
    const groups: Record<string, EventWithRegion[]> = {};
    
    filteredEvents.forEach((item) => {
      const month = parseMonthFromTypical(item.event.monthTypical);
      const monthKey = month || "tbc";
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(item);
    });

    // Sort groups by month order
    const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
      if (a === "tbc") return 1;
      if (b === "tbc") return -1;
      return MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b);
    });

    return sortedGroups;
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-hover focus:border-transparent"
            />
          </div>

          {/* Season Filter */}
          <div className="relative">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-hover focus:border-transparent bg-white cursor-pointer"
            >
              {SEASONS.map((season) => (
                <option key={season.value} value={season.value}>
                  {season.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Event Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-hover focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">All Types</option>
              {eventTypes.filter(t => t !== "all").map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {/* Grouped Events List */}
      {groupedEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            Try adjusting your filters or search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSeason("all");
              setSelectedType("all");
            }}
            className="text-accent-hover font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedEvents.map(([month, monthEvents]) => (
            <div key={month}>
              {/* Month Header */}
              <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur py-3 mb-4 border-b-2 border-primary">
                <h2 className="text-2xl font-bold text-primary capitalize">
                  {month === "tbc" ? "Date To Be Confirmed" : month}
                </h2>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 gap-4">
                {monthEvents.map(({ event, region }) => (
                  <EventRow key={event.id} event={event} region={region} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventRow({ event, region }: { event: Event; region: Region }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-accent-hover transition-all flex flex-col sm:flex-row"
    >
      {/* Image */}
      <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-gray-200">
        {event.heroImage ? (
          <Image
            src={event.heroImage}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 128px"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <CalendarIcon className="w-8 h-8 text-primary/20" />
          </div>
        )}
        {event.isPromoted && (
          <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-1 rounded-full">
            Sponsored
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div>
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-xs font-bold text-accent-hover uppercase tracking-wide">
              {event.type || "Event"}
            </span>
            {event.monthTypical && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {event.monthTypical}
              </span>
            )}
          </div>

          {/* Event Name */}
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 group-hover:text-accent-hover transition-colors line-clamp-2">
            {event.name}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {event.location}
              {region && ` • ${region.name}`}
            </span>
          </div>

          {/* Description preview */}
          {event.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {event.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {event.registrationCost !== null && (
              <span className="font-bold text-gray-900">
                {Number(event.registrationCost) === 0
                  ? "Free"
                  : `From £${Number(event.registrationCost).toFixed(0)}`}
              </span>
            )}
          </div>
          <span className="text-accent-hover font-medium text-sm group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
