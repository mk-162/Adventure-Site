import Link from "next/link";
import {
  Phone,
  Mail,
  Globe,
  Megaphone,
  BarChart3,
  Layout,
  Newspaper,
  Users,
  Target,
  Zap,
  MapPin,
  Calendar,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react";

export const metadata = {
  title: "Enterprise & Advertising Partnerships | Adventure Wales",
  description: "Custom advertising packages for tourism boards, national operators, and outdoor brands. Homepage takeovers, sponsored itineraries, native content campaigns, and more.",
};

const packages = [
  {
    icon: Layout,
    name: "Site & Category Takeovers",
    description: "Own the homepage or an entire activity category for a period. Your brand wraps the experience — hero banners, featured placement, and branded navigation.",
    examples: ["Homepage hero takeover (weekly/monthly)", "Category ownership (e.g. 'all surfing pages')", "Region sponsorship (e.g. 'Presented by...' on Snowdonia)"],
  },
  {
    icon: Newspaper,
    name: "Branded Content & Native Advertising",
    description: "Editorially crafted content that lives alongside our organic guides. Written to our quality standards, clearly labelled, and designed to genuinely help adventurers.",
    examples: ["Sponsored itineraries featuring your venues", "Branded 'how-to' guides and gear reviews", "Video content embedded in activity pages", "Seasonal campaign articles"],
  },
  {
    icon: MapPin,
    name: "Custom Campaign Pages",
    description: "Bespoke landing pages built on our platform with your branding, your messaging, and our audience. Perfect for product launches, seasonal pushes, or event promotion.",
    examples: ["Custom landing page with booking integration", "Multi-activity campaign hubs", "Event microsites with registration", "Competition and giveaway pages"],
  },
  {
    icon: Target,
    name: "Programmatic & Display",
    description: "Targeted banner placements across our network of 500+ pages. Contextually placed alongside relevant content — your surf brand on surfing pages, your gear on hiking guides.",
    examples: ["MPU and leaderboard placements", "Contextual targeting by activity, region, or season", "Retargeting pixels for your campaigns", "Performance reporting and attribution"],
  },
  {
    icon: Calendar,
    name: "Sponsored Events & Itineraries",
    description: "Put your brand at the heart of the adventure. Sponsor specific itineraries, feature in our weekend picks, or present entire event categories.",
    examples: ["'This Weekend' widget sponsorship", "Itinerary PDF branding and download sponsorship", "Event category presenting partner", "Seasonal campaign tie-ins"],
  },
  {
    icon: Users,
    name: "Multi-Location & Franchise Packages",
    description: "Bespoke packages for operators with multiple sites across Wales. Centralised billing, unified branding, and dedicated account management.",
    examples: ["Volume discounts across all locations", "Centralised dashboard for all venues", "Cross-promotion between your sites", "Priority placement in relevant itineraries"],
  },
];

const stats = [
  { label: "Activity Pages", value: "500+" },
  { label: "Itineraries", value: "54" },
  { label: "Regions Covered", value: "12" },
  { label: "Monthly Visitors", value: "Growing" },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a4c] via-[#1e3a4c] to-[#0f2a3c] text-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-orange-400" />
            Enterprise Partnerships
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            Put Your Brand at the Heart of
            <span className="text-orange-400"> Welsh Adventure</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Custom advertising, native content, and sponsorship packages for tourism boards,
            national operators, and outdoor brands who want to reach adventure-ready audiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+447968443407"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-xl shadow-orange-500/30 text-lg"
            >
              <Phone className="w-5 h-5" />
              Speak to Matt
            </a>
            <a
              href="mailto:matt@adventurewales.co.uk?subject=Enterprise%20Partnership%20Enquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/20"
            >
              <Mail className="w-5 h-5" />
              matt@adventurewales.co.uk
            </a>
          </div>
          <p className="text-white/50 text-sm mt-4">
            <Phone className="w-3 h-3 inline" /> 07968 443407 — Available Mon–Fri, 9am–6pm
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-[#1e3a4c]">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1e3a4c] mb-3">
              What We Offer
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Every package is tailored. These are starting points — we&apos;ll build something that fits your goals, your audience, and your budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map(pkg => (
              <div key={pkg.name} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[#1e3a4c] text-white p-2.5 rounded-xl shrink-0">
                    <pkg.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1e3a4c]">{pkg.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{pkg.description}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 pl-14">
                  {pkg.examples.map(ex => (
                    <li key={ex} className="flex items-start gap-2 text-sm text-slate-500">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Adventure Wales */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1e3a4c] mb-3">
              Why Advertise With Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-[#1e3a4c] mb-2">High-Intent Audience</h3>
              <p className="text-sm text-slate-600">
                People on Adventure Wales are planning trips — not browsing. They&apos;re searching for activities, comparing options, and ready to book.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-[#1e3a4c] mb-2">Wales-Focused, Not Generic</h3>
              <p className="text-sm text-slate-600">
                We&apos;re not TripAdvisor. Every page is built around Welsh adventures. Your message reaches people who specifically want Wales.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-[#1e3a4c] mb-2">Transparent Reporting</h3>
              <p className="text-sm text-slate-600">
                Full analytics on impressions, clicks, and engagement. No vanity metrics — just clear data on what your campaign delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal For */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-[#1e3a4c] mb-8 text-center">Perfect For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Tourism boards & destination marketing",
              "National outdoor operators & franchises",
              "Outdoor gear & equipment brands",
              "Adventure holiday companies",
              "Car hire & travel insurance providers",
              "Food, drink & accommodation chains",
              "Event organisers & race series",
              "Outdoor media & publications",
            ].map(item => (
              <div key={item} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-slate-200">
                <Star className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-[#1e3a4c] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Ready to Reach Welsh Adventurers?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Every package is custom. Call Matt for an informal chat about what would work for your brand, your budget, and your goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+447968443407"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-xl shadow-orange-500/30 text-lg"
            >
              <Phone className="w-5 h-5" />
              07968 443407
            </a>
            <a
              href="mailto:matt@adventurewales.co.uk?subject=Enterprise%20Partnership%20Enquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/20"
            >
              <Mail className="w-5 h-5" />
              Email Matt
            </a>
          </div>
          <p className="text-white/40 text-xs mt-6">
            Matt Sherborne — Partnerships Director, Adventure Wales
          </p>
        </div>
      </section>
    </div>
  );
}
