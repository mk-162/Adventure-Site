import Link from "next/link";
import { getAccommodation, getAllRegions } from "@/lib/queries";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { 
  ChevronRight, 
  Filter, 
  MapPin,
  Bed,
  Tent,
  Home,
  Building
} from "lucide-react";

const accommodationTypes = [
  { value: "", label: "All Types", icon: Bed },
  { value: "hotel", label: "Hotels", icon: Building },
  { value: "hostel", label: "Hostels", icon: Home },
  { value: "bunkhouse", label: "Bunkhouses", icon: Home },
  { value: "campsite", label: "Campsites", icon: Tent },
  { value: "glamping", label: "Glamping", icon: Tent },
  { value: "b&b", label: "B&Bs", icon: Bed },
];

export default async function AccommodationListingPage() {
  const [accommodations, regions] = await Promise.all([
    getAccommodation({ limit: 50 }),
    getAllRegions()
  ]);

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1e3a4c] font-medium">Accommodation</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a4c] mb-3">
            Where to Stay in Wales
          </h1>
          <p className="text-gray-600 max-w-2xl">
            From adventure-ready hostels to cozy B&Bs, find the perfect base for your Welsh adventure.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter Results</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Region Filter */}
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.id} value={region.slug}>{region.name}</option>
              ))}
            </select>
            
            {/* Type Filter */}
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
              {accommodationTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            {/* Price Filter */}
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20">
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
            return (
              <button
                key={type.value}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm whitespace-nowrap hover:border-[#1e3a4c] hover:text-[#1e3a4c] transition-colors"
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">
          {accommodations.length} places to stay
        </p>

        {/* Accommodation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {accommodations.map((item) => (
            <AccommodationCard
              key={item.accommodation.id}
              accommodation={item.accommodation}
              region={item.region}
            />
          ))}
        </div>

        {/* Empty State */}
        {accommodations.length === 0 && (
          <div className="text-center py-16">
            <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No accommodation found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
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
      </div>
    </div>
  );
}

export const metadata = {
  title: "Where to Stay | Adventure Wales",
  description: "Find adventure-friendly accommodation across Wales - hostels, bunkhouses, campsites, and more",
};
