'use client';

import { useState, useMemo } from 'react';
import Link from "next/link";
import { AccommodationCard } from '@/components/cards/accommodation-card';
import { 
  Filter, 
  MapPin,
  Bed,
  Tent,
  Home,
  Building
} from "lucide-react";

interface Accommodation {
  accommodation: {
    id: number;
    name: string;
    slug: string;
    type: string | null;
    priceFrom: string | null;
    priceTo: string | null;
    googleRating: string | null;
    adventureFeatures: string | null;
    address: string | null;
  };
  region: {
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

interface AccommodationFiltersProps {
  accommodations: Accommodation[];
  regions: Region[];
}

const accommodationTypes = [
  { value: "", label: "All Types", icon: Bed },
  { value: "hotel", label: "Hotels", icon: Building },
  { value: "hostel", label: "Hostels", icon: Home },
  { value: "bunkhouse", label: "Bunkhouses", icon: Home },
  { value: "campsite", label: "Campsites", icon: Tent },
  { value: "glamping", label: "Glamping", icon: Tent },
  { value: "b&b", label: "B&Bs", icon: Bed },
];

export function AccommodationFilters({ accommodations, regions }: AccommodationFiltersProps) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  // Filter accommodations
  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((item) => {
      // Region filter
      if (selectedRegion && item.region?.slug !== selectedRegion) {
        return false;
      }

      // Type filter
      if (selectedType) {
        const type = item.accommodation.type?.toLowerCase() || '';
        if (!type.includes(selectedType.toLowerCase())) {
          return false;
        }
      }

      // Price filter
      if (selectedPrice) {
        const priceFrom = item.accommodation.priceFrom ? parseFloat(item.accommodation.priceFrom) : null;
        
        switch (selectedPrice) {
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
  }, [accommodations, selectedRegion, selectedType, selectedPrice]);

  // Count per type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    accommodationTypes.forEach(type => {
      if (type.value === '') {
        counts[''] = accommodations.length;
      } else {
        counts[type.value] = accommodations.filter(item => {
          const itemType = item.accommodation.type?.toLowerCase() || '';
          return itemType.includes(type.value.toLowerCase());
        }).length;
      }
    });
    return counts;
  }, [accommodations]);

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filter Results</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Region Filter */}
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
          
          {/* Type Filter */}
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20"
          >
            {accommodationTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          {/* Price Filter */}
          <select 
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20"
          >
            <option value="">Any Price</option>
            <option value="budget">Budget (Under £50)</option>
            <option value="mid">Mid-Range (£50-100)</option>
            <option value="premium">Premium (£100+)</option>
          </select>
        </div>
      </div>

      {/* Type Quick Links */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {accommodationTypes.map(type => {
          const Icon = type.icon;
          const count = typeCounts[type.value] || 0;
          return (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedType === type.value
                  ? 'bg-[#1e3a4c] text-white border-[#1e3a4c]'
                  : 'bg-white border-gray-200 hover:border-[#1e3a4c] hover:text-[#1e3a4c]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.label}
              <span className={`text-xs ${
                selectedType === type.value ? 'text-white/70' : 'text-gray-500'
              }`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredAccommodations.length} {filteredAccommodations.length === 1 ? 'place' : 'places'} to stay
      </p>

      {/* Accommodation Grid */}
      {filteredAccommodations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAccommodations.map((item) => (
            <AccommodationCard
              key={item.accommodation.id}
              accommodation={item.accommodation}
              region={item.region}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl mb-12">
          <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No accommodation found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters</p>
          <button
            onClick={() => {
              setSelectedRegion('');
              setSelectedType('');
              setSelectedPrice('');
            }}
            className="text-[#ea580c] hover:text-[#ea580c] font-medium text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Region Cards */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Browse by Region</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {regions.slice(0, 8).map(region => (
            <Link
              key={region.id}
              href={`/${region.slug}/where-to-stay`}
              className="relative h-32 rounded-xl overflow-hidden group"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('/images/regions/${region.slug}-hero.jpg')` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold">{region.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
