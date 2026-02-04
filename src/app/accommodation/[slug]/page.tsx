import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAccommodationBySlug, getAccommodationByRegion, getActivities, getAllAccommodationSlugs } from "@/lib/queries";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { AccommodationLocationMap } from "@/components/maps/AccommodationLocationMap";
import type { MapMarker } from "@/components/ui/MapView";
import { 
  MapPin, Star, ExternalLink, Bed, Wifi, Car, 
  Mountain, ChevronRight, Phone, Globe, Calendar
} from "lucide-react";
import { 
  JsonLd, 
  createLodgingBusinessSchema, 
  createBreadcrumbSchema 
} from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAccommodationBySlug(slug);

  if (!data) {
    return {
      title: 'Accommodation Not Found',
    };
  }

  const { accommodation, region } = data;
  const description = accommodation.description || `${accommodation.name} offers comfortable accommodation in ${region?.name || 'Wales'}, perfect for adventure seekers.`;

  return {
    title: `${accommodation.name} | ${region?.name || 'Wales'} Accommodation | Adventure Wales`,
    description: description.slice(0, 160),
    keywords: `${accommodation.name}, ${region?.name || 'Wales'}, accommodation, ${accommodation.type || 'lodging'}, adventure stays`,
    openGraph: {
      title: `${accommodation.name} | ${region?.name || 'Wales'}`,
      description: description.slice(0, 160),
      type: 'website',
      locale: 'en_GB',
      url: `https://adventurewales.co.uk/accommodation/${slug}`,
      siteName: 'Adventure Wales',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${accommodation.name} | ${region?.name || 'Wales'}`,
      description: description.slice(0, 160),
    },
    alternates: {
      canonical: `https://adventurewales.co.uk/accommodation/${slug}`,
    },
  };
}

export default async function AccommodationPage({ params }: Props) {
  const { slug } = await params;
  const data = await getAccommodationBySlug(slug);

  if (!data) {
    notFound();
  }

  const { accommodation, region } = data;

  // Get nearby accommodation and activities
  const [nearbyAccommodation, nearbyActivities] = await Promise.all([
    region ? getAccommodationByRegion(region.slug, 4) : Promise.resolve([]),
    region ? getActivities({ regionId: region.id, limit: 10 }) : Promise.resolve([]),
  ]);

  // Prepare map markers
  const mapMarkers: MapMarker[] = [];

  // Add the main accommodation location
  if (accommodation.lat && accommodation.lng) {
    mapMarkers.push({
      id: `accommodation-${accommodation.id}`,
      lat: parseFloat(String(accommodation.lat)),
      lng: parseFloat(String(accommodation.lng)),
      type: "accommodation",
      title: accommodation.name,
      subtitle: "Your Stay",
      price: accommodation.priceFrom
        ? `From £${accommodation.priceFrom}/night`
        : undefined,
    });
  }

  // Add nearby activities
  nearbyActivities
    .filter((item) => item.activity.lat && item.activity.lng)
    .forEach((item) => {
      mapMarkers.push({
        id: `activity-${item.activity.id}`,
        lat: parseFloat(String(item.activity.lat)),
        lng: parseFloat(String(item.activity.lng)),
        type: "activity",
        title: item.activity.name,
        link: `/activities/${item.activity.slug}`,
        subtitle: item.activityType?.name || "Activity",
        price: item.activity.priceFrom
          ? `From £${item.activity.priceFrom}`
          : undefined,
      });
    });

  // Parse adventure features
  const features = accommodation.adventureFeatures
    ?.split(",")
    .map((f) => f.trim())
    .filter(Boolean) || [];

  // Create breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Accommodation', url: '/accommodation' },
  ];
  if (region) {
    breadcrumbItems.push({ name: region.name, url: `/${region.slug}/where-to-stay` });
  }
  breadcrumbItems.push({ name: accommodation.name, url: `/accommodation/${slug}` });

  return (
    <>
      <JsonLd data={createLodgingBusinessSchema(accommodation, {
        region,
        imageUrl: 'https://adventurewales.co.uk/images/wales/accommodation-hero.jpg',
      })} />
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] bg-[#1e3a4c]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('/images/wales/accommodation-hero.jpg')`,
          }}
        />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            {region && (
              <>
                <Link href={`/${region.slug}/where-to-stay`} className="hover:text-white">
                  {region.name} Stays
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-white">{accommodation.name}</span>
          </nav>

          {/* Type badge */}
          {accommodation.type && (
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full w-fit mb-3">
              <Bed className="h-3 w-3" />
              {accommodation.type}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {accommodation.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/80">
            {accommodation.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {accommodation.address}
              </span>
            )}
            {accommodation.googleRating && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {accommodation.googleRating}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">About This Property</h2>
              <p className="text-gray-600 leading-relaxed">
                {accommodation.description || `${accommodation.name} offers comfortable accommodation in ${region?.name || 'Wales'}, perfect for adventure seekers looking for a place to rest and recharge.`}
              </p>
            </div>

            {/* Adventure Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Adventure Features</h2>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 bg-[#1e3a4c]/10 text-[#1e3a4c] text-sm px-3 py-1.5 rounded-full"
                    >
                      <Mountain className="h-4 w-4" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities (placeholder) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Wifi className="h-5 w-5 text-[#1e3a4c]" />
                  <span>Free WiFi</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Car className="h-5 w-5 text-[#1e3a4c]" />
                  <span>Parking</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mountain className="h-5 w-5 text-[#1e3a4c]" />
                  <span>Gear Storage</span>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <AccommodationLocationMap
              markers={mapMarkers}
              center={
                accommodation.lat && accommodation.lng
                  ? [
                      parseFloat(String(accommodation.lat)),
                      parseFloat(String(accommodation.lng)),
                    ]
                  : undefined
              }
              nearbyCount={nearbyActivities.filter(a => a.activity.lat && a.activity.lng).length}
              address={accommodation.address}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              {/* Price */}
              <div className="mb-4">
                {accommodation.priceFrom && (
                  <div className="text-2xl font-bold text-[#1e3a4c]">
                    From £{Number(accommodation.priceFrom).toFixed(0)}
                    {accommodation.priceTo && (
                      <span>-£{Number(accommodation.priceTo).toFixed(0)}</span>
                    )}
                    <span className="text-base font-normal text-gray-500"> /night</span>
                  </div>
                )}
              </div>

              {/* Booking buttons */}
              <div className="space-y-3">
                {accommodation.bookingUrl && (
                  <a
                    href={accommodation.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#f97316] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#ea580c] transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    Check Availability
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {accommodation.airbnbUrl && (
                  <a
                    href={accommodation.airbnbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border-2 border-[#1e3a4c] text-[#1e3a4c] font-semibold py-3 px-4 rounded-lg hover:bg-[#1e3a4c]/5 transition-colors"
                  >
                    View on Airbnb
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {accommodation.website && (
                  <a
                    href={accommodation.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-[#1e3a4c] font-medium py-2"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
              </div>

              {/* Contact */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500 mb-2">Questions about this property?</p>
                <button className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="h-4 w-4" />
                  Contact Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Accommodation */}
      {nearbyAccommodation.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[#1e3a4c] mb-6">
            More Places to Stay in {region?.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyAccommodation
              .filter((item) => item.accommodation.id !== accommodation.id)
              .slice(0, 4)
              .map((item) => (
                <AccommodationCard
                  key={item.accommodation.id}
                  accommodation={item.accommodation}
                  region={item.region}
                />
              ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllAccommodationSlugs();
  return slugs.map((slug) => ({ slug }));
}
