import Link from "next/link";

interface Region {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface RegionsGridProps {
  regions: Region[];
}

// Placeholder images for regions - in production these would come from the database
const regionImages: Record<string, string> = {
  snowdonia: "https://images.unsplash.com/photo-1589802829985-817e51171b92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  pembrokeshire: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "brecon-beacons": "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gower: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  anglesey: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "llyn-peninsula": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

export function RegionsGrid({ regions }: RegionsGridProps) {
  // Take first 6 unique regions
  const uniqueRegions = regions.slice(0, 6);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-2">
            Explore by Region
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a4c]">
            Discover Wales' Hidden Gems
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueRegions.map((region) => (
            <Link
              key={region.id}
              href={`/${region.slug}`}
              className="group relative h-64 rounded-2xl overflow-hidden"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${regionImages[region.slug] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}')`,
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{region.name}</h3>
                {region.description && (
                  <p className="text-white/80 text-sm line-clamp-2">{region.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
