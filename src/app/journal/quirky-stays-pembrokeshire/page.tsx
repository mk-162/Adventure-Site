import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ExternalLink, ChevronLeft, Clock, User, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Top 5 Quirkiest Places to Stay in Pembrokeshire (2026) | Adventure Wales",
  description: "Sleep in a UFO, a converted jet plane, or a hobbit house — discover Pembrokeshire's most wonderfully weird accommodation options.",
  openGraph: {
    title: "Top 5 Quirkiest Places to Stay in Pembrokeshire",
    description: "UFO glamping, converted aircraft, and hobbit houses on the Welsh coast",
    type: "article",
    images: ["/images/journal/quirky-stays-pembrokeshire-hero.jpg"],
  },
};

const stays = [
  {
    rank: 1,
    name: "Apple Camping UFO & Jet Star",
    location: "Redberth, near Tenby",
    price: "From £100/night",
    description: `This might be the maddest accommodation in Wales — and we're absolutely here for it. Apple Camping has a genuine UFO (yes, a spaceship-shaped pod you can sleep in) and a converted Jet Star aircraft fuselage. Both are completely functional accommodation, with proper beds, heating, and all the essentials.

The UFO sleeps two and has porthole windows, mood lighting, and a distinctly "we've landed in a Welsh field" vibe. The Jet Star keeps its airline windows and overhead luggage bins, repurposed into the strangest glamping experience you'll ever have.

The site also has more conventional yurts and domes, but let's be honest — you're here for the UFO. It's gloriously ridiculous, surprisingly comfortable, and guaranteed to be the most memorable place you've ever slept.`,
    whyItsQuirky: "Literally sleep in a UFO or a converted passenger jet. Nothing else needs to be said.",
    perfectFor: "Families with kids, aviation enthusiasts, UFO believers, and anyone who appreciates pure absurdity",
    bookingUrl: "https://www.applecamping.co.uk",
    image: "/images/regions/pembrokeshire-hero.jpg",
  },
  {
    rank: 2,
    name: "Florence Springs Hobbit Houses",
    location: "Tenby",
    price: "From £120/night",
    description: `Burrowed into the hillside at Florence Springs are a collection of hobbit houses that look like they've been lifted straight from the Shire. With curved doors, round windows, and grass-covered roofs, these are as close to Middle Earth as you'll get in West Wales.

Inside, they're surprisingly spacious — proper beds, fully equipped kitchens, and en-suite bathrooms. Many have private hot tubs on their decks, and the whole site has a tranquil, fairy-tale atmosphere.

Florence Springs also has treehouses and luxury yurts if hobbits aren't your thing (though frankly, we don't trust anyone who doesn't want to sleep in a hobbit house). There's a fishing lake, nature trails, and you're just a few miles from Tenby's beaches.`,
    whyItsQuirky: "Actual hobbit houses with round doors, grass roofs, and hot tubs. Gandalf would approve.",
    perfectFor: "Lord of the Rings fans, families, couples wanting something magical",
    bookingUrl: "https://www.florencesprings.co.uk",
    image: "/images/regions/pembrokeshire-hero.jpg",
  },
  {
    rank: 3,
    name: "Roch Castle",
    location: "Roch, near St Davids",
    price: "From £250/night",
    description: `If you're going to stay in a castle, make it a proper one. Roch Castle is a 12th-century Norman fortress perched on a volcanic outcrop with panoramic views across St Brides Bay. It's been immaculately restored into a luxury boutique hotel, but it still feels distinctly castle-y — thick stone walls, winding staircases, and a genuine medieval atmosphere.

Each of the six rooms is individually designed, with huge beds, designer bathrooms, and views that stretch to the Preseli Hills. The Tower Suite, in the original Norman tower, is particularly spectacular.

What makes it special is the contrast — modern luxury inside ancient walls. You're in a castle, but you have underfloor heating and a rainfall shower. Breakfast is served in the medieval hall, and there's a hot tub in the courtyard. Properly pinch-yourself stuff.`,
    whyItsQuirky: "A genuine 12th-century Norman castle, restored to boutique hotel standards. Sleep where knights once stood guard.",
    perfectFor: "Couples celebrating something special, history lovers, anyone who's ever wanted to live in a castle",
    bookingUrl: "https://www.rochcastle.com",
    image: "/images/regions/pembrokeshire-hero.jpg",
  },
  {
    rank: 4,
    name: "Fforest Farm",
    location: "Cilgerran, near Cardigan",
    price: "From £110/night",
    description: `Fforest is the kind of place that makes you reconsider your entire lifestyle. This 200-acre farm on the banks of the Teifi River has been transformed into a glamping paradise — geodesic domes, safari tents, and cabins scattered through ancient woodland and wildflower meadows.

There's a farm shop, a pizza barn, communal fire pits, and a riverside beach. The atmosphere is laid-back and community-minded — you'll probably end up chatting to strangers around the fire and making plans to swim in the river at dawn.

The accommodation ranges from simple bell tents to the extraordinary Fforest Dome — a transparent geodesic structure where you can stargaze from your bed. It's glamping done with genuine style and soul.`,
    whyItsQuirky: "Geodesic domes, riverside glamping, and a community vibe that'll make you question city life. Plus, pizza from a barn.",
    perfectFor: "Groups of friends, families, festival lovers, anyone seeking community",
    bookingUrl: "https://www.coldatnight.co.uk",
    image: "/images/regions/pembrokeshire-hero.jpg",
  },
  {
    rank: 5,
    name: "Preseli Venture Eco Lodge",
    location: "Mathry, near St Davids",
    price: "From £60/night",
    description: `If you're coming to Pembrokeshire for adventure — coasteering, sea kayaking, surfing — there's no better basecamp than Preseli Venture. This eco-lodge is run by the adventure company of the same name, so you can roll out of bed and straight into the action.

The accommodation is dorm-style or private rooms, with a communal kitchen, cozy lounge with wood burner, and drying room for your soggy wetsuits. It's not luxury, but it's clean, comfortable, and perfectly designed for active trips.

What makes it quirky is the setup — it's basically a summer camp for adults. Book a coasteering and accommodation package, eat communal meals, swap stories with fellow adventurers. If you're traveling solo, this is where you'll make friends.`,
    whyItsQuirky: "An adventure activity basecamp where you sleep, eat, and play with fellow thrill-seekers. Summer camp vibes, adult adventures.",
    perfectFor: "Solo travelers, adventure groups, anyone who wants to coasteer and make friends",
    bookingUrl: "https://www.preseliventure.co.uk",
    image: "/images/regions/pembrokeshire-hero.jpg",
  },
];

