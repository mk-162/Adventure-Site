import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, MapPin, Star, TrendingUp } from "lucide-react";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Adventure Activities in Wales | Complete Guide | Adventure Wales",
  description: "Discover 20+ adventure activities across Wales. From world-class mountain biking and coasteering to hiking, surfing, caving, and wild swimming. Find your perfect Welsh adventure.",
  openGraph: {
    title: "Adventure Activities in Wales | Complete Guide",
    description: "Discover 20+ adventure activities across Wales. Mountain biking, coasteering, hiking, surfing, caving, and more.",
    images: ["/images/activities/activities-hero.jpg"],
  },
};

// Primary activities with mega pages
const primaryActivities = [
  {
    name: "Mountain Biking",
    slug: "mountain-biking",
    tagline: "10+ trail centres, world-class singletrack",
    description: "Wales has more trail centres per square mile than anywhere in the UK. From Coed y Brenin to BikePark Wales, this is mountain biking heaven.",
    image: "/images/activities/mountain-biking-hero.jpg",
    stats: { venues: "10+", trails: "200+" },
    regions: ["Snowdonia", "Brecon Beacons", "South Wales"],
    hasMegaPage: true,
  },
  {
    name: "Coasteering",
    slug: "coasteering",
    tagline: "Born in Wales, best in Wales",
    description: "Wales invented coasteering in 1986. Pembrokeshire's cliffs, caves, and crystal waters remain the world's best place to try it.",
    image: "/images/activities/coasteering-hero.jpg",
    stats: { spots: "15+", operators: "20+" },
    regions: ["Pembrokeshire", "Anglesey", "Gower"],
    hasMegaPage: true,
  },
  {
    name: "Hiking",
    slug: "hiking",
    tagline: "Snowdon to the Coast Path",
    description: "From scrambling up Snowdon to walking the 870-mile Wales Coast Path, Welsh hiking offers everything from gentle strolls to serious mountain days.",
    image: "/images/activities/hiking-hero.jpg",
    stats: { trails: "100+", peaks: "15" },
    regions: ["Snowdonia", "Brecon Beacons", "Pembrokeshire"],
    hasMegaPage: true,
  },
  {
    name: "Surfing",
    slug: "surfing",
    tagline: "Atlantic swells, Celtic soul",
    description: "Gower, Pembrokeshire, and Llŷn Peninsula catch consistent Atlantic swells. Less crowded than Cornwall, just as good.",
    image: "/images/activities/surfing-hero.jpg",
    stats: { beaches: "30+", schools: "15+" },
    regions: ["Gower", "Pembrokeshire", "Llŷn Peninsula"],
    hasMegaPage: true,
  },
  {
    name: "Caving",
    slug: "caving",
    tagline: "Underground adventures",
    description: "The Brecon Beacons hide Britain's longest cave system. From show caves to serious expeditions, discover Wales from below.",
    image: "/images/activities/caving-hero.jpg",
    stats: { caves: "20+", showCaves: "5" },
    regions: ["Brecon Beacons", "South Wales"],
    hasMegaPage: true,
  },
];

// Secondary activities - popular but no mega page yet
const secondaryActivities = [
  { name: "Zip Lining", slug: "zip-lining", image: "/images/activities/zip-lining.jpg", tagline: "World's fastest zip lines", region: "Snowdonia" },
  { name: "Climbing", slug: "climbing", image: "/images/activities/climbing.jpg", tagline: "Legendary crags & sea cliffs", region: "Snowdonia" },
  { name: "Kayaking", slug: "kayaking", image: "/images/activities/kayaking.jpg", tagline: "Sea, river & lake paddling", region: "Pembrokeshire" },
  { name: "Wild Swimming", slug: "wild-swimming", image: "/images/activities/wild-swimming.jpg", tagline: "Lakes, waterfalls & coast", region: "Snowdonia" },
  { name: "Gorge Walking", slug: "gorge-walking", image: "/images/activities/gorge-walking.jpg", tagline: "Welsh adventure classic", region: "Brecon Beacons" },
  { name: "Paddleboarding", slug: "paddleboarding", image: "/images/activities/paddleboarding.jpg", tagline: "SUP on stunning waters", region: "Gower" },
  { name: "Canyoning", slug: "canyoning", image: "/images/activities/canyoning.jpg", tagline: "Waterfalls & gorges", region: "Snowdonia" },
  { name: "White Water Rafting", slug: "white-water-rafting", image: "/images/activities/rafting.jpg", tagline: "Rapids & thrills", region: "Mid Wales" },
];

