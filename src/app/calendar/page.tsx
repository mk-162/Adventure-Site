import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEvents, getAllRegions } from "@/lib/queries";
import { EventCalendar } from "@/components/events/EventCalendar";
import { CalendarMapWrapper } from "@/components/events/CalendarMapWrapper";
import {
  Calendar as CalendarIcon,
  List,
  Map as MapIcon,
  Search,
  Filter,
  ChevronDown,
  Clock,
  MapPin
} from "lucide-react";
import type { events } from "@/db/schema";
import { cn } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{
    view?: string;
    filter?: string;
    category?: string;
    region?: string;
    q?: string;
  }>;
}

export const metadata = {
  title: "Events Calendar | Adventure Wales",
  description: "Discover upcoming races, festivals, and outdoor events across Wales.",
};

export default async function CalendarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = params.view || "calendar"; // 'calendar' | 'list' | 'map'
  const filter = params.filter || "upcoming"; // 'weekend' | 'month' | 'next-month' | 'upcoming'
  const category = params.category || "all";
  const regionSlug = params.region || "all";
  const query = params.q || "";

  // Fetch data
  const [allEvents, regions] = await Promise.all([
    getEvents(), // Currently fetches all published events. In production, add date filtering to query.
    getAllRegions(),
  ]);

  // Client-side filtering (for now, until query supports complex date ranges)
  let filteredEvents = allEvents.map(e => e.event);

  // 1. Filter by Region
  if (regionSlug !== "all") {
    const region = regions.find(r => r.slug === regionSlug);
    if (region) {
      filteredEvents = filteredEvents.filter(e => e.regionId === region.id);
    }
  }

  // 2. Filter by Category/Type
  if (category !== "all") {
    filteredEvents = filteredEvents.filter(e =>
      e.type?.toLowerCase() === category.toLowerCase() ||
      e.category?.toLowerCase() === category.toLowerCase()
    );
  }

  // 3. Filter by Search Query
  if (query) {
    const q = query.toLowerCase();
    filteredEvents = filteredEvents.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q)
    );
  }

  // 4. Date Filters
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  const endOfSunday = new Date(sunday);
  endOfSunday.setHours(23, 59, 59, 999);

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  if (filter === "weekend") {
    filteredEvents = filteredEvents.filter(e => {
      if (!e.dateStart) return false;
      const d = new Date(e.dateStart);
      return d >= today && d <= endOfSunday; // Simplified "This Weekend" (from today until Sunday night)
    });
  } else if (filter === "month") {
    filteredEvents = filteredEvents.filter(e => {
      if (!e.dateStart) return false;
      const d = new Date(e.dateStart);
      return d >= today && d <= endOfMonth;
    });
  } else if (filter === "next-month") {
    filteredEvents = filteredEvents.filter(e => {
      if (!e.dateStart) return false;
      const d = new Date(e.dateStart);
      return d >= nextMonthStart && d <= nextMonthEnd;
    });
  } else {
    // Upcoming
    filteredEvents = filteredEvents.filter(e => {
      // Include events with no date? Or just future?
      if (!e.dateStart) return true; // Keep TBD dates
      return new Date(e.dateStart) >= today;
    });
  }

  // Sort by date
  filteredEvents.sort((a, b) => {
    if (!a.dateStart) return 1;
    if (!b.dateStart) return -1;
    return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-primary py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/events-hero-placeholder.jpg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-accent-hover/20 text-accent-hover text-xs font-bold uppercase tracking-wider mb-4 border border-accent-hover/30">
            Adventure Calendar
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            What's On in Wales
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Find your next challenge. From trail races and triathlons to outdoor festivals and workshops.
          </p>

          {/* Main Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-full p-2 flex shadow-lg">
            <div className="flex-1 flex items-center px-4 border-r border-gray-200">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <form action="/calendar" className="w-full">
                <input
                  type="text"
                  name="q"
                  placeholder="Search events..."
                  className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                  defaultValue={query}
                />
                {/* Preserve other params */}
                <input type="hidden" name="view" value={view} />
                <input type="hidden" name="filter" value={filter} />
                <input type="hidden" name="region" value={regionSlug} />
              </form>
            </div>
            <button className="bg-accent-hover text-white px-8 py-3 rounded-full font-bold hover:bg-accent-hover transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">

          {/* Filter Groups */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Quick Filters */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <FilterLink active={filter === "upcoming"} href="?filter=upcoming" label="All Upcoming" />
              <FilterLink active={filter === "weekend"} href="?filter=weekend" label="This Weekend" />
              <FilterLink active={filter === "month"} href="?filter=month" label="This Month" />
            </div>

            {/* Region Dropdown (Simple implementation) */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400" />
                {regionSlug === "all" ? "All Regions" : regions.find(r => r.slug === regionSlug)?.name || regionSlug}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {/* Dropdown content would go here, implemented as a simple hover list for now or use a proper Select component */}
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 shrink-0">
            <ViewLink active={view === "calendar"} view="calendar" icon={CalendarIcon} label="Calendar" />
            <ViewLink active={view === "list"} view="list" icon={List} label="List" />
            <ViewLink active={view === "map"} view="map" icon={MapIcon} label="Map" />
          </div>
        </div>

        {/* View Content */}
        {view === "calendar" && (
          <EventCalendar events={filteredEvents} />
        )}

        {view === "list" && (
          <div className="space-y-8">
            {/* Group events by month */}
            {groupEventsByMonth(filteredEvents).map((group) => (
              <div key={group.monthLabel}>
                <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur py-3 mb-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-primary">{group.monthLabel}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <EmptyState />
            )}
          </div>
        )}

        {view === "map" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[600px]">
            <CalendarMapWrapper
              markers={filteredEvents
                .filter(e => e.lat && e.lng)
                .map(e => ({
                  id: e.id,
                  lat: Number(e.lat),
                  lng: Number(e.lng),
                  type: "event",
                  title: e.name,
                  subtitle: e.location || undefined,
                  link: `/events/${e.slug}`
                }))
              }
              center={[52.4153, -3.6149]} // Wales center
              zoom={8}
              height="100%"
            />
          </div>
        )}

        {/* Add Your Event CTA */}
        <div className="mt-16 bg-accent-hover rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black mb-4">Organising an event?</h2>
            <p className="text-lg text-white/90 mb-8">
              List your race, festival, or workshop on Adventure Wales to reach thousands of outdoor enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login" // Should link to operator dashboard or login
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                List Your Event
              </Link>
              <Link
                href="/advertise"
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper Components

function FilterLink({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
        active ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
      )}
    >
      {label}
    </Link>
  );
}

function ViewLink({ active, view, icon: Icon, label }: { active: boolean; view: string; icon: any; label: string }) {
  return (
    <Link
      href={`?view=${view}`} // This simplifies keeping other params, ideally use a hook to merge params
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
        active ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

function EventCard({ event }: { event: typeof events.$inferSelect }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col h-full"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {event.heroImage ? (
          <Image src={event.heroImage} alt={event.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
           <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/20">
             <CalendarIcon className="w-12 h-12" />
           </div>
        )}
        {event.isPromoted && (
          <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-1 rounded-full" aria-label="Sponsored listing">
            Sponsored
          </div>
        )}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded-lg p-2 text-center min-w-[50px]">
          <div className="text-xs font-bold text-gray-500 uppercase">
            {event.dateStart ? new Date(event.dateStart).toLocaleDateString("en-GB", { month: "short" }) : "TBC"}
          </div>
          <div className="text-xl font-black text-primary">
             {event.dateStart ? new Date(event.dateStart).getDate() : "?"}
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-xs font-bold text-accent-hover uppercase tracking-wide">
            {event.type || "Event"}
          </span>
        </div>
        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent-hover transition-colors">
          {event.name}
        </h3>
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
           <span className="font-medium text-gray-900">
             {event.registrationCost ? `From £${Number(event.registrationCost).toFixed(0)}` : "Free"}
           </span>
           <span className="text-accent-hover font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             View Details <ChevronDown className="w-4 h-4 -rotate-90" />
           </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No events found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        We couldn't find any events matching your filters. Try adjusting your search criteria or selecting a different date range.
      </p>
      <Link href="/calendar" className="inline-block mt-6 text-accent-hover font-bold hover:underline">
        Clear all filters
      </Link>
    </div>
  );
}

type EventRow = Awaited<ReturnType<typeof getEvents>>[number]["event"];

function groupEventsByMonth(eventList: EventRow[]) {
  const groups: { monthLabel: string; events: EventRow[] }[] = [];

  eventList.forEach(event => {
    if (!event.dateStart) return;
    const date = new Date(event.dateStart);
    const label = date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    let group = groups.find(g => g.monthLabel === label);
    if (!group) {
      group = { monthLabel: label, events: [] };
      groups.push(group);
    }
    group.events.push(event);
  });

  return groups;
}