export default function QuirkyStaysPembrokeshirePage() {
  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <header className="relative h-[50vh] min-h-[400px] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/regions/pembrokeshire-hero.jpg')" }}
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
            Top 5 Quirkiest Places to Stay in Pembrokeshire
          </h1>
          
          <p className="text-lg text-white/90 max-w-2xl">
            From UFO glamping to Norman castles and hobbit houses — Pembrokeshire does weird accommodation better than anywhere.
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
            Pembrokeshire has always attracted creative, slightly eccentric people — and that shows in the accommodation. This corner of Wales has UFOs, jet planes, hobbit houses, and Norman castles available for overnight stays.
          </p>
          <p className="text-slate-600">
            We've rounded up the five most gloriously weird places to sleep on the Pembrokeshire coast. These aren't just beds — they're talking points, Instagram opportunities, and genuine adventures in themselves.
          </p>
        </div>
      </div>

      {/* Listicle */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {stays.map((stay, index) => (
          <section key={stay.name} className="mb-16 scroll-mt-24" id={`stay-${stay.rank}`}>
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

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-6">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${stay.image}')` }}
              />
            </div>

            <div className="prose prose-lg max-w-none mb-6">
              {stay.description.split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-700">{para}</p>
              ))}
            </div>

            <div className="bg-accent-hover/10 border-l-4 border-accent-hover rounded-r-xl p-6 mb-6">
              <p className="font-bold text-primary mb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-hover" />
                Why it's quirky
              </p>
              <p className="text-slate-700">{stay.whyItsQuirky}</p>
            </div>

            <p className="text-slate-600 mb-4">
              <span className="font-semibold">Perfect for:</span> {stay.perfectFor}
            </p>

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
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/journal/quirky-stays-snowdonia" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">
              Snowdonia
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
