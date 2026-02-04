import { Metadata } from "next";
import {
  Mountain,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  Star,
  Search,
  MapPin,
  CalendarRange,
  BarChart3,
  ArrowRight,
  Mail,
  Map,
  Route,
  Bot,
} from "lucide-react";
import { FAQAccordion } from "@/components/operators/FAQAccordion";
import { RegisterInterestForm } from "@/components/operators/RegisterInterestForm";
import { AlreadyListedTooltip } from "@/components/operators/AlreadyListedTooltip";

export const metadata: Metadata = {
  title: "Advertise With Us - Grow Your Travel Business | Adventure Wales",
  description:
    "Get discovered by thousands of visitors planning their next Welsh trip. Free listing available, enhanced and premium plans from £9.99/mo +VAT per location.",
  openGraph: {
    title: "Advertise With Us - Grow Your Travel Business | Adventure Wales",
    description:
      "Get discovered by thousands of visitors planning their next Welsh trip. Free listing available, enhanced and premium plans.",
    siteName: "Adventure Wales",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertise With Us | Adventure Wales",
    description:
      "Get discovered by visitors planning Welsh trips. Free listing, enhanced and premium plans available.",
  },
};

const stats = [
  { value: "129", label: "Activities", icon: MapPin },
  { value: "54", label: "Itineraries", icon: Route },
  { value: "12", label: "Regions Covered", icon: Map },
];

const benefits = [
  {
    icon: Search,
    title: "Get Discovered",
    description:
      "Your activities appear in our itinerary planner, used by thousands of visitors planning Welsh trips. We don't just list you — we recommend you.",
  },
  {
    icon: Shield,
    title: "Enhanced Trust Signals",
    description:
      "Stand out with verified accreditations, ratings, and reviews so visitors book with confidence.",
  },
  {
    icon: Zap,
    title: "Booking Integration",
    description:
      "Connect your Beyonk, Rezdy, or direct booking system. Visitors book instantly from your listing — no friction, no lost customers.",
  },
  {
    icon: CalendarRange,
    title: "Smart Itinerary Placement",
    description:
      "Your activities are automatically included in relevant trip itineraries. When someone plans a Snowdonia weekend, your activity shows up.",
  },
  {
    icon: BarChart3,
    title: "Price Comparison Visibility",
    description:
      "Coming soon: visitors compare prices across platforms. Your direct price shown alongside OTAs — win the booking every time.",
  },
  {
    icon: Bot,
    title: "AI-Powered Profile",
    description:
      "We research and build your profile for you. Descriptions, photos, trust signals — all done. You just confirm and go live.",
  },
];

const freePlanFeatures = [
  "Basic listing (name, contact, website link)",
  "Appear in directory search",
  "Appear on region pages",
];

const enhancedPlanFeatures = [
  "Everything in Free, plus:",
  "Full profile with description, photos, gallery",
  "Booking link integration (Beyonk, Rezdy, direct)",
  "Included in trip itineraries",
  "Service & pricing details displayed",
  "Enquiry forwarding to your inbox",
  "Monthly performance report",
];

const premiumPlanFeatures = [
  "Everything in Enhanced, plus:",
  "Featured placement in search & itineraries",
  "Priority position on region pages",
  "Special offers & promotions displayed",
  "Lead notifications (instant email on enquiry)",
  "Competitor benchmarking (views vs similar operators)",
  "Dedicated account support",
];

const steps = [
  {
    icon: Search,
    title: "Find Your Listing",
    description:
      "Find your listing in our directory. We've already started building your profile.",
  },
  {
    icon: Mail,
    title: "Claim & Verify",
    description:
      "Click Claim and verify your email. It only takes a moment to confirm ownership.",
  },
  {
    icon: TrendingUp,
    title: "Update & Go Live",
    description:
      "Update your profile and go live. Appear in itineraries, search results, and trip plans.",
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
      "Each physical site or base counts as one location. If you operate from Snowdonia and Pembrokeshire, that's 2 locations. Each gets its own listing, its own itinerary placements, and its own visibility.",
  },
  {
    question: "What if I'm on Beyonk/Rezdy?",
    answer:
      "Great! We integrate directly with your booking platform. Visitors can check availability and book without leaving our site. You keep 100% of your booking revenue — we don't take a commission on your direct bookings.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts, no lock-in. Cancel your subscription anytime and keep your free listing.",
  },
  {
    question: "What's the Enhanced Listing?",
    answer:
      "Enhanced listings include a full profile with photos, booking integration, itinerary placement, and enquiry forwarding — everything you need to convert visitors into customers.",
  },
  {
    question: "Do you take commission on bookings?",
    answer:
      "No commission on bookings through your own system. We earn through listing subscriptions and affiliate partnerships with platforms like GetYourGuide and Viator.",
  },
];

