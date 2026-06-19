import {
  StandardActivityHub,
  standardHubMetadata,
  type StandardHubConfig,
} from "@/components/activity-hub/StandardActivityHub";

const config: StandardHubConfig = {
  slug: "horse-riding",
  name: "Horse Riding",
  title: "Horse Riding in Wales",
  strapline: "Explore Wales on horseback — from beach rides on the Gower to mountain treks through Snowdonia",
  metaTitle: "Horse Riding in Wales | Beach Rides, Trekking & Lessons | Adventure Wales",
  metaDescription: "Discover horse riding in Wales. Beach rides, mountain trekking, pony trekking for families, and riding holidays. BHS-approved centres across all regions.",
  heroImage: "/images/activities/horse-riding-hero.jpg",
  icon: "🐴",
  stats: { centres: "80+", beachRides: "20+", trails: "500km", ponies: "Yes!" },
  quickFacts: { bestTime: "Year-round", price: "£35-80", difficulty: "All Levels", duration: "1-4 hours", bestFor: "Families" },
  regions: [
    { name: "Gower", slug: "gower", tagline: "Famous beach riding", highlights: ["Rhossili Beach", "Oxwich Bay", "Llangennith"] },
    { name: "Pembrokeshire", slug: "pembrokeshire", tagline: "Coastal and countryside", highlights: ["Preseli Hills", "Newport Sands", "Broad Haven"] },
    { name: "Snowdonia", slug: "snowdonia", tagline: "Mountain trekking", highlights: ["Coed y Brenin", "Dolgellau trails", "Snowdon foothills"] },
    { name: "Brecon Beacons", slug: "brecon-beacons", tagline: "Moorland adventures", highlights: ["Black Mountains", "Fforest Fawr", "Usk Valley"] },
  ],
  relatedActivities: [
    { name: "Hiking", slug: "hiking", emoji: "🥾" },
    { name: "Mountain Biking", slug: "mountain-biking", emoji: "🚵" },
    { name: "Wild Swimming", slug: "wild-swimming", emoji: "🏊" },
    { name: "Surfing", slug: "surfing", emoji: "🏄" },
  ],
  faqs: [
    { question: "Do I need experience to go horse riding?", answer: "No! Many centres cater for complete beginners with quiet, well-trained horses and patient instruction. Pony trekking on lead rein is perfect for first-timers. Experienced riders can enjoy more challenging hacks." },
    { question: "What age can children start riding?", answer: "Most centres take children from around age 4-5 on lead rein. Pony trekking suits ages 6+. Lessons can start from age 3-4. Children often take to riding naturally and build confidence quickly." },
    { question: "What should I wear?", answer: "Long trousers (jeans can rub), sturdy shoes or boots with a small heel (no flip-flops or trainers), and layers for changing weather. Centres provide helmets — your own if you have one." },
    { question: "Can I ride on the beach?", answer: "Yes! The Gower peninsula is famous for beach riding, with centres offering rides along Rhossili, Llangennith, and other stunning beaches. Usually at low tide — check with your centre. It's magical!" },
    { question: "Are riding holidays available?", answer: "Absolutely. Multi-day treks with overnight stays in pubs or bunkhouses are available, especially in the Brecon Beacons and Cambrian Mountains. Centres can arrange routes to suit your experience level." },
  ],
  intro: "Wales is horse and pony country. From the famous beach rides of the Gower peninsula to mountain treks through Snowdonia, there's a riding experience for everyone. Friendly centres, well-trained horses, and spectacular scenery make Welsh riding unforgettable.",
  heroCtaLabel: "Find Rides",
  mapHeading: "Find Horse Riding Near You",
  experiencesHeading: "Book Horse Riding Experiences",
  ctaHeading: "Ready to Ride?",
  ctaSubtext: "From beach rides to mountain treks, discover horse riding in Wales",
  ctaButtonLabel: "Find a Centre",
};

export const metadata = standardHubMetadata(config);

export default function ActivityHubPage() {
  return <StandardActivityHub config={config} />;
}
