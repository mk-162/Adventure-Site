import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
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
  intro: "Wales is a wild swimmer's paradise. From the icy mountain lakes of Snowdonia to the hidden coves of Pembrokeshire, from thundering waterfall pools to gentle river bends, there's a swim for every mood and ability. Join the growing community of Welsh wild swimmers.",
  heroCtaLabel: "Find Swim Spots",
  mapHeading: "Find Swim Spots Near You",
  experiencesHeading: "Guided Wild Swimming Experiences",
  ctaHeading: "Ready to Take the Plunge?",
  ctaSubtext: "From icy mountain tarns to hidden waterfalls, discover your perfect wild swimming spot in Wales",
  ctaButtonLabel: "Find Swim Spots",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
