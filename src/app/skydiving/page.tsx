import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/cards/activity-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { getActivities, getActivityTypeBySlug, getItineraries, getEvents } from "@/lib/queries";
import { Map, Calendar, MessageCircle, ChevronDown, ArrowRight, MapPin, Star, Clock, PoundSterling, Users, Gauge, Compass, Sparkles, Plane } from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

const activityConfig = {
  slug: "skydiving",
  name: "Skydiving & Parachuting",
  title: "Skydiving in Wales",
  strapline: "Experience the ultimate adrenaline rush - freefall over Wales' most spectacular landscapes",
  metaTitle: "Skydiving Wales | Tandem Jumps & Parachuting Experiences | Adventure Wales",
  metaDescription: "Skydiving in Wales with stunning views over Snowdonia, Gower Peninsula, and Pembrokeshire Coast. Tandem jumps from 7,000-15,000ft with expert instructors. Book your jump today!",
  heroImage: "/images/activities/skydiving-hero.jpg",
  icon: "🪂",
  stats: { dropzones: "3", maxHeight: "15,000ft", freefall: "Up to 60s", viewRadius: "50+ miles" },
  quickFacts: { bestTime: "Mar-Nov", price: "£250-£320", difficulty: "Beginner OK", duration: "3-4 hours", bestFor: "Thrill Seekers" },
  
  dropzones: [
    {
      name: "Skydive Swansea",
      slug: "skydive-swansea",
      location: "Swansea Airport, South Wales",
      tagline: "Coastal views over the Gower Peninsula",
      highlights: [
        "15,000ft jumps available",
        "60 seconds of freefall",
        "Stunning Gower Peninsula views",
        "Bristol Channel coastline",
        "Part of GoSkydive - UK's leading operator"
      ],
      views: "Gower Peninsula, Bristol Channel, Mumbles",
      price: "From £269",
      height: "10,000ft-15,000ft",
      region: "South Wales",
      status: "OPERATING",
      operatorSlug: "skydive-swansea"
    },
    {
      name: "Skyline Skydiving Haverfordwest",
      slug: "skyline-skydiving-haverfordwest",
      location: "Haverfordwest, Pembrokeshire",
      tagline: "West Wales coastal skydiving",
      highlights: [
        "Most affordable option - from £250",
        "Pembrokeshire Coast National Park views",
        "See across to Ireland on clear days",
        "7,000ft or 10,000ft jumps",
        "VR experience available"
      ],
      views: "Pembrokeshire Coast, St Brides Bay, Skomer Island",
      price: "From £250",
      height: "7,000ft-10,000ft",
      region: "West Wales",
      status: "OPERATING",
      operatorSlug: "skyline-skydiving-haverfordwest"
    },
    {
      name: "Skydiving Snowdonia",
      slug: "skydiving-wales-snowdonia",
      location: "Llanbedr, Snowdonia",
      tagline: "Jump ABOVE Mount Snowdon",
      highlights: [
        "Most scenic location in UK",
        "Jump above Wales' highest mountain",
        "360° Snowdonia views",
        "See Mount Snowdon from above",
        "Cardigan Bay coastline"
      ],
      views: "Mount Snowdon, Snowdonia National Park, Cardigan Bay",
      price: "From £50 deposit",
      height: "7,000ft-13,000ft",
      region: "North Wales",
      status: "TEMPORARILY CLOSED",
      statusNote: "Awaiting Chief Instructor appointment",
      operatorSlug: "skydiving-wales-snowdonia"
    }
  ],

  regions: [
    { 
      name: "South Wales", 
      slug: "south-wales", 
      tagline: "Coastal jumps over the Gower", 
      highlights: ["Swansea Airport dropzone", "15,000ft available", "Gower Peninsula views"],
      dropzones: ["Skydive Swansea"]
    },
    { 
      name: "West Wales", 
      slug: "west-wales", 
      tagline: "Pembrokeshire coastal skydiving", 
      highlights: ["Most affordable jumps", "Pembrokeshire Coast views", "Island scenery"],
      dropzones: ["Skyline Skydiving Haverfordwest"]
    },
    { 
      name: "North Wales", 
      slug: "snowdonia", 
      tagline: "Mountain skydiving above Snowdon", 
      highlights: ["Jump above Snowdon", "Most scenic views", "360° mountain panoramas"],
      dropzones: ["Skydiving Snowdonia (currently closed)"]
    },
  ],

  jumpTypes: [
    {
      name: "Tandem Skydiving",
      emoji: "👥",
      description: "Perfect for first-timers - jump securely attached to an experienced instructor",
      suitable: "Anyone 16+",
      duration: "3-4 hours total",
      training: "30-45 min briefing",
      freefall: "15-60 seconds"
    },
    {
      name: "Charity Jumps",
      emoji: "❤️",
      description: "Raise money for your chosen cause - jump for free when you hit sponsorship targets",
      suitable: "Fundraisers",
      target: "£395+ sponsorship",
      benefit: "Free jump + helping charity"
    },
    {
      name: "AFF Courses",
      emoji: "🎓",
      description: "Learn to skydive solo - Accelerated Freefall training for independent skydivers",
      suitable: "Committed learners",
      duration: "Multi-day course",
      outcome: "Solo skydiving license"
    },
    {
      name: "Gift Experiences",
      emoji: "🎁",
      description: "The ultimate gift - skydiving vouchers valid for 12 months",
      suitable: "Gift givers",
      validity: "12 months",
      flexibility: "Recipient chooses date"
    }
  ],

  relatedActivities: [
    { name: "Paragliding", slug: "paragliding", emoji: "🪂" },
    { name: "Coasteering", slug: "coasteering", emoji: "🌊" },
    { name: "Surfing", slug: "surfing", emoji: "🏄" },
    { name: "Rock Climbing", slug: "rock-climbing", emoji: "🧗" },
  ],
  
  faqs: [
    { 
      question: "Is skydiving safe?", 
      answer: "Yes! Tandem skydiving has an excellent safety record. All operators in Wales are regulated by British Skydiving (formerly BPA), use modern equipment regularly serviced, and your instructor will have completed hundreds or thousands of jumps. Weather conditions are carefully monitored and jumps only go ahead when it's safe to do so." 
    },
    { 
      question: "How much does skydiving in Wales cost?", 
      answer: "Prices range from £250 (Haverfordwest, 7,000ft) to around £320 (Swansea, 15,000ft). Most operators charge around £50 deposit with balance due on the day. Video packages cost £80-£210 extra. You can also jump for free by raising £395+ for charity." 
    },
    { 
      question: "What's the best dropzone in Wales?", 
      answer: "It depends what you want! Swansea offers the highest jumps (15,000ft) with coastal Gower views. Haverfordwest is the most affordable with Pembrokeshire Coast scenery. Snowdonia (when operational) is the most scenic - you jump ABOVE Mount Snowdon. All offer incredible experiences." 
    },
    { 
      question: "Do I need experience?", 
      answer: "No! Tandem skydiving is designed for complete beginners. You're securely attached to a qualified instructor who handles everything - you just need to enjoy the ride. You'll get a 30-45 minute briefing before the jump covering what to expect and basic body positions." 
    },
    { 
      question: "What are the age and weight limits?", 
      answer: "Minimum age is 16 (parental consent required for under 18s). There's no upper age limit but over 40s need a medical form, over 70s need GP approval. Weight limits vary: most centres allow up to 15-18 stone (must be proportionate to height). Haverfordwest has stricter limits (15st men, 13st women). Contact the dropzone if you're close to limits." 
    },
    { 
      question: "How long does a skydive take?", 
      answer: "The freefall itself lasts 15-60 seconds depending on jump height. The parachute ride is 4-6 minutes. But allow 3-4 hours total for the whole experience including registration, training briefing, kitting up, the flight up, and landing." 
    },
    { 
      question: "What's the best time of year to skydive in Wales?", 
      answer: "The main season is March to November when weather is most reliable. Summer (June-August) offers the best weather and longest days, but can book up fast. Spring and autumn are quieter with still-good conditions. Always book early and be flexible - skydiving is weather-dependent so you may need to reschedule." 
    },
    { 
      question: "Can I get a video of my jump?", 
      answer: "Yes! All operators offer video packages, highly recommended for reliving the experience. Options include handcam (instructor's wrist camera), freefall cam (separate cameraman), or both. Prices range from £80-£210. Some centres offer VR experiences too. Book video when you book your jump." 
    },
    { 
      question: "What if I'm too scared to jump?", 
      answer: "It's totally normal to feel scared - that's part of the thrill! Your instructor will reassure you throughout and you'll be securely attached to them. Most people say the anticipation is worse than the actual jump. Once you exit the plane, the fear turns to pure exhilaration. Instructors are trained to help nervous jumpers and won't let you back out easily once you're up there (in a supportive way!)." 
    },
    { 
      question: "What should I wear for a skydive?", 
      answer: "Wear comfortable clothes you can move in (jeans and t-shirt are fine), trainers or boots (no sandals or loose footwear), and layers as it's colder at altitude. Avoid loose items that could fall out or get caught. The operator will provide jumpsuit, harness, goggles, and helmet. Bring a warm jacket for after the jump." 
    }
  ],
};

