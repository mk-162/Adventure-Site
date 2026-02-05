'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ActivityCard } from '@/components/cards/activity-card';
import { Filter, Search, Mountain, Map as MapIcon, Grid } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { MapMarker } from '@/components/ui/MapView';

const MapView = dynamic(() => import('@/components/ui/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface Activity {
  activity: {
    id: number;
    name: string;
    slug: string;
    priceFrom: string | null;
    priceTo: string | null;
    duration: string | null;
    difficulty: string | null;
    lat: string | null;
    lng: string | null;
    heroImage?: string | null;
  };
  region: {
    id: number;
    name: string;
    slug: string;
    heroImage?: string | null;
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
    heroImage?: string | null;
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
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedRegion) params.set('region', selectedRegion);
    if (selectedActivityType) params.set('type', selectedActivityType);
    if (selectedDifficulty) params.set('difficulty', selectedDifficulty);
    if (selectedPrice) params.set('price', selectedPrice);
    if (sortBy && sortBy !== 'name') params.set('sort', sortBy);

    const queryString = params.toString();
    const newUrl = queryString ? `/activities?${queryString}` : '/activities';
    
    // Only update if URL actually changed
    if (newUrl !== window.location.pathname + window.location.search) {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchQuery, selectedRegion, selectedActivityType, selectedDifficulty, selectedPrice, sortBy, router]);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let result = initialActivities.filter((item) => {
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

    // Sort the filtered results
    const difficultyOrder: Record<string, number> = {
      'easy': 1,
      'moderate': 2,
      'challenging': 3,
      'extreme': 4,
    };

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.activity.name.localeCompare(b.activity.name);
        
        case 'price-low':
          const priceA = a.activity.priceFrom ? parseFloat(a.activity.priceFrom) : Infinity;
          const priceB = b.activity.priceFrom ? parseFloat(b.activity.priceFrom) : Infinity;
          return priceA - priceB;
        
        case 'price-high':
          const priceAHigh = a.activity.priceFrom ? parseFloat(a.activity.priceFrom) : -Infinity;
          const priceBHigh = b.activity.priceFrom ? parseFloat(b.activity.priceFrom) : -Infinity;
          return priceBHigh - priceAHigh;
        
        case 'difficulty':
          const diffA = difficultyOrder[a.activity.difficulty?.toLowerCase() || ''] || 999;
          const diffB = difficultyOrder[b.activity.difficulty?.toLowerCase() || ''] || 999;
          return diffA - diffB;
        
        default:
          return 0;
      }
    });

    return result;
  }, [initialActivities, searchQuery, selectedRegion, selectedActivityType, selectedDifficulty, selectedPrice, sortBy]);

  const handleQuickLinkClick = (typeSlug: string) => {
    // If clicking the same type, clear it; otherwise set it
    setSelectedActivityType(selectedActivityType === typeSlug ? '' : typeSlug);
  };

  // Prepare map markers from filtered activities
  const mapMarkers: MapMarker[] = useMemo(() => {
    return filteredActivities
      .filter((item) => item.activity.lat && item.activity.lng)
      .map((item) => ({
        id: `activity-${item.activity.id}`,
        lat: parseFloat(String(item.activity.lat)),
        lng: parseFloat(String(item.activity.lng)),
        type: 'activity' as const,
        title: item.activity.name,
        link: `/activities/${item.activity.slug}`,
        subtitle: item.activityType?.name || undefined,
        price: item.activity.priceFrom
          ? `From £${item.activity.priceFrom}`
          : undefined,
      }));
  }, [filteredActivities]);

  return (
    <>
      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30 focus:bg-white transition-all"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region.id} value={region.slug}>{region.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedActivityType}
            onChange={(e) => setSelectedActivityType(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30 focus:bg-white transition-all"
          >
            <option value="">All Activity Types</option>
            {activityTypes.map(type => (
              <option key={type.id} value={type.slug}>{type.name}</option>
            ))}
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

      {/* Results Count & View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
        </p>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-[#1e3a4c] shadow-sm'
                : 'text-gray-600 hover:text-[#1e3a4c]'
            }`}
          >
            <Grid className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-[#1e3a4c] shadow-sm'
                : 'text-gray-600 hover:text-[#1e3a4c]'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && filteredActivities.length > 0 && (
        <div className="mb-12">
          <MapView
            markers={mapMarkers}
            center={[52.4, -3.6]}
            zoom={8}
            height="600px"
            className="rounded-xl shadow-lg"
          />
          
          {/* Map Legend */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white shadow-sm"></span>
              Activities ({mapMarkers.length})
            </span>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredActivities.length > 0 && (
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
      )}

      {/* Empty State */}
      {filteredActivities.length === 0 && (
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
              setSortBy('name');
            }}
            className="px-6 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
