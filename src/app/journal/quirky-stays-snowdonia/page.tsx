import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Star, ChevronLeft, Clock, User, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Top 5 Quirkiest Places to Stay in Snowdonia (2026) | Adventure Wales",
  description: "From magical treehouses to Italianate villages and slate mine glamping - discover the 5 most wonderfully weird places to stay in Snowdonia National Park.",
  openGraph: {
    title: "Top 5 Quirkiest Places to Stay in Snowdonia",
    description: "Treehouses, converted boats, and a surreal Italian village - Snowdonia's most unique accommodation",
    type: "article",
    images: ["/images/journal/quirky-stays-snowdonia-hero.jpg"],
  },
};

const stays = [
  {
    rank: 1,
    name: "Living Room Treehouses",
    location: "Machynlleth",
    price: "From £140/night",
    description: `If you've ever dreamed of living in a treehouse, this is where dreams come true. Nestled in a hidden valley near Machynlleth, the Living Room Treehouses are genuinely magical — six hand-crafted wooden structures suspended high in the tree canopy, completely off-grid and utterly peaceful.

Each treehouse has a wood-burning stove, solar lighting, and floor-to-ceiling windows that make you feel like you're floating in the forest. There's no WiFi, no TV, no phone signal — and that's entirely the point. You'll fall asleep to owls and wake up to birdsong.

The hot tub treehouse (yes, really) has a cedar wood tub on the deck with views across the valley. It's the kind of place that makes you wonder why you ever bothered with hotels.`,
    whyItsQuirky: "Completely off-grid treehouses with wood-fired hot tubs suspended in an ancient Welsh forest. No WiFi, no signal, no problem.",
    perfectFor: "Couples wanting a romantic escape or anyone desperate for a digital detox",
    bookingUrl: "https://www.living-room.co",
    image: "/images/regions/snowdonia-hero.jpg",
  },
  {
    rank: 2,
    name: "Portmeirion Village",
    location: "Minffordd",
    price: "From £150/night",
    description: `Portmeirion is quite possibly the strangest place in Wales — and we mean that as the highest compliment. This Italianate village, built by eccentric architect Clough Williams-Ellis between 1925 and 1975, looks like it was airlifted from the Amalfi Coast and dropped into the Snowdonia countryside.

You can actually stay here, in rooms scattered throughout the village — from the grand hotel to quirky self-catering cottages with names like "Angel" and "The Gatehouse". Wander through sub-tropical gardens (yes, palm trees in Wales), past pastel-coloured buildings, ornate fountains, and architectural salvage from demolished English stately homes.

It's famously where cult TV series "The Prisoner" was filmed, and the surreal atmosphere remains. Breakfast on the terrace overlooking the estuary, with peacocks strutting past, is unlike anywhere else in Britain.`,
    whyItsQuirky: "An entire Italianate village in the middle of Snowdonia, built by a maverick architect. It's like waking up in a fever dream — but a beautiful one.",
    perfectFor: "Architecture nerds, The Prisoner fans, and anyone who appreciates beautiful eccentricity",
    bookingUrl: "https://portmeirion.wales/stay",
    image: "/images/regions/snowdonia-hero.jpg",
  },
  {
    rank: 3,
    name: "Smugglers Cove Boatyard",
    location: "Mawddach Estuary",
    price: "From £100/night",
    description: `Hidden on the edge of the Mawddach Estuary — arguably the most beautiful estuary in Britain — Smugglers Cove is the kind of place you stumble upon and never want to leave. Stay in a converted boat or one of the quirky boathouses, each with wood burners, private decks, and direct water access.

The setting is impossibly romantic. Watch the sun set over Cader Idris from your deck, kayak straight out from your doorstep, or just sit with a glass of wine and wonder how you got so lucky. At low tide, you can walk across the sand to the village of Fairbourne.

This isn't polished, corporate accommodation — it's charming, personal, and wonderfully eccentric. The kind of place with character you can't manufacture.`,
    whyItsQuirky: "Sleep on a converted boat in a secret cove on a stunning estuary. Kayak from your bedroom door. Watch the tide come and go.",
    perfectFor: "Water lovers, romantics, and anyone who fantasises about running away to sea",
    bookingUrl: "https://www.smugglerscove.info/",
    image: "/images/regions/snowdonia-hero.jpg",
  },
  {
    rank: 4,
    name: "Llechwedd Slate Caverns Glamping",
    location: "Blaenau Ffestiniog",
    price: "From £120/night",
    description: `Where else can you go glamping on the edge of an active slate mine, with direct access to underground adventures? Llechwedd's safari tents are perched on a hillside overlooking the caverns, with views of the mountains and the mine's industrial heritage.

By day, you can bounce on underground trampolines at Bounce Below, zoom through caverns on Titan (the longest underground zip line in Europe), or explore the deep mine tours. By night, retreat to your tent with its proper beds, wood burner, and deck with mountain views.

There's something wonderfully Welsh about this — industrial heritage meets outdoor adventure meets comfortable camping. The onsite cafe does excellent Welsh cakes, and there's a real sense of being somewhere with history and purpose.`,
    whyItsQuirky: "Glamping above a working slate mine with underground zip lines and trampolines literally beneath your feet. Adventure on tap.",
    perfectFor: "Thrill-seekers, families, and anyone who wants Zip World on the doorstep",
    bookingUrl: "https://llechwedd.co.uk/glamping/",
    image: "/images/regions/snowdonia-hero.jpg",
  },
  {
    rank: 5,
    name: "Graig Wen",
    location: "Arthog, near Dolgellau",
    price: "From £90/night",
    description: `Graig Wen has won multiple awards for its eco-friendly approach, but don't let the sustainability credentials fool you — this is also genuinely gorgeous accommodation in a jaw-dropping location. Choose from yurts, a shepherd's hut, or eco-cabins, all with panoramic views across the Mawddach Estuary.

The site sprawls across 45 acres of wild woodland, with direct access to the Mawddach Trail for cycling and walking. You can kayak or paddleboard from the shore, watch ospreys fishing in the estuary, or just lie in your yurt watching the light change over the water.

What makes it special is the balance — enough comfort (proper beds, wood burners, hot showers) without losing the connection to nature. The owners are passionate and knowledgeable, and the communal fire pit is a great place to swap adventure stories.`,
    whyItsQuirky: "Award-winning yurts and shepherd's huts overlooking one of Britain's most beautiful estuaries. Eco-friendly without being uncomfortable.",
    perfectFor: "Eco-conscious adventurers, families, and cyclists doing the Mawddach Trail",
    bookingUrl: "https://www.graigwen.co.uk/",
    image: "/images/regions/snowdonia-hero.jpg",
  },
];

