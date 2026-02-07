import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ExternalLink, ChevronLeft, Clock, User, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Top 5 Quirkiest Places to Stay in the Brecon Beacons (2026) | Adventure Wales",
  description: "From ruined priory hotels to suspended tree tents and castle stays — the Brecon Beacons' most wonderfully weird accommodation.",
  openGraph: {
    title: "Top 5 Quirkiest Places to Stay in the Brecon Beacons",
    description: "Sleep in priory ruins, tree tents, and Dark Sky lodges in Wales's adventure heartland",
    type: "article",
    images: ["/images/journal/quirky-stays-brecon-beacons-hero.jpg"],
  },
};

const stays = [
  {
    rank: 1,
    name: "Llanthony Priory Hotel",
    location: "Llanthony, Black Mountains",
    price: "From £85/night",
    description: `This might be the most atmospheric place to stay in Wales. The Llanthony Priory Hotel is literally built into the ruins of a 12th-century Augustinian priory, with parts of the ancient stonework forming the walls of the bar and bedrooms.

You'll walk past soaring Gothic arches to reach your room, have a pint in a cellar that monks used 800 years ago, and fall asleep in one of the most hauntingly beautiful settings imaginable. The Black Mountains rise dramatically on all sides, and at night, with no light pollution for miles, the stars are extraordinary.

The rooms are simple — don't expect luxury — but that's part of the charm. This is a place where history seeps from the walls, and where you'll feel genuinely transported to another time. The walking from the door is spectacular.`,
    whyItsQuirky: "Sleep in the actual ruins of a 12th-century priory. The bar is in the medieval cellar. Ghosts entirely optional.",
    perfectFor: "History buffs, hikers, photographers, and anyone who appreciates genuine atmosphere over boutique polish",
    bookingUrl: "https://www.llanthonypriory.co.uk",
    image: "/images/accommodation/quirky/llanthony-priory.jpg",
  },
  {
    rank: 2,
    name: "Red Kite Tree Tent",
    location: "Newbridge-on-Wye",
    price: "From £130/night",
    description: `Featured on George Clarke's Amazing Spaces, the Red Kite Tree Tent is a spherical pod suspended in the tree canopy, accessed by a wooden walkway. It's part tent, part treehouse, part spacecraft — and entirely unique.

Inside, there's a proper double bed, wood-burning stove, and panoramic windows looking out into the forest. Below, a private stream babbles through the woodland, and you have your own fire pit for evening cooking. Red kites (the birds, not more tents) wheel overhead.

This is genuinely off-grid — no electricity, no WiFi, no phone signal. Light comes from candles and the wood burner. It's the kind of place where you go to escape everything, float among the trees, and remember what silence sounds like.`,
    whyItsQuirky: "A spherical tent suspended in the trees, as seen on TV. Completely off-grid, completely peaceful, completely unlike anywhere else.",
    perfectFor: "Couples wanting romance and adventure, TV design fans, digital detoxers",
    bookingUrl: "https://www.sheepskinlife.com/relax-explore/red-kite-tree-tent",
    image: "/images/accommodation/quirky/red-kite-tree-tent.jpg",
  },
  {
    rank: 3,
    name: "Craig y Nos Castle",
    location: "Ystradgynlais",
    price: "From £90/night",
    description: `Once the home of Victorian opera star Adelina Patti, Craig y Nos Castle is a Gothic fantasy of turrets, towers, and theatrical history. The opera house she built in the grounds still stands, and the castle itself has been converted into a hotel with all the grandeur you'd expect.

It's also, by all accounts, extremely haunted. Ghost tours run regularly, and many guests report unexplained footsteps, cold spots, and the feeling of being watched. If that's your thing, you can specifically book the "most haunted" rooms.

Even if ghosts aren't your bag, the castle is spectacular — all carved wood, stained glass, and Victorian excess. There's a country park on the doorstep, Dan yr Ogof caves nearby, and the Brecon Beacons just up the valley.`,
    whyItsQuirky: "A Victorian opera singer's Gothic castle, complete with resident ghosts and an onsite opera house. Diva energy guaranteed.",
    perfectFor: "Ghost hunters, opera lovers, anyone who's ever wanted to dramatically sweep down a castle staircase",
    bookingUrl: "https://www.craigynoscastle.co.uk",
    image: "/images/accommodation/quirky/craig-y-nos.jpg",
  },
  {
    rank: 4,
    name: "Cosy Under Canvas",
    location: "Newchurch, near Hay-on-Wye",
    price: "From £100/night",
    description: `Geodesic domes in a wildflower meadow, with wood-fired hot tubs and views across the Black Mountains. Cosy Under Canvas is glamping done with genuine style — each dome is beautifully furnished with proper beds, rugs, and log burners.

What sets it apart is the setting. You're on a working farm at the foot of the mountains, with complete peace and dark skies overhead. The hot tubs (one per dome) are wood-fired, so you have to chop wood and light them yourself — which sounds like effort but is actually deeply satisfying.

There's a communal kitchen and hammock circle, but each dome is private enough that you might not see another soul. It's the perfect base for exploring Hay-on-Wye (book town and secondhand bookshop heaven) or hiking the Black Mountains.`,
    whyItsQuirky: "Geodesic domes with private wood-fired hot tubs in a wildflower meadow. You chop your own firewood. It's weirdly rewarding.",
    perfectFor: "Couples, book lovers visiting Hay, hikers, anyone who enjoys the satisfaction of lighting a fire",
    bookingUrl: "https://www.cosyundercanvas.co.uk",
    image: "/images/accommodation/quirky/cosy-under-canvas.jpg",
  },
  {
    rank: 5,
    name: "The Star Inn",
    location: "Talybont-on-Usk",
    price: "From £95/night",
    description: `The Star Inn isn't quirky in the UFO or treehouse sense — it's quirky because it's a properly excellent village pub that happens to have genuinely brilliant rooms upstairs. In an age of soulless chain hotels, a characterful coaching inn with log fires and local ale is borderline revolutionary.

The rooms are stylish and comfortable, with proper bathrooms and modern touches, but the real draw is downstairs. This is a proper Welsh pub with proper Welsh beer, excellent food, and the kind of atmosphere that makes you want to cancel your plans and stay another night.

You're right on the Monmouthshire & Brecon Canal, with towpath walking and cycling in both directions. Talybont itself is a lovely village, and the Beacons are just up the road. It's unpretentious, welcoming, and exactly what you want after a day in the hills.`,
    whyItsQuirky: "A proper village pub with proper rooms — radical in its ordinariness. Log fires, local ale, and landlords who actually want you there.",
    perfectFor: "Walkers, cyclists, real ale enthusiasts, anyone who thinks chain hotels have stolen our souls",
    bookingUrl: "https://www.starinntalybont.co.uk",
    image: "/images/accommodation/quirky/star-inn-talybont.jpg",
  },
];

export default function QuirkyStaysBreconBeaconsPage() {
  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <header className="relative h-[50vh] min-h-[400px] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/regions/brecon-beacons-hero.jpg')" }}
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
            Top 5 Quirkiest Places to Stay in the Brecon Beacons
          </h1>
          
          <p className="text-lg text-white/90 max-w-2xl">
            Medieval priory hotels, suspended tree tents, and haunted castles — the Brecon Beacons does atmospheric accommodation like nowhere else.
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
            The Brecon Beacons attract serious adventurers — and serious adventurers deserve more than a Premier Inn. This national park has some of the most atmospheric, unusual, and downright strange accommodation in Wales.
          </p>
          <p className="text-slate-600">
            From medieval priory ruins to suspended tree pods and ghost-infested castles, here are our five favourite places to stay weird in the Beacons.
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
            <Link href="/journal/quirky-stays-pembrokeshire" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-primary hover:border-primary transition-colors">
              Pembrokeshire
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
