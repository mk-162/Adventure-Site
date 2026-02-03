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
  hostel:
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  camping:
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  default:
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        {accommodation.type && (
          <div className="absolute top-3 left-3">
            <TypeBadge type={accommodation.type} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#1e3a4c] mb-1 group-hover:text-[#f97316] transition-colors line-clamp-1">
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
              <Star className="h-4 w-4 fill-[#f97316] text-[#f97316]" />
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
