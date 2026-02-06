import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPin, ArrowRight, Compass, Info, Car, Clock } from "lucide-react";
import { getLocationBySlug, getLocations } from "@/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLocationBySlug(slug);

  if (!data) {
    return {
      title: "Location | Adventure Wales",
      description: "Discover amazing locations across Wales for your next adventure.",
    };
  }

  const description = data.location.description?.slice(0, 160) || `Discover ${data.location.name} in ${data.region?.name || "Wales"}.`;

  return {
    title: `${data.location.name} | Adventure Wales`,
    description,
    openGraph: {
      title: `${data.location.name} | Adventure Wales`,
      description,
      type: "website",
      locale: "en_GB",
      url: `https://adventurewales.co.uk/locations/${slug}`,
      siteName: "Adventure Wales",
    },
    alternates: {
      canonical: `https://adventurewales.co.uk/locations/${slug}`,
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const data = await getLocationBySlug(slug);

  // Location not found — show friendly placeholder
  if (!data) {
    const recentLocations = await getLocations({ limit: 6 });

    return (
      <div className="min-h-screen pt-4 lg:pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-medium">Location</span>
          </nav>

          <div className="bg-gradient-to-br from-primary/5 to-accent-hover/5 rounded-2xl p-8 lg:p-12 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-hover/10 mb-6">
              <Compass className="w-8 h-8 text-accent-hover" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-primary mb-3">
              This location page is coming soon
            </h1>
            <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto mb-8">
              We&apos;re still building out our location guides. Check back soon for detailed info, parking tips, and nearby activities.
            </p>

            {recentLocations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Explore these locations
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {recentLocations.map((item) => (
                    <Link
                      key={item.location.id}
                      href={`/locations/${item.location.slug}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all text-sm font-medium text-primary"
                    >
                      <MapPin className="w-4 h-4" />
                      {item.location.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/destinations"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-[#2d5568] transition-colors"
              >
                Browse Regions
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/activities"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-full border border-gray-200 hover:border-primary/30 transition-colors"
              >
                Find Activities
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { location, region } = data;

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          {region && (
            <>
              <Link href={`/${region.slug}`} className="hover:text-primary">{region.name}</Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="text-primary font-medium">{location.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-primary mb-3">{location.name}</h1>
          {region && (
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{region.name}, Wales</span>
            </div>
          )}
        </header>

        {/* Description */}
        {location.description && (
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed text-base lg:text-lg">{location.description}</p>
          </section>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {location.parkingInfo && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">Parking</h3>
              </div>
              <p className="text-gray-600 text-sm">{location.parkingInfo}</p>
            </div>
          )}
          {location.accessNotes && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">Access Notes</h3>
              </div>
              <p className="text-gray-600 text-sm">{location.accessNotes}</p>
            </div>
          )}
          {location.bestTime && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">Best Time to Visit</h3>
              </div>
              <p className="text-gray-600 text-sm">{location.bestTime}</p>
            </div>
          )}
          {location.facilities && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-primary">Facilities</h3>
              </div>
              <p className="text-gray-600 text-sm">{location.facilities}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-6 lg:p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Explore more of {region?.name || "Wales"}</h2>
          <p className="text-white/80 text-sm mb-4">Find activities and accommodation nearby.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {region && (
              <Link
                href={`/${region.slug}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors"
              >
                Things to Do
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 px-6 rounded-full hover:bg-white/20 transition-colors"
            >
              All Regions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
