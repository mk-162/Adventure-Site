import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "kitesurfing",
  name: "Kitesurfing",
  title: "Kitesurfing in Wales",
  strapline: "Harness the wind on Wales's stunning beaches — from Rhosneigr's world-class waves to Pembrokeshire's hidden spots",
  metaTitle: "Kitesurfing in Wales | Lessons, Schools & Spots | Adventure Wales",
  metaDescription: "Discover kitesurfing in Wales. IKO/BKSA lessons, kite schools, and the best spots from Rhosneigr to Pembrokeshire. Learn to kitesurf on Welsh waves.",
  heroImage: "/images/activities/kitesurfing-hero.jpg",
  icon: "🪁",
  stats: { spots: "30+", schools: "10+", windDays: "200+", beaches: "50+" },
  quickFacts: { bestTime: "Apr-Oct", price: "£150-350", difficulty: "Challenging", duration: "3+ hours", bestFor: "Thrill-seekers" },
  regions: [
    { name: "Anglesey", slug: "anglesey", tagline: "UK kitesurfing capital", highlights: ["Rhosneigr", "Newborough", "Trearddur Bay"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Uncrowded Atlantic spots", highlights: ["Freshwater West", "Newgale", "Broad Haven"] },
    { name: "Gower", slug: "gower", tagline: "Consistent Swansea Bay winds", highlights: ["Oxwich Bay", "Llangennith", "Rhossili"] },
    { name: "North Wales", slug: "north-wales", tagline: "Beach and estuary riding", highlights: ["Talacre", "Dulas Bay", "Point of Ayr"] },
  ],
  relatedActivities: [
    { name: "Windsurfing", slug: "windsurfing", emoji: "🏄" },
    { name: "Surfing", slug: "surfing", emoji: "🌊" },
    { name: "Paddleboarding", slug: "paddleboarding", emoji: "🏄‍♀️" },
    { name: "Sailing", slug: "sailing", emoji: "⛵" },
  ],
  faqs: [
    { question: "How long does it take to learn kitesurfing?", answer: "Most people need 6-12 hours of lessons to ride independently — typically spread over 2-3 days. You'll learn kite control, body dragging, and board starts progressively. Weather conditions affect progress, so flexible lesson packages work best." },
    { question: "Is kitesurfing dangerous?", answer: "With proper instruction, quality equipment, and respect for conditions, kitesurfing is manageable. The sport has inherent risks — that's part of the thrill. IKO/BKSA schools teach safety thoroughly. Never try to teach yourself; professional instruction is essential." },
    { question: "What equipment do I need to start?", answer: "Nothing! Schools provide everything for lessons: kites, boards, harnesses, wetsuits, helmets. Once you're independent, a full setup costs £1500-3000 secondhand or £2500-5000 new. Many people continue hiring or sharing kit initially." },
    { question: "Where's the best place to learn in Wales?", answer: "Rhosneigr on Anglesey is ideal — consistent winds, sandy beach, shallow water, and multiple schools. Pembrokeshire spots like Newgale also work well. Avoid learning at wave spots; flat water is much easier for beginners." },
    { question: "What wind do I need?", answer: "Beginners need 12-20 knots for stable kite control. Experienced riders can handle 8-35+ knots with different kite sizes. Wales gets plenty of wind, especially spring and autumn. Schools monitor forecasts and schedule lessons when conditions suit." },
  ],
  intro: "Wales punches above its weight for kitesurfing. Rhosneigr on Anglesey is one of the UK's best spots, with consistent wind and an established scene. Pembrokeshire offers uncrowded Atlantic beaches, and Gower adds Swansea Bay's reliable conditions. Learn here and you can kite anywhere.",
  heroCtaLabel: "Find Lessons",
  mapHeading: "Find Kitesurfing Near You",
  experiencesHeading: "Kitesurfing Schools & Lessons",
  ctaHeading: "Ready to Learn?",
  ctaSubtext: "From first flights to wave riding, discover kitesurfing in Wales",
  ctaButtonLabel: "Find a School",
  viewAllLabel: "View all lessons",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
