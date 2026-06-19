import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "paragliding",
  name: "Paragliding",
  title: "Paragliding in Wales",
  strapline: "Soar above dramatic mountains, coastal cliffs, and valleys — experience the freedom of flight over Wales",
  metaTitle: "Paragliding in Wales | Tandem Flights & Courses | Adventure Wales",
  metaDescription: "Experience paragliding in Wales. Tandem flights for beginners, pilot courses, and ridge soaring along the Black Mountains and Snowdonia. Fly with BHPA-qualified instructors.",
  heroImage: "/images/activities/paragliding-hero.jpg",
  icon: "🪂",
  stats: { sites: "50+", schools: "10+", ridgeKm: "100+", thermals: "Epic" },
  quickFacts: { bestTime: "Mar-Oct", price: "£100-200", difficulty: "Beginner OK", duration: "2-4 hours", bestFor: "Adventurers" },
  regions: [
    { name: "Brecon Beacons", slug: "brecon-beacons", tagline: "Black Mountains thermals", highlights: ["Hay Bluff", "Llangorse Lake", "Crickhowell"] },
    { name: "Mid Wales", slug: "mid-wales", tagline: "Ridge soaring paradise", highlights: ["Long Mynd", "Plynlimon", "Elan Valley"] },
    { name: "Snowdonia", slug: "snowdonia", tagline: "Mountain flights", highlights: ["Cadair Idris", "Moel Siabod", "Rhinogs"] },
    { name: "Gower", slug: "gower", tagline: "Coastal ridge flying", highlights: ["Rhossili Down", "Cefn Bryn", "Port Eynon"] },
  ],
  relatedActivities: [
    { name: "Hiking", slug: "hiking", emoji: "🥾" },
    { name: "Coasteering", slug: "coasteering", emoji: "🌊" },
    { name: "Mountain Biking", slug: "mountain-biking", emoji: "🚵" },
    { name: "Wild Swimming", slug: "wild-swimming", emoji: "🏊" },
  ],
  faqs: [
    { question: "Can beginners try paragliding?", answer: "Absolutely! Tandem flights let you experience paragliding with a qualified pilot who handles everything. You just enjoy the flight. It's perfect for a first taste of flying. No experience needed." },
    { question: "Is paragliding safe?", answer: "With proper training and equipment, paragliding is a safe adventure sport. Tandem pilots are BHPA-qualified with extensive experience. Weather conditions are carefully assessed — you won't fly if conditions aren't suitable." },
    { question: "How long do flights last?", answer: "Tandem flights typically last 15-30 minutes, depending on conditions. Ridge soaring in good thermals can extend flights significantly. Your whole experience including briefing, hike to launch, and landing takes 2-4 hours." },
    { question: "What do I need to wear?", answer: "Sturdy shoes or boots for the hike to launch, warm layers (it's cooler at altitude), and clothes you can move in. Avoid loose items that might catch in the lines. Operators provide harnesses and helmets." },
    { question: "Can I learn to fly solo?", answer: "Yes! BHPA-registered schools offer Elementary Pilot courses (typically 4-5 days) that teach you to fly independently. Progress to Club Pilot and beyond with more training. Wales has excellent learning conditions." },
  ],
  intro: "Wales offers exceptional paragliding with diverse sites from coastal ridges to mountain thermals. The Black Mountains are legendary for cross-country flying, while Snowdonia provides dramatic mountain scenery. Tandem flights make this incredible experience accessible to everyone.",
  heroCtaLabel: "Find Flights",
  mapHeading: "Find Paragliding Near You",
  experiencesHeading: "Book Paragliding Experiences",
  ctaHeading: "Ready to Fly?",
  ctaSubtext: "From tandem taster flights to learning to fly solo, discover paragliding in Wales",
  ctaButtonLabel: "Book a Flight",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
