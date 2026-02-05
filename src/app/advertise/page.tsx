import { Metadata } from "next";
import {
  Mountain,
  CheckCircle,
  Star,
  Search,
  MapPin,
  TrendingUp,
  ArrowRight,
  Mail,
  Map,
  Route,
  X,
  Sparkles,
  Image as ImageIcon,
  MousePointerClick,
  Clock,
  Quote,
  Megaphone,
  Users,
  Eye,
} from "lucide-react";
import { FAQAccordion } from "@/components/operators/FAQAccordion";
import { RegisterInterestForm } from "@/components/operators/RegisterInterestForm";
import { AlreadyListedTooltip } from "@/components/operators/AlreadyListedTooltip";
import { PricingSection } from "@/components/commercial/PricingSection";

export const metadata: Metadata = {
  title:
    "Advertise With Us — From £9.99/mo | Adventure Wales",
  description:
    "Grow your Welsh adventure business for just £9.99/mo. Get discovered by thousands planning Welsh trips. Free listing available — upgrade anytime.",
  openGraph: {
    title: "Advertise With Us — From £9.99/mo | Adventure Wales",
    description:
      "Grow your Welsh adventure business for just £9.99/mo. Free listing available — upgrade anytime.",
    siteName: "Adventure Wales",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertise With Us — From £9.99/mo | Adventure Wales",
    description:
      "Grow your Welsh adventure business for just £9.99/mo. Free listing, enhanced & premium plans.",
  },
};

/* ── Data ─────────────────────────────────────────────── */

const stats = [
  { value: "129", label: "Activities Listed", icon: MapPin },
  { value: "54", label: "Trip Itineraries", icon: Route },
  { value: "12", label: "Regions Covered", icon: Map },
];

const steps = [
  {
    icon: Search,
    title: "Find Your Listing",
    description: "We've already started building your profile. Search our directory to find it.",
  },
  {
    icon: Mail,
    title: "Claim & Verify",
    description: "One click to claim ownership. Verify your email — takes 30 seconds.",
  },
  {
    icon: TrendingUp,
    title: "Go Live & Grow",
    description: "Your listing appears in search, itineraries, and trip plans instantly.",
  },
];

const testimonials = [
  {
    quote: "Since upgrading to Enhanced, we've seen 3× more enquiries from our listing. The itinerary placement alone is worth it.",
    name: "Sarah T.",
    business: "Coasteering Pembrokeshire",
  },
  {
    quote: "We were paying £65/mo on TripAdvisor for less visibility. This is a no-brainer at £9.99.",
    name: "James R.",
    business: "Snowdonia Adventures",
  },
  {
    quote: "The booking integration meant customers could book directly — no commission, no middleman. Brilliant.",
    name: "Elin M.",
    business: "Brecon Beacons Kayaking",
  },
];

const faqItems = [
  {
    question: "Is my business already listed?",
    answer:
      "Probably! We've pre-listed many Welsh tourism businesses. Search our directory to find yours, or contact us to get added.",
  },
  {
    question: "What does 'per location' mean?",
    answer:
      "Each physical site or base counts as one location. If you operate from Snowdonia and Pembrokeshire, that's 2 locations.",
  },
  {
    question: "Do you take commission on bookings?",
    answer:
      "No commission on bookings through your own system. We earn through listing subscriptions only. You keep 100% of your revenue.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts, no lock-in. Cancel your subscription anytime and keep your free listing.",
  },
];

/* ── Comparison table data ────────────────────────────── */

interface ComparisonRow {
  feature: string;
  free: string | boolean;
  enhanced: string | boolean;
  premium: string | boolean;
}

