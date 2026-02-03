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

  const months = [
    "Any Time",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (where) params.set("region", where);
    if (what) params.set("activity", what);
    if (when) params.set("month", when);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="relative -mt-12 z-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Where */}
            <div className="relative">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Where
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
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
            <div className="relative">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                What
              </label>
              <div className="relative">
                <Compass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={what}
                  onChange={(e) => setWhat(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
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
            <div className="relative">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                When
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg appearance-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-gray-700"
                >
                  {months.map((month) => (
                    <option key={month} value={month === "Any Time" ? "" : month.toLowerCase()}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#f97316] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-colors"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
