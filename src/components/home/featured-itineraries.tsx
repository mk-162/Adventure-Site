import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

interface Activity {
  id: number;
  name: string;
  slug: string;
  priceFrom: string | null;
  priceTo: string | null;
  duration: string | null;
  difficulty: string | null;
}

interface FeaturedItinerariesProps {
  activities: Activity[];
}

// Mock itineraries since we don't have them seeded yet
const mockItineraries = [
  {
    id: 1,
    title: "Summit Challenge",
    region: "Snowdonia National Park",
    duration: "3 DAYS",
    rating: 4.9,
    reviews: 126,
    price: 299,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "River Rapids Adventure",
    region: "Wye Valley, Llangollen",
    duration: "1 DAY",
    rating: 4.8,
    reviews: 89,
    price: 85,
    image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Coed y Brenin MTB",
    region: "Coed y Brenin Forest Park",
    duration: "2 DAYS",
    rating: 5.0,
    reviews: 42,
    price: 150,
    image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Family Coastal Camp",
    region: "Pembrokeshire Coast",
    duration: "WEEKEND",
    rating: 4.7,
    reviews: 210,
    price: 120,
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export function FeaturedItineraries({ activities }: FeaturedItinerariesProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-2">
              Curated Trips
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a4c]">
              Featured Itineraries
            </h2>
          </div>
          <Link
            href="/itineraries"
            className="hidden md:flex items-center gap-2 text-[#f97316] font-semibold hover:text-[#ea580c] transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockItineraries.map((itinerary) => (
            <Link
              key={itinerary.id}
              href={`/itineraries/${itinerary.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${itinerary.image}')` }}
                />
                {/* Duration Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#1e3a4c] text-white text-xs font-semibold rounded-full">
                  {itinerary.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-[#f97316] text-[#f97316]" />
                  <span className="text-sm font-semibold text-[#f97316]">
                    {itinerary.rating}
                  </span>
                  <span className="text-sm text-gray-500">({itinerary.reviews})</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-[#1e3a4c] mb-1 group-hover:text-[#f97316] transition-colors">
                  {itinerary.title}
                </h3>

                {/* Region */}
                <p className="text-sm text-gray-500 mb-3">{itinerary.region}</p>

                {/* Price */}
                <p className="text-sm">
                  <span className="font-semibold text-[#1e3a4c]">From £{itinerary.price}</span>
                  <span className="text-gray-500"> /person</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/itineraries"
            className="inline-flex items-center gap-2 text-[#f97316] font-semibold hover:text-[#ea580c] transition-colors"
          >
            View All Itineraries
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
