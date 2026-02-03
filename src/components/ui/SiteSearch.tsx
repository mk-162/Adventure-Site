"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Loader2, MapPin, Compass, Users, Tent } from "lucide-react";
import clsx from "clsx";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: string;
}

interface SearchResults {
  activities: SearchResult[];
  operators: SearchResult[];
  regions: SearchResult[];
  accommodation: SearchResult[];
}

const typeIcons: Record<string, any> = {
  activity: Compass,
  operator: Users,
  region: MapPin,
  accommodation: Tent,
};

const typeColors: Record<string, string> = {
  activity: "bg-blue-100 text-blue-600",
  operator: "bg-green-100 text-green-600",
  region: "bg-orange-100 text-orange-600",
  accommodation: "bg-purple-100 text-purple-600",
};

const typeLinks: Record<string, (slug: string) => string> = {
  activity: (slug) => `/activities/${slug}`,
  operator: (slug) => `/directory/${slug}`,
  region: (slug) => `/${slug}`,
  accommodation: (slug) => `/accommodation/${slug}`,
};

export function SiteSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const allResults = results
    ? [
        ...results.regions.map((r) => ({ ...r, type: "region" })),
        ...results.activities.map((r) => ({ ...r, type: "activity" })),
        ...results.operators.map((r) => ({ ...r, type: "operator" })),
        ...results.accommodation.map((r) => ({ ...r, type: "accommodation" })),
      ]
    : [];

  const handleSelect = (result: SearchResult & { type: string }) => {
    const link = typeLinks[result.type](result.slug);
    router.push(link);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 text-sm transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white rounded text-xs text-gray-400 border">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Dialog */}
            <div className="inline-block w-full max-w-xl my-16 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl overflow-hidden relative">
              {/* Search Input */}
              <div className="flex items-center border-b px-4">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search activities, regions, operators..."
                  className="flex-1 px-4 py-4 text-lg outline-none"
                />
                {loading && <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />}
                {query && !loading && (
                  <button onClick={() => setQuery("")} className="p-1 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.length < 2 ? (
                  <div className="p-8 text-center text-gray-500">
                    Type at least 2 characters to search
                  </div>
                ) : allResults.length === 0 && !loading ? (
                  <div className="p-8 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="py-2">
                    {allResults.map((result) => {
                      const Icon = typeIcons[result.type] || Compass;
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSelect(result)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                        >
                          <div className={clsx("p-2 rounded-lg", typeColors[result.type])}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {result.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {result.description?.slice(0, 60)}...
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 capitalize">
                            {result.type}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
                <span>Press <kbd className="px-1 py-0.5 bg-white rounded border">↵</kbd> to select</span>
                <span>Press <kbd className="px-1 py-0.5 bg-white rounded border">esc</kbd> to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
