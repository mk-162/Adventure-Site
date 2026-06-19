import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "rock-climbing",
  name: "Rock Climbing",
  title: "Rock Climbing in Wales",
  strapline: "From Snowdonia's legendary crags to Pembrokeshire sea cliffs — world-class climbing on every type of rock",
  metaTitle: "Rock Climbing in Wales | Crags, Sea Cliffs & Indoor Walls | Adventure Wales",
  metaDescription: "Discover rock climbing in Wales. World-famous crags in Snowdonia, sea cliff climbing in Pembrokeshire, and indoor walls for beginners. Guides and courses for all levels.",
  heroImage: "/images/activities/rock-climbing-hero.jpg",
  icon: "🧗",
  stats: { crags: "500+", routes: "10,000+", seaCliffs: "50km", indoorWalls: "15+" },
  quickFacts: { bestTime: "Apr-Oct", price: "£50-120", difficulty: "All Levels", duration: "Half/Full day", bestFor: "Adventurers" },
  regions: [
    { name: "Snowdonia", slug: "snowdonia", tagline: "Legendary mountain crags", highlights: ["Tremadog", "Llanberis Pass", "Ogwen Valley"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "World-class sea cliffs", highlights: ["St Davids Head", "Stackpole", "Range East"] },
    { name: "Gower", slug: "gower", tagline: "Limestone coastal climbing", highlights: ["Rhossili", "Oxwich", "Fall Bay"] },
    { name: "North Wales", slug: "north-wales", tagline: "Slate and limestone", highlights: ["Great Orme", "Holyhead Mountain", "Llandudno"] },
  ],
  relatedActivities: [
    { name: "Bouldering", slug: "bouldering", emoji: "🪨" },
    { name: "Coasteering", slug: "coasteering", emoji: "🌊" },
    { name: "Gorge Walking", slug: "gorge-walking", emoji: "🏞️" },
    { name: "Hiking", slug: "hiking", emoji: "🥾" },
  ],
  faqs: [
    { question: "Do I need experience to try rock climbing?", answer: "No! Beginners can start with an indoor climbing session or a guided outdoor taster day. Qualified instructors teach all the basics including safety, movement, and belaying. Many people get hooked after just one session." },
    { question: "Is rock climbing safe?", answer: "With proper instruction and equipment, climbing is a safe adventure sport. You'll always be on a rope secured by a trained belayer. Guides manage risk through route selection, equipment checks, and safety briefings." },
    { question: "What equipment do I need?", answer: "For guided sessions, everything is provided: harness, helmet, climbing shoes, and ropes. You just need comfortable clothes you can move in and layers for outdoor climbing. Experienced climbers can hire or bring their own gear." },
    { question: "What's the difference between indoor and outdoor climbing?", answer: "Indoor walls offer controlled conditions to learn technique and build strength. Outdoor climbing on real rock is more varied and adventurous — you'll read natural features and deal with weather. Most climbers do both!" },
    { question: "Can children go rock climbing?", answer: "Absolutely! Many centres offer climbing from age 4-5 on indoor walls. Outdoor sessions typically start from age 8+. It's brilliant for confidence, problem-solving, and physical development." },
  ],
  intro: "Wales is a climbing mecca. The crags of Snowdonia forged British mountaineering, the sea cliffs of Pembrokeshire are world-renowned, and limestone edges dot the coastline. Whether you're a complete beginner or chasing hard grades, Wales has the rock for you.",
  heroCtaLabel: "Find Climbing",
  mapHeading: "Find Climbing Near You",
  experiencesHeading: "Book Rock Climbing Experiences",
  ctaHeading: "Ready to Climb?",
  ctaSubtext: "From your first moves on an indoor wall to multi-pitch adventures on sea cliffs, discover rock climbing in Wales",
  ctaButtonLabel: "Browse All Experiences",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
