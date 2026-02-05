"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Home, MapPin, X, Search, Loader2 } from "lucide-react";
import { accommodation } from "@/db/schema";
import { calculateDistance, calculateDrivingTime, formatDistance } from "@/lib/travel-utils";
import clsx from "clsx";

type AccommodationData = typeof accommodation.$inferSelect;

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface UserLocation {
  label: string;
  lat: number;
  lng: number;
}

interface BasecampPickerProps {
  accommodations: AccommodationData[];
  firstActivityLat: number | null;
  firstActivityLng: number | null;
  onSelect: (basecamp: AccommodationData) => void;
  onClose: () => void;
  currentBasecamp?: AccommodationData | null;
  userLocation?: UserLocation | null;
  onUserLocationChange?: (location: UserLocation | null) => void;
}

function PostcodeSearch({
  onLocationSelect,
  currentLocation,
  onClear,
}: {
  onLocationSelect: (location: UserLocation) => void;
  currentLocation?: UserLocation | null;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(!currentLocation);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchNominatim = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          q
        )}&format=json&countrycodes=gb&limit=5`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      );
      if (res.ok) {
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setShowResults(true);
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => searchNominatim(query), 400);
    } else {
      setResults([]);
      setShowResults(false);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchNominatim]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: NominatimResult) => {
    const location: UserLocation = {
      label: result.display_name.split(",").slice(0, 2).join(",").trim(),
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
    onLocationSelect(location);
    setQuery("");
    setResults([]);
    setShowResults(false);
    setIsEditing(false);
  };

  const handleChange = () => {
    onClear();
    setIsEditing(true);
    setQuery("");
  };

  // Show the set location with a "Change" link
  if (currentLocation && !isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
              Your Location
            </div>
            <div className="text-sm font-bold text-primary truncate">
              {currentLocation.label}
            </div>
          </div>
        </div>
        <button
          onClick={handleChange}
          className="text-sm font-bold text-accent-hover hover:text-accent-hover/80 transition-colors whitespace-nowrap"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Enter postcode or town (e.g. SA1 1DP, Swansea)"
          className="w-full pl-9 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-hover focus:outline-none text-sm placeholder:text-gray-400 transition-colors"
          autoFocus
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Autocomplete results */}
      {showResults && results.length > 0 && (
        <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700 line-clamp-2">
                  {result.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && query.trim().length >= 2 && !isSearching && (
        <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
          <p className="text-sm text-gray-500 text-center">No results found</p>
        </div>
      )}
    </div>
  );
}

export function BasecampPicker({
  accommodations,
  firstActivityLat,
  firstActivityLng,
  onSelect,
  onClose,
  currentBasecamp,
  userLocation: initialUserLocation,
  onUserLocationChange,
}: BasecampPickerProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    currentBasecamp?.id || null
  );
  const [userLocation, setUserLocation] = useState<UserLocation | null>(
    initialUserLocation || null
  );

  const handleLocationSelect = (location: UserLocation) => {
    setUserLocation(location);
    onUserLocationChange?.(location);
  };

  const handleLocationClear = () => {
    setUserLocation(null);
    onUserLocationChange?.(null);
  };

  // Calculate distances for each accommodation
  const accommodationsWithDistance = accommodations.map((acc) => {
    let distanceToActivity: number | null = null;
    let drivingTimeToActivity: string | null = null;
    let distanceToUser: number | null = null;
    let drivingTimeToUser: string | null = null;

    if (
      acc.lat &&
      acc.lng &&
      firstActivityLat !== null &&
      firstActivityLng !== null
    ) {
      distanceToActivity = calculateDistance(
        Number(acc.lat),
        Number(acc.lng),
        firstActivityLat,
        firstActivityLng
      );
      drivingTimeToActivity = calculateDrivingTime(distanceToActivity);
    }

    if (acc.lat && acc.lng && userLocation) {
      distanceToUser = calculateDistance(
        Number(acc.lat),
        Number(acc.lng),
        userLocation.lat,
        userLocation.lng
      );
      drivingTimeToUser = calculateDrivingTime(distanceToUser);
    }

    return {
      ...acc,
      distance: distanceToActivity,
      drivingTime: drivingTimeToActivity,
      distanceToUser,
      drivingTimeToUser,
    };
  });

  // Sort by distance to user location if available, otherwise to first activity
  const sortedAccommodations = accommodationsWithDistance.sort((a, b) => {
    const aDist = userLocation ? a.distanceToUser : a.distance;
    const bDist = userLocation ? b.distanceToUser : b.distance;
    if (aDist === null) return 1;
    if (bDist === null) return -1;
    return aDist - bDist;
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
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Home className="w-6 h-6 text-accent-hover" />
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

        {/* Location Search */}
        <div className="px-6 pt-4 pb-2">
          <PostcodeSearch
            onLocationSelect={handleLocationSelect}
            currentLocation={userLocation}
            onClear={handleLocationClear}
          />
          {userLocation && (
            <p className="text-xs text-gray-500 mt-2">
              Showing accommodations sorted by distance from{" "}
              <span className="font-semibold">{userLocation.label}</span>
            </p>
          )}
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
                    ? "border-accent-hover bg-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="font-bold text-primary text-lg">
                        {acc.name}
                      </h3>
                      {selectedId === acc.id && (
                        <span className="bg-accent-hover text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
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
                      {acc.distanceToUser !== null && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <MapPin className="w-3 h-3" />
                          {formatDistance(acc.distanceToUser)} from you
                        </span>
                      )}
                      {acc.distance !== null && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {formatDistance(acc.distance)} to first activity
                        </span>
                      )}
                    </div>

                    {acc.drivingTimeToUser && (
                      <div className="mt-2 text-blue-600 font-bold text-sm">
                        {acc.drivingTimeToUser} drive from you
                      </div>
                    )}
                    {acc.drivingTime && !acc.drivingTimeToUser && (
                      <div className="mt-2 text-accent-hover font-bold text-sm">
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
                        ? "border-accent-hover bg-accent-hover"
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
                ? "bg-accent-hover text-white hover:bg-accent-hover/90 shadow-lg shadow-accent-hover/20"
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
