import { notFound } from "next/navigation";
import Link from "next/link";
import { getRegionBySlug, getAccommodationByRegion, getAllRegions } from "@/lib/queries";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { MapPin, Mountain, Compass } from "lucide-react";

interface AccommodationPageProps {
  params: Promise<{ region: string }>;
}

// Regional accommodation guides - local knowledge for adventure planning
const regionalGuides: Record<string, {
  intro: string;
  bestBases: { name: string; forWhat: string }[];
  tips: string[];
  seasonAdvice: string;
}> = {
  'snowdonia': {
    intro: "Snowdonia accommodation clusters around two main hubs: Llanberis (convenient, amenities, Llanberis Path) and Pen-y-Pass (remote, closest to summit, multiple routes). For climbing and scrambling, Capel Curig puts you near Tryfan and the Ogwen Valley classics.",
    bestBases: [
      { name: "Llanberis", forWhat: "Llanberis Path, Pete's Eats, gear shops, nightlife" },
      { name: "Pen-y-Pass", forWhat: "Pyg/Miners tracks, early starts, serious hiking" },
      { name: "Capel Curig", forWhat: "Tryfan, Ogwen Valley, rock climbing" },
      { name: "Bala", forWhat: "White water rafting, southern peaks, lake activities" },
    ],
    tips: [
      "Book 2-3 months ahead for summer weekends at Pen-y-Pass",
      "Llanberis has the best gear shops if you've forgotten something",
      "Drying rooms are essential - expect wet gear daily",
      "The Sherpa bus connects major trailheads if you're hostel-hopping",
    ],
    seasonAdvice: "Summer (June-Aug) is busiest and most expensive. May and September offer great weather with fewer crowds. Winter requires proper mountain experience but hostels are quieter."
  },
  'brecon-beacons': {
    intro: "The Brecon Beacons spread across a large area. Brecon town is the main hub, but for waterfall walks you want the southern valleys, and for caving near Dan yr Ogof. The Black Mountains (eastern end) are quieter with different character.",
    bestBases: [
      { name: "Brecon Town", forWhat: "Central access, Pen y Fan, services and pubs" },
      { name: "Waterfall Country (Ystradfellte)", forWhat: "Sgwd yr Eira, gorge walks, wild swimming" },
      { name: "Crickhowell", forWhat: "Black Mountains, Sugarloaf, gentler walking" },
      { name: "Llanthony", forWhat: "Remote Black Mountains, Offa's Dyke, atmosphere" },
    ],
    tips: [
      "Pen y Fan car park fills by 8am on sunny weekends - stay nearby and walk",
      "Waterfall walks get slippery - waterproof boots essential",
      "Craig y Nos Castle near Dan yr Ogof combines luxury with caving access",
      "The Taff Trail is great for cycling between accommodation and activities",
    ],
    seasonAdvice: "Spring (March-May) has waterfalls at their best. Summer brings crowds to Pen y Fan. Autumn colors in the beechwoods are spectacular. Winter can be harsh on the peaks."
  },
  'pembrokeshire': {
    intro: "Pembrokeshire is all about the coast. St Davids is the adventure hub with TYF and Preseli Venture nearby. North coast is wilder, south coast more accessible. Stackpole and Barafundle are in the south; Whitesands and Abereiddy in the north.",
    bestBases: [
      { name: "St Davids", forWhat: "Coasteering, surfing, Coast Path, cathedral city vibes" },
      { name: "Whitesands", forWhat: "Surfing, beach camping, St Davids Head walks" },
      { name: "Newport", forWhat: "Preseli Hills, northern coast walking" },
      { name: "Stackpole", forWhat: "Barafundle, lily ponds, southern Coast Path" },
    ],
    tips: [
      "Preseli Venture includes meals and activities - great value for solo travelers",
      "Book coasteering 2+ weeks ahead in summer",
      "Newgale is the beginner surf spot; Whitesands for more experience",
      "Coast Path sections make great linear walks with bus returns",
    ],
    seasonAdvice: "May-September for water sports (sea temps peak in August). Coast Path is year-round but quieter in spring. Seal pups visible September-November."
  },
  'gower': {
    intro: "Britain's first AONB packs incredible variety into a small peninsula. Rhossili and Llangennith in the west for surfing, Three Cliffs in the middle for beauty, Mumbles in the east for amenities. You can base anywhere and drive to everything.",
    bestBases: [
      { name: "Rhossili", forWhat: "Surfing, Worm's Head, dramatic coastal walking" },
      { name: "Llangennith", forWhat: "Surf beach, camping, surf culture" },
      { name: "Reynoldston", forWhat: "Central location, good pubs, reach all beaches" },
      { name: "Mumbles", forWhat: "Restaurants, pier, gateway to peninsula" },
    ],
    tips: [
      "Rhossili car park costs £6 - camp nearby and walk",
      "Llangennith has the most consistent surf",
      "Three Cliffs requires a proper walk in - no car access",
      "Worm's Head is tidal - check crossing times",
    ],
    seasonAdvice: "Easter to October for swimming/surfing. Weekends get busy year-round as it's close to Swansea. Winter storms bring big waves for experienced surfers."
  },
  'anglesey': {
    intro: "Anglesey is water sports paradise - kitesurfing at Rhosneigr, sea kayaking from Plas Menai, family beaches everywhere. The island is flat and easy to cycle. Holy Island (Holyhead) has dramatic sea cliffs and the South Stack lighthouse.",
    bestBases: [
      { name: "Rhosneigr", forWhat: "Kitesurfing, windsurfing, beach lifestyle" },
      { name: "Trearddur Bay", forWhat: "Family beaches, kayaking, relaxed vibe" },
      { name: "Menai Bridge", forWhat: "Plas Menai courses, access to mainland Snowdonia" },
      { name: "Beaumaris", forWhat: "Castle, restaurants, sailing" },
    ],
    tips: [
      "Plas Menai is THE place to learn watersports properly",
      "Rhosneigr wind is reliable - that's why the kiters love it",
      "Newborough Forest has unique beach-forest combo walks",
      "Combine Anglesey watersports with Snowdonia hiking - 30 min drive",
    ],
    seasonAdvice: "May-September for water sports. Wind is most reliable spring and autumn. Quieter than mainland Wales even in summer."
  },
  'llyn-peninsula': {
    intro: "Llŷn has that end-of-the-world feel - Welsh-speaking, traditional, beautiful. Abersoch is the busy beach resort, Aberdaron the wild west tip where pilgrims left for Bardsey Island. Hell's Mouth has big waves, Porthdinllaen has the famous beach pub.",
    bestBases: [
      { name: "Abersoch", forWhat: "Water sports, beach life, evening entertainment" },
      { name: "Aberdaron", forWhat: "Wild coast, Bardsey views, end-of-earth atmosphere" },
      { name: "Pwllheli", forWhat: "Marina, practical base, good transport links" },
      { name: "Porthdinllaen", forWhat: "Tŷ Coch pub, coastal walking, unique experience" },
    ],
    tips: [
      "Tŷ Coch Inn (beach pub) - walk from Morfa Nefyn, don't expect to drive",
      "Hell's Mouth is for experienced surfers only - respect the name",
      "Whistling Sands (Porth Oer) really does squeak - worth a visit",
      "Welsh language very much alive here - locals appreciate any effort",
    ],
    seasonAdvice: "July-August is peak family holiday time. May/June and September are perfect - warm enough, much quieter. Bardsey trips weather-dependent."
  },
  'mid-wales': {
    intro: "Mid Wales is the quiet heart of the country - reservoirs, forests, market towns, and mountains without crowds. Cader Idris is the signature peak, the Elan Valley has spectacular Victorian engineering, and the coast from Aberystwyth to Borth has character.",
    bestBases: [
      { name: "Dolgellau", forWhat: "Cader Idris, Mawddach Trail, handsome town" },
      { name: "Aberystwyth", forWhat: "University town, beaches, Cambrian Mountains" },
      { name: "Machynlleth", forWhat: "Green capital, Dyfi Biosphere, mountain biking" },
      { name: "Llanidloes", forWhat: "Central base, Llyn Clywedog, quiet walking" },
    ],
    tips: [
      "Cader Idris is Snowdon-quality without Snowdon crowds",
      "Mawddach Trail (Dolgellau to Barmouth) is a perfect cycling day",
      "Dyfi mountain biking at Machynlleth rivals Snowdonia",
      "Elan Valley and Lake Vyrnwy are superb for wildlife and dark skies",
    ],
    seasonAdvice: "Year-round destination - it's never crowded. Autumn is spectacular for reservoir scenery. Winter can be harsh but accommodation is available and cheap."
  },
};

