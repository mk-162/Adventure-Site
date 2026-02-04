import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getActivityBySlug, getActivities, getAccommodation } from "@/lib/queries";
import { Badge, DifficultyBadge, PriceBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ActivityCard } from "@/components/cards/activity-card";
import { ActivityGallery } from "@/components/activities/activity-gallery";
import dynamic from "next/dynamic";
import type { MapMarker } from "@/components/ui/MapView";
import { 
  MapPin, Clock, Calendar, Users, Star, 
  CheckCircle, XCircle, ExternalLink, Share2, Heart 
} from "lucide-react";
import { 
  JsonLd, 
  createTouristAttractionSchema, 
  createBreadcrumbSchema 
} from "@/components/seo/JsonLd";

const MapView = dynamic(() => import("@/components/ui/MapView"), {
  loading: () => (
    <div className="w-full h-[300px] rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface ActivityPageProps {
  params: Promise<{ slug: string }>;
}

// Helper to extract just the intro text (before any **Section:** headers)
function extractIntro(description: string | null): string {
  if (!description) return "";
  
  // Find where the first **Something:** section starts
  const sectionStart = description.search(/\*\*[A-Z][^*]+:\*\*/);
  
  if (sectionStart > 0) {
    return description.substring(0, sectionStart).trim();
  }
  
  // If no sections found, return first 500 chars
  return description.length > 500 ? description.substring(0, 500) + "..." : description;
}

// Available local activity hero images
const localActivityImages = new Set([
  "archery", "boat-tour", "caving", "climbing", "coasteering",
  "gorge-scrambling", "gorge-walking", "high-ropes", "hiking",
  "hiking-scrambling", "kayaking", "mine-exploration", "mountain-biking",
  "paddleboarding", "rafting", "sea-kayaking", "sup", "surfing",
  "trail-running", "wildlife-boat-tour", "wild-swimming", "windsurfing", "zip-lining",
]);

function getActivityHeroImage(activitySlug: string, activityTypeSlug?: string | null): string {
  // Try activity type first
  if (activityTypeSlug && localActivityImages.has(activityTypeSlug)) {
    return `/images/activities/${activityTypeSlug}-hero.jpg`;
  }
  // Try to match from slug
  const slugParts = activitySlug.toLowerCase().split("-");
  for (const part of slugParts) {
    if (localActivityImages.has(part)) {
      return `/images/activities/${part}-hero.jpg`;
    }
  }
  // Check compound matches
  const compoundMatches = ["gorge-walking", "sea-kayaking", "mountain-biking", "trail-running", "wild-swimming", "zip-lining"];
  for (const match of compoundMatches) {
    if (activitySlug.includes(match)) {
      return `/images/activities/${match}-hero.jpg`;
    }
  }
  return "/images/activities/hiking-hero.jpg";
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getActivityBySlug(slug);

  if (!data) {
    return {
      title: 'Activity Not Found',
    };
  }

  const { activity, region, operator, activityType } = data;
  const intro = extractIntro(activity.description);
  const description = intro || `Experience ${activity.name} in ${region?.name || 'Wales'}. ${activity.duration ? `Duration: ${activity.duration}.` : ''} ${activity.difficulty ? `Difficulty: ${activity.difficulty}.` : ''}`;

  return {
    title: `${activity.name} | ${region?.name || 'Wales'} | Adventure Wales`,
    description: description.slice(0, 160),
    keywords: `${activity.name}, ${region?.name || 'Wales'}, adventure, outdoor activities, ${activityType?.name || 'activities'}`,
    openGraph: {
      title: `${activity.name} | ${region?.name || 'Wales'}`,
      description: description.slice(0, 160),
      type: 'website',
      locale: 'en_GB',
      url: `https://adventurewales.co.uk/activities/${slug}`,
      siteName: 'Adventure Wales',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.name} | ${region?.name || 'Wales'}`,
      description: description.slice(0, 160),
    },
    alternates: {
      canonical: `https://adventurewales.co.uk/activities/${slug}`,
    },
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const data = await getActivityBySlug(slug);

  if (!data) {
    notFound();
  }

  const { activity, region, operator, activityType } = data;

  // Get related activities and nearby accommodation
  const [relatedActivities, nearbyAccommodation] = await Promise.all([
    getActivities({
      regionId: region?.id,
      limit: 4,
    }),
    region
      ? getAccommodation({ regionId: region.id, limit: 10 })
      : Promise.resolve([]),
  ]);

  // Prepare map markers
  const mapMarkers: MapMarker[] = [];

  // Add the main activity location
  if (activity.lat && activity.lng) {
    mapMarkers.push({
      id: `activity-${activity.id}`,
      lat: parseFloat(String(activity.lat)),
      lng: parseFloat(String(activity.lng)),
      type: "activity",
      title: activity.name,
      subtitle: "Activity Location",
      price: activity.priceFrom ? `From £${activity.priceFrom}` : undefined,
    });
  }

  // Add nearby accommodation
  nearbyAccommodation
    .filter((item) => item.accommodation.lat && item.accommodation.lng)
    .forEach((item) => {
      mapMarkers.push({
        id: `accommodation-${item.accommodation.id}`,
        lat: parseFloat(String(item.accommodation.lat)),
        lng: parseFloat(String(item.accommodation.lng)),
        type: "accommodation",
        title: item.accommodation.name,
        link: `/accommodation/${item.accommodation.slug}`,
        subtitle: item.accommodation.type || "Accommodation",
        price: item.accommodation.priceFrom
          ? `From £${item.accommodation.priceFrom}/night`
          : undefined,
      });
    });

  // Get hero image based on activity type
  const heroImage = getActivityHeroImage(activity.slug, activityType?.slug);

  // Create breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Activities', url: '/activities' },
  ];
  if (region) {
    breadcrumbItems.push({ name: region.name, url: `/${region.slug}` });
  }
  breadcrumbItems.push({ name: activity.name, url: `/activities/${slug}` });

  return (
    <>
      <JsonLd data={createTouristAttractionSchema(activity, {
        region,
        operator,
        imageUrl: `https://adventurewales.co.uk${heroImage}`,
      })} />
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <div className="min-h-screen pt-16">
      {/* Hero Gallery */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${heroImage}')`,
          }}
        >
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Heart className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Floating Info Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-t-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  {operator && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-[#1e3a4c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {operator.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600">{operator.name}</span>
                      {operator.googleRating && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-[#f97316] text-[#f97316]" />
                          {operator.googleRating}
                        </span>
                      )}
                    </div>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a4c]">
                    {activity.name}
                  </h1>
                </div>
                <div className="text-right">
                  <PriceBadge
                    from={activity.priceFrom ? parseFloat(activity.priceFrom) : null}
                    to={activity.priceTo ? parseFloat(activity.priceTo) : null}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 overflow-x-auto">
            {activity.duration && (
              <InfoPill icon={Clock} label={activity.duration} />
            )}
            {activity.difficulty && (
              <InfoPill icon={Users} label={activity.difficulty} />
            )}
            {activity.minAge && (
              <InfoPill icon={Users} label={`${activity.minAge}+`} />
            )}
            {activity.season && (
              <InfoPill icon={Calendar} label={activity.season} />
            )}
            {region && (
              <InfoPill icon={MapPin} label={region.name} />
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">
                About This Experience
              </h2>
              <p className="text-gray-600">
                {extractIntro(activity.description) || `Experience the thrill of ${activity.name} in ${region?.name || 'Wales'}. This unforgettable adventure is perfect for those seeking excitement in the great outdoors.`}
              </p>
            </section>

            {/* Photo Gallery */}
            {activityType?.slug && (
              <ActivityGallery 
                activityType={activityType.slug} 
                activityName={activity.name}
              />
            )}

            {/* What's Included */}
            <section>
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">
                What's Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Included
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Professional instruction</li>
                    <li>• All safety equipment</li>
                    <li>• Safety briefing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 mb-2 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Not Included
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Transport to venue</li>
                    <li>• Food and drinks</li>
                    <li>• Personal insurance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Meeting Point & Location Map */}
            {activity.meetingPoint && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">
                  Meeting Point
                </h2>
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-5 w-5 text-[#f97316]" />
                    {activity.meetingPoint}
                  </p>
                </div>
              </section>
            )}

            {/* Location Map */}
            {mapMarkers.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">
                  Location & Nearby Accommodation
                </h2>
                <MapView
                  markers={mapMarkers}
                  center={
                    activity.lat && activity.lng
                      ? [parseFloat(String(activity.lat)), parseFloat(String(activity.lng))]
                      : undefined
                  }
                  zoom={13}
                  height="350px"
                  className="rounded-xl shadow-sm"
                />
                
                {/* Map Legend */}
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#3b82f6] border-2 border-white shadow-sm"></span>
                    Activity
                  </span>
                  {nearbyAccommodation.length > 0 && (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#22c55e] border-2 border-white shadow-sm"></span>
                      Nearby Stays ({nearbyAccommodation.filter(a => a.accommodation.lat && a.accommodation.lng).length})
                    </span>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border p-6 shadow-sm">
              <div className="text-center mb-6">
                <PriceBadge
                  from={activity.priceFrom ? parseFloat(activity.priceFrom) : null}
                  to={activity.priceTo ? parseFloat(activity.priceTo) : null}
                />
                <p className="text-gray-500 text-sm">per person</p>
              </div>

              {activity.bookingUrl ? (
                <ButtonLink
                  href={activity.bookingUrl}
                  variant="accent"
                  fullWidth
                  external
                >
                  Check Availability
                  <ExternalLink className="h-4 w-4" />
                </ButtonLink>
              ) : (
                <ButtonLink href="/contact" variant="accent" fullWidth>
                  Enquire Now
                </ButtonLink>
              )}

              {operator && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500 mb-2">Provided by</p>
                  <a
                    href={`/directory/${operator.slug}`}
                    className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#1e3a4c] rounded-full flex items-center justify-center text-white font-bold">
                      {operator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1e3a4c]">{operator.name}</p>
                      {operator.googleRating && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#f97316] text-[#f97316]" />
                          {operator.googleRating}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Activities */}
        {relatedActivities.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-[#1e3a4c] mb-6">
              More Adventures Nearby
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedActivities
                .filter((item) => item.activity.id !== activity.id)
                .slice(0, 4)
                .map((item) => (
                  <ActivityCard
                    key={item.activity.id}
                    activity={item.activity}
                    region={item.region}
                    operator={item.operator}
                  />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
    </>
  );
}

function InfoPill({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full whitespace-nowrap">
      <Icon className="h-4 w-4 text-[#f97316]" />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
