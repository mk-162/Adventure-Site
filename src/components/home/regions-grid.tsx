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

// Use local images from /images/regions/[slug]-hero.jpg
function getRegionImage(slug: string): string {
  return `/images/regions/${slug}-hero.jpg`;
}

export function RegionsGrid({ regions }: RegionsGridProps) {
  // Take first 6 unique regions
  const uniqueRegions = regions.slice(0, 6);

  return (
    <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-accent-hover font-bold uppercase tracking-wider text-sm">Where in Wales</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-primary">Each Region Has Its Thing</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {uniqueRegions.map((region) => (
            <Link
              key={region.id}
              href={`/${region.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${getRegionImage(region.slug)}')`,
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold">{region.name}</h3>
                <p className="text-slate-300 text-sm mt-1 hidden sm:block">
                  {region.description ? region.description.substring(0, 30) + "..." : "Explore this region"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
