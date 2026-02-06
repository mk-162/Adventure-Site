import { getEvents, getEventMonths } from "@/lib/queries";
import { EventsClient } from "@/components/events/EventsClient";
import { EventGridCard } from "@/components/events/EventGridCard";
// Pagination removed - loading all events for proper month grouping
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = typeof searchParams.type === 'string' ? searchParams.type : undefined;
  const month = typeof searchParams.month === 'string' ? searchParams.month : undefined;

  const [eventsData, months] = await Promise.all([
    getEvents({
      type: category,
      month,
      // No limit - load all events for proper month grouping
    }),
    getEventMonths(),
  ]);

  const { events, total } = eventsData;

  // Group events by month for display
  const groupedEvents: { monthKey: string; monthLabel: string; events: typeof events }[] = [];
  
  // Create a map to collect events by month
  const monthMap = new Map<string, typeof events>();
  
  events.forEach((item) => {
    let monthKey = "9999-99"; // Sort unknown dates last
    let monthLabel = "Date TBC";
    
    if (item.event.dateStart) {
      const date = new Date(item.event.dateStart);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      monthLabel = date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    } else if (item.event.monthTypical) {
      // Parse "October (TBC)" or "May" format
      const monthMatch = item.event.monthTypical.match(/^(\w+)/);
      if (monthMatch) {
        const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                          'july', 'august', 'september', 'october', 'november', 'december'];
        const monthIdx = monthNames.findIndex(m => m.startsWith(monthMatch[1].toLowerCase()));
        if (monthIdx !== -1) {
          monthKey = `2026-${(monthIdx + 1).toString().padStart(2, '0')}`;
          monthLabel = `${monthMatch[1]} 2026 (TBC)`;
        } else {
          monthLabel = item.event.monthTypical;
        }
      }
    }

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }
    monthMap.get(monthKey)!.push(item);
  });

  // Convert map to sorted array
  Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([monthKey, monthEvents]) => {
      // Get the label from the first event
      let monthLabel = "Date TBC";
      const firstWithDate = monthEvents.find(e => e.event.dateStart);
      if (firstWithDate) {
        const date = new Date(firstWithDate.event.dateStart!);
        monthLabel = date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
      } else if (monthEvents[0]?.event.monthTypical) {
        const monthMatch = monthEvents[0].event.monthTypical.match(/^(\w+)/);
        monthLabel = monthMatch ? `${monthMatch[1]} 2026` : monthEvents[0].event.monthTypical;
      }
      
      groupedEvents.push({ monthKey, monthLabel, events: monthEvents });
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pt-16">
      {/* Hero Section */}
      <div className="relative bg-slate-900 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            alt="Misty mountains"
            className="w-full h-full object-cover opacity-30"
            src="/images/misc/homepage-hero-03-355a010f.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
            Home / Events
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white mb-4">
            Races & Events
          </h1>
          <p className="text-slate-300 max-w-2xl text-lg mb-8">
            Discover top-tier triathlons, MTB raids, and trail running adventures across the stunning landscapes of Wales.
          </p>

          {/* Featured Categories/Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
             {[
               { name: "Trail Running", img: "/images/misc/events-races-01-73c695f1.jpg" },
               { name: "Cycling", img: "/images/misc/events-races-02-4805ea61.jpg" },
               { name: "Hiking", img: "/images/misc/gear-hiking-01-918f1952.jpg" },
               { name: "Watersports", img: "/images/misc/gear-water-01-cdcf40ed.jpg" }
             ].map((cat, idx) => (
                <div key={idx} className="relative group cursor-pointer overflow-hidden rounded-lg aspect-video">
                  <img
                    alt={cat.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    src={cat.img}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-wide">{cat.name}</span>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <EventsClient availableMonths={months} totalEvents={total} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {groupedEvents.length > 0 ? (
          <div className="space-y-12">
            {groupedEvents.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-10">
                <div className="flex items-center gap-4 mb-6 sticky top-[8rem] z-30 py-4 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
                    {group.monthLabel.split(' ')[0]} <span className="text-slate-400 dark:text-slate-600 font-medium">{group.monthLabel.split(' ')[1] || ''}</span>
                  </h2>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.events.map((item) => (
                    <EventGridCard
                      key={item.event.id}
                      event={item.event}
                      region={item.region}
                      featured={item.event.isFeatured || false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No events found</h3>
             <p className="text-slate-500">Try adjusting your filters or checking back later.</p>
          </div>
        )}

        {/* Organizers Banner */}
        <div className="my-12 relative rounded-2xl overflow-hidden bg-primary shadow-lg ring-1 ring-white/10">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          <div className="relative z-10 px-6 py-6 md:flex md:items-center md:justify-between gap-6">
            <div className="text-left md:flex-1">
              <span className="text-white/80 font-bold uppercase tracking-widest text-xs mb-1 block">Organizers</span>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white">Organising an adventure?</h2>
              <p className="text-white/90 text-sm mt-1 max-w-2xl hidden md:block">List your race, festival, or workshop on Adventure Wales to reach thousands.</p>
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0">
              <Link href="/auth/login" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-full shadow-lg text-sm transform hover:scale-105 transition duration-200 flex items-center gap-2">
                List Your Event Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export const metadata = {
  title: "Welsh Races & Adventure Events 2026 — Trail Runs, MTB, Triathlons | Adventure Wales",
  description: "Find races and adventure events across Wales. Trail running, mountain biking, triathlons, swimming events, and outdoor festivals with dates, entry fees, and difficulty info.",
};
