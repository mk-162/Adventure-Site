'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OperatorCard } from '@/components/cards/operator-card';
import { AdvertiseWidget } from '@/components/commercial/AdvertiseWidget';
import { Search, Award, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Operator {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  claimStatus: "stub" | "claimed" | "premium";
  regions: string[] | null;
  activityTypes: string[] | null;
  googleRating: string | null;
  tagline: string | null;
  address: string | null;
  reviewCount: number | null;
  priceRange: string | null;
  uniqueSellingPoint: string | null;
  logoUrl: string | null;
}

interface Region {
  id: number;
  name: string;
  slug: string;
}

interface ActivityType {
  id: number;
  name: string;
  slug: string;
}

interface DirectoryFiltersProps {
  operators: Operator[];
  regions: Region[];
  activityTypes: ActivityType[];
  totalCount: number;
}

const categoryLabels: Record<string, string> = {
  activity_provider: "🏔️ Activity Providers",
  gear_rental: "🚲 Gear & Hire",
  food_drink: "🍽️ Food & Drink",
  transport: "🚌 Transport",
  accommodation: "🏠 Accommodation",
};

function DirectoryFiltersContent({ operators, regions, activityTypes, totalCount }: DirectoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const selectedRegion = searchParams.get('region') || '';
  const selectedActivityType = searchParams.get('activity') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedRating = searchParams.get('rating') || '';

  // Debounce search update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentQ = searchParams.get('q') || '';
      if (searchQuery !== currentQ) {
        updateFilter('q', searchQuery);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchParams]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 on filter change
    params.delete('page');

    router.replace(`/directory?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.replace('/directory', { scroll: false });
    setSearchQuery('');
  };

  const availableCategories = Object.keys(categoryLabels);

  // Separate featured from regular (from the current page of results)
  const featuredOperators = operators.filter(op => op.claimStatus === "premium");
  const regularOperators = operators.filter(op => op.claimStatus !== "premium");

  const hasActiveFilters = selectedRegion || selectedActivityType || selectedCategory || selectedRating || searchQuery;

  return (
    <>
      {/* Search */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-white/70 text-sm mb-4">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">›</span>
            <span className="text-white">Directory</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Adventure Directory
          </h1>
          <p className="text-white/80">
            {totalCount}+ Welsh adventure businesses. Adventure providers, gear hire, food, transport — all in one place.
          </p>

          <div className="mt-6 relative max-w-md">
            <label htmlFor="directory-search" className="sr-only">Search providers</label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="directory-search"
              type="search"
              placeholder="Search adventure providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 border-2 border-white focus:border-accent-hover focus:ring-2 focus:ring-accent-hover outline-none shadow-lg text-base"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 items-center">
            <label htmlFor="category-filter" className="sr-only">Filter by category</label>
            <select 
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-[180px]"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat] || cat}
                </option>
              ))}
            </select>

            <label htmlFor="region-filter" className="sr-only">Filter by region</label>
            <select 
              id="region-filter"
              value={selectedRegion}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-[180px]"
              aria-label="Filter by region"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>

            <label htmlFor="activity-filter" className="sr-only">Filter by activity</label>
            <select 
              id="activity-filter"
              value={selectedActivityType}
              onChange={(e) => updateFilter('activity', e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-[180px]"
              aria-label="Filter by activity type"
            >
              <option value="">All Activities</option>
              {activityTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>

            <label htmlFor="rating-filter" className="sr-only">Filter by rating</label>
            <select 
              id="rating-filter"
              value={selectedRating}
              onChange={(e) => updateFilter('rating', e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-[140px]"
              aria-label="Filter by rating"
            >
              <option value="">Rating: Any</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium ml-auto sm:ml-2 whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchQuery && (
                <Badge variant="default" className="gap-1 pl-2 pr-1 py-1 font-normal bg-gray-100 text-gray-800 hover:bg-gray-200">
                  Search: {searchQuery}
                  <button onClick={() => { setSearchQuery(''); updateFilter('q', ''); }} className="ml-1 text-gray-500 hover:text-gray-900"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="default" className="gap-1 pl-2 pr-1 py-1 font-normal bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {categoryLabels[selectedCategory] || selectedCategory}
                  <button onClick={() => updateFilter('category', '')} className="ml-1 text-gray-500 hover:text-gray-900"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedRegion && (
                <Badge variant="default" className="gap-1 pl-2 pr-1 py-1 font-normal bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {regions.find(r => r.slug === selectedRegion)?.name || selectedRegion}
                  <button onClick={() => updateFilter('region', '')} className="ml-1 text-gray-500 hover:text-gray-900"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedActivityType && (
                <Badge variant="default" className="gap-1 pl-2 pr-1 py-1 font-normal bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {activityTypes.find(t => t.slug === selectedActivityType)?.name || selectedActivityType}
                  <button onClick={() => updateFilter('activity', '')} className="ml-1 text-gray-500 hover:text-gray-900"><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedRating && (
                <Badge variant="default" className="gap-1 pl-2 pr-1 py-1 font-normal bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {selectedRating}+ Stars
                  <button onClick={() => updateFilter('rating', '')} className="ml-1 text-gray-500 hover:text-gray-900"><X className="h-3 w-3" /></button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Operators */}
        {featuredOperators.length > 0 && (
          <section className="mb-12 bg-gradient-to-br from-primary/5 via-accent-hover/5 to-transparent rounded-2xl p-6 border border-primary/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-accent-hover text-white p-2 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">
                    Sponsored Partners
                  </h2>
                  <p className="text-sm text-gray-600">
                    Paid partners — vetted and trusted
                  </p>
                </div>
              </div>
              <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300" aria-label="Sponsored listings">
                Sponsored
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredOperators.map((operator) => (
                <OperatorCard
                  key={operator.id}
                  operator={operator}
                  variant="featured"
                />
              ))}
            </div>
          </section>
        )}

        {/* All Operators */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              All Adventure Providers
            </h2>
            <p className="text-gray-500 text-sm">
              Showing {operators.length} of {totalCount} providers
            </p>
          </div>

          {operators.length > 0 ? (
            <div className="space-y-4">
              {regularOperators.map((operator, index) => (
                <div key={operator.id}>
                  <OperatorCard operator={operator} />
                  {index === 5 && regularOperators.length > 6 && (
                    <div className="mt-4">
                      <AdvertiseWidget variant="banner" context="the Adventure Wales Directory" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-2">No adventure providers found matching your filters</p>
              <button
                onClick={clearAllFilters}
                className="text-accent-hover hover:text-accent-hover font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export function DirectoryFilters(props: DirectoryFiltersProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <DirectoryFiltersContent {...props} />
    </Suspense>
  );
}