const comparisonRows: ComparisonRow[] = [
  {
    feature: "Control Your Listing",
    free: "Basic (name, link)",
    enhanced: "Full profile, photos & gallery",
    premium: "Full profile + priority editing",
  },
  {
    feature: "Itinerary Inclusion",
    free: false,
    enhanced: true,
    premium: "Featured placement",
  },
  {
    feature: "Bookings & Leads",
    free: "Website link only",
    enhanced: "Booking widget + enquiry forwarding",
    premium: "Instant lead alerts + booking widget",
  },
  {
    feature: "Exposure & Analytics",
    free: "Directory listing",
    enhanced: "Region pages + monthly report",
    premium: "Priority search + competitor benchmarking",
  },
  {
    feature: "Promotions & Offers",
    free: false,
    enhanced: false,
    premium: "Special offers displayed on listing",
  },
  {
    feature: "Support",
    free: "Community",
    enhanced: "Email support",
    premium: "Dedicated account manager",
  },
];

/* ── Helper: render cell ──────────────────────────────── */

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />;
  if (value === false) return <X className="h-5 w-5 text-slate-300 mx-auto" />;
  return <span className="text-sm text-slate-700">{value}</span>;
}

/* ── Page ─────────────────────────────────────────────── */

export default function ForOperatorsPage() {
  return (
    <div className="bg-white">
      {/* ═══ STICKY PRICING BAR ═══ */}
      <div className="sticky top-0 z-50 bg-primary text-white py-2.5 text-center text-sm font-medium shadow-md">
        <span className="hidden sm:inline">🏴󠁧󠁢󠁷󠁬󠁳󠁿 </span>
        Enhanced listings from{" "}
        <span className="font-bold text-accent-hover">£9.99/mo</span> — TripAdvisor
        charges £65+.{" "}
        <a
          href="#pricing"
          className="underline underline-offset-2 hover:text-accent-hover transition-colors"
        >
          See plans ↓
        </a>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#2d5a73]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent-hover blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
              <Mountain className="h-4 w-4" />
              For Tourism &amp; Adventure Businesses
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Grow Your Wales Adventure Business for Just{" "}
              <span className="text-accent-hover">£9.99/mo</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              Get discovered by thousands planning Welsh trips. Your listing,
              your bookings, your revenue — no commission, no middleman.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href="#register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-hover text-white font-semibold rounded-full hover:bg-accent-hover transition-colors text-base shadow-lg shadow-orange-500/25"
              >
                Claim Free &amp; Upgrade
                <ArrowRight className="h-5 w-5" />
              </a>
              <AlreadyListedTooltip />
            </div>

            {/* Urgency nudge */}
            <p className="text-sm text-amber-300/90 font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              First 10 upgrades get a free sponsored itinerary spot
            </p>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 py-8 px-6 sm:px-10">
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-hover/10 mb-3">
                    <stat.icon className="h-6 w-6 text-accent-hover" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section id="pricing" className="py-20 sm:py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              What You Get — At a Glance
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three plans, zero commission. Pick what fits your business today —
              upgrade anytime.
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="py-5 px-6 text-sm font-semibold text-slate-600 w-[30%]">
                    Feature
                  </th>
                  <th className="py-5 px-4 text-center w-[20%]">
                    <div className="text-sm font-semibold text-slate-600">Free</div>
                    <div className="text-2xl font-extrabold text-primary mt-1">£0</div>
                    <div className="text-xs text-slate-400">forever</div>
                  </th>
                  <th className="py-5 px-4 text-center w-[28%] bg-accent-hover/5 border-x-2 border-accent-hover/20 relative">
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 -translate-y-full inline-flex items-center gap-1 px-3 py-1 rounded-t-lg bg-accent-hover text-white text-xs font-bold uppercase tracking-wide">
                      <Star className="h-3 w-3" /> Recommended
                    </span>
                    <div className="text-sm font-semibold text-accent-hover">Enhanced</div>
                    <div className="text-2xl font-extrabold text-primary mt-1">
                      £9.99<span className="text-sm font-normal text-slate-500">/mo</span>
                    </div>
                    <div className="text-xs text-slate-400">+VAT · per location</div>
                  </th>
                  <th className="py-5 px-4 text-center w-[22%]">
                    <div className="text-sm font-semibold text-slate-600">Premium</div>
                    <div className="text-2xl font-extrabold text-primary mt-1">
                      £29.99<span className="text-sm font-normal text-slate-500">/mo</span>
                    </div>
                    <div className="text-xs text-slate-400">+VAT · per location</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="py-4 px-6 text-sm font-medium text-primary">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CellValue value={row.free} />
                    </td>
                    <td className="py-4 px-4 text-center bg-accent-hover/5 border-x-2 border-accent-hover/20">
                      <CellValue value={row.enhanced} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <CellValue value={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-6">
            {/* Free mobile */}
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-primary">Free — £0</h3>
              <p className="text-sm text-slate-500 mb-4">Basic directory listing</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />Basic listing (name, link)</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />Directory &amp; region pages</li>
                <li className="flex items-start gap-2"><X className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />No itinerary inclusion</li>
                <li className="flex items-start gap-2"><X className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />No booking widget</li>
              </ul>
            </div>
            {/* Enhanced mobile */}
            <div className="rounded-2xl border-2 border-accent-hover p-6 relative shadow-lg">
              <span className="absolute -top-3 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-hover text-white text-xs font-bold">
                <Star className="h-3 w-3" /> Recommended
              </span>
              <h3 className="text-lg font-bold text-primary mt-2">Enhanced — £9.99/mo <span className="text-sm font-normal text-slate-500">+VAT</span></h3>
              <p className="text-sm text-slate-500 mb-4">Full profile &amp; bookings</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Full profile, photos &amp; gallery</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Itinerary inclusion</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Booking widget + enquiry forwarding</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />Monthly analytics report</li>
              </ul>
            </div>
            {/* Premium mobile */}
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-primary">Premium — £29.99/mo <span className="text-sm font-normal text-slate-500">+VAT</span></h3>
              <p className="text-sm text-slate-500 mb-4">Maximum visibility</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><Star className="h-4 w-4 text-primary mt-0.5 shrink-0" />Everything in Enhanced</li>
                <li className="flex items-start gap-2"><Star className="h-4 w-4 text-primary mt-0.5 shrink-0" />Featured search &amp; itinerary placement</li>
                <li className="flex items-start gap-2"><Star className="h-4 w-4 text-primary mt-0.5 shrink-0" />Instant lead alerts</li>
                <li className="flex items-start gap-2"><Star className="h-4 w-4 text-primary mt-0.5 shrink-0" />Dedicated account manager</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="#register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-hover text-white font-semibold rounded-full hover:bg-accent-hover transition-colors text-base shadow-lg shadow-orange-500/20"
            >
              Claim Your Free Listing
              <ArrowRight className="h-5 w-5" />
            </a>
            <p className="text-sm text-slate-500 mt-3">
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ VISUAL PROOF — BEFORE / AFTER ═══ */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              See the Difference
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your free listing gets you found. Upgrading gets you booked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free stub */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 relative">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold mb-6 uppercase tracking-wide">
                Free Listing
              </span>
              <div className="space-y-4">
                <div className="h-32 rounded-xl bg-slate-100 flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-slate-300" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="mt-4 flex gap-2">
                  <div className="h-8 bg-slate-100 rounded-full px-4 flex items-center">
                    <span className="text-xs text-slate-400">Website →</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-6 italic">
                Name, contact link, basic category. Enough to be found — but visitors move on quickly.
              </p>
            </div>

            {/* Enhanced */}
            <div className="bg-white rounded-2xl border-2 border-accent-hover p-8 relative shadow-lg">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-hover/10 text-accent-hover text-xs font-semibold mb-6 uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5" /> Enhanced Listing
              </span>
              <div className="space-y-4">
                {/* Mock gallery */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 h-32 rounded-xl bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
                    <Mountain className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-[60px] rounded-lg bg-gradient-to-br from-amber-100 to-orange-100" />
                    <div className="h-[60px] rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100" />
                  </div>
                </div>
                <div className="h-4 bg-primary rounded w-3/4" />
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">4.8 · Verified</span>
                </div>
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-8 bg-accent-hover rounded-full px-4 flex items-center">
                    <span className="text-xs text-white font-medium">Book Now</span>
                  </div>
                  <div className="h-8 bg-emerald-50 border border-emerald-200 rounded-full px-3 flex items-center gap-1">
                    <Route className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs text-emerald-700 font-medium">In 4 Itineraries</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-6 italic">
                Full gallery, reviews, booking widget, and itinerary badge. Visitors stay, explore, and book.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS — 3 GROUPS ═══ */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Why Operators Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Visibility */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-hover/10 mb-5">
                <Eye className="h-8 w-8 text-accent-hover" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Be Found First
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Your activity appears in itineraries, search, and regional guides — right when visitors are planning their trip.
              </p>
            </div>

            {/* Bookings */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-hover/10 mb-5">
                <MousePointerClick className="h-8 w-8 text-accent-hover" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Direct Bookings, Zero Commission
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Integrate your booking system (Beyonk, Rezdy, direct). Visitors book from your listing — you keep 100% of revenue.
              </p>
            </div>

            {/* Trust */}
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-hover/10 mb-5">
                <Users className="h-8 w-8 text-accent-hover" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Built-In Trust
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Verified badges, ratings, reviews, and accreditations — everything visitors need to book with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Live in 3 Steps
            </h2>
            <p className="text-lg text-slate-600">
              We&apos;ve done the hard work. You just confirm and go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-slate-200" />
                )}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent-hover/10 mb-6">
                  <step.icon className="h-10 w-10 text-accent-hover" />
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPONSORSHIP TEASE ═══ */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-primary to-[#2d5a73] rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent-hover blur-3xl" />
            </div>
            <div className="relative">
              <Megaphone className="h-12 w-12 text-accent-hover mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Looking for Bigger Impact?
              </h2>
              <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto leading-relaxed">
                Sponsor an entire category, region, or run banner ads across the
                site. Starting from £49/mo for category-wide exposure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@adventurewales.co.uk?subject=Sponsorship%20Enquiry"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-hover text-white font-semibold rounded-full hover:bg-accent-hover transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  Enquire About Sponsorship
                </a>
                <a
                  href="#register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-colors"
                >
                  Or Fill In the Form Below
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Trusted by Welsh Adventure Operators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm"
              >
                <Quote className="h-8 w-8 text-accent-hover/30 mb-4" />
                <p className="text-slate-700 leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-primary">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING CARDS (Client Component) ═══ */}
      <div id="pricing" className="scroll-mt-20">
        <PricingSection />
      </div>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Quick Answers
            </h2>
          </div>
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* ═══ CTA / REGISTER FORM ═══ */}
      <section id="register" className="py-20 sm:py-24 scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Claim Your Listing Today
            </h2>
            <p className="text-lg text-slate-600">
              Start free. Upgrade when you&apos;re ready. We respond within 24 hours.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
            <RegisterInterestForm />
          </div>

          {/* Newsletter opt-in */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              📬 We&apos;ll also send you tips on growing your Welsh tourism
              business. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM STICKY BAR ═══ */}
      <div className="sticky bottom-0 z-50 bg-white border-t border-slate-200 py-3 text-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-sm text-slate-700 font-medium">
            Enhanced listings from{" "}
            <span className="font-bold text-accent-hover">£9.99/mo</span>
            <span className="hidden sm:inline"> — no commission, no lock-in</span>
          </p>
          <a
            href="#register"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent-hover text-white text-sm font-semibold rounded-full hover:bg-accent-hover transition-colors"
          >
            Claim Free &amp; Upgrade
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
