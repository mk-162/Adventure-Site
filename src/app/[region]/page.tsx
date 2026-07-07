import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getRegionWithStats, getActivitiesByRegion, getAccommodationByRegion, getOperators, getRegionEntitiesForMap, getActivityTypesForRegion } from "@/lib/queries";
import { isLaunchRegion, isLaunchCombo, isLaunchBestList, LAUNCH_REGIONS } from "@/lib/launch";
import type { MapMarker } from "@/components/ui/MapView";
import { TopExperiences } from "@/components/regions/TopExperiences";
import { TransportSection } from "@/components/regions/TransportSection";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { RegionMap } from "@/components/ui/RegionMap";
import { ScenicGallery } from "@/components/regions/scenic-gallery";
import { getBestListsForRegion } from "@/lib/best-list-data";
import { BestOfCard } from "@/components/content/BestOfCard";
import { SectionHeader } from "@/components/ui/section-header";
import { StatTile } from "@/components/ui/stat-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import {
  ChevronRight,
  Footprints,
  Users,
  Home,
  Calendar,
  CheckCircle,
  ArrowRight,
  Star,
  Cloud,
  Backpack,
  Compass,
} from "lucide-react";
import { getAllRegions } from "@/lib/queries";
import {
  JsonLd,
  createTouristDestinationSchema,
  createBreadcrumbSchema
} from "@/components/seo/JsonLd";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { ActivitySeasonGuide } from "@/components/weather/ActivitySeasonGuide";
import { ThisWeekendWidget } from "@/components/events/ThisWeekendWidget";
import { BookingWidget } from "@/components/commercial/BookingWidget";

// Static region pages are revalidated hourly; content changes (new activities,
// operators, events) don't need to be instant, and this cuts per-request DB
// load from ~6 queries to a cached render.
export const revalidate = 3600;

/** Pre-render every launch-gated region at build time. */
export function generateStaticParams() {
  return Array.from(LAUNCH_REGIONS).map((region) => ({ region }));
}

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

// Helper to extract section content from description
function extractSection(description: string | null, sectionName: string): string | null {
  if (!description) return null;
  
  // Look for **Section Name:** pattern and extract content until next ** or end
  const regex = new RegExp(`\\*\\*${sectionName}:\\*\\*\\s*([^*]+?)(?=\\*\\*|$)`, 'i');
  const match = description.match(regex);
  return match ? match[1].trim() : null;
}

// Helper to extract just the intro paragraphs (before any **Section:** headers)
function extractIntro(description: string | null): string {
  if (!description) return "";
  
  // Find where the first **Something:** section starts
  const sectionStart = description.search(/\*\*[A-Z][^*]+:\*\*/);
  
  if (sectionStart > 0) {
    return description.substring(0, sectionStart).trim();
  }
  
  // If no sections found, return first 500 chars as fallback
  return description.length > 500 ? description.substring(0, 500) + "..." : description;
}

// Helper to extract Pro Tips as an array
function extractProTips(description: string | null): string[] {
  if (!description) return [];
  
  const proTipsSection = extractSection(description, 'Pro Tips');
  if (!proTipsSection) return [];
  
  // Split by bullet points (• or -)
  return proTipsSection
    .split(/[•\-]/)
    .map(tip => tip.trim())
    .filter(tip => tip.length > 10);
}

// Default content for Plan Your Visit sections
const defaultPlanContent = {
  gettingThere: "Check local transport links and drive times from major cities. Many regions have good rail connections.",
  bestTime: "Spring and autumn offer pleasant weather with fewer crowds. Summer is warmest but busiest.",
  essentialGear: "Waterproof jacket and layers are essential year-round. For hiking, bring sturdy boots, a map, and extra food/water.",
};

