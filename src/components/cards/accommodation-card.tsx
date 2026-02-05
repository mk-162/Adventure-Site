import Link from "next/link";
import { MapPin, Star, Bike, Shirt } from "lucide-react";
import { Badge, PriceBadge, TypeBadge } from "@/components/ui/badge";

interface AccommodationCardProps {
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
  region?: {
    name: string;
    slug: string;
  } | null;
  image?: string;
  variant?: "default" | "compact";
}

const placeholderImages: Record<string, string> = {
  hostel: "/images/misc/gear-camping-01-55639fd4.jpg",
  hotel: "/images/wales/snowdonia-wales-1-d896a4e4.jpg",
  camping: "/images/misc/gear-camping-02-68be8b48.jpg",
  campsite: "/images/misc/gear-camping-03-ad238db8.jpg",
  bunkhouse: "/images/misc/gear-camping-04-27db8926.jpg",
  default: "/images/misc/gear-camping-05-ca857981.jpg",
};

// Parse adventure features string into array
function parseFeatures(features: string | null): string[] {
  if (!features) return [];
  return features.split(",").map((f) => f.trim()).filter(Boolean);
}

// Map feature to icon
function getFeatureIcon(feature: string) {
  const lower = feature.toLowerCase();
  if (lower.includes("bike") || lower.includes("storage")) {
    return <Bike className="h-3 w-3" />;
  }
  if (lower.includes("drying") || lower.includes("room")) {
    return <Shirt className="h-3 w-3" />;
  }
  return null;
}

export function AccommodationCard({
  accommodation,
  region,
  image,
  variant = "default",
}: AccommodationCardProps) {
  const features = parseFeatures(accommodation.adventureFeatures);
  const typeKey = accommodation.type?.toLowerCase() || "default";
  const imageUrl = image || placeholderImages[typeKey] || placeholderImages.default;

  return (
    <Link
      href={`/accommodation/${accommodation.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {accommodation.type && (
          <div className="absolute top-3 left-3">
            <TypeBadge type={accommodation.type} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#1e3a4c] mb-1 group-hover:text-[#ea580c] transition-colors line-clamp-1">
          {accommodation.name}
        </h3>

        {(accommodation.address || region) && (
          <p className="text-sm text-gray-400 flex items-center gap-1 mb-2">
            <MapPin className="h-3 w-3" />
            {accommodation.address || region?.name}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          {accommodation.googleRating && (
            <span className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-[#ea580c] text-[#ea580c]" />
              <span className="font-medium">{accommodation.googleRating}</span>
            </span>
          )}
          <PriceBadge
            from={accommodation.priceFrom ? parseFloat(accommodation.priceFrom) : null}
            to={accommodation.priceTo ? parseFloat(accommodation.priceTo) : null}
          />
        </div>

        {/* Adventure Features */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1 text-xs text-gray-500"
              >
                {getFeatureIcon(feature)}
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
