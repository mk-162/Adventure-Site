'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ActivityCard } from '@/components/cards/activity-card';
import { Filter, Search, Mountain } from 'lucide-react';

interface Activity {
  activity: {
    id: number;
    name: string;
    slug: string;
    priceFrom: string | null;
    priceTo: string | null;
    duration: string | null;
    difficulty: string | null;
  };
  region: {
    id: number;
    name: string;
    slug: string;
  } | null;
  operator: {
    name: string;
    slug: string;
    googleRating: string | null;
  } | null;
  activityType: {
    id: number;
    name: string;
    slug: string;
  } | null;
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

interface ActivityFiltersProps {
  initialActivities: Activity[];
  regions: Region[];
  activityTypes: ActivityType[];
}

export function ActivityFilters({
  initialActivities,
  regions,
  activityTypes,
}: ActivityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '');
  const [selectedActivityType, setSelectedActivityType] = useState(searchParams.get('type') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || '');

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedRegion) params.set('region', selectedRegion);
    if (selectedActivityType) params.set('type', selectedActivityType);
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
    if (selectedPrice) params.set('price', selectedPrice);

    const queryString = params.toString();
    const newUrl = queryString ? `/activities?${queryString}` : '/activities';
    
    // Only update if URL actually changed
    if (newUrl !== window.location.pathname + window.location.search) {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchQuery, selectedRegion, selectedActivityType, selectedDifficulty, selectedPrice, router]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return initialActivities.filter((item) => {
      // Text search - filter by activity name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!item.activity.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Region filter
      if (selectedRegion && item.region?.slug !== selectedRegion) {
        return false;
      }

      // Activity type filter
      if (selectedActivityType && item.activityType?.slug !== selectedActivityType) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty && item.activity.difficulty !== selectedDifficulty) {
        return false;
      }

      // Price filter
      if (selectedPrice) {
        const priceFrom = item.activity.priceFrom ? parseFloat(item.activity.priceFrom) : null;
        
        switch (selectedPrice) {
          case 'free':
            if (priceFrom !== null && priceFrom > 0) return false;
            break;
          case 'budget':
            if (priceFrom === null || priceFrom >= 50) return false;
            break;
          case 'mid':
            if (priceFrom === null || priceFrom < 50 || priceFrom >= 100) return false;
            break;
          case 'premium':
            if (priceFrom === null || priceFrom < 100) return false;
            break;
        }
      }

      return true;
    });
  }, [initialActivities, searchQuery, selectedRegion, selectedActivityType, selectedDifficulty, selectedPrice]);

  const handleQuickLinkClick = (typeSlug: string) => {
    // If clicking the same type, clear it; otherwise set it
    setSelectedActivityType(selectedActivityType === typeSlug ? '' : typeSlug);
  };

  return (
    <>
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region.id} value={region.slug}>{region.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedActivityType}
            onChange={(e) => setSelectedActivityType(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20"
          >
            <option value="">All Activity Types</option>
            {activityTypes.map(type => (
              <option key={type.id} value={type.slug}>{type.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20"
          >
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
            <option value="extreme">Extreme</option>
          </select>
          
          <select 
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20"
          >
            <option value="">Any Price</option>
            <option value="free">Free</option>
            <option value="budget">Under £50</option>
            <option value="mid">£50 - £100</option>
            <option value="premium">£100+</option>
          </select>
        </div>
      </div>

      {/* Activity Type Quick Links */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {activityTypes.slice(0, 10).map(type => (
          <button
            key={type.id}
            onClick={() => handleQuickLinkClick(type.slug)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedActivityType === type.slug
                ? 'bg-[#1e3a4c] text-white border-[#1e3a4c]'
                : 'bg-white border-gray-200 hover:border-[#1e3a4c] hover:text-[#1e3a4c]'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
      </p>

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredActivities.map((item) => (
            <ActivityCard
              key={item.activity.id}
              activity={item.activity}
              region={item.region}
              operator={item.operator}
              activityType={item.activityType}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No activities found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('');
              setSelectedActivityType('');
              setSelectedDifficulty('');
              setSelectedPrice('');
            }}
            className="px-6 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
