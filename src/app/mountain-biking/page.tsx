import type { Metadata } from "next";
import Link from "next/link";
import { mountainBikingHub } from "@/data/activity-hubs/mountain-biking";
import { TrailCentreTable } from "@/components/mtb/TrailCentreTable";
import { GradingGuide } from "@/components/mtb/GradingGuide";
import { SeasonGuide } from "@/components/mtb/SeasonGuide";
import { ActivityCard } from "@/components/cards/activity-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { getActivities, getEvents, getActivityTypeBySlug, getItineraries, getPostsForSidebar } from "@/lib/queries";
import { 
  Mountain, 
  Map, 
  Star, 
  Calendar, 
  Bike, 
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Navigation,
  TrendingUp,
  MapPin,
  Compass,
  BookOpen,
  Home,
  Sparkles,
} from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: mountainBikingHub.metaTitle,
  description: mountainBikingHub.metaDescription,
  openGraph: {
    title: mountainBikingHub.metaTitle,
    description: mountainBikingHub.metaDescription,
    images: ["/images/activities/mountain-biking-hero.jpg"],
  },
};

export default async function MountainBikingHubPage() {
  // Fetch mountain biking activities from DB
  const activityType = await getActivityTypeBySlug("mountain-biking");
  const activities = activityType 
    ? await getActivities({ activityTypeId: activityType.id, limit: 12 })
    : [];

  // Fetch MTB-related events
  const allMtbTypes = ["MTB Enduro", "MTB Downhill", "Cycling", "Sportive"];
  const mtbEvents = await getEvents({ limit: 50 });
  const events = mtbEvents.filter(e => 
    allMtbTypes.some(t => e.event.type?.includes(t)) || 
    e.event.name?.toLowerCase().includes("mtb") || 
    e.event.name?.toLowerCase().includes("bike") ||
    e.event.name?.toLowerCase().includes("enduro")
  ).slice(0, 6);

  // Fetch related itineraries
  const allItineraries = await getItineraries({ limit: 50 });
  const relatedItineraries = allItineraries.filter(row => 
    row.itinerary.title?.toLowerCase().includes("bike") ||
    row.itinerary.title?.toLowerCase().includes("mtb") ||
    row.itinerary.title?.toLowerCase().includes("cycling") ||
    row.itinerary.description?.toLowerCase().includes("mountain biking")
  ).slice(0, 4);

  // Fetch related blog posts
  const relatedPosts = activityType 
    ? await getPostsForSidebar({ activityTypeId: activityType.id, limit: 4 })
    : [];

  // Prepare map markers for trail centres
  const mapMarkers = mountainBikingHub.trailCentres.map((centre) => ({
    id: centre.slug,
    lat: centre.lat,
    lng: centre.lng,
    title: centre.name,
    type: "activity" as const,
    link: centre.website,
    subtitle: centre.location,
  }));

  // JSON-LD structured data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Mountain Biking in Wales", url: "/mountain-biking" },
  ]);

  const destinationSchema = createTouristDestinationSchema(
    {
      name: mountainBikingHub.title,
      description: mountainBikingHub.metaDescription,
      slug: "mountain-biking",
    },
    {
      imageUrl: "/images/activities/mountain-biking-hero.jpg",
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
          style={{ backgroundImage: "url('/images/activities/mountain-biking-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Bike className="h-4 w-4" />
            The Complete MTB Guide
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {mountainBikingHub.title}
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            {mountainBikingHub.strapline}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {Object.entries(mountainBikingHub.stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-white/80 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>

          <a
            href="#trail-centres"
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
          <li className="text-primary font-medium">Mountain Biking in Wales</li>
        </ol>
      </nav>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-4xl mx-auto">
          {mountainBikingHub.introduction.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Trail Centre League Table */}
      <section id="trail-centres" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Map className="h-4 w-4" />
              Trail Centre League Table
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Wales's Best Trail Centres
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compare facilities, grades, and ratings to find the perfect centre for your level
            </p>
          </div>

          <TrailCentreTable centres={mountainBikingHub.trailCentres} />
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Navigation className="h-4 w-4" />
              Trail Centre Map
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Find Trail Centres Near You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click markers to see details and get directions
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
            <RegionMap
              markers={mapMarkers}
              center={[52.5, -3.5]}
              zoom={8}
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
              <Mountain className="h-4 w-4" />
              Regions of Wales
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Explore by Region
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each region offers a unique riding experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mountainBikingHub.regions.map((region) => (
              <Link
                key={region.slug}
                href={`/${region.slug}/things-to-do/mountain-biking`}
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
              Trail Grades Explained
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Understanding Trail Grades
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Know before you go — here's what each grade means
            </p>
          </div>

          <GradingGuide grades={mountainBikingHub.gradingGuide} />
        </div>
      </section>

      {/* Season Guide */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Calendar className="h-4 w-4" />
              Best Time to Ride
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              When to Visit
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your trip around the seasons for the best conditions
            </p>
          </div>

          <SeasonGuide seasons={mountainBikingHub.seasonGuide} />
        </div>
      </section>

      {/* Beginner's Guide Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
            <p className="text-gray-600">
              New to mountain biking?{" "}
              <Link href="/guides/getting-started-mountain-biking" className="text-primary font-medium hover:text-accent-hover">
                Check our getting started guide →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Book Experiences */}
      {activities.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Book Mountain Biking Experiences
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Guided rides, skills courses, and bike hire from local operators
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
                href="/activities/mountain-biking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold"
              >
                Browse all mountain biking experiences
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
                MTB Races & Events
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
                MTB Trip Itineraries
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Multi-day biking adventures through Wales
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
                MTB Stories & Guides
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
              Combine Biking With...
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Make the most of your Welsh adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/hiking" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🥾</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Hiking</h3>
              <p className="text-sm text-gray-600">Same mountains, different pace — explore on foot</p>
            </Link>
            <Link href="/climbing" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🧗</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Rock Climbing</h3>
              <p className="text-sm text-gray-600">Go vertical — Snowdonia has world-class crags</p>
            </Link>
            <Link href="/surfing" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🏄</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Surfing</h3>
              <p className="text-sm text-gray-600">Rest your legs and catch waves on the Welsh coast</p>
            </Link>
            <Link href="/wild-swimming" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🏊</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Wild Swimming</h3>
              <p className="text-sm text-gray-600">Cool off in mountain lakes after a trail session</p>
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
              Biker-Friendly Accommodation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find places to stay near Wales&apos;s best trail centres
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
                Stay near Coed y Brenin, Antur Stiniog, and Dyfi Bike Park
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
                Base yourself for BikePark Wales — the UK&apos;s biggest uplift park
              </p>
              <span className="text-sm text-accent-hover font-semibold flex items-center gap-1">
                Browse stays <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              href="/accommodation?region=south-wales"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover">
                South Wales
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Stay near Afan Forest Park and Cwmcarn for legendary trail riding
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
            {mountainBikingHub.faqs.map((faq, i) => (
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
