import { getEvents, getAllRegions } from "@/lib/queries";
import { EventsFilters } from "@/components/events/EventsFilters";

export default async function EventsPage() {
  const [events, regions] = await Promise.all([
    getEvents(),
    getAllRegions(),
  ]);

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

      <EventsFilters events={events} />
    </div>
  );
}

export const metadata = {
  title: "Races & Events | Adventure Wales",
  description: "Trail runs, triathlons, MTB races, and adventure festivals across Wales. With honest difficulty info and what you're actually signing up for.",
};
