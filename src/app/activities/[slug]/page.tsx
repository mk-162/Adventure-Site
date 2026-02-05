import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getActivityBySlug, getActivities, getAccommodation, getAllActivitySlugs, getItineraries } from "@/lib/queries";
import { Badge, DifficultyBadge, PriceBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ActivityCard } from "@/components/cards/activity-card";
import { ActivityGallery } from "@/components/activities/activity-gallery";
import dynamic from "next/dynamic";
import type { MapMarker } from "@/components/ui/MapView";
import { ActivityLocationMap } from "@/components/maps/ActivityLocationMap";
import { ClaimListingBanner } from "@/components/operators/ClaimListingBanner";
import { AdvertiseWidget } from "@/components/commercial/AdvertiseWidget";
import { TopTip } from "@/components/widgets/TopTip";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { 
  MapPin, Clock, Calendar, Users, Star, 
  CheckCircle, XCircle, ExternalLink, Share2, Navigation
} from "lucide-react";
import { 
  JsonLd, 
  createTouristAttractionSchema, 
  createBreadcrumbSchema 
} from "@/components/seo/JsonLd";
import { ActivityWeatherAlert } from "@/components/weather/ActivityWeatherAlert";

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

// Slug aliases for activities whose slug doesn't contain the type name directly
const slugAliases: Record<string, string> = {
  "mtb": "mountain-biking",
  "downhill": "mountain-biking",
  "biking": "mountain-biking",
  "cycling": "mountain-biking",
  "paddle": "paddleboarding",
  "canoe": "kayaking",
  "canoeing": "kayaking",
  "abseil": "climbing",
  "abseiling": "climbing",
  "bouldering": "climbing",
  "cave": "caving",
  "gorge": "gorge-walking",
  "scrambling": "gorge-scrambling",
  "raft": "rafting",
  "swim": "wild-swimming",
  "swimming": "wild-swimming",
  "surf": "surfing",
  "bodyboard": "surfing",
  "zipline": "zip-lining",
  "zip": "zip-lining",
  "ropes": "high-ropes",
  "trek": "hiking",
  "trekking": "hiking",
  "walk": "hiking",
  "walking": "hiking",
  "mine": "mine-exploration",
  "boat": "boat-tour",
  "wildlife": "wildlife-boat-tour",
  "windsurf": "windsurfing",
  "run": "trail-running",
  "running": "trail-running",
};

