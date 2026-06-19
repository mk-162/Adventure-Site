import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "windsurfing",
  name: "Windsurfing",
  title: "Windsurfing in Wales",
  strapline: "Classic wind-powered adventure on Welsh waters — from beginner lakes to wave sailing on the coast",
  metaTitle: "Windsurfing in Wales | Lessons, Hire & Best Spots | Adventure Wales",
  metaDescription: "Discover windsurfing in Wales. RYA lessons, equipment hire, and the best spots from Rhosneigr to Gower. Learn to windsurf on Welsh lakes and beaches.",
  heroImage: "/images/activities/windsurfing-hero.jpg",
  icon: "🏄",
  stats: { spots: "40+", centres: "15+", lakes: "30+", beaches: "50+" },
  quickFacts: { bestTime: "Apr-Oct", price: "£50-120", difficulty: "Moderate", duration: "2-4 hours", bestFor: "Everyone" },
  regions: [
    { name: "Anglesey", slug: "anglesey", tagline: "Consistent coastal winds", highlights: ["Rhosneigr", "Trearddur Bay", "Menai Strait"] },
    { name: "Gower", slug: "gower", tagline: "Swansea Bay and beyond", highlights: ["Oxwich Bay", "Port Eynon", "Llangennith"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Atlantic swell sessions", highlights: ["Newgale", "Dale", "Freshwater West"] },
    { name: "Mid Wales", slug: "mid-wales", tagline: "Lake sailing paradise", highlights: ["Bala Lake", "Elan Valley", "Llangorse Lake"] },
  ],
  relatedActivities: [
    { name: "Kitesurfing", slug: "kitesurfing", emoji: "🪁" },
    { name: "Sailing", slug: "sailing", emoji: "⛵" },
    { name: "Paddleboarding", slug: "paddleboarding", emoji: "🏄‍♀️" },
    { name: "Surfing", slug: "surfing", emoji: "🌊" },
  ],
  faqs: [
    { question: "Is windsurfing hard to learn?", answer: "The basics come quickly — most beginners are sailing back and forth within their first lesson. Progression from there takes practice. Modern wide boards and stable rigs make learning much easier than it used to be. RYA Start Windsurfing courses teach everything you need." },
    { question: "What's the difference between windsurfing and kitesurfing?", answer: "Windsurfing uses a sail attached to the board — you hold the boom and steer by tilting the rig. Kitesurfing uses a kite flying above you, controlled by a bar. Windsurfing is arguably easier to learn; kitesurfing is more extreme. Many people do both!" },
    { question: "What wind do I need?", answer: "Beginners need light, steady winds (8-15 knots) for stable learning. Intermediate and advanced sailors can handle 15-30+ knots with smaller sails. Wales gets excellent wind, especially spring and autumn, with plenty of sub-20 knot days for learning." },
    { question: "Can I windsurf on lakes?", answer: "Absolutely! Lakes like Bala and Llangorse are perfect for learning — no tides, waves, or currents to worry about. Several Welsh lakes have windsurf centres. Inland sailing extends your season as coastal conditions can be challenging in winter." },
    { question: "What equipment is provided for lessons?", answer: "RYA centres provide everything: wetsuit, buoyancy aid, board, sail, and harness. Modern beginner kit is much more forgiving than old-school equipment. You'll typically use a large stable board and small sail to start, progressing as skills develop." },
  ],
  intro: "Windsurfing remains one of the most accessible wind sports, and Wales offers excellent conditions. From the renowned spots at Rhosneigr to calm lake sailing at Bala, there's progression for every level. RYA centres provide quality instruction on modern, forgiving equipment.",
  heroCtaLabel: "Find Lessons",
  mapHeading: "Find Windsurfing Near You",
  experiencesHeading: "Windsurfing Schools & Hire",
  ctaHeading: "Ready to Catch the Wind?",
  ctaSubtext: "From first sails to wave riding, discover windsurfing in Wales",
  ctaButtonLabel: "Find a Centre",
  viewAllLabel: "View all centres",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
