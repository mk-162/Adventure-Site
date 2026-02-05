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

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const displayEvents = events.slice(0, 3); // Design shows 3

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-[#1e3a4c] font-bold uppercase tracking-wider text-sm">Coming Up</span>
            <h2 className="mt-2 text-3xl font-bold text-[#1e3a4c]">Races & Events Worth Entering</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button className="shrink-0 px-4 py-2 rounded-full bg-[#1e3a4c] text-white text-sm font-bold hover:bg-[#1e3a4c]/90 transition-colors">All</button>
            <button className="shrink-0 px-4 py-2 rounded-full border border-slate-200 text-sm font-bold hover:bg-slate-50 text-slate-700 transition-colors">Festivals</button>
            <button className="shrink-0 px-4 py-2 rounded-full border border-slate-200 text-sm font-bold hover:bg-slate-50 text-slate-700 transition-colors">Races</button>
          </div>
        </div>

        <div className="space-y-2">
          {displayEvents.map((event, index) => {
            const date = parseDate(event.monthTypical);
            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className={`group flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl hover:bg-slate-50 hover:shadow-md transition-all duration-300 ${index !== 0 ? "border-t border-slate-100" : ""}`}
              >
                <div className="shrink-0 w-16 sm:w-20 text-center bg-slate-100 group-hover:bg-[#ea580c]/10 rounded-2xl py-3 transition-colors">
                  <span className="block text-[#ea580c] font-bold text-xs sm:text-sm uppercase">
                    {date.month}
                  </span>
                  <span className="block text-2xl sm:text-3xl font-black text-[#1e3a4c]">
                    {date.day || "—"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold truncate text-[#1e3a4c]">{event.name}</h3>
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
      </div>
    </section>
  );
}
