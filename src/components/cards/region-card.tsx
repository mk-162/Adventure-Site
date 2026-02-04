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

// Local images for regions - all 11 regions covered
const regionImages: Record<string, string> = {
  snowdonia: "/images/regions/snowdonia-hero.jpg",
  pembrokeshire: "/images/regions/pembrokeshire-hero.jpg",
  "brecon-beacons": "/images/regions/brecon-beacons-hero.jpg",
  gower: "/images/regions/gower-hero.jpg",
  anglesey: "/images/regions/anglesey-hero.jpg",
  "llyn-peninsula": "/images/regions/llyn-peninsula-hero.jpg",
  "south-wales": "/images/regions/south-wales-hero.jpg",
  "north-wales": "/images/regions/north-wales-hero.jpg",
  "mid-wales": "/images/regions/mid-wales-hero.jpg",
  "wye-valley": "/images/regions/wye-valley-hero.jpg",
  carmarthenshire: "/images/regions/carmarthenshire-hero.jpg",
  default: "/images/regions/snowdonia-hero.jpg",
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
