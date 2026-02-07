"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Event {
  id: number;
  name: string;
  slug: string;
  type: string | null;
  location: string | null;
  monthTypical: string | null;
}

interface UpcomingEventsProps {
  events: Event[];
}

// Parse month from monthTypical (e.g., "January 25" -> { month: "JAN", day: "25" })
function parseDate(monthTypical: string | null): { month: string; day: string } {
  if (!monthTypical) return { month: "TBD", day: "" };
  const parts = monthTypical.split(" ");
  const month = parts[0]?.substring(0, 3).toUpperCase() || "TBD";
  const day = parts[1] || "";
  return { month, day };
}

// Filter keywords for each category
const FESTIVAL_KEYWORDS = ["festival", "fair", "carnival", "celebration", "gala", "fiesta"];
const RACE_KEYWORDS = ["race", "marathon", "triathlon", "sportive", "enduro", "ultra", "run", "duathlon", "challenge", "championship"];

function matchesFilter(event: Event, filter: "all" | "festivals" | "races"): boolean {
  if (filter === "all") return true;
  
  const name = (event.name || "").toLowerCase();
  const type = (event.type || "").toLowerCase();
  const searchText = `${name} ${type}`;
  
  if (filter === "festivals") {
    return FESTIVAL_KEYWORDS.some(kw => searchText.includes(kw));
  }
  if (filter === "races") {
    return RACE_KEYWORDS.some(kw => searchText.includes(kw));
  }
  return true;
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const [filter, setFilter] = useState<"all" | "festivals" | "races">("all");
  
  const filteredEvents = events.filter(e => matchesFilter(e, filter));
  const displayEvents = filteredEvents.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-primary font-bold uppercase tracking-wider text-sm">Coming Up</span>
            <h2 className="mt-2 text-3xl font-bold text-primary">Races & Events Worth Entering</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setFilter("all")}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                filter === "all" 
                  ? "bg-primary text-white" 
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("festivals")}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                filter === "festivals" 
                  ? "bg-primary text-white" 
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Festivals
            </button>
            <button 
              onClick={() => setFilter("races")}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                filter === "races" 
                  ? "bg-primary text-white" 
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Races
            </button>
          </div>
        </div>

        {displayEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>No {filter === "all" ? "events" : filter} found</p>
            <button 
              onClick={() => setFilter("all")} 
              className="mt-2 text-primary font-semibold hover:underline"
            >
              View all events
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {displayEvents.map((event, index) => {
              const date = parseDate(event.monthTypical);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className={`group flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl hover:bg-slate-50 hover:shadow-md transition-all duration-300 ${index !== 0 ? "border-t border-slate-100" : ""}`}
                >
                  <div className="shrink-0 w-16 sm:w-20 text-center bg-slate-100 group-hover:bg-accent-hover/10 rounded-2xl py-3 transition-colors">
                    <span className="block text-accent-hover font-bold text-xs sm:text-sm uppercase">
                      {date.month}
                    </span>
                    <span className="block text-2xl sm:text-3xl font-black text-primary">
                      {date.day || "—"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold truncate text-primary">{event.name}</h3>
                    <p className="text-slate-500 text-sm">{event.location || "Wales"}</p>
                  </div>
                  <span className="hidden sm:block text-slate-500 text-sm">
                     {event.type || "Event"}
                  </span>
                  <ChevronRight className="text-slate-400 h-6 w-6" />
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link 
            href={`/events${filter !== "all" ? `?type=${filter}` : ""}`}
            className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
          >
            View all {filter === "all" ? "events" : filter}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