export const metadata: Metadata = {
  title: activityConfig.metaTitle,
  description: activityConfig.metaDescription,
  openGraph: { 
    title: activityConfig.metaTitle, 
    description: activityConfig.metaDescription, 
    images: [activityConfig.heroImage] 
  },
};

export default async function SkydivingHubPage() {
  const activityType = await getActivityTypeBySlug(activityConfig.slug);
  
  const [activitiesData, allItineraries, eventsData] = await Promise.all([
    activityType ? getActivities({ activityTypeId: activityType.id, limit: 12 }) : Promise.resolve([]),
    getItineraries({ limit: 50 }),
    getEvents({ limit: 50 }),
  ]);

  const relatedItineraries = allItineraries.filter(row => 
    row.itinerary.title?.toLowerCase().includes("skydiv") ||
    row.itinerary.title?.toLowerCase().includes("parachut") ||
    row.itinerary.description?.toLowerCase().includes("skydiving")
  ).slice(0, 4);

  const relatedEvents = eventsData.events.filter(e => 
    e.event.name?.toLowerCase().includes("skydiv") ||
    e.event.name?.toLowerCase().includes("parachut")
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

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" }, 
    { name: activityConfig.title, url: `/${activityConfig.slug}` }
  ]);
  
  const destinationSchema = createTouristDestinationSchema(
    { 
      name: activityConfig.title, 
      description: activityConfig.metaDescription, 
      slug: activityConfig.slug 
    }, 
    { imageUrl: activityConfig.heroImage }
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={destinationSchema} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${activityConfig.heroImage}')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <span className="text-xl">{activityConfig.icon}</span>
            The Complete Guide to Skydiving in Wales
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {activityConfig.title}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            {activityConfig.strapline}
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {Object.entries(activityConfig.stats).map(([key, value]) => (
              <div key={key} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-white/80 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Facts */}
          <div className="flex flex-wrap justify-center gap-4 text-white/90">
            {Object.entries(activityConfig.quickFacts).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="capitalize text-white/70">{key.replace(/([A-Z])/g, " $1")}:</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dropzones Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Wales' Skydiving Dropzones
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your perfect jump location - from coastal Gower to mountain Snowdonia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {activityConfig.dropzones.map((dropzone) => (
              <div key={dropzone.slug} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {dropzone.status === "TEMPORARILY CLOSED" && (
                    <div className="mb-4 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full inline-block">
                      Temporarily Closed
                    </div>
                  )}
                  {dropzone.status === "OPERATING" && (
                    <div className="mb-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full inline-block">
                      Operating
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{dropzone.name}</h3>
                  <p className="text-primary font-medium mb-2">{dropzone.tagline}</p>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {dropzone.location}
                  </div>

                  <div className="space-y-2 mb-4">
                    {dropzone.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Jump Height:</span>
                      <span className="font-semibold">{dropzone.height}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-primary">{dropzone.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-semibold text-xs">{dropzone.views}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/directory/${dropzone.operatorSlug}`}
                    className="mt-4 block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    View Details <ArrowRight className="inline w-4 h-4 ml-1" />
                  </Link>
                  
                  {dropzone.statusNote && (
                    <p className="mt-2 text-xs text-gray-500 text-center">{dropzone.statusNote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jump Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Types of Skydiving
            </h2>
            <p className="text-xl text-gray-600">
              From tandem jumps to charity skydives - find your perfect experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activityConfig.jumpTypes.map((type) => (
              <div key={type.name} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{type.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                <div className="space-y-1 text-sm">
                  {type.suitable && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Suitable for:</span>
                      <span className="font-medium">{type.suitable}</span>
                    </div>
                  )}
                  {type.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{type.duration}</span>
                    </div>
                  )}
                  {type.target && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target:</span>
                      <span className="font-medium">{type.target}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What to Expect on the Day
            </h2>
            <p className="text-xl text-gray-600">
              Your skydiving journey from arrival to landing
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { step: 1, title: "Arrival", desc: "Check in and complete paperwork", icon: "📋" },
              { step: 2, title: "Training", desc: "30-45 min safety briefing", icon: "🎓" },
              { step: 3, title: "Kit Up", desc: "Get your harness and gear", icon: "🪂" },
              { step: 4, title: "Board", desc: "Scenic flight to altitude", icon: "✈️" },
              { step: 5, title: "Jump!", desc: "Exit plane and freefall", icon: "🤸" },
              { step: 6, title: "Land", desc: "Parachute ride and landing", icon: "🎯" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-3xl shadow-md">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-primary mb-1">Step {item.step}</div>
                <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Important Requirements</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Age & Weight:</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Minimum age: 16 years (parental consent under 18)</li>
                  <li>• Weight limits: 15-18 stone (varies by centre)</li>
                  <li>• Must be proportionate to height</li>
                  <li>• Surcharges may apply for higher weights</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Health & Fitness:</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Complete medical declaration form</li>
                  <li>• GP approval for certain conditions</li>
                  <li>• Reasonable fitness level required</li>
                  <li>• No alcohol/drugs 24 hours before</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Wales for Skydiving */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Skydive in Wales?
            </h2>
            <p className="text-xl text-gray-600">
              Unbeatable scenery and unforgettable experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Spectacular Coastal Views",
                desc: "Jump over the Gower Peninsula and Pembrokeshire Coast - some of Britain's most beautiful coastlines",
                emoji: "🏖️"
              },
              {
                title: "Mountain Scenery",
                desc: "At Snowdonia, you'll jump ABOVE Mount Snowdon - Wales' highest peak at 3,560ft",
                emoji: "⛰️"
              },
              {
                title: "Multiple Locations",
                desc: "Three dropzones across Wales mean you can choose coastal or mountain jumps",
                emoji: "📍"
              },
              {
                title: "Experienced Operators",
                desc: "All centres are regulated by British Skydiving with professional, qualified instructors",
                emoji: "🏆"
              },
              {
                title: "Great Value",
                desc: "Wales offers some of the UK's most affordable skydiving from £250",
                emoji: "💰"
              },
              {
                title: "Perfect Weekend Trip",
                desc: "Combine skydiving with surfing, hiking, castles, and coastal towns for an adventure weekend",
                emoji: "🎯"
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-6">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Skydiving FAQs
            </h2>
            <p className="text-xl text-gray-600">
              Your questions answered
            </p>
          </div>

          <div className="space-y-6">
            {activityConfig.faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                  <span>{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Activities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              More Wales Adventures
            </h2>
            <p className="text-xl text-gray-600">
              Combine skydiving with other adrenaline activities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {activityConfig.relatedActivities.map((activity) => (
              <Link 
                key={activity.slug} 
                href={`/${activity.slug}`}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="text-4xl mb-3">{activity.emoji}</div>
                <div className="font-semibold text-gray-900">{activity.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Take the Leap?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your skydiving experience in Wales today and tick it off your bucket list
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/directory?activity=skydiving"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Find Dropzones <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/contact"
              className="bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-darker transition-colors border-2 border-white inline-flex items-center justify-center"
            >
              Ask a Question <MessageCircle className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
