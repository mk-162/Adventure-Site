import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "bouldering",
  name: "Bouldering",
  title: "Bouldering in Wales",
  strapline: "Low-level climbing at its purest — no ropes, just you and the rock on incredible boulder fields across Wales",
  metaTitle: "Bouldering in Wales | Outdoor & Indoor Climbing | Adventure Wales",
  metaDescription: "Discover bouldering in Wales. From the legendary gritstone of North Wales to modern indoor walls. Boulder fields, circuits, and problems for all abilities.",
  heroImage: "/images/activities/bouldering-hero.jpg",
  icon: "🪨",
  stats: { boulderAreas: "100+", problems: "3,000+", indoorWalls: "12+", rockTypes: "5+" },
  quickFacts: { bestTime: "Year-round", price: "Free-£15", difficulty: "All Levels", duration: "2-4 hours", bestFor: "Everyone" },
  regions: [
    { name: "Snowdonia", slug: "snowdonia", tagline: "Legendary boulder fields", highlights: ["Cromlech Boulders", "Ogwen", "Llanberis Pass"] },
    { name: "North Wales", slug: "north-wales", tagline: "Gritstone edges", highlights: ["Holyhead Mountain", "Castell Helen", "Parisella's"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Coastal bouldering", highlights: ["Porthclais", "Trevine", "St Davids"] },
    { name: "South Wales", slug: "south-wales", tagline: "Indoor walls and sandstone", highlights: ["Boulders Cardiff", "Climbing Hangar", "Forest Fawr"] },
  ],
  relatedActivities: [
    { name: "Rock Climbing", slug: "rock-climbing", emoji: "🧗" },
    { name: "Hiking", slug: "hiking", emoji: "🥾" },
    { name: "Wild Swimming", slug: "wild-swimming", emoji: "🏊" },
    { name: "Coasteering", slug: "coasteering", emoji: "🌊" },
  ],
  faqs: [
    { question: "What is bouldering?", answer: "Bouldering is climbing on low rocks (typically under 5m) without ropes. You use crash pads for protection and focus on short, powerful 'problems' — sequences of moves to reach the top. It's climbing distilled to its purest form." },
    { question: "Do I need experience?", answer: "No! Bouldering is one of the most accessible forms of climbing. Indoor walls grade problems from V0 (easy) upwards. You can progress quickly and see immediate improvement. It's a great workout too." },
    { question: "What equipment do I need?", answer: "Climbing shoes (hire available), chalk bag, and a crash pad for outdoor bouldering. Indoors, just shoes and chalk — pads are part of the floor. Wear comfortable clothes you can move in." },
    { question: "Is bouldering dangerous?", answer: "Falls are typically onto crash pads or padded floors from low heights. Injuries can occur, mostly to ankles from bad landings. Learn to fall safely, use spotters outdoors, and work problems within your ability. It's lower-risk than roped climbing." },
    { question: "Where can I try it indoors?", answer: "Wales has excellent indoor walls in Cardiff, Swansea, and North Wales. These offer perfect conditions to learn, train, and climb when the weather is poor. Most offer taster sessions and equipment hire." },
  ],
  intro: "Bouldering in Wales offers world-class problems across diverse rock types. From the historic boulders of the Cromlech in Llanberis Pass to coastal gneiss in Pembrokeshire, there's something for every level. Modern indoor walls provide perfect training grounds and wet-weather alternatives.",
  heroCtaLabel: "Find Bouldering",
  mapHeading: "Find Bouldering Near You",
  experiencesHeading: "Bouldering Venues & Sessions",
  ctaHeading: "Ready to Boulder?",
  ctaSubtext: "From indoor walls to legendary outdoor problems, discover bouldering in Wales",
  ctaButtonLabel: "Find Bouldering",
  viewAllLabel: "View all venues",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
