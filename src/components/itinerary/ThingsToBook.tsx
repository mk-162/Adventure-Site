"use client";

import { ItineraryStop } from "@/types/itinerary";
import { useLocalStorageSet } from "./useItineraryLocalState";
import { CheckCircle2, Circle, ExternalLink, ClipboardList } from "lucide-react";
import clsx from "clsx";

interface ThingsToBookProps {
  stops: ItineraryStop[];
  itinerarySlug: string;
  mode: "standard" | "wet" | "budget";
}

interface BookableItem {
  id: string;
  label: string;
  operatorName: string;
  bookingUrl: string | null;
}

export function ThingsToBook({ stops, itinerarySlug, mode }: ThingsToBookProps) {
  const storageKey = `aw-booked-${itinerarySlug}`;
  const { toggle, has, loaded } = useLocalStorageSet(storageKey);

  // Extract bookable items — activities that have an operator
  const bookableItems: BookableItem[] = stops
    .filter((stop) => stop.stopType === "activity" && stop.operator)
    .map((stop) => {
      let title = stop.title;
      if (mode === "wet" && stop.wetAltTitle) title = stop.wetAltTitle;
      if (mode === "budget" && stop.budgetAltTitle) title = stop.budgetAltTitle;

      // Prefer activity bookingUrl, then operator website
      const bookingUrl =
        stop.activity?.bookingUrl ||
        stop.operator?.website ||
        null;

      return {
        id: String(stop.id),
        label: title,
        operatorName: stop.operator!.name,
        bookingUrl,
      };
    });

  if (bookableItems.length === 0 || !loaded) return null;

  const checkedCount = bookableItems.filter((item) => has(item.id)).length;
  const allChecked = checkedCount === bookableItems.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a4c] to-[#2d5a73] px-5 py-3">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Things to Book
        </h3>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-500">
            {checkedCount} of {bookableItems.length} booked
          </span>
          {allChecked && (
            <span className="text-xs font-bold text-green-600">All done! 🎉</span>
          )}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{
              width: `${(checkedCount / bookableItems.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="px-5 pb-5 space-y-1">
        {bookableItems.map((item) => {
          const checked = has(item.id);
          return (
            <div
              key={item.id}
              className={clsx(
                "flex items-start gap-3 p-2.5 rounded-lg transition-colors cursor-pointer group",
                checked ? "bg-green-50" : "hover:bg-gray-50"
              )}
              onClick={() => toggle(item.id)}
            >
              {/* Checkbox */}
              <div className="shrink-0 mt-0.5">
                {checked ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                )}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <span
                  className={clsx(
                    "text-sm font-medium block transition-colors",
                    checked
                      ? "text-green-700 line-through"
                      : "text-[#1e3a4c]"
                  )}
                >
                  Book {item.label}
                </span>
                <span
                  className={clsx(
                    "text-xs",
                    checked ? "text-green-600/60" : "text-gray-500"
                  )}
                >
                  with {item.operatorName}
                </span>
              </div>

              {/* Booking link */}
              {item.bookingUrl && (
                <a
                  href={item.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 text-[#ea580c] hover:text-[#ea580c] p-1 rounded-md hover:bg-orange-50 transition-colors"
                  title="Book now"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
