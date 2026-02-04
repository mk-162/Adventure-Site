'use client';

import { useState, useMemo } from 'react';
import { OperatorCard } from '@/components/cards/operator-card';
import { Star, Award } from 'lucide-react';

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
}

const categoryLabels: Record<string, string> = {
  activity_provider: "🏔️ Activity Providers",
  gear_rental: "🚲 Gear & Hire",
  food_drink: "🍽️ Food & Drink",
  transport: "🚌 Transport",
  accommodation: "🏠 Accommodation",
};

export function DirectoryFilters({ operators, regions, activityTypes }: DirectoryFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  // Filter operators
  const filteredOperators = useMemo(() => {
    return operators.filter((operator) => {
      // Search filter - case-insensitive includes
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!operator.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Region filter
      if (selectedRegion) {
        const hasRegion = operator.regions && operator.regions.includes(selectedRegion);
        if (!hasRegion) {
          return false;
        }
      }

      // Activity type filter
      if (selectedActivityType) {
        const hasActivityType = operator.activityTypes && operator.activityTypes.includes(selectedActivityType);
        if (!hasActivityType) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory) {
        if (operator.category !== selectedCategory) {
          return false;
        }
      }

      // Rating filter
      if (selectedRating) {
        const rating = operator.googleRating ? parseFloat(operator.googleRating) : 0;
        switch (selectedRating) {
          case '4+':
            if (rating < 4) return false;
            break;
          case '4.5+':
            if (rating < 4.5) return false;
            break;
        }
      }

      return true;
    });
  }, [operators, searchQuery, selectedRegion, selectedActivityType, selectedCategory, selectedRating]);

  // Get available categories from the data
  const availableCategories = useMemo(() => {
    const cats = new Set(operators.map(op => op.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [operators]);

  // Separate featured from regular
  const featuredOperators = filteredOperators.filter(op => op.claimStatus === "premium");
  const regularOperators = filteredOperators.filter(op => op.claimStatus !== "premium");

  return (
    <>
      {/* Search */}
      <section className="bg-[#1e3a4c] py-12">
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
            {operators.length}+ Welsh adventure businesses. Operators, gear hire, food, transport — all in one place.
          </p>

          <div className="mt-6">
            <input
              type="search"
              placeholder="Search operators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-lg text-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat!}>
                  {categoryLabels[cat!] || cat}
                </option>
              ))}
            </select>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>
            <select 
              value={selectedActivityType}
              onChange={(e) => setSelectedActivityType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Activities</option>
              {activityTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>
            <select 
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Rating: Any</option>
              <option value="4+">4+ Stars</option>
              <option value="4.5+">4.5+ Stars</option>
            </select>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Operators */}
        {featuredOperators.length > 0 && (
          <section className="mb-12 bg-gradient-to-br from-[#1e3a4c]/5 via-[#f97316]/5 to-transparent rounded-2xl p-6 border border-[#1e3a4c]/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#f97316] text-white p-2 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1e3a4c]">
                    Featured Partners
                  </h2>
                  <p className="text-sm text-gray-600">
                    Premium operators trusted by thousands
                  </p>
                </div>
              </div>
              <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#f97316] bg-[#f97316]/10 px-3 py-1.5 rounded-full border border-[#f97316]/20">
                <Star className="w-3 h-3 fill-current" />
                Promoted
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
            <h2 className="text-xl font-bold text-[#1e3a4c]">
              All Operators
            </h2>
            <p className="text-gray-500 text-sm">
              Showing {filteredOperators.length} of {operators.length} operators
            </p>
          </div>

          {regularOperators.length > 0 ? (
            <div className="space-y-4">
              {regularOperators.map((operator) => (
                <OperatorCard key={operator.id} operator={operator} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-2">No operators found matching your filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('');
                  setSelectedActivityType('');
                  setSelectedCategory('');
                  setSelectedRating('');
                }}
                className="text-[#f97316] hover:text-[#ea580c] font-medium text-sm"
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
