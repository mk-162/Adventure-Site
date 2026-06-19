import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "paddleboarding",
  name: "Paddleboarding",
  title: "Paddleboarding in Wales",
  strapline: "Stand-up paddleboarding on stunning coastlines, tranquil lakes, and winding rivers across Wales",
  metaTitle: "Paddleboarding in Wales | SUP Lessons, Tours & Hire | Adventure Wales",
  metaDescription: "Discover paddleboarding in Wales. SUP lessons for beginners, coastal tours, lake sessions, and SUP yoga. Find the best spots and operators across Wales.",
  heroImage: "/images/activities/paddleboarding-hero.jpg",
  icon: "🏄",
  stats: { spots: "100+", operators: "40+", coastline: "870 miles", lakes: "50+" },
  quickFacts: { bestTime: "May-Sep", price: "£30-60", difficulty: "Beginner-friendly", duration: "1-3 hours", bestFor: "Everyone" },
  regions: [
    { name: "Gower", slug: "gower", tagline: "Calm bays and coastal beauty", highlights: ["Three Cliffs Bay", "Oxwich Bay", "Caswell Bay"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Crystal waters and sea caves", highlights: ["Barafundle Bay", "Stackpole Quay", "Whitesands"] },
    { name: "Snowdonia", slug: "snowdonia", tagline: "Mountain lake paddling", highlights: ["Llyn Padarn", "Llyn Gwynant", "Mawddach Estuary"] },
    { name: "Anglesey", slug: "anglesey", tagline: "Sheltered straits and beaches", highlights: ["Menai Strait", "Rhosneigr", "Red Wharf Bay"] },
  ],
  relatedActivities: [
    { name: "Kayaking", slug: "kayaking", emoji: "🛶" },
    { name: "Surfing", slug: "surfing", emoji: "🏄‍♂️" },
    { name: "Wild Swimming", slug: "wild-swimming", emoji: "🏊" },
    { name: "Coasteering", slug: "coasteering", emoji: "🧗" },
  ],
  faqs: [
    { question: "Do I need experience to try paddleboarding?", answer: "No! SUP is one of the most accessible water sports. Beginners typically stand up and paddle within the first lesson. Start on calm water like a lake or sheltered bay." },
    { question: "What if I fall in?", answer: "Falling in is part of learning! The water is usually shallow enough to stand, and you'll wear a buoyancy aid. SUP boards are very stable — most beginners stay dry after the first few minutes." },
    { question: "What should I wear?", answer: "In summer, swimwear or quick-dry shorts and a rash vest work well. In cooler months, a wetsuit keeps you warm. Operators provide wetsuits if needed. Bring water shoes or go barefoot." },
    { question: "Can children paddleboard?", answer: "Yes! Children from around age 6-8 can try SUP. Some operators offer family sessions with tandem boards or smaller kids' boards. Calm lakes are perfect for young paddlers." },
    { question: "What's SUP yoga?", answer: "SUP yoga combines paddleboarding with yoga poses on the water. It's great for balance and mindfulness. Classes are usually held on calm mornings in sheltered bays or lakes." },
  ],
  intro: "Stand-up paddleboarding (SUP) is one of the fastest-growing water sports in Wales. With calm bays, mirror-like lakes, and gentle rivers, there's a perfect spot for every ability level. Whether you want a peaceful sunrise paddle or an adventurous coastal tour, Wales delivers.",
  heroCtaLabel: "Find Experiences",
  mapHeading: "Find Paddleboarding Near You",
  experiencesHeading: "Book Paddleboarding Experiences",
  ctaHeading: "Ready to Get on the Water?",
  ctaSubtext: "From your first lesson to SUP yoga at sunrise, find your perfect paddleboarding experience in Wales",
  ctaButtonLabel: "Browse All Experiences",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
