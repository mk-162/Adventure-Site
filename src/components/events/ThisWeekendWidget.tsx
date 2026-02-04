"use client";

import Link from "next/link";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import type { events } from "@/db/schema";

type Event = typeof events.$inferSelect;

interface ThisWeekendWidgetProps {
  events: Event[];
  title?: string;
  viewAllLink?: string;
  subtitle?: string;
}

export function ThisWeekendWidget({
  events,
  title = "This Weekend",
  viewAllLink = "/calendar?filter=weekend",
  subtitle = "Don't Miss Out"
}: ThisWeekendWidgetProps) {

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-[#f97316]" />
          </div>
          <h3 className="text-lg font-bold text-[#1e3a4c]">{title}</h3>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          No events found. Check out what's coming up later!
        </p>
        <Link
          href="/calendar"
          className="text-[#f97316] text-sm font-bold hover:underline flex items-center gap-1"
        >
          View Full Calendar <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-[#f97316]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#f97316] uppercase tracking-wider">{subtitle}</span>
              <h3 className="text-lg font-bold text-[#1e3a4c] leading-tight">{title}</h3>
            </div>
          </div>
          <Link
            href={viewAllLink}
            className="text-xs font-bold text-gray-400 hover:text-[#1e3a4c] transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {events.slice(0, 3).map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="block p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex gap-4">
              <div className="shrink-0 w-12 text-center pt-1">
                <span className="block text-xs font-bold text-gray-400 uppercase">
                  {event.dateStart ? new Date(event.dateStart).toLocaleDateString('en-GB', { weekday: 'short' }) : 'SAT'}
                </span>
                <span className="block text-xl font-black text-[#1e3a4c]">
                  {event.dateStart ? new Date(event.dateStart).getDate() : '25'}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-[#1e3a4c] text-sm truncate group-hover:text-[#f97316] transition-colors">
                  {event.name}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{event.location || "Wales"}</span>
                </div>
                {event.type && (
                  <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {event.type}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
