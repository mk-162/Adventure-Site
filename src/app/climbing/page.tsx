import type { Metadata } from "next";
import Link from "next/link";
import { ActivityCard } from "@/components/cards/activity-card";
import { getActivities, getActivityTypeBySlug } from "@/lib/queries";
import {
  Mountain,
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
  title: "Rock Climbing in Wales | Snowdonia, Pembrokeshire & Indoor | Adventure Wales",
  description: "Rock climbing in Wales. From the legendary crags of Snowdonia to Pembrokeshire sea cliffs. Courses for beginners, guiding for experts, and indoor walls.",
  alternates: {
    canonical: "https://adventurewales.co.uk/climbing",
  },
  openGraph: {
    title: "Rock Climbing in Wales | Crags, Sea Cliffs & Indoor Walls",
    description: "Rock climbing in Wales. From the legendary crags of Snowdonia to Pembrokeshire sea cliffs.",
    images: ["/images/activities/climbing-hero.jpg"],
  },
};

const regions = [
  {
    name: "Snowdonia",
    slug: "snowdonia",
    tagline: "The birthplace of British mountaineering",
    highlights: ["Llanberis Pass", "Tryfan", "Idwal Slabs"],
    bestFor: ["Trad Climbing", "Mountain Routes", "History"],
  },
  {
    name: "Pembrokeshire",
    slug: "pembrokeshire",
    tagline: "World-class sea cliff climbing",
    highlights: ["Mother Carey's Kitchen", "Lydstep", "St Govan's"],
    bestFor: ["Sea Cliffs", "Sport Climbing", "Adventure"],
  },
  {
    name: "Gower",
    slug: "gower",
    tagline: "Limestone cliffs above the sea",
    highlights: ["Pennard Castle", "Three Cliffs", "Oxwich Bay"],
    bestFor: ["Sport Climbing", "Bouldering", "Accessible"],
  },
];

const faqs = [
  {
    question: "I've never climbed before — where should I start?",
    answer: "Indoor climbing walls are the best introduction. Wales has excellent walls in Snowdonia (Beacon Climbing Centre), Cardiff (Boulders), and Swansea. For outdoor, book a guided 'Introduction to Rock Climbing' course in Snowdonia or Pembrokeshire.",
  },
  {
    question: "What's the difference between trad and sport climbing?",
    answer: "Sport climbing uses pre-placed bolts for protection — you clip into them as you climb. Trad (traditional) climbing requires placing your own protection in cracks as you go. Sport is more accessible for beginners; trad requires more experience and gear.",
  },
  {
    question: "What's the best time of year for outdoor climbing?",
    answer: "Spring (April-May) and autumn (September-October) offer the best conditions — dry rock and comfortable temperatures. Summer works but popular crags get crowded. Some Pembrokeshire sea cliffs have seasonal restrictions for nesting birds (March-August).",
  },
  {
    question: "Do I need my own gear?",
    answer: "No. Guiding companies provide all technical gear (harness, helmet, ropes, protection). You just need comfortable clothing, sturdy shoes you don't mind scuffing, and layers. For indoor walls, rental gear is available.",
  },
  {
    question: "What are the famous routes in Wales?",
    answer: "Some classics include: Cenotaph Corner (E1, Llanberis Pass), A Dream of White Horses (HVS, Anglesey sea cliff), The Rainbow of Recalcitrance (VS, Tremadog), and Idwal Slabs routes for beginners. Wales has thousands of documented routes across all grades.",
  },
];

export default async function ClimbingHubPage() {
  const activityType = await getActivityTypeBySlug("climbing");
  const activities = activityType
    ? await getActivities({ activityTypeId: activityType.id, limit: 12 })
    : [];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Climbing in Wales", url: "/climbing" },
  ]);

  const destinationSchema = createTouristDestinationSchema(
    {
      name: "Rock Climbing in Wales",
      description: "From the legendary crags of Snowdonia to Pembrokeshire sea cliffs. Courses for beginners, guiding for experts.",
      slug: "climbing",
    },
    {
      imageUrl: "/images/activities/climbing-hero.jpg",
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
          style={{ backgroundImage: "url('/images/activities/climbing-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Mountain className="h-4 w-4" />
            Crags, Sea Cliffs & Indoor Walls
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Rock Climbing in Wales
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            The birthplace of British mountaineering — from Snowdonia&apos;s legendary crags to Pembrokeshire&apos;s dramatic sea cliffs
          </p>

          <a
            href="#experiences"
            className="inline-flex items-center gap-2 bg-accent-hover hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Find Your Route
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
                <div className="font-bold text-gray-900">£45</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Difficulty</span>
                </div>
                <div className="font-bold text-gray-900">All Grades</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Duration</span>
                </div>
                <div className="font-bold text-gray-900">Half/Full Day</div>
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
            <li className="text-primary font-medium">Climbing in Wales</li>
          </ol>
        </nav>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">
            Wales is the birthplace of British mountaineering. The crags of Snowdonia have been a training ground
            for climbers since the Victorian era, producing pioneers who went on to conquer Everest. Today, Wales
            offers world-class climbing across every discipline — from the legendary traditional routes of Llanberis
            Pass to the sport climbing of Pembrokeshire&apos;s sea cliffs.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you&apos;re touching rock for the first time or seeking a guide to Wales&apos;s hardest lines,
            you&apos;ll find expert instruction and inspiring routes throughout the country. Indoor walls provide
            year-round training, while the outdoor crags reward with views that match the quality of the climbing.
          </p>
        </div>
      </div>

      {/* Regions */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Climbing Regions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each area offers a different character and style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/${region.slug}/climbing`}
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
      {activities.length > 0 && (
        <section id="experiences" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Book Climbing Experiences
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Courses, guiding, and indoor sessions from expert instructors
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

            <div className="text-center mt-8">
              <Link
                href="/activities?type=climbing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold"
              >
                Browse all climbing experiences
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
              Combine Climbing With...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/hiking" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🥾</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Hiking</h3>
              <p className="text-sm text-gray-600">Walk to the crags — mountain days that include both</p>
            </Link>
            <Link href="/scrambling" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">⛰️</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Scrambling</h3>
              <p className="text-sm text-gray-600">Take your skills to the ridges</p>
            </Link>
            <Link href="/coasteering" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🪨</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Coasteering</h3>
              <p className="text-sm text-gray-600">Climb sea cliffs before jumping off them</p>
            </Link>
            <Link href="/caving" className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center">
              <div className="text-4xl mb-3">🔦</div>
              <h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">Caving</h3>
              <p className="text-sm text-gray-600">Take your rope skills underground</p>
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
