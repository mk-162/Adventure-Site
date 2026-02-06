import type { Metadata } from "next";
import Link from "next/link";
import { hikingHub } from "@/data/activity-hubs/hiking";
import { TrailTable } from "@/components/hiking/TrailTable";
import { HikingGradingGuide } from "@/components/hiking/HikingGradingGuide";
import { HikingSeasonGuide } from "@/components/hiking/HikingSeasonGuide";
import { ActivityCard } from "@/components/cards/activity-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { getActivities, getEvents, getActivityTypeBySlug, getItineraries, getPostsForSidebar } from "@/lib/queries";
import { 
  Mountain, 
  Map, 
  Star, 
  Calendar, 
  Backpack,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Navigation,
  TrendingUp,
  MapPin,
  Shield,
  AlertTriangle,
  Footprints,
  Route,
  Compass,
  BookOpen,
  Home,
  Sparkles,
} from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: hikingHub.metaTitle,
  description: hikingHub.metaDescription,
  openGraph: {
    title: hikingHub.metaTitle,
    description: hikingHub.metaDescription,
    images: ["/images/activities/hiking-hero.jpg"],
  },
};

export default async function HikingHubPage() {
  // Fetch hiking activities from DB
  const activityType = await getActivityTypeBySlug("hiking");
  const activities = activityType 
    ? await getActivities({ activityTypeId: activityType.id, limit: 12 })
    : [];

  // Fetch hiking-related events
  const allHikingTypes = ["Walking", "Hiking", "Trail", "Mountain", "Fell"];
  const hikingEvents = await getEvents({ limit: 50 });
  const events = hikingEvents.filter(e => 
    allHikingTypes.some(t => e.event.type?.includes(t)) || 
    e.event.name?.toLowerCase().includes("walk") ||
    e.event.name?.toLowerCase().includes("hike") ||
    e.event.name?.toLowerCase().includes("trail")
  ).slice(0, 6);

  // Fetch related itineraries
  const allItineraries = await getItineraries({ limit: 50 });
  const relatedItineraries = allItineraries.filter(row => 
    row.itinerary.title?.toLowerCase().includes("hik") ||
    row.itinerary.title?.toLowerCase().includes("walk") ||
    row.itinerary.title?.toLowerCase().includes("mountain") ||
    row.itinerary.title?.toLowerCase().includes("snowdon") ||
    row.itinerary.description?.toLowerCase().includes("hiking")
  ).slice(0, 4);

  // Fetch related blog posts
  const relatedPosts = activityType 
    ? await getPostsForSidebar({ activityTypeId: activityType.id, limit: 4 })
    : [];

  // Prepare map markers for trails
  const mapMarkers = hikingHub.featuredTrails.map((trail) => ({
    id: trail.slug,
    lat: trail.lat,
    lng: trail.lng,
    title: trail.name,
    type: "activity" as const,
    subtitle: `${trail.difficulty} • ${trail.distance}`,
  }));

  // JSON-LD structured data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Hiking in Wales", url: "/hiking" },
  ]);

  const destinationSchema = createTouristDestinationSchema(
    {
      name: hikingHub.title,
      description: hikingHub.metaDescription,
      slug: "hiking",
    },
    {
      imageUrl: "/images/activities/hiking-hero.jpg",
    }
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={destinationSchema} />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/activities/hiking-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Mountain className="h-4 w-4" />
            The Complete Walking Guide
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {hikingHub.title}
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            {hikingHub.strapline}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {Object.entries(hikingHub.stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-white/80 capitalize">
                  {key === "nationalParks" ? "National Parks" : 
                   key === "nationalTrails" ? "National Trails" :
                   key === "coastPath" ? "Coast Path" :
                   key === "mountains" ? "Mountains" :
                   key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>

          <a
            href="#trails"
            className="inline-flex items-center gap-2 bg-accent-hover hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Find Your Trail
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary font-medium">Hiking in Wales</li>
        </ol>
      </nav>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-4xl mx-auto">
          {hikingHub.introduction.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Featured Trails */}
      <section id="trails" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Footprints className="h-4 w-4" />
              Trail Guide
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Wales's Best Hiking Trails
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From gentle walks to challenging scrambles — filter by difficulty to find your perfect route
            </p>
          </div>

          <TrailTable trails={hikingHub.featuredTrails} />
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Navigation className="h-4 w-4" />
              Trail Map
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Find Trails Near You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click markers to see trail details
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
            <RegionMap
              markers={mapMarkers}
              center={[52.3, -3.6]}
              zoom={7}
              height="500px"
            />
          </div>
        </div>
      </section>

      {/* Regional Breakdown */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Map className="h-4 w-4" />
              Walking Regions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Explore by Region
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each region offers a unique walking experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hikingHub.regions.map((region) => (
              <Link
                key={region.slug}
                href={`/${region.slug}/things-to-do/hiking`}
                className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-accent-hover transition-colors">
                  {region.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 italic">
                  {region.tagline}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {region.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  {region.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Star className="h-4 w-4 text-accent-hover flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Top Trail:</span> {region.topTrail}
                </div>

                <div className="flex items-center gap-2 text-accent-hover font-semibold group-hover:gap-3 transition-all">
                  Explore {region.name}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trail Grading Guide */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <TrendingUp className="h-4 w-4" />
              Difficulty Explained
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Trail Difficulty Grades
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Know before you go — choose a grade that matches your experience
            </p>
          </div>

          <HikingGradingGuide grades={hikingHub.gradingGuide} />
        </div>
      </section>

      {/* Season Guide */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Calendar className="h-4 w-4" />
              Best Time to Walk
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              When to Visit
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your trip around the seasons for the best conditions
            </p>
          </div>

          <HikingSeasonGuide seasons={hikingHub.seasonGuide} />
        </div>
      </section>

      {/* Safety Guide */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Shield className="h-4 w-4" />
              Stay Safe
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Mountain Safety Essentials
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent-hover" />
                Essential Safety Rules
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hikingHub.safetyGuide.essentials.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-accent-hover flex-shrink-0 mt-2" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-100">
                <h4 className="font-bold text-red-800 mb-2">🆘 Emergencies</h4>
                <p className="text-sm text-red-700 leading-relaxed">
                  {hikingHub.safetyGuide.emergencies}
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">⛰️ Mountain Rescue</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {hikingHub.safetyGuide.mountainRescue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gear Guide */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Backpack className="h-4 w-4" />
              Gear Guide
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              What to Pack
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Essential kit for Welsh mountain walking
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 mb-8">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Essential Kit (All Walks)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hikingHub.gearGuide.essentialKit.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-hover flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
                <h4 className="font-bold text-blue-800 mb-3">❄️ Winter Additions</h4>
                <div className="space-y-2">
                  {hikingHub.gearGuide.winterAdditions.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-blue-700 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-100">
                <h4 className="font-bold text-amber-800 mb-3">👟 Footwear Guide</h4>
                <div className="space-y-3">
                  {hikingHub.gearGuide.footwearGuide.map((fw) => (
                    <div key={fw.type}>
                      <div className="font-medium text-amber-800 text-sm">{fw.type}</div>
                      <div className="text-xs text-amber-700">✓ {fw.bestFor}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* National Trails */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Route className="h-4 w-4" />
              Long-Distance Trails
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              National Trails in Wales
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hikingHub.nationalTrails.map((trail) => (
              <div
                key={trail.name}
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold text-primary mb-2">
                  {trail.name}
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-accent-hover font-semibold">{trail.distance}</span>
                  <span className="text-sm text-gray-500">{trail.duration}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {trail.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Experiences */}
      {activities.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Book Guided Walks
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Expert-led walks, navigation courses, and mountain experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((row) => (
                <ActivityCard
                  key={row.activity.id}
                  activity={row.activity}
                  region={row.region}
                  operator={row.operator}
                  activityType={activityType ?? row.activityType}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/activities/type/hiking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold"
              >
                Browse all walking experiences
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
                <Calendar className="h-4 w-4" />
                Upcoming Events
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Walking Events & Festivals
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((row) => (
                <Link
                  key={row.event.id}
                  href={`/events/${row.event.slug}`}
                  className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover/30 transition-all block"
                >
                  <div className="text-sm text-accent-hover font-semibold mb-2">
                    {row.event.monthTypical || "Date TBC"}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {row.event.name}
                  </h3>
                  {row.event.location && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {row.event.location}
                    </p>
                  )}
                  {row.event.type && (
                    <span className="inline-block mt-2 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {row.event.type}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Itineraries */}
      {relatedItineraries.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
                <Compass className="h-4 w-4" />
                Trip Ideas
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Walking Trip Itineraries
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Multi-day adventures featuring the best of Welsh walking
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItineraries.map((row) => (
                <Link
                  key={row.itinerary.id}
                  href={`/itineraries/${row.itinerary.slug}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"
                >
                  <div className="text-sm text-accent-hover font-semibold mb-2">
                    {row.itinerary.durationDays} days • {row.itinerary.difficulty || "All levels"}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent-hover transition-colors">
                    {row.itinerary.title}
                  </h3>
                  {row.itinerary.tagline && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {row.itinerary.tagline}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/itineraries"
                className="inline-flex items-center gap-2 text-primary hover:text-accent-hover font-semibold"
              >
                View all itineraries <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related Blog Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
                <BookOpen className="h-4 w-4" />
                From the Journal
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Walking Stories & Guides
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/journal/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 hover:shadow-lg transition-all"
                >
                  {post.heroImage && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img 
                        src={post.heroImage} 
                        alt={post.title || ""} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-primary group-hover:text-accent-hover transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 text-primary hover:text-accent-hover font-semibold"
              >
                Read more articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Combine Your Adventure */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Multi-Activity Adventures
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Combine Hiking With...
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Make the most of your Welsh adventure with these perfect pairings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/mountain-biking" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🚵</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Mountain Biking</h3>
              <p className="text-sm text-gray-600">Same mountains, different wheels — trail centres throughout Wales</p>
            </Link>
            <Link href="/climbing" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🧗</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Rock Climbing</h3>
              <p className="text-sm text-gray-600">Go vertical — Snowdonia has world-class crags for all abilities</p>
            </Link>
            <Link href="/wild-swimming" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🏊</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Wild Swimming</h3>
              <p className="text-sm text-gray-600">Cool off in mountain lakes after a summit push</p>
            </Link>
            <Link href="/coasteering" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🪨</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Coasteering</h3>
              <p className="text-sm text-gray-600">Take your scrambling skills to the coast for cliff jumping and caves</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Accommodation Links */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Home className="h-4 w-4" />
              Where to Stay
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Hiker-Friendly Accommodation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find places to stay near Wales&apos;s best walking trails
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/accommodation?region=snowdonia"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover">
                Snowdonia
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Stay near Snowdon, Tryfan, and the Glyders
              </p>
              <span className="text-sm text-accent-hover font-semibold flex items-center gap-1">
                Browse stays <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              href="/accommodation?region=brecon-beacons"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover">
                Brecon Beacons
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Base yourself for Pen y Fan, waterfalls, and Black Mountains
              </p>
              <span className="text-sm text-accent-hover font-semibold flex items-center gap-1">
                Browse stays <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              href="/accommodation?region=pembrokeshire"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover">
                Pembrokeshire
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Walk the Coast Path from St Davids, Tenby, or Fishguard
              </p>
              <span className="text-sm text-accent-hover font-semibold flex items-center gap-1">
                Browse stays <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <MessageCircle className="h-4 w-4" />
              Common Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {hikingHub.faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-semibold text-primary pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
