import Link from "next/link";

interface RegionCardProps {
  region: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  };
  image?: string;
  stats?: {
    activities?: number;
    accommodation?: number;
  };
}

// Placeholder images for regions
const regionImages: Record<string, string> = {
  snowdonia:
    "https://images.unsplash.com/photo-1589802829985-817e51171b92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  pembrokeshire:
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "brecon-beacons":
    "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gower:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  anglesey:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "llyn-peninsula":
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "south-wales":
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "north-wales":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  default:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

export function RegionCard({ region, image, stats }: RegionCardProps) {
  const imageUrl = image || regionImages[region.slug] || regionImages.default;

  return (
    <Link
      href={`/${region.slug}`}
      className="group relative h-64 rounded-2xl overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white mb-1">{region.name}</h3>
        {region.description && (
          <p className="text-white/80 text-sm line-clamp-2">
            {region.description}
          </p>
        )}
        {stats && (
          <div className="flex gap-4 mt-2 text-white/70 text-xs">
            {stats.activities !== undefined && (
              <span>{stats.activities} activities</span>
            )}
            {stats.accommodation !== undefined && (
              <span>{stats.accommodation} places to stay</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
