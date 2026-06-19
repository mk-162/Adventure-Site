import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "gorge-walking",
  name: "Gorge Walking",
  title: "Gorge Walking in Wales",
  strapline: "Scramble through dramatic gorges, abseil waterfalls, and explore hidden canyons in the Welsh wilderness",
  metaTitle: "Gorge Walking in Wales | Canyoning, Scrambling & Adventures | Adventure Wales",
  metaDescription: "Experience gorge walking and canyoning in Wales. Scramble through rivers, jump pools, abseil waterfalls. Guided trips in Snowdonia and the Brecon Beacons.",
  heroImage: "/images/activities/gorge-walking-hero.jpg",
  icon: "🏞️",
  stats: { gorges: "20+", operators: "25+", waterfalls: "100+", jumpPools: "50+" },
  quickFacts: { bestTime: "Apr-Oct", price: "£45-85", difficulty: "Moderate", duration: "3-5 hours", bestFor: "Adventurers" },
  regions: [
    { name: "Snowdonia", slug: "snowdonia", tagline: "Classic gorge adventures", highlights: ["Fairy Glen", "Aber Falls", "Ogwen Valley"] },
    { name: "Brecon Beacons", slug: "brecon-beacons", tagline: "Waterfall country", highlights: ["Four Falls Trail", "Henrhyd Falls", "Neath Valley"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Coastal gorges", highlights: ["Preseli Hills", "Eastern Cleddau", "Gwaun Valley"] },
    { name: "Mid Wales", slug: "mid-wales", tagline: "Remote wilderness gorges", highlights: ["Rheidol Gorge", "Devil's Bridge", "Elan Valley"] },
  ],
  relatedActivities: [
    { name: "Coasteering", slug: "coasteering", emoji: "🧗" },
    { name: "Caving", slug: "caving", emoji: "🦇" },
    { name: "Wild Swimming", slug: "wild-swimming", emoji: "🏊" },
    { name: "Rock Climbing", slug: "rock-climbing", emoji: "🧗‍♂️" },
  ],
  faqs: [
    { question: "Do I need to be able to swim?", answer: "Basic swimming ability is required as you'll be in deep pools. However, you'll wear a wetsuit and buoyancy aid which provide significant floatation. Operators assess conditions and won't ask you to do anything beyond your ability." },
    { question: "Is gorge walking dangerous?", answer: "With a qualified guide and proper equipment, gorge walking is a managed adventure. Guides know the terrain, check water levels, and carry safety gear. All jumps are optional. The main risks are cold water and slippery rocks — handled with wetsuits and proper footwear." },
    { question: "What equipment is provided?", answer: "Operators provide full wetsuit, helmet, buoyancy aid, and specialist gorge shoes. You just bring swimwear to wear underneath and a towel for after. Some trips include hot drinks afterwards." },
    { question: "What's the difference between gorge walking and canyoning?", answer: "They're often used interchangeably! Canyoning typically involves more technical elements like abseiling and rope work, while gorge walking focuses on scrambling, jumping, and swimming. Both involve travelling through water-carved gorges." },
    { question: "Can children do gorge walking?", answer: "Yes! Many operators offer family-friendly trips for children from age 8-10. These focus on fun scrambling and small jumps in shallower gorges. Check individual operators for age requirements and family sessions." },
  ],
  intro: "Gorge walking is Wales at its wildest. Scramble up river canyons, slide down natural water chutes, leap into crystal-clear pools, and work your way through some of Britain's most spectacular gorge systems. It's an adventure that combines climbing, swimming, and exploration.",
  heroCtaLabel: "Find Adventures",
  mapHeading: "Find Gorge Walking Near You",
  experiencesHeading: "Book Gorge Walking Experiences",
  ctaHeading: "Ready for Adventure?",
  ctaSubtext: "From beginner scrambles to expert canyoning, discover your perfect gorge walking adventure in Wales",
  ctaButtonLabel: "Browse All Experiences",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