// More activities for comprehensive coverage
const moreActivities = [
  { name: "Horse Riding", slug: "horse-riding" },
  { name: "Sailing", slug: "sailing" },
  { name: "Fishing", slug: "fishing" },
  { name: "Paragliding", slug: "paragliding" },
  { name: "Quad Biking", slug: "quad-biking" },
  { name: "Archery", slug: "archery" },
  { name: "Rock Pooling", slug: "rock-pooling" },
  { name: "Birdwatching", slug: "birdwatching" },
  { name: "Foraging", slug: "foraging" },
  { name: "Photography Tours", slug: "photography-tours" },
];

// Activity + Region combos for SEO
const popularCombos = [
  { activity: "Coasteering", region: "Pembrokeshire", slug: "/pembrokeshire/coasteering" },
  { activity: "Mountain Biking", region: "Snowdonia", slug: "/snowdonia/mountain-biking" },
  { activity: "Hiking", region: "Brecon Beacons", slug: "/brecon-beacons/hiking" },
  { activity: "Surfing", region: "Gower", slug: "/gower/surfing" },
  { activity: "Climbing", region: "Snowdonia", slug: "/snowdonia/climbing" },
  { activity: "Sea Kayaking", region: "Anglesey", slug: "/anglesey/sea-kayaking" },
  { activity: "Zip Lining", region: "Snowdonia", slug: "/snowdonia/zip-lining" },
  { activity: "Wild Swimming", region: "Pembrokeshire", slug: "/pembrokeshire/wild-swimming" },
  { activity: "Caving", region: "Brecon Beacons", slug: "/brecon-beacons/caving" },
  { activity: "Gorge Walking", region: "Brecon Beacons", slug: "/brecon-beacons/gorge-walking" },
  { activity: "Coasteering", region: "Anglesey", slug: "/anglesey/coasteering" },
  { activity: "Mountain Biking", region: "Brecon Beacons", slug: "/brecon-beacons/mountain-biking" },
];

