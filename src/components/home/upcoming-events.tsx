import Link from "next/link";

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
  const displayEvents = events.slice(0, 4);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-2">
              Mark Your Calendar
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a4c]">
              Upcoming Events
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button className="px-4 py-2 bg-[#1e3a4c] text-white text-sm font-medium rounded-full">
              All Events
            </button>
            <button className="px-4 py-2 bg-white text-gray-600 text-sm font-medium rounded-full hover:bg-gray-100 transition-colors">
              Festivals
            </button>
            <button className="px-4 py-2 bg-white text-gray-600 text-sm font-medium rounded-full hover:bg-gray-100 transition-colors">
              Competitions
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {displayEvents.map((event) => {
            const date = parseDate(event.monthTypical);
            return (
              <div
                key={event.id}
                className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Left: Date + Info */}
                <div className="flex items-center gap-4">
                  {/* Date Badge */}
                  <div className="w-14 text-center">
                    <div className="text-xs font-semibold text-[#f97316] uppercase">
                      {date.month}
                    </div>
                    <div className="text-2xl font-bold text-[#1e3a4c]">
                      {date.day || "—"}
                    </div>
                  </div>

                  {/* Event Info */}
                  <div>
                    <h3 className="font-semibold text-[#1e3a4c]">{event.name}</h3>
                    <p className="text-sm text-gray-500">{event.location || "Wales"}</p>
                  </div>
                </div>

                {/* Right: Time + Details */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 hidden sm:block">
                    {event.type || "Event"}
                  </span>
                  <Link
                    href={`/events/${event.slug}`}
                    className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-full hover:border-[#f97316] hover:text-[#f97316] transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a4c] text-white font-semibold rounded-full hover:bg-[#152a38] transition-colors"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
