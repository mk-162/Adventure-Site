import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ExternalLink, ChevronLeft, Clock, User, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Top 5 Quirkiest Places to Stay on the Gower (2026) | Adventure Wales",
  description: "Clifftop glamping, converted barns, and beach huts — discover the Gower Peninsula's most unique accommodation.",
  openGraph: {
    title: "Top 5 Quirkiest Places to Stay on the Gower",
    description: "Britain's first AONB has quirky stays to match its stunning beaches",
    type: "article",
  },
};

const stays = [
  {
    rank: 1,
    name: "Three Cliffs Bay Glamping",
    location: "Penmaen",
    price: "From £90/night",
    description: `Three Cliffs Bay is regularly voted one of Britain's most beautiful beaches — and you can wake up overlooking it. The campsite at the top of the valley has luxury bell tents and yurts with proper beds, wood burners, and views that'll make you forget your own name.

The walk down to the beach takes about 15 minutes through the valley, crossing stepping stones over the stream. At low tide, you can explore caves, rock pools, and the dramatic limestone cliffs that give the bay its name. At high tide, it's one of the best swimming spots in Wales.

The glamping tents are beautifully kitted out — fairy lights, rugs, and enough comfort that you won't feel like you're roughing it. But the star of the show is always that view.`,
    whyItsQuirky: "Glamping with views over Britain's most beautiful beach. Wake up, walk down to the sand, wonder why you ever lived in a city.",
    perfectFor: "Beach lovers, families, photographers, anyone who wants the WOW factor",
    bookingUrl: "https://www.threecliffsbay.com",
    image: "/images/accommodation/quirky/three-cliffs-glamping.jpg",
  },
  {
    rank: 2,
    name: "The King Arthur Hotel",
    location: "Reynoldston",
    price: "From £85/night",
    description: `The King Arthur is a proper village pub at the heart of the Gower, with rooms upstairs that are far nicer than you'd expect. It's the kind of place where you plan to have one drink and end up staying all evening, chatting to locals about surf spots and walking routes.

The rooms have been recently refurbished with style and comfort in mind — good beds, proper bathrooms, and views over the village green or surrounding hills. But the real draw is downstairs: excellent local ales, homemade food, and an atmosphere that feels genuinely Welsh.

You're in the centre of the peninsula here, with easy access to beaches in both directions. The pub does packed lunches for walkers and has that increasingly rare quality — genuine hospitality from people who love their patch.`,
    whyItsQuirky: "A characterful village pub with surprisingly stylish rooms. Local ales, homemade food, and landlords who know every secret beach.",
    perfectFor: "Walkers, surfers, foodies, anyone who appreciates a proper pub",
    bookingUrl: "https://www.kingarthurhotel.co.uk",
    image: "/images/accommodation/quirky/king-arthur.jpg",
  },
  {
    rank: 3,
    name: "Parc-le-Breos House",
    location: "Parkmill",
    price: "From £140/night",
    description: `A grand Victorian hunting lodge in the middle of the Gower, surrounded by ancient woodland and with its own Neolithic burial chamber in the grounds. Parc-le-Breos is the kind of place that makes you feel like a 19th-century aristocrat — all high ceilings, open fires, and creaking floorboards.

The house has been in the same family for generations and has that wonderful lived-in quality that boutique hotels try to manufacture and never quite achieve. Dinner is available by arrangement and is excellent.

From here, you can walk to Three Cliffs Bay through the woods, explore the burial chamber (5,000 years old and genuinely atmospheric), or just sit by the fire and pretend you're in a period drama.`,
    whyItsQuirky: "Victorian hunting lodge with a Neolithic burial chamber in the garden. History layered on history, with very comfortable beds.",
    perfectFor: "History lovers, couples wanting romance, anyone who's ever fantasised about owning a country estate",
    bookingUrl: "https://www.parc-le-breos.co.uk",
    image: "/images/accommodation/quirky/parc-le-breos.jpg",
  },
  {
    rank: 4,
    name: "Port Eynon Youth Hostel",
    location: "Port Eynon",
    price: "From £25/night",
    description: `Not all quirky stays need to be expensive. Port Eynon YHA is a former lifeboat station right on the beach — and you can stay here for the price of a couple of pints. Wake up to the sound of waves, step outside onto the sand, and wonder why anyone pays more.

The accommodation is hostel-style (dorms and private rooms), but the location is unbeatable. The building has that maritime character — thick walls, small windows, and the sense of history that comes from decades of saving lives at sea.

Port Eynon is one of the Gower's best beaches, with excellent rock pooling at low tide and a gorgeous sunset view. There's a pub up the hill for food and drink, and some of the best coastal walking in Wales on your doorstep.`,
    whyItsQuirky: "A former lifeboat station on the beach, now a youth hostel. Maritime history, budget prices, unbeatable location.",
    perfectFor: "Budget travelers, solo adventurers, families, surfers, anyone who values location over luxury",
    bookingUrl: "https://www.yha.org.uk/hostel/yha-port-eynon",
    image: "/images/accommodation/quirky/port-eynon-yha.jpg",
  },
  {
    rank: 5,
    name: "Oldwalls Gower Glamping",
    location: "Llanrhidian",
    price: "From £150/night",
    description: `At the quiet northern end of the Gower, overlooking the Llanrhidian marsh and the Loughor estuary, Oldwalls offers upmarket glamping with hot tubs and proper style. The safari tents are huge, with king-size beds, wood burners, and private bathrooms.

What sets it apart is the setting — this is the wild side of the Gower, with salt marsh, birdlife, and big skies. The sunsets over the estuary are spectacular, and there's a real sense of remoteness even though you're only 15 minutes from Swansea.

The hot tubs are wood-fired and private to each tent. There's a farm shop on site, and the owners are passionate about the peninsula. It's glamping for grown-ups who want peace, comfort, and quality.`,
    whyItsQuirky: "Safari tents with private hot tubs overlooking the wild side of Gower. Grown-up glamping with proper style.",
    perfectFor: "Couples, small groups, anyone wanting peace and stargazing",
    bookingUrl: "https://www.oldwallsgower.co.uk",
    image: "/images/accommodation/quirky/oldwalls-glamping.jpg",
  },
];

