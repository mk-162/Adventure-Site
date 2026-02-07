import type { Metadata } from "next";
import Link from "next/link";
import { coasteeringHub } from "@/data/activity-hubs/coasteering";
import { CoasteeringSpotCards } from "@/components/coasteering/CoasteeringSpotCard";
import { ActivityCard } from "@/components/cards/activity-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { QuickAnswerBox, HubSidebar } from "@/components/activity-hub";
import { getActivities, getEvents, getActivityTypeBySlug, getItineraries, getPostsForSidebar } from "@/lib/queries";
import { 
  Waves, 
  Map, 
  Star, 
  Calendar, 
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Navigation,
  MapPin,
  Shield,
  AlertTriangle,
  Clock,
  Users,
  Thermometer,
  CheckCircle,
  ExternalLink,
  Compass,
  BookOpen,
  Home,
  Sparkles,
  PoundSterling,
  Gauge,
} from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: coasteeringHub.metaTitle,
  description: coasteeringHub.metaDescription,
  alternates: {
    canonical: "https://adventurewales.co.uk/coasteering",
  },
  openGraph: {
    title: coasteeringHub.metaTitle,
    description: coasteeringHub.metaDescription,
    images: ["/images/activities/coasteering-hero.jpg"],
  },
};

// Season config for visual styling
const seasonConfig = {
  spring: { name: "Spring", color: "from-green-50 to-green-100", borderColor: "border-green-200", iconColor: "text-green-600" },
  summer: { name: "Summer", color: "from-yellow-50 to-yellow-100", borderColor: "border-yellow-200", iconColor: "text-yellow-600" },
  autumn: { name: "Autumn", color: "from-orange-50 to-orange-100", borderColor: "border-orange-200", iconColor: "text-orange-600" },
  winter: { name: "Winter", color: "from-blue-50 to-blue-100", borderColor: "border-blue-200", iconColor: "text-blue-600" },
};

