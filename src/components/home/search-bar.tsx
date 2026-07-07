"use client";

import { useMemo, useState } from "react";
import { MapPin, Compass, Search, ArrowRight, Mountain, Waves, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Region {
  id: number;
  name: string;
  slug: string;
}

interface ActivityType {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

interface SearchBarProps {
  regions: Region[];
  activityTypes: ActivityType[];
  /** Map of region slug → activity type slugs available in that region */
  regionActivityMap?: Record<string, string[]>;
}

// Icon mapping for activity types
const activityIconMap: Record<string, React.ReactNode> = {
  hiking: <Footprints className="h-4 w-4" />,
  coasteering: <Waves className="h-4 w-4" />,
  surfing: <Waves className="h-4 w-4" />,
  kayaking: <Waves className="h-4 w-4" />,
  climbing: <Mountain className="h-4 w-4" />,
  "mountain-biking": <Mountain className="h-4 w-4" />,
};

// Region icon mapping
const regionIconMap: Record<string, string> = {
  snowdonia: "🏔️",
  pembrokeshire: "🌊",
  "brecon-beacons": "⛰️",
  "cardiff-vale": "🏙️",
  "anglesey-coast": "🏖️",
  "gower-peninsula": "🌅",
};

export function SearchBar({ regions, activityTypes, regionActivityMap = {} }: SearchBarProps) {
  const [where, setWhere] = useState("");
  const [what, setWhat] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState(false);

  // Deduplicate activity types by slug (defensive — prevents stale cache doubling)
  const uniqueActivityTypes = useMemo(() => {
    const seen = new Set<string>();
    return activityTypes.filter((at) => {
      if (seen.has(at.slug)) return false;
      seen.add(at.slug);
      return true;
    });
  }, [activityTypes]);

  // Filter activity types based on selected region
  const filteredActivityTypes = useMemo(() => {
    if (!where || !regionActivityMap[where]) return uniqueActivityTypes;
    const allowedSlugs = new Set(regionActivityMap[where]);
    return uniqueActivityTypes.filter((at) => allowedSlugs.has(at.slug));
  }, [where, uniqueActivityTypes, regionActivityMap]);

  // Reset activity selection if it's no longer valid for the chosen region
  const handleRegionChange = (regionSlug: string) => {
    setWhere(regionSlug);
    if (regionSlug && regionActivityMap[regionSlug]) {
      const allowed = new Set(regionActivityMap[regionSlug]);
      if (what && !allowed.has(what)) {
        setWhat("");
        setResetNotice(true);
        setTimeout(() => setResetNotice(false), 3000);
      }
    }
  };

  const handleSearch = () => {
    if (where && what) {
      // Both selected → /snowdonia/hiking
      window.location.href = `/${where}/${what}`;
    } else if (where) {
      // Region only → /snowdonia
      window.location.href = `/${where}`;
    } else if (what) {
      // Activity only → hub page like /hiking
      window.location.href = `/${what}`;
    } else {
      // Nothing selected → browse all regions
      window.location.href = `/regions`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative -mt-16 sm:-mt-20 z-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <div 
        className={`
          bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-100
          transition-shadow duration-300
          ${focusedField ? 'ring-2 ring-accent-strong/20 shadow-accent-strong/10' : ''}
        `}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 sm:gap-4">
          {/* WHERE */}
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              Where
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-5 w-5 transition-colors group-focus-within:text-accent-strong" />
              <select
                value={where}
                onChange={(e) => handleRegionChange(e.target.value)}
                onFocus={() => setFocusedField("where")}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                className="
                  w-full h-14 pl-12 pr-4
                  bg-slate-50 border-2 border-slate-200 rounded-xl
                  font-medium text-base text-slate-900
                  focus:bg-white focus:border-accent-strong focus:ring-2 focus:ring-accent-strong/20
                  hover:border-slate-300
                  transition duration-200
                  appearance-none cursor-pointer
                "
              >
                <option value="">Anywhere in Wales</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.slug}>
                    {regionIconMap[region.slug] || "📍"} {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* WHAT */}
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              What
            </label>
            <div className="relative group">
              <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-primary h-5 w-5 transition-colors group-focus-within:text-accent-strong" />
              <select
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                onFocus={() => setFocusedField("what")}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                className="
                  w-full h-14 pl-12 pr-4
                  bg-slate-50 border-2 border-slate-200 rounded-xl
                  font-medium text-base text-slate-900
                  focus:bg-white focus:border-accent-strong focus:ring-2 focus:ring-accent-strong/20
                  hover:border-slate-300
                  transition duration-200
                  appearance-none cursor-pointer
                "
              >
                <option value="">Any Adventure</option>
                {/* Water Activities */}
                {filteredActivityTypes.filter(at => ['surfing', 'kayaking', 'coasteering', 'sea-kayaking', 'sup', 'wild-swimming'].includes(at.slug)).length > 0 && (
                  <optgroup label="🌊 Water Adventures">
                    {filteredActivityTypes
                      .filter(at => ['surfing', 'kayaking', 'coasteering', 'sea-kayaking', 'sup', 'wild-swimming'].includes(at.slug))
                      .map(type => (
                        <option key={type.id} value={type.slug}>
                          {type.name}
                        </option>
                      ))}
                  </optgroup>
                )}
                {/* Mountain Activities */}
                {filteredActivityTypes.filter(at => ['hiking', 'climbing', 'mountain-biking', 'trail-running', 'caving', 'canyoning'].includes(at.slug)).length > 0 && (
                  <optgroup label="⛰️ Mountain Adventures">
                    {filteredActivityTypes
                      .filter(at => ['hiking', 'climbing', 'mountain-biking', 'trail-running', 'caving', 'canyoning'].includes(at.slug))
                      .map(type => (
                        <option key={type.id} value={type.slug}>
                          {type.name}
                        </option>
                      ))}
                  </optgroup>
                )}
                {/* Other Activities */}
                {filteredActivityTypes.filter(at => !['surfing', 'kayaking', 'coasteering', 'sea-kayaking', 'sup', 'wild-swimming', 'hiking', 'climbing', 'mountain-biking', 'trail-running', 'caving', 'canyoning'].includes(at.slug)).length > 0 && (
                  <optgroup label="🎯 Other Adventures">
                    {filteredActivityTypes
                      .filter(at => !['surfing', 'kayaking', 'coasteering', 'sea-kayaking', 'sup', 'wild-swimming', 'hiking', 'climbing', 'mountain-biking', 'trail-running', 'caving', 'canyoning'].includes(at.slug))
                      .map(type => (
                        <option key={type.id} value={type.slug}>
                          {type.name}
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex items-end md:pb-0">
            <Button
              type="button"
              onClick={handleSearch}
              variant="primary"
              size="lg"
              className="h-14 w-full rounded-xl shadow-lg shadow-accent-strong/30 hover:shadow-xl hover:shadow-accent-strong/40 md:w-auto md:px-8"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="h-5 w-5 hidden sm:inline" />
            </Button>
          </div>
        </div>

        {/* Reset notice */}
        {resetNotice && (
          <div className="mt-3 text-center animate-in fade-in duration-300">
            <p className="text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1.5 rounded-full">
              Activity reset — not available in this region
            </p>
          </div>
        )}

        {/* Helper text */}
        <p className="mt-4 text-xs text-slate-500 text-center">
          Find your perfect Welsh adventure • {uniqueActivityTypes.length} activity types • {regions.length} regions
        </p>
      </div>
    </div>
  );
}
