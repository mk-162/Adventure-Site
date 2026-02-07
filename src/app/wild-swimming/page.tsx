import type { Metadata } from "next";
import Link from "next/link";
import { ActivityCard } from "@/components/cards/activity-card";
import { getActivities, getActivityTypeBySlug } from "@/lib/queries";
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
  Thermometer,
} from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Wild Swimming in Wales | Lakes, Rivers & Waterfalls | Adventure Wales",
  description: "Discover Wales' best wild swimming spots. Mountain lakes in Snowdonia, river pools in the Brecon Beacons, and secret waterfalls. Guides and safety tips.",
  alternates: {
    canonical: "https://adventurewales.co.uk/wild-swimming",
  },
  openGraph: {
    title: "Wild Swimming in Wales | Lakes, Rivers & Waterfalls",
    description: "Discover Wales' best wild swimming spots. Mountain lakes in Snowdonia, river pools in the Brecon Beacons.",
    images: ["/images/activities/wild-swimming-hero.jpg"],
  },
};

const regions = [
  {
    name: "Snowdonia",
    slug: "snowdonia",
    tagline: "Crystal-clear mountain lakes and glacial pools",
    highlights: ["Llyn Idwal", "Llyn Gwynant", "Blue Lake (Dorothea)"],
    bestFor: ["Mountain Lakes", "Cold Water", "Scenic Swims"],
  },
  {
    name: "Brecon Beacons",
    slug: "brecon-beacons",
    tagline: "Waterfall pools and river swimming",
    highlights: ["Henrhyd Falls", "Sgwd yr Eira", "Ystradfellte Pools"],
    bestFor: ["Waterfall Pools", "River Dips", "Warm Water"],
  },
  {
    name: "Pembrokeshire",
    slug: "pembrokeshire",
    tagline: "Hidden coves and tidal pools",
    highlights: ["Blue Lagoon", "Barafundle Bay", "Abereiddy"],
    bestFor: ["Sea Swimming", "Sheltered", "Clear Water"],
  },
];

const faqs = [
  {
    question: "Is wild swimming safe?",
    answer: "Wild swimming carries inherent risks — cold water shock, currents, underwater hazards, and changing conditions. Always swim with others, know your exit points, enter slowly to acclimatise, and never jump into water you haven't checked. Many accidents happen to confident swimmers who underestimate conditions.",
  },
  {
    question: "When is the best time to go wild swimming?",
    answer: "June to September offers the warmest water temperatures (16-20°C in lakes, warmer in rivers). May and October can be excellent with fewer crowds. Year-round swimming is growing popular, but cold water (below 15°C) requires experience, proper acclimatisation, and safety precautions.",
  },
  {
    question: "What gear do I need?",
    answer: "At minimum: swimwear, towel, and something warm to change into. Recommended: wetsuit or swimming wetsuit for extended swims, neoprene gloves/socks for cold water, tow float for visibility, and water shoes for rocky entries. A changing robe makes post-swim warmth much easier.",
  },
  {
    question: "Where is it legal to swim?",
    answer: "Wales doesn't have Scotland's right to roam. Many popular spots are tolerated or on access land, but technically you may need landowner permission. Public rights of way to water don't guarantee swimming rights. Be respectful, leave no trace, and avoid conflict with anglers.",
  },
  {
    question: "Are there guided wild swimming experiences?",
    answer: "Yes! Several operators offer guided swims, particularly in Snowdonia and the Brecon Beacons. They know the safest spots, can teach cold water techniques, and provide equipment. Great for beginners or discovering new locations safely.",
  },
];

const spots = [
  { name: "Llyn Gwynant", region: "Snowdonia", type: "Lake", temp: "12-18°C", difficulty: "Easy" },
  { name: "Blue Lake (Dorothea)", region: "Snowdonia", type: "Quarry Lake", temp: "10-16°C", difficulty: "Moderate" },
  { name: "Llyn Idwal", region: "Snowdonia", type: "Mountain Lake", temp: "8-14°C", difficulty: "Moderate" },
  { name: "Sgwd yr Eira", region: "Brecon Beacons", type: "Waterfall Pool", temp: "12-18°C", difficulty: "Easy" },
  { name: "Henrhyd Falls", region: "Brecon Beacons", type: "Waterfall Pool", temp: "12-18°C", difficulty: "Moderate" },
  { name: "Ystradfellte", region: "Brecon Beacons", type: "River Pools", temp: "14-20°C", difficulty: "Easy" },
];