export default async function CoasteeringHubPage() {
  // Fetch coasteering activities from DB
  const activityType = await getActivityTypeBySlug("coasteering");
  const activities = activityType 
    ? await getActivities({ activityTypeId: activityType.id, limit: 12 })
    : [];

  // Fetch related events
  const allTypes = ["Coasteering", "Adventure", "Watersports"];
  const { events: allEvents } = await getEvents({ limit: 50 });
  const events = allEvents.filter(e => 
    allTypes.some(t => e.event.type?.includes(t)) || 
    e.event.name?.toLowerCase().includes("coasteer")
  ).slice(0, 6);

  // Fetch related itineraries
  const allItineraries = await getItineraries({ limit: 50 });
  const relatedItineraries = allItineraries.filter(row => 
    row.itinerary.title?.toLowerCase().includes("coasteer") ||
    row.itinerary.title?.toLowerCase().includes("adventure") ||
    row.itinerary.title?.toLowerCase().includes("pembrokeshire") ||
    row.itinerary.description?.toLowerCase().includes("coasteering")
  ).slice(0, 4);

  // Fetch related blog posts
  const relatedPosts = activityType 
    ? await getPostsForSidebar({ activityTypeId: activityType.id, limit: 4 })
    : [];

  // Prepare map markers
  const mapMarkers = coasteeringHub.coasteeringSpots.map((spot) => ({
    id: spot.slug,
    lat: spot.lat,
    lng: spot.lng,
    title: spot.name,
    type: "activity" as const,
    subtitle: spot.region,
  }));

  // JSON-LD structured data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Coasteering in Wales", url: "/coasteering" },
  ]);

  const destinationSchema = createTouristDestinationSchema(
    {
      name: coasteeringHub.title,
      description: coasteeringHub.metaDescription,
      slug: "coasteering",
    },
    {
      imageUrl: "/images/activities/coasteering-hero.jpg",
    }
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={destinationSchema} />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/activities/coasteering-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Waves className="h-4 w-4" />
            Born in Wales
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {coasteeringHub.title}
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            {coasteeringHub.strapline}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {Object.entries(coasteeringHub.stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-white/80 capitalize">
                  {key === "yearInvented" ? "Year Invented" : 
                   key === "coastlineMiles" ? "Miles of Coast" :
                   key === "operators" ? "Operators" :
                   key === "blueFlag" ? "Blue Flag Beaches" :
                   key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>

          <a
            href="#locations"
            className="inline-flex items-center gap-2 bg-accent-hover hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Find Your Adventure
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>

        {/* Quick Answer Box */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Best Time</span>
                </div>
                <div className="font-bold text-gray-900">May-Sep</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <PoundSterling className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Price</span>
                </div>
                <div className="font-bold text-gray-900">£45-75</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Difficulty</span>
                </div>
                <div className="font-bold text-gray-900">Moderate</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Duration</span>
                </div>
                <div className="font-bold text-gray-900">2-3 hours</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Best For</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">Adventurers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for quick answer box */}
      <div className="h-20 md:h-16" />

      {/* 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary font-medium">Coasteering in Wales</li>
          </ol>
        </nav>

        <div className="flex gap-8 lg:gap-12">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Quick Answer Box - Where Should I Go? */}
            <div className="mb-10">
              <QuickAnswerBox
                bestForBeginners={{
                  label: "Best for Beginners",
                  venue: "Abereiddy (Blue Lagoon)",
                  link: "/pembrokeshire/coasteering",
                  reason: "Sheltered, gradual jumps, the birthplace of coasteering",
                }}
                bestOverall={{
                  label: "Best Overall",
                  venue: "St Davids Peninsula",
                  link: "/pembrokeshire/coasteering",
                  reason: "Dramatic cliffs, sea caves, wildlife encounters",
                }}
                bestValue={{
                  label: "Best Value",
                  venue: "Rhossili, Gower",
                  link: "/gower/coasteering",
                  reason: "Spectacular scenery, multiple operators, good facilities",
                }}
                bestForFamilies={{
                  label: "Best for Families",
                  venue: "Three Cliffs Bay",
                  link: "/gower/coasteering",
                  reason: "Shorter sessions, sheltered spots, seal sightings",
                }}
                bestForExperts={{
                  label: "Best for Experts",
                  venue: "Stackpole",
                  link: "/pembrokeshire/coasteering",
                  reason: "High jumps, sea arches, challenging swims",
                }}
              />
            </div>

            {/* Introduction */}
            <section className="mb-12" id="overview">
              <div className="prose prose-lg max-w-none">
                {coasteeringHub.introduction.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <HubSidebar
            activityType="coasteering"
            navItems={[
              { id: "overview", label: "Overview" },
              { id: "locations", label: "Locations" },
              { id: "map", label: "Map" },
              { id: "regions", label: "By Region" },
              { id: "seasons", label: "When to Go" },
              { id: "safety", label: "Safety" },
              { id: "operators", label: "Operators" },
              { id: "faqs", label: "FAQs" },
            ]}
            primaryCTA={{
              label: "Find Locations",
              href: "#locations",
              variant: "accent",
            }}
            secondaryCTA={{
              label: "Book Coasteering",
              href: "/coasteering",
            }}
            weather={{
              temp: 15,
              condition: "sunny",
              wind: 10,
              location: "Pembrokeshire",
            }}
          />
        </div>
      </div>

      {/* What to Expect */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              What to Expect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know before your first coasteering session
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-primary mb-2">Duration</h3>
              <p className="text-gray-700">{coasteeringHub.whatToExpect.duration}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-primary mb-2">Group Size</h3>
              <p className="text-gray-700">{coasteeringHub.whatToExpect.groupSize}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-primary mb-2">Gear Provided</h3>
              <p className="text-gray-700">{coasteeringHub.whatToExpect.includedGear.join(", ")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-primary mb-4">Activities Included</h3>
              <div className="space-y-3">
                {coasteeringHub.whatToExpect.activities.map((activity) => (
                  <div key={activity.name}>
                    <div className="font-medium text-gray-800">{activity.name}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-primary mb-4">What to Bring</h3>
              <ul className="space-y-2">
                {coasteeringHub.whatToExpect.toBring.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coasteering Locations */}
      <section id="locations" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Map className="h-4 w-4" />
              Coasteering Spots
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Where to Go Coasteering
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From the birthplace in Pembrokeshire to dramatic Gower cliffs and crystal-clear Anglesey waters
            </p>
          </div>

          <CoasteeringSpotCards spots={coasteeringHub.coasteeringSpots} />
        </div>
      </section>

      {/* Interactive Map */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Navigation className="h-4 w-4" />
              Location Map
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Find Coasteering Near You
            </h2>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
            <RegionMap
              markers={mapMarkers}
              center={[52.0, -4.5]}
              zoom={7}
              height="500px"
            />
          </div>
        </div>
      </section>

      {/* Regional Breakdown */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Explore by Region
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coasteeringHub.regions.map((region) => (
              <Link
                key={region.slug}
                href={`/${region.slug}/coasteering`}
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

      {/* Season Guide */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Calendar className="h-4 w-4" />
              Best Time to Go
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Seasonal Guide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(coasteeringHub.seasonGuide) as Array<keyof typeof coasteeringHub.seasonGuide>).map((season) => {
              const data = coasteeringHub.seasonGuide[season];
              const config = seasonConfig[season];

              return (
                <div
                  key={season}
                  className={`bg-gradient-to-br ${config.color} rounded-2xl border-2 ${config.borderColor} p-6 shadow-sm`}
                >
                  <h3 className="text-2xl font-bold text-primary mb-1">
                    {config.name}
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    {data.months}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < data.rating ? `${config.iconColor} fill-current` : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="bg-white/60 rounded-lg p-2 mb-3 flex items-center gap-2">
                    <Thermometer className={`h-4 w-4 ${config.iconColor}`} />
                    <span className="text-sm font-medium text-gray-700">{data.waterTemp}</span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {data.conditions}
                  </p>

                  <div className={`bg-white/80 rounded-lg p-3 border ${config.borderColor}`}>
                    <p className="text-xs text-gray-700">
                      💡 {data.tip}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Guide */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Shield className="h-4 w-4" />
              Safety First
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Safety & Requirements
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-primary mb-4">Requirements</h3>
              <ul className="space-y-2">
                {coasteeringHub.safetyGuide.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-primary mb-4">Safety Measures</h3>
              <ul className="space-y-2">
                {coasteeringHub.safetyGuide.safetyMeasures.map((measure, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    {measure}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 bg-amber-50 rounded-2xl p-6 border-2 border-amber-100">
              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Important Safety Note
              </h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                {coasteeringHub.safetyGuide.risks}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Operators */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Trusted Operators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Licensed, experienced, and ready to show you the coast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coasteeringHub.operators.map((operator) => (
              <div
                key={operator.name}
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-primary">
                      {operator.name}
                    </h3>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {operator.location}
                    </div>
                  </div>
                  {operator.established && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      Est. {operator.established}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {operator.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-accent-hover">
                      From {operator.priceFrom}
                    </div>
                    <div className="text-xs text-gray-500">{operator.duration}</div>
                  </div>
                  <a
                    href={operator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent-hover font-medium"
                  >
                    Book <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Experiences */}
      {activities.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Book Coasteering Experiences
              </h2>
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
                href="/coasteering"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold"
              >
                Browse all coasteering experiences
                <ArrowRight className="h-5 w-5" />
              </Link>
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
                Adventure Trip Itineraries
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Multi-day trips featuring coasteering and coastal adventures
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
                Coasteering Stories & Tips
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
              Combine Coasteering With...
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Make the most of your Welsh coastal adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/surfing" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🏄</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Surfing</h3>
              <p className="text-sm text-gray-600">Catch waves at nearby beaches — same coastline, different thrill</p>
            </Link>
            <Link href="/kayaking" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🛶</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Sea Kayaking</h3>
              <p className="text-sm text-gray-600">Explore the same caves and cliffs from a kayak</p>
            </Link>
            <Link href="/hiking" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🥾</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Coastal Walking</h3>
              <p className="text-sm text-gray-600">Walk the Pembrokeshire Coast Path between coasteering sessions</p>
            </Link>
            <Link href="/wild-swimming" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🏊</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Wild Swimming</h3>
              <p className="text-sm text-gray-600">Take the jumping skills inland to rivers and lakes</p>
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
              Adventure-Friendly Accommodation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find places to stay near Wales&apos;s best coasteering spots
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/accommodation?region=pembrokeshire"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover">
                Pembrokeshire
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Stay near St Davids, Abereiddy, and Stackpole — the heart of coasteering
              </p>
              <span className="text-sm text-accent-hover font-semibold flex items-center gap-1">
                Browse stays <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              href="/accommodation?region=gower"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover">
                Gower Peninsula
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Base yourself for Rhossili, Three Cliffs Bay, and seal encounters
              </p>
              <span className="text-sm text-accent-hover font-semibold flex items-center gap-1">
                Browse stays <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              href="/accommodation?region=anglesey"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"
            >
              <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover">
                Anglesey
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Stay on Holy Island for Rhoscolyn&apos;s crystal-clear waters
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
            {coasteeringHub.faqs.map((faq, i) => (
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