// Generate metadata for SEO
export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = await getRegionWithStats(regionSlug);

  if (!region) {
    return {
      title: 'Region Not Found',
    };
  }

  const introText = extractIntro(region.description) || `Discover the adventures waiting for you in ${region.name}.`;
  const description = introText.slice(0, 160);

  return {
    title: `${region.name} | Discover Adventures in ${region.name} | Adventure Wales`,
    description,
    keywords: `${region.name}, Wales, adventure, outdoor activities, things to do, accommodation, travel guide`,
    openGraph: {
      title: `${region.name} | Adventure Wales`,
      description,
      type: 'website',
      locale: 'en_GB',
      url: `https://adventurewales.co.uk/${regionSlug}`,
      siteName: 'Adventure Wales',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${region.name} | Adventure Wales`,
      description,
    },
    alternates: {
      canonical: `https://adventurewales.co.uk/${regionSlug}`,
    },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: regionSlug } = await params;

  // Launch gate: only verified regions are reachable/indexable.
  if (!isLaunchRegion(regionSlug)) {
    notFound();
  }

  const region = await getRegionWithStats(regionSlug);

  if (!region) {
    notFound();
  }

  const [activities, accommodation, { operators }, mapEntities, activityTypesWithCount, bestLists] = await Promise.all([
    getActivitiesByRegion(regionSlug, 30),
    getAccommodationByRegion(regionSlug, 4),
    getOperators({ regionSlug, limit: 3 }),
    getRegionEntitiesForMap(region.id),
    getActivityTypesForRegion(region.id),
    Promise.resolve(getBestListsForRegion(regionSlug)),
  ]);

  // Prepare map markers for all entities in the region
  const mapMarkers: MapMarker[] = [
    // Activities (blue)
    ...mapEntities.activities.map((activity) => ({
      id: `activity-${activity.id}`,
      lat: parseFloat(String(activity.lat)),
      lng: parseFloat(String(activity.lng)),
      type: "activity" as const,
      title: activity.name,
      link: `/activities/${activity.slug}`,
      price: activity.priceFrom ? `From £${activity.priceFrom}` : undefined,
    })),
    // Accommodation (green)
    ...mapEntities.accommodation.map((acc) => ({
      id: `accommodation-${acc.id}`,
      lat: parseFloat(String(acc.lat)),
      lng: parseFloat(String(acc.lng)),
      type: "accommodation" as const,
      title: acc.name,
      link: `/accommodation/${acc.slug}`,
      price: acc.priceFrom ? `From £${acc.priceFrom}/night` : undefined,
      subtitle: acc.type || undefined,
    })),
    // Locations (purple)
    ...mapEntities.locations.map((location) => ({
      id: `location-${location.id}`,
      lat: parseFloat(String(location.lat)),
      lng: parseFloat(String(location.lng)),
      type: "location" as const,
      title: location.name,
      subtitle: "Point of Interest",
    })),
    // Events (red)
    ...mapEntities.events.map((event) => ({
      id: `event-${event.id}`,
      lat: parseFloat(String(event.lat)),
      lng: parseFloat(String(event.lng)),
      type: "event" as const,
      title: event.name,
      subtitle: event.type || undefined,
      price: event.registrationCost ? `£${event.registrationCost}` : undefined,
    })),
  ];
  
  // Filter events for widget
  const upcomingEvents = mapEntities.events
    .filter(e => !e.dateStart || new Date(e.dateStart) >= new Date())
    .sort((a, b) => {
       if (!a.dateStart) return 1;
       if (!b.dateStart) return -1;
       return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
    })
    .slice(0, 3);

  // Check if region has any content at all
  const hasContent = activities.length > 0 || accommodation.length > 0 || mapEntities.events.length > 0;

  // If no content, fetch other regions to suggest (launch regions only, so
  // suggestions never point at gated 404s)
  const allRegions = !hasContent ? await getAllRegions() : [];
  const otherRegions = allRegions
    .filter(r => r.slug !== regionSlug && isLaunchRegion(r.slug))
    .slice(0, 6);

  // Launch gate: only link to verified combo / best-of pages (others 404).
  const launchActivityTypes = activityTypesWithCount.filter((item) =>
    isLaunchCombo(regionSlug, item.activityType.slug)
  );
  const launchBestLists = bestLists.filter((list) =>
    isLaunchBestList(regionSlug, list.slug)
  );

  // Extract structured content from description
  const introText = extractIntro(region.description) || `Discover the adventures waiting for you in ${region.name}.`;
  const proTips = extractProTips(region.description);
  const gettingThere = extractSection(region.description, 'Getting There') || defaultPlanContent.gettingThere;
  const bestTimeToVisit = extractSection(region.description, 'Best Time to Visit') || defaultPlanContent.bestTime;
  const essentialGear = defaultPlanContent.essentialGear;

  // Create breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Destinations', url: '/destinations' },
    { name: region.name, url: `/${regionSlug}` },
  ];

  return (
    <>
      <JsonLd data={createTouristDestinationSchema(region, {
        stats: region.stats,
        imageUrl: `https://adventurewales.co.uk/images/regions/${regionSlug}-hero.jpg`,
      })} />
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <div className="min-h-screen pt-4 lg:pt-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-6 lg:mb-8 group h-[400px] lg:h-[500px]">
          <div className="absolute inset-0 bg-slate-900">
            {/* Use local hero image */}
            <Image
              alt={region.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={`/images/regions/${regionSlug}-hero.jpg`}
              fill
              sizes="(max-width: 1280px) 100vw, 1216px"
              loading="eager"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col gap-4 lg:gap-6 p-6 lg:p-12 text-white h-full justify-end">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="text-xs lg:text-sm font-medium text-slate-200">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">Wales</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
                <li>
                  <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
                <li>
                  <span className="text-white" aria-current="page">{region.name}</span>
                </li>
              </ol>
            </nav>

             {/* Heading */}
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tight mb-2 lg:mb-3">
                {region.name}
              </h1>
              <p className="text-base lg:text-xl text-slate-200 font-medium max-w-xl line-clamp-3">
                {introText.split('.').slice(0, 2).join('.') + '.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <StatTile label="Activities" value={region.stats.activities} icon={<Footprints className="size-5" />} />
          <StatTile label="Operators" value={region.stats.operators} icon={<Users className="size-5" />} />
          <StatTile label="Stays" value={region.stats.accommodation} icon={<Home className="size-5" />} />
          <StatTile label="Events" value={region.stats.events} icon={<Calendar className="size-5" />} />
        </div>

        {/* Sticky Section Nav — only shown when there's content to jump to */}
        {hasContent && (
          <nav
            className="sticky z-40 bg-white/80 backdrop-blur-md pt-2 pb-3 lg:pb-4 mb-4 lg:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ top: "var(--header-height)" }}
          >
            <div className="flex overflow-x-auto border-b border-slate-200 gap-4 lg:gap-8 no-scrollbar">
              <AnchorTab href="#overview" label="Overview" />
              {activities.length > 0 && (
                <AnchorTab href="#activities" label="Activities" />
              )}
              {launchActivityTypes.length > 0 && (
                <AnchorTab href="#explore-by-activity" label="Explore by Activity" />
              )}
              {launchBestLists.length > 0 && (
                <AnchorTab href="#top-picks" label="Top Picks" />
              )}
              {accommodation.length > 0 && (
                <AnchorTab href="#accommodation" label="Accommodation" />
              )}
              {upcomingEvents.length > 0 && (
                <AnchorTab href="#events" label="Events" />
              )}
              <AnchorTab href="#map" label="Map" />
              <AnchorTab href="#getting-there" label="Getting There" />
              <AnchorTab href="#plan-your-visit" label="Plan Your Visit" />
              <AnchorTab href="#directory" label="Directory" />
            </div>
          </nav>
        )}

        {/* Empty Region State */}
        {!hasContent && (
          <div className="mb-12 rounded-2xl border border-border bg-white p-8 lg:p-12">
            <EmptyState
              icon={<Compass />}
              title={`We're still exploring ${region.name}`}
              description={`We're busy discovering the best adventures, accommodation, and hidden gems in ${region.name}. Check back soon — or explore one of these other incredible regions in Wales.`}
              actions={
                <>
                  <ButtonLink href="/destinations" variant="secondary" size="md">
                    Browse All Regions
                    <ArrowRight className="w-4 h-4" />
                  </ButtonLink>
                  <ButtonLink href="/activities" variant="outline" size="md">
                    View All Activities
                  </ButtonLink>
                </>
              }
            />

            {otherRegions.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-8">
                {otherRegions.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${r.slug}`}
                    className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden">
                      <Image
                        alt={r.name}
                        className="w-full h-full object-cover"
                        src={`/images/regions/${r.slug}-hero.jpg`}
                        width={48}
                        height={48}
                        loading="eager"
                      />
                    </div>
                    <span className="text-sm font-bold text-primary group-hover:text-accent-strong transition-colors">
                      {r.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2-Column Layout */}
        {hasContent && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-12 lg:gap-16">

            {/* Top Experiences Grid — prominent at top */}
            {activities.length > 0 && (
              <TopExperiences activities={activities} regionSlug={regionSlug} />
            )}

            {/* Explore by Activity Grid */}
            {launchActivityTypes.length > 0 && (
              <section id="explore-by-activity" className="scroll-mt-32">
                <SectionHeader title="Explore by Activity" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                  {launchActivityTypes.map((item) => (
                    <Link
                      key={item.activityType.id}
                      href={`/${regionSlug}/${item.activityType.slug}`}
                      className="group relative overflow-hidden rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                    >
                      <div className="aspect-[4/3] relative bg-slate-100">
                        <FallbackImage
                          src={`/images/activities/${item.activityType.slug}-hero.jpg`}
                          alt={item.activityType.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Count badge */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-primary px-2 py-1 rounded-full text-xs font-bold">
                          {Number(item.count)}
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="font-bold text-sm text-primary group-hover:text-accent-strong transition-colors line-clamp-2">
                          {item.activityType.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {Number(item.count)} experience{Number(item.count) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Intro */}
            <section id="overview" className="scroll-mt-32">
              <SectionHeader title={`Welcome to ${region.name}`} />
              <p className="text-slate-600 leading-relaxed text-base">
                 {introText}
              </p>

              {proTips.length > 0 && (
                <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-xl border-l-4 border-primary mt-4">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong>Top Tip:</strong> {proTips[0]}
                  </p>
                </div>
              )}
            </section>

            {/* Scenic Gallery */}
            <ScenicGallery regionSlug={regionSlug} regionName={region.name} />

            {/* Activity Season Guide */}
            <ActivitySeasonGuide regionSlug={regionSlug} />

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section id="events" className="scroll-mt-32">
                <ThisWeekendWidget
                  events={upcomingEvents}
                  title={`Events in ${region.name}`}
                  subtitle="Coming Up"
                  viewAllLink={`/calendar?region=${regionSlug}`}
                />
              </section>
            )}

            {/* Our Top Picks - Best-Of Lists */}
            {launchBestLists.length > 0 && (
              <section id="top-picks" className="scroll-mt-32">
                <SectionHeader title="Our Top Picks" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  {launchBestLists.map((list) => (
                    <BestOfCard
                      key={list.slug}
                      title={list.title}
                      strapline={list.strapline}
                      href={list.urlPath}
                      count={list.entries.length}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Accommodation Grid */}
            {accommodation.length > 0 && (
              <section id="accommodation" className="scroll-mt-32">
                <SectionHeader
                  title="Where to Stay"
                  action={{ label: "View all", href: `/${regionSlug}/stay` }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  {accommodation.slice(0, 2).map((item) => (
                      <AccommodationCard
                          key={item.accommodation.id}
                          accommodation={item.accommodation}
                          region={item.region}
                      />
                  ))}
                </div>
                <div className="mt-5">
                  <BookingWidget regionName={region.name} />
                </div>
              </section>
            )}

            {/* Interactive Map Section */}
            <section id="map" className="scroll-mt-32">
              <SectionHeader title="Explore the Region" />
              <RegionMap
                markers={mapMarkers}
                center={region.lat && region.lng ? [parseFloat(String(region.lat)), parseFloat(String(region.lng))] : undefined}
                zoom={10}
                height="450px"
                className="shadow-md"
              />

              {/* Map Legend */}
              <div className="flex flex-wrap gap-3 lg:gap-4 mt-4 text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white shadow-sm"></span>
                  Activities ({mapEntities.activities.length})
                </span>
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white shadow-sm"></span>
                  Accommodation ({mapEntities.accommodation.length})
                </span>
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-[#a855f7] border-2 border-white shadow-sm"></span>
                  Locations ({mapEntities.locations.length})
                </span>
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-[#ef4444] border-2 border-white shadow-sm"></span>
                  Events ({mapEntities.events.length})
                </span>
              </div>
            </section>

            {/* Getting There — Transport Section */}
            <section id="getting-there" className="scroll-mt-32">
              <SectionHeader title="Getting There" />
              <TransportSection
                regionSlug={regionSlug}
                summary={gettingThere === defaultPlanContent.gettingThere ? null : gettingThere}
              />
            </section>

            {/* Plan Your Visit Accordion */}
            <section id="plan-your-visit" className="scroll-mt-32">
              <SectionHeader title="Plan Your Visit" />
              <div className="flex flex-col gap-3">
                <AccordionItem
                    icon={Cloud}
                    title="Best Time to Visit"
                    content={bestTimeToVisit}
                />
                <AccordionItem
                    icon={Backpack}
                    title="Essential Gear"
                    content={essentialGear}
                />
              </div>
            </section>

          </div>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Weather Widget — compact in sidebar with climate tab */}
            {region.lat && region.lng && (
              <WeatherWidget 
                lat={parseFloat(String(region.lat))} 
                lng={parseFloat(String(region.lng))} 
                regionName={region.name}
                regionSlug={regionSlug}
              />
            )}
            
            {/* Local Businesses */}
            <div id="directory" className="scroll-mt-32 bg-white p-5 lg:p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-primary">Local Businesses</h3>
                <Link href="/directory" className="text-xs font-bold text-primary hover:underline">View all</Link>
              </div>
              <div className="flex flex-col gap-4">
                {operators.map((op) => (
                    <div key={op.id} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="relative size-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                            {op.logoUrl ? (
                                <Image alt={op.name} className="object-cover" src={op.logoUrl} fill sizes="40px" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                    {op.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-primary">{op.name}</p>
                            {op.googleRating != null && op.reviewCount != null && (
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs text-slate-500">{op.googleRating} ({op.reviewCount} reviews)</span>
                                </div>
                            )}
                        </div>
                        <Link href={`/directory/${op.slug}`} className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                            <ArrowRight className="w-4 h-4 text-slate-600" />
                        </Link>
                    </div>
                ))}
              </div>
            </div>

            {/* Advertise CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-primary text-white p-5 lg:p-6 shadow-md">
              <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
                <Users className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px]" />
              </div>
              <h4 className="text-lg font-bold mb-2 relative z-10">List Your Business</h4>
              <p className="text-sm text-blue-100 mb-4 relative z-10">Get discovered by visitors planning their {region.name} trip. Free listing available.</p>
              <ButtonLink href="/advertise" variant="outline" size="sm" fullWidth className="relative z-10">
                Learn More
              </ButtonLink>
            </div>
          </aside>
        </div>}
      </div>

      {/* CTA Section */}
      <div className="bg-accent-hover p-6 lg:p-10 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center gap-4 max-w-xl mx-auto">
          <h2 className="text-white text-xl lg:text-2xl font-black leading-tight tracking-tight">
            Ready to plan your {region.name} adventure?
          </h2>
          <p className="text-white/80 text-sm font-medium">Create a custom itinerary in minutes.</p>
          <ButtonLink href="/trip-planner" variant="secondary" size="lg" className="rounded-full shadow-lg hover:shadow-xl hover:scale-105">
            Start Planning
            <ArrowRight className="w-5 h-5" />
          </ButtonLink>
        </div>
      </div>
    </div>
    </>
  );
}

function AnchorTab({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center border-b-[3px] border-transparent pb-3 px-2 shrink-0 transition-colors text-slate-500 hover:text-primary hover:border-primary/40"
    >
      <p className="text-sm font-bold whitespace-nowrap">{label}</p>
    </a>
  );
}

function AccordionItem({ icon: Icon, title, content }: { icon: any; title: string; content: string }) {
  return (
    <details className="group bg-white rounded-xl overflow-hidden border border-slate-200">
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Icon className="text-primary w-5 h-5" />
          </div>
          <span className="font-bold text-primary">{title}</span>
        </div>
        <ChevronRight className="text-slate-400 transition-transform group-open:rotate-90 w-5 h-5" />
      </summary>
      <div className="px-4 pb-4 pt-0 text-slate-600 text-sm leading-relaxed pl-[60px]">
        {content}
      </div>
    </details>
  );
}