export default function ForOperatorsPage() {
  return (
    <div className="bg-white">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a4c] via-[#1e3a4c] to-[#2d5a73]">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#f97316] blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwdjJIMjRWNGgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
              <Mountain className="h-4 w-4" />
              For Tourism &amp; Travel Businesses
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Grow your travel business in the Wales directory.
            </h1>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              Get discovered by thousands of visitors planning their next Welsh
              trip. List your business, reach new customers, and drive more
              bookings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f97316] text-white font-semibold rounded-full hover:bg-[#ea580c] transition-colors text-base"
              >
                See Plans
                <ArrowRight className="h-5 w-5" />
              </a>
              <AlreadyListedTooltip />
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 py-8 px-6 sm:px-10">
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#f97316]/10 mb-3">
                    <stat.icon className="h-6 w-6 text-[#f97316]" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#1e3a4c]">
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

      {/* ============ BENEFITS / VALUE PROP ============ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a4c] mb-4">
              Why List With Us?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We don&apos;t just list you — we actively drive bookings to your
              business through itineraries, search, and trust signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group relative bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-lg hover:border-slate-200 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f97316]/10 mb-5 group-hover:bg-[#f97316]/20 transition-colors">
                  <benefit.icon className="h-7 w-7 text-[#f97316]" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a4c] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Getting listed takes minutes. We do the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-slate-200" />
                )}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#f97316]/10 mb-6">
                  <step.icon className="h-10 w-10 text-[#f97316]" />
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#1e3a4c] text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-3">
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

      {/* ============ FAQ ============ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a4c] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about listing your business.
            </p>
          </div>
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* ============ CTA FOOTER ============ */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-[#1e3a4c] via-[#1e3a4c] to-[#2d5a73] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#f97316] blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Get started free — upgrade when you&apos;re ready. No contracts, no
            commission, no risk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="#register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f97316] text-white font-semibold rounded-full hover:bg-[#ea580c] transition-colors text-base"
            >
              Get Listed Free
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="mailto:hello@adventurewales.co.uk?subject=Adventure%20Wales%20Listing%20Enquiry"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-base"
            >
              <Mail className="h-5 w-5" />
              Contact Us
            </a>
          </div>
          <p className="text-white/60 text-sm">
            <Mail className="inline h-4 w-4 mr-1" />
            hello@adventurewales.co.uk
          </p>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-20 sm:py-28 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a4c] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free. Upgrade when you&apos;re ready. All plans are priced{" "}
              <strong>per location</strong> — each site gets its own listing and
              visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {/* FREE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-1">Free</h3>
                <p className="text-sm text-slate-500">Get started with a basic listing</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-[#1e3a4c]">£0</span>
                <span className="text-slate-500 ml-2">/ forever</span>
                <div className="text-sm text-slate-400 mt-1">per location</div>
              </div>
              <ul className="space-y-3 mb-8">
                {freePlanFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#register"
                className="block text-center w-full px-6 py-3 rounded-full border-2 border-[#1e3a4c] text-[#1e3a4c] font-semibold hover:bg-[#1e3a4c] hover:text-white transition-colors"
              >
                Get Listed Free
              </a>
            </div>

            {/* ENHANCED — Most Popular */}
            <div className="relative bg-white rounded-2xl border-2 border-[#f97316] p-8 shadow-xl lg:-mt-4 lg:mb-0">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f97316] text-white text-xs font-bold uppercase tracking-wide">
                  <Star className="h-3.5 w-3.5" />
                  Most Popular
                </span>
              </div>
              <div className="mb-6 mt-2">
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-1">Enhanced Listing</h3>
                <p className="text-sm text-slate-500">
                  Full profile with trust signals
                </p>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-[#1e3a4c]">
                  £9.99
                </span>
                <span className="text-slate-500 ml-1">+VAT</span>
                <span className="text-slate-500 ml-2">/ mo</span>
                <div className="text-sm text-slate-400 mt-1">per location</div>
              </div>
              <p className="text-sm text-[#f97316] font-medium mb-6">
                or £99/yr +VAT — save 17%
              </p>
              <ul className="space-y-3 mb-8">
                {enhancedPlanFeatures.map((feature, i) => (
                  <li key={feature} className="flex items-start gap-3">
                    {i === 0 ? (
                      <ArrowRight className="h-5 w-5 text-[#f97316] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-[#f97316] shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        i === 0
                          ? "text-[#f97316] font-medium"
                          : "text-slate-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#register"
                className="block text-center w-full px-6 py-3.5 rounded-full bg-[#f97316] text-white font-semibold hover:bg-[#ea580c] transition-colors"
              >
                Get Enhanced
              </a>
            </div>

            {/* PREMIUM */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-1">Premium</h3>
                <p className="text-sm text-slate-500">
                  Maximum visibility &amp; priority placement
                </p>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-[#1e3a4c]">
                  £29.99
                </span>
                <span className="text-slate-500 ml-1">+VAT</span>
                <span className="text-slate-500 ml-2">/ mo</span>
                <div className="text-sm text-slate-400 mt-1">per location</div>
              </div>
              <p className="text-sm text-[#f97316] font-medium mb-6">
                or £299/yr +VAT — save 17%
              </p>
              <ul className="space-y-3 mb-8">
                {premiumPlanFeatures.map((feature, i) => (
                  <li key={feature} className="flex items-start gap-3">
                    {i === 0 ? (
                      <ArrowRight className="h-5 w-5 text-[#1e3a4c] shrink-0 mt-0.5" />
                    ) : (
                      <Star className="h-5 w-5 text-[#1e3a4c] shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        i === 0
                          ? "text-[#1e3a4c] font-medium"
                          : "text-slate-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#register"
                className="block text-center w-full px-6 py-3 rounded-full border-2 border-[#1e3a4c] text-[#1e3a4c] font-semibold hover:bg-[#1e3a4c] hover:text-white transition-colors"
              >
                Go Premium
              </a>
            </div>
          </div>

          {/* Multi-site discounts note */}
          <div className="mt-10 text-center">
            <p className="text-slate-600 text-base">
              Multiple sites?{" "}
              <a
                href="mailto:hello@adventurewales.co.uk?subject=Multi-site%20discount%20enquiry"
                className="text-[#f97316] font-semibold hover:underline"
              >
                Contact us for multi-site discounts
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ============ REGISTER INTEREST FORM ============ */}
      <section id="register" className="py-20 sm:py-28 scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a4c] mb-4">
              Register Your Interest
            </h2>
            <p className="text-lg text-slate-600">
              Tell us about your business and we&apos;ll get you set up. We
              respond within 24 hours.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
            <RegisterInterestForm />
          </div>
        </div>
      </section>
    </div>
  );
}
