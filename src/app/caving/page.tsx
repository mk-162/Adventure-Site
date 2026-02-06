import type { Metadata } from "next";
import Link from "next/link";
import { cavingHub } from "@/data/activity-hubs/caving";
import { ShowCaveCard, AdventureCaveCard, OperatorCard, DifficultyGuide } from "@/components/caving";
import { SeasonGuide } from "@/components/mtb/SeasonGuide";
import { ActivityCard } from "@/components/cards/activity-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { QuickAnswerBox, HubSidebar } from "@/components/activity-hub";
import { getActivities, getActivityTypeBySlug, getItineraries, getAccommodationByRegion } from "@/lib/queries";
import {
  Mountain,
  Map,
  Star,
  Calendar,
  Layers,
  Backpack,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  Flashlight,
  Users,
  ShieldCheck,
  Droplets,
  CheckCircle,
  Lightbulb,
  MapPin,
  Home,
  Clock,
  PoundSterling,
  Gauge,
} from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: cavingHub.metaTitle,
  description: cavingHub.metaDescription,
  openGraph: {
    title: cavingHub.metaTitle,
    description: cavingHub.metaDescription,
    images: ["/images/activities/caving-hero.jpg"],
  },
};

export default async function CavingHubPage() {
  // Fetch caving activities from DB
  const activityType = await getActivityTypeBySlug("caving");
  const activities = activityType
    ? await getActivities({ activityTypeId: activityType.id, limit: 6 })
    : [];

  // Fetch related itineraries
  const allItineraries = await getItineraries({ limit: 50 });
  const relatedItineraries = allItineraries.filter((it) =>
    cavingHub.relatedItineraries.some(
      (slug) => it.itinerary.slug?.includes(slug) || it.itinerary.title?.toLowerCase().includes("adventure")
    )
  ).slice(0, 3);

  // Fetch Brecon Beacons accommodation
  const breconAccommodation = await getAccommodationByRegion("brecon-beacons", 4);

  // Prepare map markers for show caves and adventure caves
  const mapMarkers = [
    ...cavingHub.showCaves.map((cave) => ({
      id: cave.slug,
      lat: cave.lat,
      lng: cave.lng,
      title: cave.name,
      type: "activity" as const,
      link: cave.website,
      subtitle: `Show Cave • ${cave.location}`,
    })),
    ...cavingHub.adventureCaves
      .filter((cave) => cave.lat && cave.lng)
      .map((cave) => ({
        id: cave.slug,
        lat: cave.lat!,
        lng: cave.lng!,
        title: cave.name,
        type: "activity" as const,
        subtitle: `Adventure Cave • ${cave.difficulty}`,
      })),
  ];

  // JSON-LD structured data
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Caving in Wales", url: "/caving" },
  ]);

  const destinationSchema = createTouristDestinationSchema(
    {
      name: cavingHub.title,
      description: cavingHub.metaDescription,
      slug: "caving",
    },
    {
      imageUrl: "/images/activities/caving-hero.jpg",
    }
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={destinationSchema} />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background - dark gradient simulating cave */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-primary"
        />
        <div className="absolute inset-0 bg-[url('/images/textures/rock-texture.png')] opacity-20 mix-blend-overlay" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Flashlight className="h-4 w-4" />
            The Complete Underground Guide
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {cavingHub.title}
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            {cavingHub.strapline}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {Object.entries(cavingHub.stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-white/80 capitalize">
                  {key === "depthRecord"
                    ? "Depth Record"
                    : key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>

          <a
            href="#show-caves"
            className="inline-flex items-center gap-2 bg-accent-hover hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Explore Underground
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
                <div className="font-bold text-gray-900">Year-round</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <PoundSterling className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Price</span>
                </div>
                <div className="font-bold text-gray-900">£45-85</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Difficulty</span>
                </div>
                <div className="font-bold text-gray-900">All Levels</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Duration</span>
                </div>
                <div className="font-bold text-gray-900">2-6 hours</div>
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
            <li className="text-primary font-medium">Caving in Wales</li>
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
                  venue: "Dan yr Ogof Show Caves",
                  link: "/brecon-beacons/caving",
                  reason: "Lit walkways, no crawling, suitable for all ages",
                }}
                bestOverall={{
                  label: "Best Overall",
                  venue: "Porth yr Ogof",
                  link: "/brecon-beacons/caving",
                  reason: "Spectacular river cave, accessible adventure caving",
                }}
                bestValue={{
                  label: "Best Value",
                  venue: "National Showcaves Centre",
                  link: "/brecon-beacons/caving",
                  reason: "Multiple caves, dinosaur park included, family day out",
                }}
                bestForFamilies={{
                  label: "Best for Families",
                  venue: "Dan yr Ogof",
                  link: "/brecon-beacons/caving",
                  reason: "Three show caves, no experience needed, café on-site",
                }}
                bestForExperts={{
                  label: "Best for Experts",
                  venue: "Ogof Ffynnon Ddu",
                  link: "/brecon-beacons/caving",
                  reason: "Britain's deepest cave, 50km passages, club access only",
                }}
              />
            </div>

            {/* Introduction */}
            <section className="mb-12" id="overview">
              <div className="prose prose-lg max-w-none">
                {cavingHub.introduction.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <HubSidebar
            activityType="caving"
            navItems={[
              { id: "overview", label: "Overview" },
              { id: "show-caves", label: "Show Caves" },
              { id: "adventure-caves", label: "Adventure Caves" },
              { id: "map", label: "Cave Map" },
              { id: "operators", label: "Operators" },
              { id: "difficulty", label: "Difficulty Levels" },
              { id: "regions", label: "By Region" },
              { id: "seasons", label: "When to Go" },
              { id: "gear", label: "Gear Guide" },
              { id: "faqs", label: "FAQs" },
            ]}
            primaryCTA={{
              label: "Find Show Caves",
              href: "#show-caves",
              variant: "accent",
            }}
            secondaryCTA={{
              label: "Book Caving Trip",
              href: "/caving",
            }}
            weather={{
              temp: 10,
              condition: "cloudy",
              wind: 0,
              location: "Brecon Beacons",
            }}
          />
        </div>
      </div>

      {/* Show Caves Section */}
      <section id="show-caves" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Users className="h-4 w-4" />
              Family-Friendly
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Show Caves
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No experience needed — walk through spectacular underground worlds with lit paths and expert guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cavingHub.showCaves.map((cave) => (
              <ShowCaveCard key={cave.slug} cave={cave} />
            ))}
          </div>
        </div>
      </section>

      {/* Adventure Caves Section */}
      <section id="adventure-caves" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Flashlight className="h-4 w-4" />
              Wild Caving
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Adventure Caves
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Guided trips into wild cave systems — from beginner-friendly to expert expeditions
            </p>
          </div>

          {/* Filter by difficulty */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary mb-4">Beginner Caves</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {cavingHub.adventureCaves
                .filter((c) => c.difficulty === "beginner")
                .map((cave) => (
                  <AdventureCaveCard key={cave.slug} cave={cave} />
                ))}
            </div>

            <h3 className="text-lg font-semibold text-primary mb-4">Intermediate Caves</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {cavingHub.adventureCaves
                .filter((c) => c.difficulty === "intermediate")
                .map((cave) => (
                  <AdventureCaveCard key={cave.slug} cave={cave} />
                ))}
            </div>

            <h3 className="text-lg font-semibold text-primary mb-4">Advanced & Expert Caves</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cavingHub.adventureCaves
                .filter((c) => c.difficulty === "advanced" || c.difficulty === "expert")
                .map((cave) => (
                  <AdventureCaveCard key={cave.slug} cave={cave} />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cave Map */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Map className="h-4 w-4" />
              Cave Map
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Find Caves Near You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click markers to see cave details
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
            <RegionMap
              markers={mapMarkers}
              center={[51.85, -3.65]}
              zoom={9}
              height="500px"
            />
          </div>
        </div>
      </section>

      {/* Operators Section */}
      <section id="operators" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <ShieldCheck className="h-4 w-4" />
              Expert Guides
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Caving Operators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional guides who provide all equipment and keep you safe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cavingHub.operators
              .filter((op) => op.rating !== null)
              .slice(0, 9)
              .map((operator) => (
                <OperatorCard key={operator.slug} operator={operator} />
              ))}
          </div>

          {/* South Wales Caving Club callout */}
          <div className="mt-10 p-6 bg-primary/5 rounded-2xl border-2 border-primary/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Serious About Caving?
                </h3>
                <p className="text-gray-700">
                  The <strong>South Wales Caving Club</strong> manages access to Ogof Ffynnon Ddu (Britain&apos;s deepest cave) and offers training weekends for prospective members. Join a club to access caves that commercial operators can&apos;t reach.
                </p>
              </div>
              <a
                href="https://www.swcc.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold whitespace-nowrap"
              >
                Visit SWCC
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty Guide */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Layers className="h-4 w-4" />
              Difficulty Levels
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Understanding Cave Grades
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Know your level before you book — here&apos;s what each grade means
            </p>
          </div>

          <DifficultyGuide levels={cavingHub.difficultyGuide} />
        </div>
      </section>

      {/* Regional Breakdown */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Mountain className="h-4 w-4" />
              Explore by Region
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Caving Regions of Wales
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cavingHub.regions.map((region) => (
              <Link
                key={region.slug}
                href={`/${region.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent-hover transition-colors">
                  {region.name}
                </h3>

                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {region.description.slice(0, 150)}...
                </p>

                <div className="space-y-2 mb-4">
                  {region.keyFacts.slice(0, 3).map((fact, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Star className="h-4 w-4 text-accent-hover flex-shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Main caves
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {region.mainCaves.slice(0, 3).map((cave, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium"
                    >
                      {cave}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-accent-hover font-semibold group-hover:gap-3 transition-all">
                  Explore {region.name.split(" ")[0]}
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
              When to Go
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Best Time for Caving
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Underground temperature is constant at 10°C year-round — but surface conditions matter
            </p>
          </div>

          <SeasonGuide seasons={cavingHub.seasonGuide} />
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              <Lightbulb className="h-4 w-4" />
              First Time?
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              What to Expect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know before your first caving trip
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4">Before You Go</h3>
              <ul className="space-y-3">
                {cavingHub.whatToExpect.beforeYouGo.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4">During the Trip</h3>
              <ul className="space-y-3">
                {cavingHub.whatToExpect.duringTheTrip.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4">After the Trip</h3>
              <ul className="space-y-3">
                {cavingHub.whatToExpect.afterTheTrip.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-accent-hover flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
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
              What You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Operators provide technical gear — here&apos;s what you bring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Operator provided */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                Provided by Operator
              </h3>
              <ul className="space-y-3">
                {cavingHub.gearGuide.operatorProvided.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900">{item.item}</span>
                      <span className="text-gray-600"> — {item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* You bring */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Backpack className="h-5 w-5 text-blue-500" />
                What You Bring
              </h3>
              <ul className="space-y-3">
                {cavingHub.gearGuide.youBring.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900">{item.item}</span>
                      <span className="text-gray-600"> — {item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-accent-hover/10 border-l-4 border-accent-hover rounded-r-2xl p-6">
            <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent-hover" />
              Pro Tips
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cavingHub.gearGuide.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-accent-hover">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Book Experiences */}
      {activities.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Book Caving Experiences
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Guided trips from local operators
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
                href="/caving"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold"
              >
                Browse all caving experiences
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
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Adventure Itineraries
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Multi-day trips combining caving with other adventures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItineraries.map((row) => (
                <Link
                  key={row.itinerary.id}
                  href={`/itineraries/${row.itinerary.slug}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover/30 transition-all"
                >
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover transition-colors">
                    {row.itinerary.title}
                  </h3>
                  {row.itinerary.durationDays && (
                    <div className="text-sm text-accent-hover font-medium mb-2">
                      {row.itinerary.durationDays} days
                    </div>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {row.itinerary.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/itineraries"
                className="inline-flex items-center gap-2 text-primary hover:text-accent-hover font-semibold transition-colors"
              >
                View all itineraries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Nearby Accommodation */}
      {breconAccommodation.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
                <Home className="h-4 w-4" />
                Where to Stay
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Accommodation Near the Caves
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Stay in the Brecon Beacons — walking distance from Wales&apos;s best caving
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {breconAccommodation.map((row) => (
                <Link
                  key={row.accommodation.id}
                  href={`/accommodation/${row.accommodation.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover/30 transition-all"
                >
                  <div className="h-40 bg-gray-200 relative">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Home className="h-12 w-12" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-primary mb-1 group-hover:text-accent-hover transition-colors">
                      {row.accommodation.name}
                    </h3>
                    {row.accommodation.address && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3" />
                        {row.accommodation.address}
                      </div>
                    )}
                    {row.accommodation.priceFrom && (
                      <div className="text-sm font-semibold text-primary">
                        From £{row.accommodation.priceFrom}/night
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/accommodation?region=brecon-beacons"
                className="inline-flex items-center gap-2 text-primary hover:text-accent-hover font-semibold transition-colors"
              >
                View all Brecon Beacons accommodation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Combine Activities */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              Combine Caving With...
            </h2>
            <p className="text-gray-600">
              Most caving operators offer multi-activity days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/gorge-walking"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover/30 transition-all text-center"
            >
              <Droplets className="h-10 w-10 text-primary mx-auto mb-3 group-hover:text-accent-hover transition-colors" />
              <h3 className="text-lg font-bold text-primary mb-2">Gorge Walking</h3>
              <p className="text-sm text-gray-600">
                Explore the rivers above before heading underground below
              </p>
            </Link>

            <Link
              href="/coasteering"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover/30 transition-all text-center"
            >
              <Droplets className="h-10 w-10 text-primary mx-auto mb-3 group-hover:text-accent-hover transition-colors" />
              <h3 className="text-lg font-bold text-primary mb-2">Coasteering</h3>
              <p className="text-sm text-gray-600">
                Sea caves on the Pembrokeshire coast — a different underground experience
              </p>
            </Link>

            <Link
              href="/climbing"
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover/30 transition-all text-center"
            >
              <Mountain className="h-10 w-10 text-primary mx-auto mb-3 group-hover:text-accent-hover transition-colors" />
              <h3 className="text-lg font-bold text-primary mb-2">Rock Climbing</h3>
              <p className="text-sm text-gray-600">
                The same limestone that makes caves makes excellent climbing routes
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
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
            {cavingHub.faqs.map((faq, i) => (
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

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-gray-900 to-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Go Underground?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From family-friendly show caves to expert expeditions, Wales has an underground adventure for everyone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#show-caves"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              <Users className="h-5 w-5" />
              Family Show Caves
            </a>
            <a
              href="#operators"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-hover text-white rounded-xl font-semibold hover:bg-accent transition-colors"
            >
              <Flashlight className="h-5 w-5" />
              Book Adventure Trip
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
