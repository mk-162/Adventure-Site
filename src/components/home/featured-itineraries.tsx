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
    image: "/images/misc/itinerary-group-01-69a29a24.jpg",
  },
  {
    id: 2,
    title: "River Rapids Adventure",
    region: "Wye Valley, Llangollen",
    duration: "1 DAY",
    rating: 4.8,
    reviews: 89,
    price: 85,
    image: "/images/activities/rafting-hero.jpg",
  },
  {
    id: 3,
    title: "Coed y Brenin MTB",
    region: "Coed y Brenin Forest Park",
    duration: "2 DAYS",
    rating: 5.0,
    reviews: 42,
    price: 150,
    image: "/images/activities/mountain-biking-hero.jpg",
  },
  {
    id: 4,
    title: "Family Coastal Camp",
    region: "Pembrokeshire Coast",
    duration: "WEEKEND",
    rating: 4.7,
    reviews: 210,
    price: 120,
    image: "/images/misc/family-adventure-01-41f3f49e.jpg",
  },
];

export function FeaturedItineraries({ activities }: FeaturedItinerariesProps) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-[#f97316] font-bold uppercase tracking-wider text-sm">Tried & Tested Routes</span>
            <h2 className="mt-2 text-3xl font-bold text-[#1e3a4c]">Ready-Made Adventures</h2>
          </div>
          <Link href="/itineraries" className="hidden sm:flex items-center text-[#1e3a4c] font-bold hover:underline">
            View All <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-4 sm:pb-0">
            {mockItineraries.map((itinerary) => (
              <Link
                key={itinerary.id}
                href={`/itineraries/${itinerary.id}`}
                className="flex-shrink-0 w-[260px] sm:w-auto group"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url('${itinerary.image}')` }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold uppercase text-[#1e3a4c]">
                    {itinerary.duration}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-[#f97316] text-sm font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{itinerary.rating} ({itinerary.reviews})</span>
                  </div>
                  <h3 className="text-lg font-bold mt-1 text-[#1e3a4c] group-hover:text-[#1e3a4c] transition-colors">
                    {itinerary.title}
                  </h3>
                  <p className="text-slate-500 text-sm">{itinerary.region}</p>
                  <p className="mt-2 font-bold text-[#1e3a4c]">
                    From £{itinerary.price} <span className="text-slate-500 font-normal text-xs">/ person</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link href="/itineraries" className="sm:hidden block w-full mt-6 py-3 text-center text-[#1e3a4c] font-bold border border-slate-200 rounded-xl hover:bg-slate-50">
          View All Itineraries
        </Link>
      </div>
    </section>
  );
}
