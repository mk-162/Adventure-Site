import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "sailing",
  name: "Sailing",
  title: "Sailing in Wales",
  strapline: "From sheltered estuaries to challenging sea passages — discover sailing on the Welsh coast and lakes",
  metaTitle: "Sailing in Wales | Lessons, Charters & Clubs | Adventure Wales",
  metaDescription: "Discover sailing in Wales. RYA courses, yacht charters, dinghy sailing, and club racing. From Pwllheli to Pembrokeshire, find your perfect sailing experience.",
  heroImage: "/images/activities/sailing-hero.jpg",
  icon: "⛵",
  stats: { marinas: "20+", clubs: "50+", coastline: "870mi", lakes: "30+" },
  quickFacts: { bestTime: "Apr-Oct", price: "£50-200", difficulty: "All Levels", duration: "Half/Full day", bestFor: "Everyone" },
  regions: [
    { name: "Anglesey", slug: "anglesey", tagline: "Wales' sailing heartland", highlights: ["Menai Strait", "Holyhead", "Beaumaris"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Sheltered havens", highlights: ["Milford Haven", "Dale", "Solva"] },
    { name: "Llŷn Peninsula", slug: "llyn-peninsula", tagline: "Home of Welsh sailing", highlights: ["Pwllheli", "Plas Heli", "Abersoch"] },
    { name: "Gower", slug: "gower", tagline: "Swansea Bay sailing", highlights: ["Mumbles", "Swansea Marina", "Oxwich"] },
  ],
  relatedActivities: [
    { name: "Kayaking", slug: "kayaking", emoji: "🛶" },
    { name: "Windsurfing", slug: "windsurfing", emoji: "🏄" },
    { name: "Kitesurfing", slug: "kitesurfing", emoji: "🪁" },
    { name: "Coasteering", slug: "coasteering", emoji: "🌊" },
  ],
  faqs: [
    { question: "Do I need experience to try sailing?", answer: "No! Taster sessions and RYA Start Sailing courses are designed for complete beginners. You'll be sailing a dinghy or small yacht within your first lesson. Qualified instructors handle everything while you learn." },
    { question: "What sailing qualifications can I get?", answer: "RYA (Royal Yachting Association) courses range from Start Sailing (beginner dinghies) to Yachtmaster Ocean. Day Skipper lets you charter yachts. Coastal Skipper and beyond for passage making. Most centres offer the full pathway." },
    { question: "Can I charter a yacht in Wales?", answer: "Yes! Several companies offer bareboat charter (you skipper) or skippered charter (professional crew). Popular bases include Pwllheli, Milford Haven, and Conwy. You typically need Day Skipper or equivalent for bareboat." },
    { question: "Is sailing safe in Welsh waters?", answer: "With proper training and respect for conditions, yes. Welsh waters can be challenging with strong tides and changeable weather. RYA training teaches you to assess conditions. Sheltered areas like the Menai Strait are excellent for learning." },
    { question: "Can children learn to sail?", answer: "Absolutely! Many clubs run junior programmes from age 6-8 in Optimist dinghies. RYA Youth Sailing Scheme teaches skills progressively. It builds confidence, teamwork, and a lifelong love of the water." },
  ],
  intro: "Wales has a proud sailing heritage. From the Olympic-standard facilities at Pwllheli to sheltered club sailing on the Menai Strait, there's sailing for every level. RYA training centres, yacht clubs, and charter companies make it easy to get on the water.",
  heroCtaLabel: "Find Sailing",
  mapHeading: "Find Sailing Near You",
  experiencesHeading: "Sailing Schools & Charters",
  ctaHeading: "Ready to Set Sail?",
  ctaSubtext: "From beginner courses to yacht charters, discover sailing in Wales",
  ctaButtonLabel: "Find Sailing",
  viewAllLabel: "View all sailing",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
