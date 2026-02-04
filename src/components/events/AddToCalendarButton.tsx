"use client";

import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddToCalendarButtonProps {
  event: {
    name: string;
    description?: string | null;
    location?: string | null;
    dateStart: Date | null;
    dateEnd: Date | null;
  };
}

export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!event.dateStart) return null;

  const start = event.dateStart.toISOString().replace(/-|:|\.\d+/g, "");
  const end = (event.dateEnd || event.dateStart).toISOString().replace(/-|:|\.\d+/g, "");

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${start}/${end}&location=${encodeURIComponent(event.location || "")}&details=${encodeURIComponent(event.description || "")}`;

  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${event.name}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `LOCATION:${event.location || ""}`,
      `DESCRIPTION:${event.description || ""}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${event.name.replace(/\s+/g, "-").toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-bold text-[#1e3a4c] hover:text-[#f97316] transition-colors"
      >
        <CalendarPlus className="w-4 h-4" />
        Add to Calendar
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-20 flex flex-col gap-1">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Google Calendar
            </a>
            <button
              onClick={downloadIcs}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              iCal / Outlook
            </button>
          </div>
        </>
      )}
    </div>
  );
}
