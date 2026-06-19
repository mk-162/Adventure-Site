import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "canoeing",
  name: "Canoeing",
  title: "Canoeing in Wales",
  strapline: "Peaceful river journeys through ancient valleys, from gentle family floats to multi-day wilderness expeditions",
  metaTitle: "Canoeing in Wales | River Trips, Tours & Adventures | Adventure Wales",
  metaDescription: "Discover canoeing in Wales. Paddle the River Wye, explore Snowdonia's lakes, or take a family trip on the Brecon Beacons canals. Tours for all abilities.",
  heroImage: "/images/activities/canoeing-hero.jpg",
  icon: "🛶",
  stats: { rivers: "30+", canals: "100+ miles", operators: "20+", lakes: "50+" },
  quickFacts: { bestTime: "Apr-Oct", price: "£35-70", difficulty: "All Levels", duration: "2-8 hours", bestFor: "Families" },
  regions: [
    { name: "Wye Valley", slug: "wye-valley", tagline: "Classic British river canoeing", highlights: ["Multi-day trips", "Monmouth to Chepstow", "Gentle gradient"] },
    { name: "Brecon Beacons", slug: "brecon-beacons", tagline: "Canal and river adventures", highlights: ["Monmouthshire Canal", "River Usk", "Mountain backdrop"] },
    { name: "Snowdonia", slug: "snowdonia", tagline: "Mountain lakes and rivers", highlights: ["Llyn Padarn", "Mawddach Estuary", "Wild camping trips"] },
    { name: "Mid Wales", slug: "mid-wales", tagline: "Remote and tranquil paddling", highlights: ["River Teifi", "Tregaron Bog", "Otter spotting"] },
  ],
  relatedActivities: [
    { name: "Kayaking", slug: "kayaking", emoji: "🛶" },
    { name: "Paddleboarding", slug: "paddleboarding", emoji: "🏄" },
    { name: "Wild Swimming", slug: "wild-swimming", emoji: "🏊" },
    { name: "Fishing", slug: "fishing", emoji: "🎣" },
  ],
  faqs: [
    { question: "What's the best river for beginners?", answer: "The River Wye is perfect for beginners — it's wide, gentle, and has plenty of operators offering guided trips with all equipment. The Monmouthshire & Brecon Canal is even calmer with no current." },
    { question: "Can I take children canoeing?", answer: "Absolutely! Canoes are stable and great for families. Many operators take children from age 4-5 in family canoes. Calm rivers and canals are ideal for young paddlers." },
    { question: "Do I need my own canoe?", answer: "No — operators provide Canadian canoes, paddles, buoyancy aids, and waterproof bags. Some offer multi-day trips with camping equipment and shuttle services." },
    { question: "What's the difference between canoeing and kayaking?", answer: "Canoes are open boats where you kneel or sit on a raised seat, using a single-bladed paddle. They're more stable and better for carrying gear. Kayaks are enclosed with double-bladed paddles." },
    { question: "Can I camp along the river?", answer: "Yes! Multi-day trips on the Wye and other rivers include wild camping on riverside sites. Operators can arrange permits and provide camping equipment if needed." },
  ],
  intro: "Wales offers exceptional canoeing experiences, from gentle river journeys to multi-day wilderness adventures. The River Wye is a classic British canoe trail, while Snowdonia's lakes and the Brecon Beacons canals provide stunning alternatives.",
  heroCtaLabel: "Find Experiences",
  mapHeading: "Find Canoeing Near You",
  experiencesHeading: "Book Canoeing Experiences",
  ctaHeading: "Ready to Start Paddling?",
  ctaSubtext: "From peaceful family floats to multi-day river expeditions, find your perfect canoeing adventure in Wales",
  ctaButtonLabel: "Browse All Experiences",
  itineraryMatch: { title: ["canoeing", "paddle"], description: ["canoeing"] },
  showItinerariesSection: true,
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
