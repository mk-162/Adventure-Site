import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getRegionWithStats, getActivitiesByRegion, getAccommodationByRegion, getOperators, getRegionEntitiesForMap } from "@/lib/queries";
import type { MapMarker } from "@/components/ui/MapView";
import { ActivityCard } from "@/components/cards/activity-card";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { ScenicGallery } from "@/components/regions/scenic-gallery";
import { 
  Map, 
  Heart, 
  Share, 
  ChevronRight, 
  Footprints, 
  Users, 
  Home, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Bus, 
  Cloud, 
  Backpack, 
  Plane, 
} from "lucide-react";
import { 
  JsonLd, 
  createTouristDestinationSchema, 
  createBreadcrumbSchema 
} from "@/components/seo/JsonLd";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { ClimateChart } from "@/components/weather/ClimateChart";
import { ActivitySeasonGuide } from "@/components/weather/ActivitySeasonGuide";
import { ThisWeekendWidget } from "@/components/events/ThisWeekendWidget";

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
  const region = await getRegionWithStats(regionSlug);

  if (!region) {
    notFound();
  }

  const [activities, accommodation, operators, mapEntities] = await Promise.all([
    getActivitiesByRegion(regionSlug, 6),
    getAccommodationByRegion(regionSlug, 4),
    getOperators({ limit: 3 }),
    getRegionEntitiesForMap(region.id),
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
          <div className="absolute inset-0 bg-gray-900">
            {/* Use local hero image */}
            <img 
              alt={region.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={`/images/regions/${regionSlug}-hero.jpg`}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          <div className="absolute top-4 right-4 flex gap-2 lg:hidden z-20">
             {/* Mobile Actions - placeholders */}
            <button className="text-white flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="text-white flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
              <Share className="w-5 h-5" />
            </button>
          </div>

          <div className="relative z-10 flex flex-col gap-4 lg:gap-6 p-6 lg:p-12 text-white h-full justify-end">
             {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm font-medium text-gray-200">
              <Link href="/" className="hover:text-white transition-colors">Wales</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{region.name}</span>
            </div>

             {/* Heading */}
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tight mb-2 lg:mb-3">
                {region.name}
              </h1>
              <p className="text-base lg:text-xl text-gray-200 font-medium max-w-xl line-clamp-3">
                {introText.split('.').slice(0, 2).join('.') + '.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <StatCard label="Activities" value={region.stats.activities} icon={Footprints} />
          <StatCard label="Operators" value={region.stats.operators} icon={Users} />
          <StatCard label="Stays" value={region.stats.accommodation} icon={Home} />
          <StatCard label="Events" value={region.stats.events} icon={Calendar} />
        </div>

        {/* Sticky Tabs */}
        <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-md pt-2 pb-3 lg:pb-4 mb-4 lg:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex overflow-x-auto border-b border-gray-200 gap-4 lg:gap-8 no-scrollbar">
            <TabLink href={`/${regionSlug}`} label="Overview" active />
            <TabLink href={`/${regionSlug}/things-to-do`} label="Things to Do" />
            <TabLink href={`/${regionSlug}/where-to-stay`} label="Where to Stay" />
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">

            {/* Top Experiences Grid — prominent at top */}
            {activities.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-4 lg:mb-5">
                  <h3 className="text-lg lg:text-xl font-bold text-[#1e3a4c]">Top Experiences</h3>
                  <Link href={`/${regionSlug}/things-to-do`} className="text-[#1e3a4c] text-sm font-bold hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  {activities.slice(0, 4).map((item) => (
                      <ActivityCard
                          key={item.activity.id}
                          activity={item.activity}
                          region={item.region}
                          operator={item.operator}
                          hideOperator={true}
                      />
                  ))}
                </div>
              </section>
            )}

            {/* Intro */}
            <section>
              <h3 className="text-lg lg:text-xl font-bold mb-3 text-[#1e3a4c]">Welcome to {region.name}</h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                 {introText}
              </p>
              
              {proTips.length > 0 && (
                <div className="flex items-start gap-3 bg-[#1e3a4c]/5 p-4 rounded-xl border-l-4 border-[#1e3a4c] mt-4">
                  <CheckCircle className="w-5 h-5 text-[#1e3a4c] shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
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
              <section>
                <ThisWeekendWidget
                  events={upcomingEvents}
                  title={`Events in ${region.name}`}
                  subtitle="Coming Up"
                  viewAllLink={`/calendar?region=${regionSlug}`}
                />
              </section>
            )}

            {/* (Top Experiences moved to top of main content) */}

            {/* Accommodation Grid */}
            {accommodation.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-4 lg:mb-5">
                  <h3 className="text-lg lg:text-xl font-bold text-[#1e3a4c]">Where to Stay</h3>
                  <Link href={`/${regionSlug}/where-to-stay`} className="text-[#1e3a4c] text-sm font-bold hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  {accommodation.slice(0, 2).map((item) => (
                      <AccommodationCard
                          key={item.accommodation.id}
                          accommodation={item.accommodation}
                          region={item.region}
                      />
                  ))}
                </div>
              </section>
            )}

            {/* Interactive Map Section */}
            <section>
              <h3 className="text-lg lg:text-xl font-bold mb-4 text-[#1e3a4c]">Explore the Region</h3>
              <RegionMap
                markers={mapMarkers}
                center={region.lat && region.lng ? [parseFloat(String(region.lat)), parseFloat(String(region.lng))] : undefined}
                zoom={10}
                height="450px"
                className="shadow-md"
              />
              
              {/* Map Legend */}
              <div className="flex flex-wrap gap-3 lg:gap-4 mt-4 text-xs lg:text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white shadow-sm"></span>
                  Activities ({mapEntities.activities.length})
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white shadow-sm"></span>
                  Accommodation ({mapEntities.accommodation.length})
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#a855f7] border-2 border-white shadow-sm"></span>
                  Locations ({mapEntities.locations.length})
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#ef4444] border-2 border-white shadow-sm"></span>
                  Events ({mapEntities.events.length})
                </span>
              </div>
            </section>

            {/* Plan Your Visit Accordion */}
            <section>
              <h3 className="text-lg lg:text-xl font-bold mb-4 text-[#1e3a4c]">Plan Your Visit</h3>
              <div className="flex flex-col gap-3">
                <AccordionItem 
                    icon={Bus} 
                    title="Getting There" 
                    content={gettingThere} 
                />
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

            {/* Weather Widget — compact in sidebar */}
            {region.lat && region.lng && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <WeatherWidget 
                  lat={parseFloat(String(region.lat))} 
                  lng={parseFloat(String(region.lng))} 
                  regionName={region.name} 
                />
              </div>
            )}
            
            {/* Local Businesses */}
            <div className="bg-white p-5 lg:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#1e3a4c]">Local Businesses</h3>
                <Link href="/directory" className="text-xs font-bold text-[#1e3a4c] hover:underline">View all</Link>
              </div>
              <div className="flex flex-col gap-4">
                {operators.map((op) => (
                    <div key={op.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="size-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                            {op.logoUrl ? (
                                <img alt={op.name} className="w-full h-full object-cover" src={op.logoUrl} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#1e3a4c]/10 text-[#1e3a4c] font-bold">
                                    {op.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-[#1e3a4c]">{op.name}</p>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs text-gray-500">{op.googleRating || "5.0"} ({op.reviewCount || 100} reviews)</span>
                            </div>
                        </div>
                        <Link href={`/directory/${op.slug}`} className="size-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                        </Link>
                    </div>
                ))}
              </div>
            </div>

            {/* Advertise CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-[#1e3a4c] text-white p-5 lg:p-6 shadow-md">
              <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
                <Users className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px]" />
              </div>
              <h4 className="text-lg font-bold mb-2 relative z-10">List Your Business</h4>
              <p className="text-sm text-blue-100 mb-4 relative z-10">Get discovered by visitors planning their {region.name} trip. Free listing available.</p>
              <Link href="/advertise" className="block w-full bg-white text-[#1e3a4c] font-bold py-2.5 rounded-lg text-sm relative z-10 hover:bg-gray-100 transition-colors text-center">
                Learn More
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#f97316] p-6 lg:p-10 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col items-center gap-4 max-w-xl mx-auto">
          <h2 className="text-white text-xl lg:text-2xl font-black leading-tight tracking-tight">
            Ready to plan your {region.name} adventure?
          </h2>
          <p className="text-white/80 text-sm font-medium">Create a custom itinerary in minutes.</p>
          <button className="bg-[#1e3a4c] text-white text-sm lg:text-base font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
            Start Planning
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl p-4 lg:p-5 border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex justify-between items-start">
        <p className="text-gray-500 text-xs lg:text-sm font-medium">{label}</p>
        <Icon className="text-[#1e3a4c] group-hover:scale-110 transition-transform w-5 h-5 lg:w-6 lg:h-6" />
      </div>
      <p className="text-xl lg:text-2xl font-bold text-[#1e3a4c]">{value}</p>
    </div>
  );
}

function TabLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center border-b-[3px] pb-3 px-2 shrink-0 transition-colors ${
        active 
        ? "border-[#1e3a4c] text-[#1e3a4c]" 
        : "border-transparent text-gray-500 hover:text-[#1e3a4c]"
      }`}
    >
      <p className="text-sm font-bold whitespace-nowrap">{label}</p>
    </Link>
  );
}

function MapFilterPill({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50 text-[#1e3a4c]">
      {icon} {label}
    </span>
  );
}

function AccordionItem({ icon: Icon, title, content }: { icon: any; title: string; content: string }) {
  return (
    <details className="group bg-white rounded-xl overflow-hidden border border-gray-200">
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
        <div className="flex items-center gap-3">
          <div className="bg-[#1e3a4c]/10 p-2 rounded-lg">
            <Icon className="text-[#1e3a4c] w-5 h-5" />
          </div>
          <span className="font-bold text-[#1e3a4c]">{title}</span>
        </div>
        <ChevronRight className="text-gray-400 transition-transform group-open:rotate-90 w-5 h-5" />
      </summary>
      <div className="px-4 pb-4 pt-0 text-gray-600 text-sm leading-relaxed pl-[60px]">
        {content}
      </div>
    </details>
  );
}