export default function QuirkyStaysGowerPage() {
  return (
    <article className="min-h-screen bg-white">
      <header className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/regions/gower-hero.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <Link href="/journal/quirky-stays" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4">
            <ChevronLeft className="h-4 w-4" />All Quirky Stays
          </Link>
          <div className="flex items-center gap-2 text-accent-hover text-sm font-bold mb-3"><Sparkles className="h-4 w-4" />QUIRKY ACCOMMODATION</div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Top 5 Quirkiest Places to Stay on the Gower</h1>
          <p className="text-lg text-white/90 max-w-2xl">Britain's first AONB has quirky stays to match its stunning beaches — from clifftop glamping to lifeboat station hostels.</p>
          <div className="flex items-center gap-4 mt-6 text-white/70 text-sm">
            <span className="flex items-center gap-1"><User className="h-4 w-4" />Adventure Wales Team</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />7 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-lg">
          <p className="text-xl text-slate-600 leading-relaxed">The Gower was the UK's first Area of Outstanding Natural Beauty — and its accommodation scene is just as special as its beaches.</p>
          <p className="text-slate-600">From glamping above Three Cliffs Bay to a former lifeboat station, here are five unforgettable places to stay.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {stays.map((stay, index) => (
          <section key={stay.name} className="mb-16 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">{stay.rank}</div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">{stay.name}</h2>
                <p className="text-slate-500 flex items-center gap-1"><MapPin className="h-4 w-4" />{stay.location} • {stay.price}</p>
              </div>
            </div>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-6">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${stay.image}')` }} />
            </div>
            <div className="prose prose-lg max-w-none mb-6">
              {stay.description.split('\n\n').map((para, i) => (<p key={i} className="text-slate-700">{para}</p>))}
            </div>
            <div className="bg-accent-hover/10 border-l-4 border-accent-hover rounded-r-xl p-6 mb-6">
              <p className="font-bold text-primary mb-1 flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent-hover" />Why it's quirky</p>
              <p className="text-slate-700">{stay.whyItsQuirky}</p>
            </div>
            <p className="text-slate-600 mb-4"><span className="font-semibold">Perfect for:</span> {stay.perfectFor}</p>
            <a href={stay.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors">Check Availability<ExternalLink className="h-4 w-4" /></a>
            {index < stays.length - 1 && <hr className="mt-12 border-slate-200" />}
          </section>
        ))}
      </div>

      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Explore More Quirky Stays</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/journal/quirky-stays-snowdonia" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">Snowdonia</Link>
            <Link href="/journal/quirky-stays-pembrokeshire" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">Pembrokeshire</Link>
            <Link href="/journal/quirky-stays-brecon-beacons" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">Brecon Beacons</Link>
            <Link href="/journal/quirky-stays-anglesey" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">Anglesey</Link>
            <Link href="/journal/quirky-stays" className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">View All Regions →</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
