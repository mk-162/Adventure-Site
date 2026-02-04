import Link from "next/link";
import { Clock, Mountain, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItineraryCardProps {
  itinerary: {
    title: string;
    slug: string;
    tagline?: string | null;
    durationDays?: number | null;
    difficulty?: string | null;
    priceEstimateFrom?: string | null;
    priceEstimateTo?: string | null;
  };
  region: {
    name: string;
    slug: string;
  } | null;
  tags?: {
    tag: {
      name: string;
      slug: string;
    };
  }[];
  className?: string;
}

export function ItineraryCard({
  itinerary,
  region,
  tags,
  className,
}: ItineraryCardProps) {
  // Construct image path based on region slug as requested
  const imagePath = region
    ? `/images/regions/${region.slug}-hero.jpg`
    : "/images/placeholder-hero.jpg";

  const difficultyColor = (difficulty: string | null | undefined) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "challenging":
      case "hard":
        return "bg-orange-100 text-orange-700";
      case "extreme":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Link
      href={`/itineraries/${itinerary.slug}`}
      className={cn(
        "group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#1e3a4c]/30 flex flex-col h-full",
        className
      )}
    >
      {/* Card Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100 shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${imagePath}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Duration Badge */}
        {itinerary.durationDays && (
          <div className="absolute top-3 right-3 bg-[#1e3a4c] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {itinerary.durationDays} DAY{itinerary.durationDays > 1 ? "S" : ""}
          </div>
        )}

        {/* Region Badge */}
        {region && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-[#1e3a4c] text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {region.name}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-[#1e3a4c] mb-2 group-hover:text-[#f97316] transition-colors line-clamp-2">
          {itinerary.title}
        </h3>

        {itinerary.tagline && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {itinerary.tagline}
          </p>
        )}

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Difficulty */}
            {itinerary.difficulty && (
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1",
                  difficultyColor(itinerary.difficulty)
                )}
              >
                <Mountain className="w-3 h-3" />
                {itinerary.difficulty.charAt(0).toUpperCase() +
                  itinerary.difficulty.slice(1)}
              </span>
            )}

            {/* Tags (limit to 2) */}
            {tags &&
              tags.slice(0, 2).map(({ tag }) => (
                <span
                  key={tag.slug}
                  className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag.name}
                </span>
              ))}
          </div>

          {/* Price */}
          {(itinerary.priceEstimateFrom || itinerary.priceEstimateTo) && (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Estimated cost</span>
              <span className="font-bold text-[#1e3a4c]">
                {itinerary.priceEstimateFrom && `£${itinerary.priceEstimateFrom}`}
                {itinerary.priceEstimateFrom &&
                  itinerary.priceEstimateTo &&
                  itinerary.priceEstimateFrom !== itinerary.priceEstimateTo &&
                  ` - `}
                {itinerary.priceEstimateTo &&
                  itinerary.priceEstimateFrom !== itinerary.priceEstimateTo &&
                  `£${itinerary.priceEstimateTo}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