export default function QuirkyStaysSnowdoniaPage() {
  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <header className="relative h-[50vh] min-h-[400px] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/regions/snowdonia-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <Link 
            href="/journal/quirky-stays" 
            className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            All Quirky Stays
          </Link>
          
          <div className="flex items-center gap-2 text-accent-hover text-sm font-bold mb-3">
            <Sparkles className="h-4 w-4" />
            QUIRKY ACCOMMODATION
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Top 5 Quirkiest Places to Stay in Snowdonia
          </h1>
          
          <p className="text-lg text-white/90 max-w-2xl">
            From treehouses suspended in ancient woodland to an entire Italianate village — these are the most wonderfully weird places to sleep in the national park.
          </p>
          
          <div className="flex items-center gap-4 mt-6 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Adventure Wales Team
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              8 min read
            </span>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-lg">
          <p className="text-xl text-slate-600 leading-relaxed">
            Let's be honest — anyone can book a Travelodge. But if you're coming to Snowdonia for adventure, why would you sleep somewhere boring? The national park is full of accommodation that's as memorable as the mountains themselves.
          </p>
          <p className="text-slate-600">
            We've scoured the region for the quirkiest, most unusual, most "you have to see it to believe it" places to stay. These aren't just beds — they're experiences. From off-grid treehouses with hot tubs to glamping above underground zip lines, here are our top 5 picks for staying weird in Snowdonia.
          </p>
        </div>
      </div>

      {/* Listicle */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {stays.map((stay, index) => (
          <section key={stay.name} className="mb-16 scroll-mt-24" id={`stay-${stay.rank}`}>
            {/* Rank badge */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                {stay.rank}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                  {stay.name}
                </h2>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {stay.location} • {stay.price}
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-6">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${stay.image}')` }}
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-6">
              {stay.description.split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-700">{para}</p>
              ))}
            </div>

            {/* Quirky callout */}
            <div className="bg-accent-hover/10 border-l-4 border-accent-hover rounded-r-xl p-6 mb-6">
              <p className="font-bold text-primary mb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-hover" />
                Why it's quirky
              </p>
              <p className="text-slate-700">{stay.whyItsQuirky}</p>
            </div>

            {/* Perfect for */}
            <p className="text-slate-600 mb-4">
              <span className="font-semibold">Perfect for:</span> {stay.perfectFor}
            </p>

            {/* CTA */}
            <a
              href={stay.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Check Availability
              <ExternalLink className="h-4 w-4" />
            </a>

            {index < stays.length - 1 && (
              <hr className="mt-12 border-slate-200" />
            )}
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Explore More Quirky Stays
          </h2>
          <p className="text-slate-600 mb-8">
            Every region of Wales has its own collection of weird and wonderful places to stay. 
            From Pembrokeshire's UFO glamping to Anglesey's lighthouse cottages.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/journal/quirky-stays-pembrokeshire" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">
              Pembrokeshire
            </Link>
            <Link href="/journal/quirky-stays-brecon-beacons" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">
              Brecon Beacons
            </Link>
            <Link href="/journal/quirky-stays-anglesey" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">
              Anglesey
            </Link>
            <Link href="/journal/quirky-stays-gower" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">
              Gower
            </Link>
            <Link href="/journal/quirky-stays" className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
              View All Regions →
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
