import { getEvents, getAllRegions } from "@/lib/queries";
import { EventsFilters } from "@/components/events/EventsFilters";
import { getPageImages } from "@/lib/archive-images";

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
          <p className="text-white/80 mb-3">
            Trail runs, triathlons, MTB races, and adventure festivals across Wales. With honest difficulty info so you know what you&apos;re signing up for.
          </p>
          <a href="/calendar" className="text-[#ea580c] font-semibold text-sm hover:underline">
            View Calendar →
          </a>

          {/* Event image strip */}
          <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {[...getPageImages("events-festival", 3), ...getPageImages("events-races", 2)].map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0 w-48 h-28 rounded-xl overflow-hidden">
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <EventsFilters events={events} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-[#ea580c] rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black mb-4">Organising an event?</h2>
            <p className="text-lg text-white/90 mb-8">
              List your race, festival, or workshop on Adventure Wales to reach thousands of outdoor enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/login"
                className="bg-[#1e3a4c] hover:bg-[#152a38] text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                List Your Event
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Welsh Races & Adventure Events 2026 — Trail Runs, MTB, Triathlons | Adventure Wales",
  description: "Find races and adventure events across Wales. Trail running, mountain biking, triathlons, swimming events, and outdoor festivals with dates, entry fees, and difficulty info.",
};