export default async function WildSwimmingHubPage() {
  const activityType = await getActivityTypeBySlug("wild-swimming");
  const activities = activityType
    ? await getActivities({ activityTypeId: activityType.id, limit: 12 })
    : [];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Wild Swimming in Wales", url: "/wild-swimming" },
  ]);

  const destinationSchema = createTouristDestinationSchema(
    {
      name: "Wild Swimming in Wales",
      description: "Mountain lakes, waterfall pools, and river swimming across Wales.",
      slug: "wild-swimming",
    },
    {
      imageUrl: "/images/activities/wild-swimming-hero.jpg",
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
          style={{ backgroundImage: "url('/images/activities/wild-swimming-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Waves className="h-4 w-4" />
            Lakes, Rivers & Waterfalls
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Wild Swimming in Wales
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Crystal-clear mountain lakes, secret waterfall pools, and river dips — discover Wales&apos; natural swimming spots
          </p>

          <a
            href="#spots"
            className="inline-flex items-center gap-2 bg-accent-hover hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Find Your Swim Spot
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
                <div className="font-bold text-gray-900">Jun-Sep</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <PoundSterling className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Cost</span>
                </div>
                <div className="font-bold text-gray-900">Free</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Thermometer className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Water Temp</span>
                </div>
                <div className="font-bold text-gray-900">8-20°C</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Difficulty</span>
                </div>
                <div className="font-bold text-gray-900">Varies</div>
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
            <li className="text-primary font-medium">Wild Swimming in Wales</li>
          </ol>
        </nav>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">
            Wales is a wild swimmer&apos;s paradise. The mountains of Snowdonia hold glacial lakes with
            startlingly clear water. The Brecon Beacons offer waterfall pools beneath spectacular
            cascades. Rivers wind through valleys with secret swimming holes known only to locals.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Wild swimming has exploded in popularity, but the fundamentals remain: respect the water,
            know the risks, and always swim with a buddy. Whether you&apos;re a year-round cold water
            devotee or a summer dipper, Wales has a swim spot for you.
          </p>
        </div>
      </div>

      {/* Popular Spots */}
      <section id="spots" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Popular Swimming Spots
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Some of Wales&apos; most-loved wild swimming locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((spot) => (
              <div
                key={spot.name}
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200"
              >
                <h3 className="text-xl font-bold text-primary mb-2">{spot.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4" />
                  {spot.region}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {spot.type}
                  </span>
                  <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full font-medium">
                    {spot.temp}
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {spot.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Explore by Region
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/${region.slug}/wild-swimming`}
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

      {/* Guided Experiences */}
      {activities.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Guided Swimming Experiences
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join expert guides who know the best spots and keep you safe
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((row) => (
                <ActivityCard
                  key={row.activity.id}
                  activity={row.activity}
                  region={row.region}
                  operator={row.operator}
                  activityType={row.activityType}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Combine With */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Combine Wild Swimming With...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/hiking" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🥾</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Hiking</h3>
              <p className="text-sm text-gray-600">Walk to your swim — mountain lakes reward the effort</p>
            </Link>
            <Link href="/kayaking" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🛶</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Kayaking</h3>
              <p className="text-sm text-gray-600">Paddle to spots you can&apos;t walk to</p>
            </Link>
            <Link href="/coasteering" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🪨</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Coasteering</h3>
              <p className="text-sm text-gray-600">Take your swimming to the sea — with cliff jumps</p>
            </Link>
            <Link href="/surfing" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🏄</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Surfing</h3>
              <p className="text-sm text-gray-600">Ocean swimming with added waves</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Callout */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-amber-800 mb-4">⚠️ Wild Swimming Safety</h3>
            <ul className="space-y-2 text-amber-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Never swim alone</strong> — always have someone watching</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Enter slowly</strong> — cold water shock can incapacitate even strong swimmers</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Know your exits</strong> — check how you&apos;ll get out before getting in</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Use a tow float</strong> — makes you visible to boats and other water users</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Check conditions</strong> — rain can change rivers dramatically within hours</span>
              </li>
            </ul>
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
