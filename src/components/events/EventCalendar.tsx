"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Clock, MapPin } from "lucide-react";
import type { events } from "@/db/schema";
import { cn } from "@/lib/utils";

type Event = typeof events.$inferSelect;

interface EventCalendarProps {
  events: Event[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday, etc. Adjust to make Monday = 0
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
    setSelectedDate(null);
  };

  const getEventsForDate = (day: number) => {
    return events.filter(event => {
      if (!event.dateStart) return false;
      const date = new Date(event.dateStart);
      return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    });
  };

  const selectedDateEvents = selectedDate
    ? getEventsForDate(selectedDate.getDate())
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-[#1e3a4c]">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-gray-50/50 rounded-lg" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;
              const isSelected = selectedDate?.getDate() === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-start pt-2 relative transition-colors hover:bg-gray-50",
                    isToday && "bg-blue-50 font-bold text-blue-600",
                    isSelected && "ring-2 ring-[#f97316] ring-offset-1 bg-orange-50"
                  )}
                >
                  <span className={cn("text-sm", isToday && "font-bold")}>{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div
                          key={e.id}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            e.isFeatured ? "bg-[#f97316]" : "bg-[#1e3a4c]"
                          )}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] text-gray-400 leading-none">+</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Panel */}
        {selectedDate && (
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 p-4 bg-gray-50/50">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-[#1e3a4c]">
                {selectedDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Close
              </button>
            </div>

            {selectedDateEvents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No events on this day</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className={cn(
                      "block bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow group",
                      event.isFeatured ? "border-[#f97316]/30" : "border-gray-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-[#f97316]">
                        {event.dateStart ? new Date(event.dateStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'All Day'}
                      </span>
                      {event.isFeatured && <Star className="w-3 h-3 text-[#f97316] fill-[#f97316]" />}
                    </div>
                    <h4 className="font-bold text-[#1e3a4c] text-sm mb-1 group-hover:text-[#f97316] transition-colors">
                      {event.name}
                    </h4>
                    {event.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
