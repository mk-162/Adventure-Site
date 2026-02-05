import Link from "next/link";
import { getAccommodation, getAllRegions } from "@/lib/queries";
import { AccommodationFilters } from "@/components/accommodation/AccommodationFilters";
import { ChevronRight } from "lucide-react";

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
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">Accommodation</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
            Where to Stay
          </h1>
          <p className="text-gray-600 max-w-2xl">
            70 places that actually work for adventurers. Gear drying, early breakfasts, proximity to
            the good stuff. Filter by type, region, and what matters to you.
          </p>
        </div>

        <AccommodationFilters 
          accommodations={accommodations}
          regions={regions}
        />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Where to Stay | Adventure Wales",
  description: "70 adventure-friendly places to stay in Wales. Sorted by what's nearby, gear storage, and whether they'll let you drip-dry in the hallway.",
};
