"use client";

import { useState } from "react";
import { Home, MapPin, X } from "lucide-react";
import { accommodation } from "@/db/schema";
import { calculateDistance, calculateDrivingTime, formatDistance } from "@/lib/travel-utils";
import clsx from "clsx";

type AccommodationData = typeof accommodation.$inferSelect;

interface BasecampPickerProps {
  accommodations: AccommodationData[];
  firstActivityLat: number | null;
  firstActivityLng: number | null;
  onSelect: (basecamp: AccommodationData) => void;
  onClose: () => void;
  currentBasecamp?: AccommodationData | null;
}

export function BasecampPicker({
  accommodations,
  firstActivityLat,
  firstActivityLng,
  onSelect,
  onClose,
  currentBasecamp,
}: BasecampPickerProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    currentBasecamp?.id || null
  );

  // Calculate distances for each accommodation
  const accommodationsWithDistance = accommodations.map((acc) => {
    let distance: number | null = null;
    let drivingTime: string | null = null;

    if (
      acc.lat &&
      acc.lng &&
      firstActivityLat !== null &&
      firstActivityLng !== null
    ) {
      distance = calculateDistance(
        Number(acc.lat),
        Number(acc.lng),
        firstActivityLat,
        firstActivityLng
      );
      drivingTime = calculateDrivingTime(distance);
    }

    return {
      ...acc,
      distance,
      drivingTime,
    };
  });

  // Sort by distance (closest first)
  const sortedAccommodations = accommodationsWithDistance.sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });

  const handleSelect = (acc: AccommodationData) => {
    setSelectedId(acc.id);
  };

  const handleConfirm = () => {
    const selected = accommodations.find((acc) => acc.id === selectedId);
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a4c] flex items-center gap-2">
              <Home className="w-6 h-6 text-[#f97316]" />
              Select Your Basecamp
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose your accommodation to see personalised travel times
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Accommodation List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {sortedAccommodations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Home className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No accommodation available in this region</p>
            </div>
          ) : (
            sortedAccommodations.map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleSelect(acc)}
                className={clsx(
                  "w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md",
                  selectedId === acc.id
                    ? "border-[#f97316] bg-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="font-bold text-[#1e3a4c] text-lg">
                        {acc.name}
                      </h3>
                      {selectedId === acc.id && (
                        <span className="bg-[#f97316] text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                          SELECTED
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                      {acc.type && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                          {acc.type}
                        </span>
                      )}
                      {acc.distance !== null && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {formatDistance(acc.distance)} to first activity
                        </span>
                      )}
                    </div>

                    {acc.drivingTime && (
                      <div className="mt-2 text-[#f97316] font-bold text-sm">
                        {acc.drivingTime} drive
                      </div>
                    )}

                    {acc.priceFrom && (
                      <div className="mt-2 text-gray-700 font-semibold">
                        £{Number(acc.priceFrom).toFixed(0)}
                        {acc.priceTo && acc.priceTo !== acc.priceFrom
                          ? ` - £${Number(acc.priceTo).toFixed(0)}`
                          : ""}{" "}
                        <span className="text-xs text-gray-500 font-normal">
                          per night
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Radio indicator */}
                  <div
                    className={clsx(
                      "w-5 h-5 rounded-full border-2 shrink-0 mt-1 transition-all",
                      selectedId === acc.id
                        ? "border-[#f97316] bg-[#f97316]"
                        : "border-gray-300"
                    )}
                  >
                    {selectedId === acc.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedId === null}
            className={clsx(
              "flex-1 px-6 py-3 font-bold rounded-xl transition-all",
              selectedId !== null
                ? "bg-[#f97316] text-white hover:bg-[#f97316]/90 shadow-lg shadow-[#f97316]/20"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            Confirm Basecamp
          </button>
        </div>
      </div>
    </div>
  );
}
