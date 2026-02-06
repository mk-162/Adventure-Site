
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";
import { OperatorCard } from "@/components/cards/operator-card";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Beer, MapPin, Mountain, Users, Wallet } from "lucide-react";
import { JsonLd, createFAQPageSchema, createWebSiteSchema } from "@/components/seo/JsonLd";
import Image from "next/image";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Stag & Hen Weekends in Wales | Adventure Wales",
  description: "Plan the ultimate stag or hen party in Wales. Adventure packages, city nightlife, and group-friendly activities from Cardiff to Snowdonia.",
};

export default async function StagHenPage() {
  // Fetch operators: either explicitly marked for stag/hen OR has 'stag-hen' in activity types
  // Note: arrayContains might require specific Drizzle syntax for Postgres arrays,
  // but simpler to use SQL for the array check if needed, or just filter in JS if dataset is small.
  // Using sql for array overlap: 'stag-hen' = ANY(activity_types)
  const stagOperators = await db.select().from(operators).where(
    or(
      eq(operators.stagHenPackages, true),
      sql`'stag-hen' = ANY(${operators.activityTypes})`
    )
  ).limit(12);

  const popularActivities = [
    { name: "Gorge Walking", slug: "gorge-walking", price: "45", desc: "Leap into waterfalls and scramble through gorges." },
    { name: "Coasteering", slug: "coasteering", price: "45", desc: "Climb, jump, and swim along the wild coast." },
    { name: "Canyoning", slug: "canyoning", price: "55", desc: "Abseil down waterfalls in deep river canyons." },
    { name: "Paintball", slug: "paintball", price: "25", desc: "Classic group combat strategy games." },
    { name: "Surfing", slug: "surfing", price: "35", desc: "Catch waves on Wales' best beaches." },
    { name: "Climbing", slug: "climbing", price: "40", desc: "Scale sea cliffs or mountain crags." },
    { name: "Zip Lining", slug: "zip-lining", price: "50", desc: "Fly over quarries at 100mph." },
    { name: "Wild Swimming", slug: "wild-swimming", price: "Free", desc: "Dip in crystal clear mountain lakes." },
  ];

  const regionsList = [
    { name: "South Wales", slug: "south-wales", desc: "City + adventure. Best of both worlds.", img: "https://images.unsplash.com/photo-1534349762913-924971c97cad?w=800&q=80" },
    { name: "Brecon Beacons", slug: "brecon-beacons", desc: "Lodges, hot tubs, and mountain activities", img: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80" },
    { name: "Pembrokeshire", slug: "pembrokeshire", desc: "Coastal adventures, camping, and surf", img: "https://images.unsplash.com/photo-1595246237722-1d374431e285?w=800&q=80" },
    { name: "Snowdonia", slug: "snowdonia", desc: "Go big. Mountains, zip lines, gorges", img: "https://images.unsplash.com/photo-1505232930983-50007887532f?w=800&q=80" },
    { name: "Gower", slug: "gower", desc: "Beach parties, surfing, coasteering", img: "https://images.unsplash.com/photo-1535798263593-6c84c1f6c738?w=800&q=80" },
  ];

  const faqs = [
    { q: "How much does a stag/hen weekend in Wales cost?", a: "From £150pp for a day to £350pp for a full weekend depending on accommodation and activities." },
    { q: "What's the best time of year?", a: "March-September for outdoor activities. Winter is great for cosy lodge weekends and indoor adventures." },
    { q: "What's the minimum group size?", a: "Most operators take groups of 6+ for private sessions, but smaller groups can join mixed sessions." },
    { q: "Can you do stag/hen activities in winter?", a: "Yes — caving, gorge walking (with thick wetsuits!), and indoor climbing work year-round." },
    { q: "Cardiff or Snowdonia?", a: "Cardiff for nightlife + daytime activities. Snowdonia for full adventure immersion and cabin vibes." },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070" // Party/Group vibes
            alt="Stag and Hen Adventure Wales"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Plan the Ultimate <span className="text-accent">Stag or Hen</span> Weekend in Wales
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium">
            Adventure packages, city nightlife, and everything in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#activities" className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <Mountain className="w-5 h-5" /> Browse Activities
            </a>
            <a href="#operators" className="bg-white hover:bg-gray-100 text-primary font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <Users className="w-5 h-5" /> Find Group Packages
            </a>
          </div>
        </div>
      </section>

      {/* Why Wales Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Wales for your Stag or Hen?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Forget the cliche destinations. Wales offers real adventure by day and legendary hospitality by night.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <WhyCard icon={<Beer className="w-8 h-8 text-amber-500" />} title="Top Destinations" text="Cardiff is consistently voted a UK top-5 stag/hen destination." />
            <WhyCard icon={<MapPin className="w-8 h-8 text-blue-500" />} title="City + Adventure" text="Epic adventures just 30 minutes from vibrant city nightlife." />
            <WhyCard icon={<Wallet className="w-8 h-8 text-green-500" />} title="Affordable" text="More bang for your buck than London, Edinburgh, or Bristol." />
            <WhyCard icon={<Mountain className="w-8 h-8 text-primary" />} title="Epic Scenery" text="Mountains, coastline, and rivers right on your doorstep." />
          </div>
        </div>
      </section>

      {/* Popular Activities */}
      <section id="activities" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Popular Group Activities</h2>
              <p className="text-gray-500">The most booked experiences for stags and hens.</p>
            </div>
            <Link href="/activities" className="hidden md:flex items-center gap-2 text-accent font-bold hover:underline">
              View all activities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularActivities.map((activity) => (
              <Link key={activity.slug} href={`/${activity.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{activity.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 h-10">{activity.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">From £{activity.price} pp</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/activities" className="inline-flex items-center gap-2 text-accent font-bold hover:underline">
              View all activities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* By Region */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Explore by Region</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {regionsList.map((region) => (
              <Link key={region.slug} href={`/${region.slug}/stag-hen`} className="group relative h-80 rounded-2xl overflow-hidden flex items-end p-6">
                <Image
                  src={region.img}
                  alt={region.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{region.name}</h3>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">{region.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Operators Section */}
      <section id="operators" className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stag & Hen Specialists</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">These operators offer dedicated packages, group pricing, and know how to handle a party.</p>
          </div>

          {stagOperators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stagOperators.map(op => (
                <OperatorCard key={op.id} operator={op} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-slate-700 rounded-2xl">
              <p className="text-slate-400">No specific stag/hen packages found yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-primary mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WhyCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-gray-500">{text}</p>
    </div>
  );
}