export async function generateStaticParams() {
  const regionsData = await getAllRegions();
  return regionsData.map((region) => ({
    region: region.slug,
  }));
}

export async function generateMetadata({ params }: AccommodationPageProps) {
  const { region: regionSlug } = await params;
  const region = await getRegionBySlug(regionSlug);
  
  if (!region) {
    return { title: "Accommodation Not Found" };
  }
  
  return {
    title: `Where to Stay in ${region.name} | Adventure Wales`,
    description: `Find adventure-friendly accommodation in ${region.name}. Hostels, bunkhouses, hotels and B&Bs perfect for outdoor activities.`,
  };
}

export default async function AccommodationPage({ params }: AccommodationPageProps) {
  const { region: regionSlug } = await params;
  const region = await getRegionBySlug(regionSlug);

  if (!region) {
    notFound();
  }

  const accommodation = await getAccommodationByRegion(regionSlug);
  const guide = regionalGuides[regionSlug];

  const types = ["All", "Hostel", "Bunkhouse", "Hotel", "B&B", "Camping", "Activity Centre"];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-white/70 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <Link href={`/${regionSlug}`} className="hover:text-white">{region.name}</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Stay</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Where to Stay in {region.name}
          </h1>
          <p className="text-white/80">
            {guide ? guide.intro.split('.')[0] + '.' : 'Adventure-friendly accommodation from hostels to hotels'}
          </p>
        </div>
      </section>

      {/* Regional Guide - if available */}
      {guide && (
        <section className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Best Bases */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                  <MapPin className="w-5 h-5" />
                  Best Bases
                </div>
                <ul className="space-y-2 text-sm">
                  {guide.bestBases.map((base) => (
                    <li key={base.name}>
                      <span className="font-medium text-gray-900">{base.name}</span>
                      <span className="text-gray-500"> — {base.forWhat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Local Tips */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                  <Compass className="w-5 h-5" />
                  Local Tips
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {guide.tips.slice(0, 3).map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Season Advice */}
              <div className="bg-white rounded-xl p-5 shadow-sm md:col-span-2">
                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                  <Mountain className="w-5 h-5" />
                  When to Visit
                </div>
                <p className="text-sm text-gray-600">{guide.seasonAdvice}</p>
                {guide.tips.length > 3 && (
                  <p className="text-sm text-gray-500 mt-3 pt-3 border-t">
                    <span className="font-medium">Also:</span> {guide.tips[3]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {types.map((type, i) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  i === 0
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            Showing {accommodation.length} properties
          </p>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accommodation.map((item) => (
            <AccommodationCard
              key={item.accommodation.id}
              accommodation={item.accommodation}
              region={item.region}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
