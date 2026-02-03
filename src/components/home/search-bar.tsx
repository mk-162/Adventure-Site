"use client";

import { useState } from "react";
import { MapPin, Compass, Calendar, Search } from "lucide-react";

interface Region {
  id: number;
  name: string;
  slug: string;
}

interface SearchBarProps {
  regions: Region[];
}

export function SearchBar({ regions }: SearchBarProps) {
  const [where, setWhere] = useState("");
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");

  const activityTypes = [
    "Any Activity",
    "Hiking",
    "Coasteering",
    "Surfing",
    "Mountain Biking",
    "Kayaking",
    "Climbing",
    "Zip Lining",
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (where) params.set("region", where);
    if (what) params.set("activity", what);
    if (when) {
      const dateObj = new Date(when);
      const monthName = dateObj.toLocaleString("default", { month: "long" });
      params.set("month", monthName);
    }
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="relative -mt-16 sm:-mt-20 z-10 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Where */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Where
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1e3a4c] h-5 w-5" />
              <select
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-[#1e3a4c] focus:border-transparent appearance-none text-slate-900"
              >
                <option value="">All Destinations</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.slug}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* What */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              What
            </label>
            <div className="relative">
              <Compass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1e3a4c] h-5 w-5" />
              <select
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-[#1e3a4c] focus:border-transparent appearance-none text-slate-900"
              >
                {activityTypes.map((activity) => (
                  <option key={activity} value={activity === "Any Activity" ? "" : activity.toLowerCase()}>
                    {activity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* When */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              When
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1e3a4c] h-5 w-5" />
              <input
                type="date"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-[#1e3a4c] focus:border-transparent text-slate-900"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full h-12 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
