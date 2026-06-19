import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "fishing",
  name: "Fishing",
  title: "Fishing in Wales",
  strapline: "From wild brown trout in mountain streams to sea bass off the Pembrokeshire coast — Wales is an angler's paradise",
  metaTitle: "Fishing in Wales | Sea, River & Lake Fishing | Adventure Wales",
  metaDescription: "Discover fishing in Wales. River fishing for salmon and trout, lake fishing, sea fishing charters, and fly fishing lessons. Permits, guides, and the best spots.",
  heroImage: "/images/activities/fishing-hero.jpg",
  icon: "🎣",
  stats: { rivers: "100+", lakes: "400+", coastline: "870mi", species: "60+" },
  quickFacts: { bestTime: "Mar-Oct", price: "£10-150", difficulty: "All Levels", duration: "Half/Full day", bestFor: "Everyone" },
  regions: [
    { name: "Mid Wales", slug: "mid-wales", tagline: "River Wye & Teifi", highlights: ["Salmon fishing", "Wild trout", "Scenic valleys"] },
    { name: "Snowdonia", slug: "snowdonia", tagline: "Mountain lakes", highlights: ["Llyn Padarn", "Glaslyn", "Remote tarns"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Sea fishing paradise", highlights: ["Bass fishing", "Wreck trips", "Shark fishing"] },
    { name: "Brecon Beacons", slug: "brecon-beacons", tagline: "River Usk salmon", highlights: ["Fly fishing", "Grayling", "Stocked lakes"] },
  ],
  relatedActivities: [
    { name: "Kayaking", slug: "kayaking", emoji: "🛶" },
    { name: "Sailing", slug: "sailing", emoji: "⛵" },
    { name: "Wild Swimming", slug: "wild-swimming", emoji: "🏊" },
    { name: "Hiking", slug: "hiking", emoji: "🥾" },
  ],
  faqs: [
    { question: "Do I need a license to fish in Wales?", answer: "For freshwater fishing (rivers and lakes), you need a rod licence from the Environment Agency (buy online at gov.uk). For sea fishing, no licence is required. You may also need a permit from the water owner or club." },
    { question: "What fish can I catch in Wales?", answer: "Rivers: salmon, sea trout (sewin), brown trout, grayling. Lakes: trout, pike, perch, carp. Sea: bass, mackerel, pollack, ray, cod, and occasional blue shark. Species vary by season and location." },
    { question: "Is fly fishing hard to learn?", answer: "The basics can be learned in a single lesson! Casting takes practice, but guides teach beginners to catch fish quickly. Many fisheries offer still-water fly fishing which is easier than river fishing to start." },
    { question: "Can I take children fishing?", answer: "Absolutely! Children under 13 don't need a rod licence. Many lakes are perfect for beginners — they offer accessible banks, toilets, and often hire equipment. Carp fisheries and stocked trout lakes are great starting points." },
    { question: "Where can I go sea fishing?", answer: "Pembrokeshire and the Llŷn Peninsula offer excellent sea fishing. Charter boats run from Milford Haven, Tenby, and other ports. Shore fishing is great from beaches, rocks, and piers across the coast. Bass, mackerel, and pollack are popular targets." },
  ],
  intro: "Wales is blessed with exceptional fishing waters. The rivers Wye and Usk are famous for salmon and sewin, mountain lakes hold wild brown trout, and the coastline offers world-class sea fishing. Whether you're a complete beginner or experienced angler, Wales delivers.",
  heroCtaLabel: "Find Fishing",
  mapHeading: "Find Fishing Near You",
  experiencesHeading: "Fishing Guides & Charters",
  ctaHeading: "Ready to Cast a Line?",
  ctaSubtext: "From wild trout streams to deep sea adventures, discover fishing in Wales",
  ctaButtonLabel: "Find Fishing",
  viewAllLabel: "View all fishing",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
