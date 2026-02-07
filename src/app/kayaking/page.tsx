import type { Metadata } from "next";
import Link from "next/link";
import { ActivityCard } from "@/components/cards/activity-card";
import { getActivities, getActivityTypeBySlug, getAllRegions } from "@/lib/queries";
import {
  Waves,
  MapPin,
  Calendar,
  Clock,
  Users,
  PoundSterling,
  Gauge,
  ArrowRight,
  ChevronDown,
  MessageCircle,
  Star,
} from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Kayaking in Wales | Sea Kayaking, River Kayaking & Tours | Adventure Wales",
  description: "Explore Wales by kayak. Sea kayaking around Pembrokeshire, river kayaking in Snowdonia, and guided tours across the Welsh coast. Find trips for all abilities.",
  alternates: {
    canonical: "https://adventurewales.co.uk/kayaking",
  },
  openGraph: {
    title: "Kayaking in Wales | Sea Kayaking & River Adventures",
    description: "Explore Wales by kayak. Sea kayaking around Pembrokeshire, river kayaking in Snowdonia, and guided tours across the Welsh coast.",
    images: ["/images/activities/kayaking-hero.jpg"],
  },
};

const regions = [
  {
    name: "Pembrokeshire",
    slug: "pembrokeshire",
    tagline: "Sea caves, seals, and spectacular coastline",
    highlights: ["Blue Lagoon", "Ramsey Island", "Sea caves galore"],
    bestFor: ["Sea Kayaking", "Wildlife", "Beginners"],
  },
  {
    name: "Anglesey",
    slug: "anglesey",
    tagline: "Island hopping and crystal-clear waters",
    highlights: ["Puffin Island", "South Stack", "Sheltered bays"],
    bestFor: ["Sea Kayaking", "Expedition", "All Levels"],
  },
  {
    name: "Snowdonia",
    slug: "snowdonia",
    tagline: "Mountain lakes and river adventures",
    highlights: ["Llyn Padarn", "River Dee", "Llyn Gwynant"],
    bestFor: ["Lake Kayaking", "River", "Scenic"],
  },
];

const faqs = [
  {
    question: "Do I need experience to go kayaking in Wales?",
    answer: "No! Many operators offer beginner-friendly trips with full instruction. Sea kayaking tasters and calm lake paddles are perfect for first-timers. More advanced trips on exposed coastline or rivers require some experience.",
  },
  {
    question: "What's the best time of year for kayaking?",
    answer: "April to October offers the best conditions with calmer seas and warmer water. Summer (June-August) is peak season. Spring and autumn can be excellent with fewer crowds but choppier conditions.",
  },
  {
    question: "What's the difference between sea kayaking and river kayaking?",
    answer: "Sea kayaking uses longer, more stable boats designed for open water, waves, and multi-day trips. River kayaking uses shorter, more maneuverable boats for rapids and moving water.",
  },
  {
    question: "Do I need to be able to swim?",
    answer: "You should be confident in water. While you wear a buoyancy aid at all times, being comfortable if you capsize is important. Most operators require basic swimming ability.",
  },
  {
    question: "What should I wear kayaking?",
    answer: "Operators provide wetsuits or drysuits for sea kayaking. Bring swimwear underneath, plus a change of clothes. In summer, quick-dry clothing may be enough for sheltered lake paddling.",
  },
];

export default async function KayakingHubPage() {
  const activityType = await getActivityTypeBySlug("kayaking");
  const activities = activityType
    ? await getActivities({ activityTypeId: activityType.id, limit: 12 })
    : [];

  // Also check for sea-kayaking
  const seaKayakType = await getActivityTypeBySlug("sea-kayaking");
  const seaKayakActivities = seaKayakType
    ? await getActivities({ activityTypeId: seaKayakType.id, limit: 6 })
    : [];

  const allActivities = [...activities, ...seaKayakActivities].slice(0, 12);

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Kayaking in Wales", url: "/kayaking" },
  ]);

  const destinationSchema = createTouristDestinationSchema(
    {
      name: "Kayaking in Wales",
      description: "Sea kayaking, river kayaking and guided tours across the Welsh coast and mountains.",
      slug: "kayaking",
    },
    {
      imageUrl: "/images/activities/kayaking-hero.jpg",
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
          style={{ backgroundImage: "url('/images/activities/kayaking-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Waves className="h-4 w-4" />
            Sea & River Adventures
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Kayaking in Wales
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            From sheltered bays to dramatic sea cliffs — paddle some of Europe&apos;s finest coastline
          </p>

          <a
            href="#experiences"
            className="inline-flex items-center gap-2 bg-accent-hover hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Find Your Paddle
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>

        {/* Quick Stats Box */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Best Time</span>
                </div>
                <div className="font-bold text-gray-900">Apr-Oct</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <PoundSterling className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">From</span>
                </div>
                <div className="font-bold text-gray-900">£40</div>
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
                <div className="font-bold text-gray-900 text-sm">Everyone</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-20 md:h-16" />

      {/* Breadcrumbs + Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary font-medium">Kayaking in Wales</li>
          </ol>
        </nav>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">
            Wales offers some of the best kayaking in Europe. The Pembrokeshire coast is world-renowned for sea kayaking,
            with dramatic cliffs, sea caves, and abundant wildlife including seals and seabirds. Anglesey provides
            sheltered bays and island-hopping opportunities, while Snowdonia&apos;s lakes and rivers offer mountain
            paddling with stunning scenery.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you&apos;re a complete beginner looking for a taster session or an experienced paddler seeking
            multi-day expeditions, Welsh waters have something for every ability level.
          </p>
        </div>
      </div>

      {/* Regions */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Explore by Region
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each region offers a unique paddling experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/${region.slug}/kayaking`}
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

      {/* Experiences */}
      {allActivities.length > 0 && (
        <section id="experiences" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Book Kayaking Experiences
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Guided trips, courses, and rentals from local operators
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allActivities.map((row) => (
                <ActivityCard
                  key={row.activity.id}
                  activity={row.activity}
                  region={row.region}
                  operator={row.operator}
                  activityType={row.activityType}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/activities?type=kayaking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold"
              >
                Browse all kayaking experiences
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Combine With */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Combine Kayaking With...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/coasteering" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🪨</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Coasteering</h3>
              <p className="text-sm text-gray-600">Same coastline, different perspective — cliffs, caves, jumps</p>
            </Link>
            <Link href="/surfing" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🏄</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Surfing</h3>
              <p className="text-sm text-gray-600">Catch waves on the same beaches</p>
            </Link>
            <Link href="/wild-swimming" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🏊</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Wild Swimming</h3>
              <p className="text-sm text-gray-600">Cool off in the lakes you paddle on</p>
            </Link>
            <Link href="/hiking" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🥾</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Coastal Walking</h3>
              <p className="text-sm text-gray-600">Walk the coast path between paddle sessions</p>
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
            {faqs.map((faq, i) => (
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