function getActivityHeroImage(
  activitySlug: string,
  activityTypeSlug?: string | null,
  activityTypeHeroImage?: string | null,
  regionSlug?: string | null,
): string {
  // Try activity type first
  if (activityTypeSlug && localActivityImages.has(activityTypeSlug)) {
    return `/images/activities/${activityTypeSlug}-hero.jpg`;
  }

  // Check compound matches first (more specific)
  const compoundMatches = [
    "gorge-scrambling", "gorge-walking", "sea-kayaking", "mine-exploration",
    "mountain-biking", "trail-running", "wild-swimming", "boat-tour",
    "wildlife-boat-tour", "high-ropes", "zip-lining", "hiking-scrambling",
  ];
  for (const match of compoundMatches) {
    if (activitySlug.includes(match)) {
      return `/images/activities/${match}-hero.jpg`;
    }
  }

  // Try to match from slug parts, including aliases
  const slugParts = activitySlug.toLowerCase().split("-");
  for (const part of slugParts) {
    if (localActivityImages.has(part)) {
      return `/images/activities/${part}-hero.jpg`;
    }
    if (slugAliases[part] && localActivityImages.has(slugAliases[part])) {
      return `/images/activities/${slugAliases[part]}-hero.jpg`;
    }
  }

  // Activity type hero image from DB (e.g. Unsplash URL)
  if (activityTypeHeroImage) {
    return activityTypeHeroImage;
  }

  // Region hero image fallback
  if (regionSlug) {
    return `/images/regions/${regionSlug}-hero.jpg`;
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
  const [relatedActivities, nearbyAccommodation, regionItineraries] = await Promise.all([
    getActivities({
      regionId: region?.id,
      limit: 4,
    }),
    region
      ? getAccommodation({ regionId: region.id, limit: 10 })
      : Promise.resolve([]),
    region
      ? getItineraries({ regionId: region.id, limit: 3 })
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

  // Get hero image based on activity type with full fallback chain
  const heroImage = getActivityHeroImage(
    activity.slug,
    activityType?.slug,
    activityType?.heroImage,
    region?.slug,
  );

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
        <Image
          src={heroImage}
          alt={activity.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60 z-10" />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
          <FavoriteButton
            itemId={activity.id}
            itemType="activity"
            className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
            iconClassName="h-5 w-5 text-gray-700"
          />
        </div>

        {/* Floating Info Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-t-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  {operator && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {operator.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600">{operator.name}</span>
                      {operator.googleRating && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-accent-hover text-accent-hover" />
                          {operator.googleRating}
                        </span>
                      )}
                    </div>
                  )}
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">
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
        {/* Weather Alert */}
        {(activity.lat || region?.lat) && (activity.lng || region?.lng) && (
          <ActivityWeatherAlert 
            lat={parseFloat(String(activity.lat || region?.lat))} 
            lng={parseFloat(String(activity.lng || region?.lng))} 
            activityType={activityType?.name || activity.name}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">
                About This Experience
              </h2>
              <p className="text-gray-600">
                {extractIntro(activity.description) || `Experience the thrill of ${activity.name} in ${region?.name || 'Wales'}. This unforgettable adventure is perfect for those seeking excitement in the great outdoors.`}
              </p>
            </section>

            {/* Claim Banner — prominent for stub listings */}
            {operator && operator.claimStatus !== "claimed" && operator.claimStatus !== "premium" && 
             (!activity.description || activity.description.length < 200) && (
              <ClaimListingBanner
                operatorSlug={operator.slug}
                operatorName={operator.name}
                variant="full"
                isStub={true}
              />
            )}

            {/* Photo Gallery */}
            {activityType?.slug && (
              <ActivityGallery 
                activityType={activityType.slug} 
                activityName={activity.name}
              />
            )}

            {/* What's Included */}
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">
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
                <h2 className="text-xl font-bold text-primary mb-4">
                  Meeting Point
                </h2>
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-5 w-5 text-accent-hover" />
                    {activity.meetingPoint}
                  </p>
                </div>
              </section>
            )}

            {/* Get Directions */}
            {activity.lat && activity.lng && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activity.lat},${activity.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent-hover bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            )}

            {/* Location Map */}
            <ActivityLocationMap
              markers={mapMarkers}
              center={
                activity.lat && activity.lng
                  ? [parseFloat(String(activity.lat)), parseFloat(String(activity.lng))]
                  : undefined
              }
              nearbyCount={nearbyAccommodation.filter(a => a.accommodation.lat && a.accommodation.lng).length}
            />
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

              {activity.bookingAffiliateUrl ? (
                <>
                  <ButtonLink
                    href={activity.bookingAffiliateUrl}
                    variant="accent"
                    fullWidth
                    external
                  >
                    Book Now
                    <ExternalLink className="h-4 w-4" />
                  </ButtonLink>
                  {activity.bookingPlatform && activity.bookingPlatform !== "none" && activity.bookingPlatform !== "direct" && (
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Powered by {activity.bookingPlatform.charAt(0).toUpperCase() + activity.bookingPlatform.slice(1)}
                    </p>
                  )}
                </>
              ) : activity.bookingUrl ? (
                <>
                  <ButtonLink
                    href={activity.bookingUrl}
                    variant="accent"
                    fullWidth
                    external
                  >
                    Check Availability
                    <ExternalLink className="h-4 w-4" />
                  </ButtonLink>
                  {activity.bookingPlatform && activity.bookingPlatform !== "none" && activity.bookingPlatform !== "direct" && (
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Powered by {activity.bookingPlatform.charAt(0).toUpperCase() + activity.bookingPlatform.slice(1)}
                    </p>
                  )}
                </>
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
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {operator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{operator.name}</p>
                      {operator.googleRating && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-accent-hover text-accent-hover" />
                          {operator.googleRating}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar Location Map */}
            {activity.lat && activity.lng && (
              <div className="mt-4 bg-white rounded-2xl border p-4 shadow-sm">
                <h3 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent-hover" />
                  Location
                </h3>
                <MapView
                  markers={[{
                    id: `sidebar-activity-${activity.id}`,
                    lat: parseFloat(String(activity.lat)),
                    lng: parseFloat(String(activity.lng)),
                    type: "activity" as const,
                    title: activity.name,
                  }]}
                  center={[parseFloat(String(activity.lat)), parseFloat(String(activity.lng))]}
                  zoom={13}
                  height="200px"
                  interactive={false}
                  className="rounded-xl"
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activity.lat},${activity.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:text-accent-hover bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 transition-colors w-full"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Get Directions
                </a>
              </div>
            )}

            {/* Claim Listing CTA — sidebar */}
            {operator && operator.claimStatus !== "claimed" && operator.claimStatus !== "premium" && (
              <div className="mt-4">
                <ClaimListingBanner
                  operatorSlug={operator.slug}
                  operatorName={operator.name}
                  variant="sidebar"
                />
              </div>
            )}

            {/* Advertise Widget */}
            <div className="mt-4">
              <AdvertiseWidget context={region?.name} />

            {/* Contextual Top Tip */}
            {activityType && (
              <div className="mt-4">
                <TopTip 
                  tip={getActivityTip(activityType.slug)} 
                  context={activityType.name} 
                />
              </div>
            )}
            </div>
          </div>
        </div>

        {/* SEO Cross-link to combo page */}
        {region && activityType && (
          <section className="mt-12">
            <Link
              href={`/${region.slug}/things-to-do/${activityType.slug}`}
              className="block bg-gradient-to-r from-primary to-[#2a5570] rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-bold text-white mb-1">
                All {activityType.name} in {region.name} →
              </h2>
              <p className="text-white/70 text-sm">
                Browse every {activityType.name.toLowerCase()} experience, compare operators, and find the best deals in {region.name}.
              </p>
            </Link>
          </section>
        )}

        {/* Featured in these trips */}
        {regionItineraries.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-primary mb-4">
              {region?.name} Road Trips
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {regionItineraries.map(({ itinerary, region: iRegion }) => (
                <Link
                  key={itinerary.id}
                  href={`/itineraries/${itinerary.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="h-32 bg-cover bg-center bg-gray-100"
                    style={{ backgroundImage: `url('/images/regions/${iRegion?.slug || 'default'}-hero.jpg')` }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-primary group-hover:text-accent-hover transition-colors line-clamp-1">
                      {itinerary.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {itinerary.durationDays} days · {iRegion?.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Activities */}
        {relatedActivities.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-primary mb-6">
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

function getActivityTip(activityTypeSlug: string): string {
  const tips: Record<string, string> = {
    "coasteering": "Book for morning sessions — the sea is usually calmer and you'll beat the crowds. Bring old trainers you don't mind getting wet.",
    "hiking": "Start early, especially in summer. Mountain weather changes fast — pack waterproofs even on sunny days. Check the Met Office mountain forecast.",
    "surfing": "Check Magic Seaweed or Surfline before heading out. Low tide often gives the best beach breaks. Wetsuits essential year-round in Wales.",
    "mountain-biking": "Trail centres have bike wash stations — use them. Mud in Wales is legendary. Bring a spare tube and basic tools.",
    "climbing": "Check UKClimbing.com for route conditions. Sea cliffs can be affected by tides — always check tide times at coastal crags.",
    "kayaking": "Wear layers under your wetsuit/drysuit. River levels matter — check Natural Resources Wales gauge readings before heading out.",
    "sea-kayaking": "Check wind and swell forecasts. Paddle with a qualified guide if you're new to sea conditions. Wildlife encounters are common!",
    "caving": "Wear clothes you don't mind ruining. Hard-soled boots are better than wellies. Claustrophobia? Try a beginner cave first — they're more spacious than you'd think.",
    "wild-swimming": "Check water quality at Surfers Against Sewage. Acclimatise slowly and never swim alone. A bright swim cap makes you visible to boats.",
    "sup": "Leash to your board ALWAYS, especially in the sea. Start on flat water. Wind picks up in the afternoon — mornings are often glassy.",
    "zip-lining": "Wear closed-toe shoes and tie back long hair. No loose jewellery. Most zip lines operate rain or shine — waterproofs recommended.",
    "gorge-walking": "This is genuinely one of the most fun activities in Wales. You WILL get wet, cold, and muddy — embrace it. Wetsuits provided.",
    "canyoning": "Similar to gorge walking but more technical. Listen carefully to the safety brief. It's harder than it looks but incredibly rewarding.",
    "trail-running": "Fell running shoes with grip are essential on Welsh terrain. Carry a whistle and emergency shelter for mountain routes.",
  };
  return tips[activityTypeSlug] || "Book directly with operators for the best prices — most offer group discounts. Check weather forecasts before heading out.";
}

function InfoPill({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full whitespace-nowrap">
      <Icon className="h-4 w-4 text-accent-hover" />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllActivitySlugs();
  return slugs.map((slug) => ({ slug }));
}