export default function ActivitiesPage() {
  return (
    <>
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://adventurewales.co.uk" },
        { name: "Activities", url: "https://adventurewales.co.uk/activities" },
      ])} />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-primary text-white py-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">Activities</span>
            </nav>
            
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-black mb-4">
                Adventure Activities in Wales
              </h1>
              <p className="text-xl text-white/90 mb-6">
                From world-class mountain biking to the birthplace of coasteering. 
                Wales packs more adventure per square mile than anywhere in the UK.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent-hover" />
                  <span><strong>20+</strong> activity types</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent-hover" />
                  <span><strong>11</strong> regions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent-hover" />
                  <span><strong>200+</strong> operators</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Activities - Big Cards */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                Top Adventure Activities
              </h2>
              <p className="text-gray-600">
                The activities that put Wales on the adventure map. Comprehensive guides with everything you need.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {primaryActivities.map((activity) => (
                <Link
                  key={activity.slug}
                  href={`/${activity.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-gray-900 h-[320px]"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={activity.image}
                      alt={activity.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {activity.regions.slice(0, 2).map((region) => (
                        <span
                          key={region}
                          className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs font-medium text-white"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">
                      {activity.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 text-xs text-white/60">
                        {Object.entries(activity.stats).map(([key, value]) => (
                          <span key={key}>
                            <strong className="text-white">{value}</strong> {key}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-hover text-white text-sm font-bold rounded-lg group-hover:bg-orange-600 transition-colors">
                        View Guide <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Secondary Activities - Grid */}
        <section className="py-12 lg:py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                More Adventures to Try
              </h2>
              <p className="text-gray-600">
                Popular activities across Wales — from adrenaline-pumping to gently adventurous.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {secondaryActivities.map((activity) => (
                <Link
                  key={activity.slug}
                  href={`/${activity.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-gray-900 aspect-[4/5]"
                >
                  <Image
                    src={activity.image}
                    alt={activity.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <span className="text-xs text-white/70 mb-1">{activity.region}</span>
                    <h3 className="text-lg font-bold text-white mb-0.5">{activity.name}</h3>
                    <p className="text-sm text-white/80">{activity.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Combinations - SEO Links */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                Popular Activity + Region Combos
              </h2>
              <p className="text-gray-600">
                The best places in Wales to do specific activities.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularCombos.map((combo) => (
                <Link
                  key={combo.slug}
                  href={combo.slug}
                  className="px-4 py-3 bg-slate-50 hover:bg-primary hover:text-white rounded-lg transition-colors group"
                >
                  <span className="font-semibold">{combo.activity}</span>
                  <span className="text-gray-500 group-hover:text-white/80"> in {combo.region}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Activities List */}
        <section className="py-12 lg:py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                All Activities
              </h2>
              <p className="text-gray-600">
                Everything you can do in Wales — from classic adventures to niche experiences.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {primaryActivities.map((activity) => (
                <Link
                  key={activity.slug}
                  href={`/${activity.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                >
                  {activity.name}
                </Link>
              ))}
              {secondaryActivities.map((activity) => (
                <Link
                  key={activity.slug}
                  href={`/${activity.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                >
                  {activity.name}
                </Link>
              ))}
              {moreActivities.map((activity) => (
                <Link
                  key={activity.slug}
                  href={`/${activity.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
                >
                  {activity.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "What are the most popular adventure activities in Wales?",
                  a: "Mountain biking, coasteering, hiking, and surfing are Wales's top adventure activities. Wales is home to the UK's first purpose-built trail centre (Coed y Brenin), the birthplace of coasteering (Pembrokeshire), and world-class surf at Gower and Llŷn Peninsula."
                },
                {
                  q: "What is Wales famous for in terms of adventure sports?",
                  a: "Wales is internationally famous for mountain biking (BikePark Wales, Coed y Brenin), coasteering (invented in Pembrokeshire in 1986), and zip lining (Zip World has the world's fastest zip line). It also has exceptional hiking including Snowdon, Britain's most climbed mountain."
                },
                {
                  q: "Do I need experience to try adventure activities in Wales?",
                  a: "Most Welsh adventure activities cater to beginners. Coasteering, gorge walking, and guided caving require no experience — operators provide full instruction and equipment. Mountain biking trail centres have green (easy) trails for beginners."
                },
                {
                  q: "What's the best region in Wales for adventure activities?",
                  a: "Snowdonia offers the widest variety: mountain biking, hiking, climbing, zip lining, and caving. Pembrokeshire is best for water sports: coasteering, sea kayaking, surfing. Brecon Beacons excels at hiking, caving, and gorge walking."
                },
                {
                  q: "When is the best time for adventure activities in Wales?",
                  a: "May to September offers the best weather for most activities. Water activities (coasteering, surfing, kayaking) are best June-September when sea temperatures are warmer. Mountain biking and hiking are excellent year-round with proper gear."
                },
              ].map((faq, i) => (
                <details key={i} className="group bg-slate-50 rounded-xl p-6" open={i === 0}>
                  <summary className="font-bold text-primary cursor-pointer list-none flex justify-between items-center">
                    {faq.q}
                    <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Not Sure Where to Start?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Use our trip planner to get personalised recommendations based on your interests, 
              fitness level, and how much time you have.
            </p>
            <Link
              href="/trip-planner"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-hover hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
            >
              Plan Your Adventure <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
