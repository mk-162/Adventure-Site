import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/cards/activity-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { getActivities, getActivityTypeBySlug, getItineraries, getEvents } from "@/lib/queries";
import { Map, Calendar, MessageCircle, ChevronDown, ArrowRight, MapPin, Star, Clock, PoundSterling, Users, Gauge, Compass, Sparkles } from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

const activityConfig = {
  slug: "wild-swimming",
  name: "Wild Swimming",
  title: "Wild Swimming in Wales",
  strapline: "Discover hidden waterfalls, mountain lakes, river pools, and secret sea coves across Wales",
  metaTitle: "Wild Swimming in Wales | Lakes, Waterfalls & Sea Swimming | Adventure Wales",
  metaDescription: "Discover the best wild swimming spots in Wales. From mountain lakes to hidden waterfalls, sea coves to river pools. Guides, safety tips, and swimming communities.",
  heroImage: "/images/activities/wild-swimming-hero.jpg",
  icon: "🏊",
  stats: { lakes: "400+", waterfalls: "200+", beaches: "200+", rivers: "50+" },
  quickFacts: { bestTime: "Jun-Sep", price: "Free-£25", difficulty: "All Levels", duration: "1-3 hours", bestFor: "Everyone" },
  regions: [
    { name: "Snowdonia", slug: "snowdonia", tagline: "Mountain lakes and waterfalls", highlights: ["Llyn Idwal", "Fairy Glen pools", "Llyn Gwynant"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Hidden coves and sea swims", highlights: ["Blue Lagoon", "Barafundle Bay", "Aber Bach"] },
    { name: "Brecon Beacons", slug: "brecon-beacons", tagline: "Waterfall country", highlights: ["Sgwd yr Eira", "Horseshoe Falls", "Four Falls Trail"] },
    { name: "Gower", slug: "gower", tagline: "Sheltered bays and tidal pools", highlights: ["Brandy Cove", "Fall Bay", "Worm's Head pools"] },
  ],
  relatedActivities: [
    { name: "Coasteering", slug: "coasteering", emoji: "🧗" },
    { name: "Paddleboarding", slug: "paddleboarding", emoji: "🏄" },
    { name: "Kayaking", slug: "kayaking", emoji: "🛶" },
    { name: "Hiking", slug: "hiking", emoji: "🥾" },
  ],
  faqs: [
    { question: "Is wild swimming safe?", answer: "Wild swimming can be safe with proper precautions. Never swim alone, check conditions beforehand, know your limits, and be aware of cold water shock. Start slowly in cold water and consider joining a local swimming group." },
    { question: "When is the best time to wild swim?", answer: "June to September offers the warmest water (15-20°C). Many swimmers go year-round with wetsuits. Early morning is magical for calm water and wildlife. Avoid swimming after heavy rain when rivers run fast and cold." },
    { question: "Do I need a wetsuit?", answer: "Not essential in summer, but recommended. Welsh water rarely exceeds 18°C even in August. A wetsuit extends your season and keeps you warm longer. Many swimmers use just a swimsuit for short dips." },
    { question: "Are there any rules about wild swimming?", answer: "In Wales, you can swim in the sea freely. Rivers and lakes vary — some are on private land. Always respect the environment, don't disturb wildlife, and take nothing but photos. The Outdoor Swimming Society has access information." },
    { question: "What should I bring?", answer: "Towel and warm layers for after, a bright swim cap (visibility), water shoes for rocky entries, and a dry bag for valuables. In cooler months, a hot drink in a flask makes all the difference." },
  ],
};

export const metadata: Metadata = {
  title: activityConfig.metaTitle,
  description: activityConfig.metaDescription,
  openGraph: { title: activityConfig.metaTitle, description: activityConfig.metaDescription, images: [activityConfig.heroImage] },
};

export default async function ActivityHubPage() {
  const activityType = await getActivityTypeBySlug(activityConfig.slug);
  

  const [activitiesData, allItineraries, eventsData] = await Promise.all([
    activityType ? getActivities({ activityTypeId: activityType.id, limit: 12 }) : Promise.resolve([]),
    getItineraries({ limit: 50 }),
    getEvents({ limit: 50 }),
  ]);

  const relatedItineraries = allItineraries.filter(row => 
    row.itinerary.title?.toLowerCase().includes("swim") ||
    row.itinerary.title?.toLowerCase().includes("water") ||
    row.itinerary.description?.toLowerCase().includes("swimming")
  ).slice(0, 4);

  const relatedEvents = eventsData.events.filter(e => 
    e.event.name?.toLowerCase().includes("swim") ||
    e.event.type?.toLowerCase().includes("swimming")
  ).slice(0, 4);

  const mapMarkers = activitiesData.filter(row => row.activity.lat && row.activity.lng).map((row) => ({
    id: row.activity.slug || String(row.activity.id),
    lat: parseFloat(String(row.activity.lat)),
    lng: parseFloat(String(row.activity.lng)),
    title: row.activity.name,
    type: "activity" as const,
    link: `/activities/${row.activity.slug}`,
    subtitle: row.region?.name || undefined,
  }));

  const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home", url: "/" }, { name: activityConfig.title, url: `/${activityConfig.slug}` }]);
  const destinationSchema = createTouristDestinationSchema({ name: activityConfig.title, description: activityConfig.metaDescription, slug: activityConfig.slug }, { imageUrl: activityConfig.heroImage });

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={destinationSchema} />
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${activityConfig.heroImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <span className="text-xl">{activityConfig.icon}</span>
            The Complete Guide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">{activityConfig.title}</h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">{activityConfig.strapline}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {Object.entries(activityConfig.stats).map(([key, value]) => (
              <div key={key} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-white/80 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
              </div>
            ))}
          </div>
          <a href="#experiences" className="inline-flex items-center gap-2 bg-accent-hover hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg">
            Find Swim Spots <ChevronDown className="h-5 w-5" />
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><Calendar className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Best Time</span></div><div className="font-bold text-gray-900">{activityConfig.quickFacts.bestTime}</div></div>
              <div><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><PoundSterling className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Price</span></div><div className="font-bold text-gray-900">{activityConfig.quickFacts.price}</div></div>
              <div><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><Gauge className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Difficulty</span></div><div className="font-bold text-gray-900">{activityConfig.quickFacts.difficulty}</div></div>
              <div><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><Clock className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Duration</span></div><div className="font-bold text-gray-900">{activityConfig.quickFacts.duration}</div></div>
              <div className="col-span-2 md:col-span-1"><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><Users className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Best For</span></div><div className="font-bold text-gray-900 text-sm">{activityConfig.quickFacts.bestFor}</div></div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-20 md:h-16" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6"><ol className="flex items-center gap-2 text-sm text-gray-600"><li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li><li>/</li><li className="text-primary font-medium">{activityConfig.title}</li></ol></nav>
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">Wales is a wild swimmer's paradise. From the icy mountain lakes of Snowdonia to the hidden coves of Pembrokeshire, from thundering waterfall pools to gentle river bends, there's a swim for every mood and ability. Join the growing community of Welsh wild swimmers.</p>
        </div>
      </div>
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4"><Map className="h-4 w-4" />Explore by Region</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Where to Go {activityConfig.name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activityConfig.regions.map((region) => (
              <Link key={region.slug} href={`/${region.slug}/${activityConfig.slug}`} className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover transition-colors">{region.name}</h3>
                <p className="text-sm text-gray-600 mb-4 italic">{region.tagline}</p>
                <div className="space-y-2 mb-4">{region.highlights.map((h, i) => (<div key={i} className="flex items-start gap-2 text-sm text-gray-700"><Star className="h-4 w-4 text-accent-hover flex-shrink-0 mt-0.5" /><span>{h}</span></div>))}</div>
                <div className="flex items-center gap-2 text-accent-hover font-semibold group-hover:gap-3 transition-all">Explore <ArrowRight className="h-4 w-4" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {mapMarkers.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Find Swim Spots Near You</h2></div>
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200"><RegionMap markers={mapMarkers} center={[52.0, -4.0]} zoom={7} height="500px" /></div>
          </div>
        </section>
      )}
      {activitiesData.length > 0 && (
        <section id="experiences" className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Guided {activityConfig.name} Experiences</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activitiesData.map((row) => (<ActivityCard key={row.activity.id} activity={row.activity} region={row.region} operator={row.operator} activityType={activityType} />))}
            </div>
            <div className="text-center mt-8"><Link href={`/activities/type/${activityConfig.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold">View all experiences <ArrowRight className="h-5 w-5" /></Link></div>
          </div>
        </section>
      )}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10"><div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4"><Sparkles className="h-4 w-4" />Related Adventures</div><h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Combine {activityConfig.name} With...</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activityConfig.relatedActivities.map((activity) => (<Link key={activity.slug} href={`/${activity.slug}`} className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center"><div className="text-4xl mb-3">{activity.emoji}</div><h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">{activity.name}</h3></Link>))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4"><MessageCircle className="h-4 w-4" />Common Questions</div><h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2></div>
          <div className="space-y-4">
            {activityConfig.faqs.map((faq, i) => (<details key={i} className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden"><summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"><h3 className="text-lg font-semibold text-primary pr-4">{faq.question}</h3><ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" /></summary><div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">{faq.answer}</div></details>))}
          </div>
        </div>
      </section>
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Take the Plunge?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">From icy mountain tarns to hidden waterfalls, discover your perfect wild swimming spot in Wales</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/activities/type/${activityConfig.slug}`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-colors">Find Swim Spots <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
