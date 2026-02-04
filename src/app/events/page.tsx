import { getEvents, getAllRegions } from "@/lib/queries";
import { EventCard } from "@/components/cards/event-card";

export default async function EventsPage() {
  const [events, regions] = await Promise.all([
    getEvents(),
    getAllRegions(),
  ]);

  const types = ["All Events", "Running", "Triathlon", "Cycling", "MTB", "Festival", "Walking"];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-[#1e3a4c] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-white/70 text-sm mb-4">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">›</span>
            <span className="text-white">Events</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Races & Events
          </h1>
          <p className="text-white/80">
            Trail runs, triathlons, MTB races, and adventure festivals across Wales. With honest difficulty info so you know what you're signing up for.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {types.map((type, i) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  i === 0
                    ? "bg-[#1e3a4c] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {events.map((item) => (
            <EventCard
              key={item.event.id}
              event={item.event}
              region={item.region}
              variant="list"
            />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Races & Events | Adventure Wales",
  description: "Trail runs, triathlons, MTB races, and adventure festivals across Wales. With honest difficulty info and what you're actually signing up for.",
};
