import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";

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
  return (
    <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Where in Wales"
          title="Each Region Has Its Thing"
          align="center"
          className="sm:mb-12"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {regions.map((region) => (
            <Link
              key={region.id}
              href={`/${region.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md transition-shadow duration-300 hover:shadow-2xl"
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
              <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                <h3 className="text-white text-xl sm:text-2xl font-bold">{region.name}</h3>
                <p className="text-slate-300 text-sm mt-1 line-clamp-2 hidden sm:block">
                  {region.description || "Explore this region"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
