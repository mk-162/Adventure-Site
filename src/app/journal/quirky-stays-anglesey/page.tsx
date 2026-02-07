import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ExternalLink, ChevronLeft, Clock, User, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Top 5 Quirkiest Places to Stay on Anglesey (2026) | Adventure Wales",
  description: "Lighthouses, windmills, and French châteaux — discover Anglesey's most wonderfully weird accommodation options.",
  openGraph: {
    title: "Top 5 Quirkiest Places to Stay on Anglesey",
    description: "Sleep in lighthouses, windmills, and châteaux on Wales's adventure island",
    type: "article",
  },
};

const stays = [
  {
    rank: 1,
    name: "Point Lynas Lighthouse",
    location: "Llaneilian",
    price: "From £180/night",
    description: `Perched on the dramatic north coast of Anglesey, Point Lynas Lighthouse has been guiding ships since 1835. Now, the keeper's cottage next to the tower has been converted into self-catering accommodation — and you can actually stay here.

Wake up to 180-degree sea views, watch ships passing on the horizon, and at night, the lighthouse beam sweeps across your ceiling every few seconds (you get used to it, and honestly it's quite hypnotic). The cottage sleeps up to 6 and is cozy and well-equipped.

The location is spectacular but remote — bring supplies, as the nearest shop is a drive away. The sunsets are worth every mile of the journey.`,
    whyItsQuirky: "Sleep next to a working lighthouse, with the beam sweeping overhead. Maritime history and dramatic sea views.",
    perfectFor: "Photographers, maritime enthusiasts, families wanting a unique adventure",
    bookingUrl: "https://www.trinityhouse.co.uk/point-lynas-lighthouse",
    image: "/images/regions/anglesey-hero.jpg",
  },
  {
    rank: 2,
    name: "Château Rhianfa",
    location: "Menai Bridge",
    price: "From £250/night",
    description: `A French château on the Menai Strait — because why not? Built in 1849 as a romantic wedding gift, Château Rhianfa looks like it's been transplanted directly from the Loire Valley. Turrets, towers, Gothic windows, and manicured gardens overlooking the water.

Inside, it's all Victorian grandeur — four-poster beds, roll-top baths, and views across to Snowdonia. The restaurant is excellent, and there's something wonderfully surreal about eating fine dining while looking at Welsh mountains through French windows.

Yes, it's expensive. Yes, it's fancy. But if you're celebrating something or just want to feel like minor royalty for a night, there's nowhere quite like it.`,
    whyItsQuirky: "A full-blown French château overlooking the Menai Strait. Victorian romance meets Welsh adventure.",
    perfectFor: "Couples celebrating, wedding parties, Francophiles who can't quite afford France",
    bookingUrl: "https://www.chateaurhianfa.com",
    image: "/images/regions/anglesey-hero.jpg",
  },
  {
    rank: 3,
    name: "Melin Newydd Windmill",
    location: "Llanddona",
    price: "From £120/night",
    description: `This 200-year-old windmill has been converted into cozy self-catering accommodation while keeping all its character. The circular rooms, thick stone walls, and original features make it unlike any other stay on the island.

The ground floor has the living space, with a spiral staircase leading up to the bedroom in the old millroom. Views from the top look across Red Wharf Bay and the Snowdonia mountains beyond.

It's compact — this is a windmill, after all — but perfectly formed for couples. There's something magical about the curved walls and the sense of history. The local beach at Llanddona is one of Anglesey's best.`,
    whyItsQuirky: "A converted windmill with circular rooms and spiral staircases. 200 years of history in a compact, cozy space.",
    perfectFor: "Couples, history lovers, anyone who's ever looked at a windmill and wondered what it's like inside",
    bookingUrl: "https://www.underthethatch.co.uk/melin-newydd",
    image: "/images/regions/anglesey-hero.jpg",
  },
  {
    rank: 4,
    name: "The Oyster Catcher",
    location: "Rhosneigr",
    price: "From £150/night",
    description: `Rhosneigr is Anglesey's surf and kite capital, and The Oyster Catcher is its most characterful place to stay. This boutique B&B in a Victorian villa combines surfer-chic style with genuine comfort — all driftwood furniture, ocean colours, and laid-back vibes.

The rooms are stylish without being pretentious, with huge beds and proper coffee. Breakfast is legendary — think full Welsh with local ingredients, or smashed avocado if you're feeling healthy. The beach is a two-minute walk.

What makes it quirky is the atmosphere — it's a proper surf town B&B run by people who actually understand the adventure community. Gear storage, local knowledge, and a welcome that makes you feel like you've arrived somewhere special.`,
    whyItsQuirky: "Surfer-chic boutique B&B in Anglesey's outdoor capital. Proper coffee, legendary breakfasts, beach on your doorstep.",
    perfectFor: "Surfers, kitesurfers, couples, anyone who appreciates design and a good breakfast",
    bookingUrl: "https://www.theoystercatcheranglesey.co.uk",
    image: "/images/regions/anglesey-hero.jpg",
  },
  {
    rank: 5,
    name: "Plas Menai",
    location: "Caernarfon",
    price: "From £60/night",
    description: `The National Outdoor Centre might not sound quirky, but hear us out. Plas Menai is where serious paddlers, sailors, and outdoor instructors train — and you can stay here too. Wake up overlooking the Menai Strait, with kayaks, dinghies, and windsurf boards ready to go.

The accommodation is simple (think activity centre rather than boutique hotel), but the location and access are unbeatable. You're literally on the water, with equipment hire and instruction available on tap.

It's quirky because it's the opposite of polished hospitality — it's functional, communal, and designed for people who came to Wales to DO things rather than just look at stuff. The bar has excellent stories from instructors and fellow guests.`,
    whyItsQuirky: "Sleep at the National Outdoor Centre and wake up on the water. Functional, communal, adventure-first accommodation.",
    perfectFor: "Paddlers, sailors, outdoor enthusiasts, anyone who prioritises access over thread count",
    bookingUrl: "https://www.plasmenai.co.uk",
    image: "/images/regions/anglesey-hero.jpg",
  },
];

export default function QuirkyStaysAngleseyPage() {
  return (
    <article className="min-h-screen bg-white">
      <header className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/regions/anglesey-hero.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <Link href="/journal/quirky-stays" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4">
            <ChevronLeft className="h-4 w-4" />All Quirky Stays
          </Link>
          <div className="flex items-center gap-2 text-accent-hover text-sm font-bold mb-3"><Sparkles className="h-4 w-4" />QUIRKY ACCOMMODATION</div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Top 5 Quirkiest Places to Stay on Anglesey</h1>
          <p className="text-lg text-white/90 max-w-2xl">Lighthouses, windmills, and French châteaux — Anglesey's most wonderfully weird accommodation.</p>
          <div className="flex items-center gap-4 mt-6 text-white/70 text-sm">
            <span className="flex items-center gap-1"><User className="h-4 w-4" />Adventure Wales Team</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />7 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-lg">
          <p className="text-xl text-slate-600 leading-relaxed">Anglesey is an island of contrasts — wild beaches, quiet villages, and some genuinely eccentric accommodation options.</p>
          <p className="text-slate-600">From lighthouses to French châteaux, here are five places that prove sleeping on this island is an adventure in itself.</p>
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
            <Link href="/journal/quirky-stays-gower" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">Gower</Link>
            <Link href="/journal/quirky-stays" className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">View All Regions →</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
