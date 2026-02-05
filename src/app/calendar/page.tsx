import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEvents, getAllRegions } from "@/lib/queries";
import { EventCalendar } from "@/components/events/EventCalendar";
import { CalendarMapWrapper } from "@/components/events/CalendarMapWrapper";
import { EventsList } from "@/components/events/EventsList";
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
  }>;
}

export const metadata = {
  title: "Events Calendar | Adventure Wales",
  description: "Discover upcoming races, festivals, and outdoor events across Wales.",
};

export default async function CalendarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = params.view || "list"; // 'list' | 'calendar' | 'map'

  // Fetch all events with region data
  const allEvents = await getEvents();

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
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find your next challenge. From trail races and triathlons to outdoor festivals and workshops.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">

        {/* View Toggle Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-primary">Events Calendar</h2>
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 shrink-0">
            <ViewLink active={view === "list"} view="list" icon={List} label="List" />
            <ViewLink active={view === "calendar"} view="calendar" icon={CalendarIcon} label="Calendar" />
            <ViewLink active={view === "map"} view="map" icon={MapIcon} label="Map" />
          </div>
        </div>

        {/* View Content */}
        {view === "list" && (
          <EventsList events={allEvents} />
        )}

        {view === "calendar" && (
          <EventCalendar events={allEvents.map(e => e.event)} />
        )}

        {view === "map" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[600px]">
            <CalendarMapWrapper
              markers={allEvents
                .filter(e => e.event.lat && e.event.lng)
                .map(e => ({
                  id: e.event.id,
                  lat: Number(e.event.lat),
                  lng: Number(e.event.lng),
                  type: "event",
                  title: e.event.name,
                  subtitle: e.event.location || undefined,
                  link: `/events/${e.event.slug}`
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

function ViewLink({ active, view, icon: Icon, label }: { active: boolean; view: string; icon: any; label: string }) {
  return (
    <Link
      href={`?view=${view}`}
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
