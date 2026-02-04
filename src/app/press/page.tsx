import Link from "next/link";
import { ChevronRight, Newspaper, Download, Mail, Image as ImageIcon, FileText, Video } from "lucide-react";

export default function PressPage() {
  const pressReleases = [
    {
      date: "January 2024",
      title: "Adventure Wales Secures £500K in Seed Funding",
      excerpt: "Platform connecting travelers with Welsh outdoor experiences raises investment to expand operator partnerships and enhance technology."
    },
    {
      date: "November 2023",
      title: "Adventure Wales Partners with Visit Wales",
      excerpt: "Strategic partnership announced to promote sustainable adventure tourism across Wales and support local operators."
    },
    {
      date: "August 2023",
      title: "Platform Launches with 50+ Welsh Adventure Operators",
      excerpt: "Adventure Wales officially launches, offering curated outdoor experiences from Snowdonia to Pembrokeshire."
    }
  ];

  const mediaKit = [
    {
      icon: ImageIcon,
      title: "Brand Assets",
      description: "Logos, color palette, typography guidelines",
      fileSize: "2.4 MB",
      link: "#"
    },
    {
      icon: FileText,
      title: "Company Overview",
      description: "About us, mission, key facts & figures",
      fileSize: "156 KB",
      link: "#"
    },
    {
      icon: ImageIcon,
      title: "Product Screenshots",
      description: "High-res platform screenshots and UI",
      fileSize: "8.1 MB",
      link: "#"
    },
    {
      icon: Video,
      title: "Video Assets",
      description: "Promotional videos and adventure clips",
      fileSize: "24 MB",
      link: "#"
    }
  ];

  const facts = [
    { label: "Founded", value: "2023" },
    { label: "Headquarters", value: "Cardiff, Wales" },
    { label: "Partner Operators", value: "50+" },
    { label: "Activities Listed", value: "500+" },
    { label: "Regions Covered", value: "All of Wales" },
    { label: "Total Bookings", value: "£2M+ (2024)" }
  ];

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1e3a4c] font-medium">Press</span>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#1e3a4c] rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a4c]">
              Press & Media
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Media resources, press releases, and contact information for journalists and content creators 
            covering Adventure Wales and the Welsh adventure tourism industry.
          </p>
        </div>

        {/* Press Contact */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-[#1e3a4c] to-[#2a5570] rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
                <p className="opacity-90 mb-6">
                  For press inquiries, interview requests, or media partnerships, please contact our 
                  communications team:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <a href="mailto:press@adventurewales.co.uk" className="hover:underline">
                      press@adventurewales.co.uk
                    </a>
                  </div>
                  <div className="text-sm opacity-75">
                    Response time: Within 24 hours on business days
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="font-bold mb-4">Quick Facts</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {facts.map((fact, idx) => (
                    <div key={idx}>
                      <div className="opacity-75 text-xs mb-1">{fact.label}</div>
                      <div className="font-semibold">{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-8">Media Kit</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaKit.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#f97316] transition-all p-6 group"
              >
                <div className="w-12 h-12 bg-[#f97316]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#f97316]/20 transition-colors">
                  <item.icon className="w-6 h-6 text-[#f97316]" />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{item.fileSize}</span>
                  <Download className="w-4 h-4 text-[#f97316]" />
                </div>
              </a>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href="mailto:press@adventurewales.co.uk?subject=Media Kit Request"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a4c] text-white font-semibold rounded-xl hover:bg-[#2a5570] transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Complete Media Kit
            </a>
          </div>
        </section>

        {/* About Adventure Wales */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-6">
                About Adventure Wales
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Adventure Wales is the leading online platform connecting travelers with curated outdoor 
                  experiences across Wales. Founded in 2023, we partner with over 50 local operators to 
                  showcase the best of Welsh adventure tourism, from coasteering in Pembrokeshire to 
                  mountain climbing in Snowdonia.
                </p>
                <p>
                  Our mission is to make Wales' incredible outdoor adventures accessible to everyone while 
                  supporting local businesses and promoting sustainable, responsible tourism. We believe 
                  that Wales offers some of Europe's finest adventure experiences, and we're committed to 
                  helping travelers discover them.
                </p>
                <p>
                  Through our platform, users can browse, compare, and book activities with confidence, 
                  knowing that all operators are vetted for safety, quality, and environmental responsibility.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">By the Numbers</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Partner Operators</span>
                    <span className="text-2xl font-bold text-[#1e3a4c]">50+</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Activities Listed</span>
                    <span className="text-2xl font-bold text-[#1e3a4c]">500+</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Monthly Visitors</span>
                    <span className="text-2xl font-bold text-[#1e3a4c]">10K+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Booking Value (2024)</span>
                    <span className="text-2xl font-bold text-[#1e3a4c]">£2M+</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f97316]/10 border border-[#f97316]/20 rounded-2xl p-6">
                <h3 className="font-bold text-[#1e3a4c] mb-3">Key Differentiators</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#f97316] mt-0.5">▸</span>
                    <span>Wales-focused: Deep local knowledge and relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f97316] mt-0.5">▸</span>
                    <span>Quality-vetted: All operators meet safety and service standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f97316] mt-0.5">▸</span>
                    <span>Sustainable tourism: Committed to environmental responsibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f97316] mt-0.5">▸</span>
                    <span>Local support: Benefiting Welsh communities and businesses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-8">Recent Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((release, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">{release.date}</div>
                    <h3 className="text-xl font-bold text-[#1e3a4c] mb-2">{release.title}</h3>
                    <p className="text-gray-600">{release.excerpt}</p>
                  </div>
                  <a
                    href="mailto:press@adventurewales.co.uk?subject=Press Release Request"
                    className="px-6 py-2 bg-[#1e3a4c] text-white font-medium rounded-xl hover:bg-[#2a5570] transition-colors whitespace-nowrap text-center"
                  >
                    Request Full Release
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-8">Brand Guidelines</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Primary Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: '#1e3a4c' }}></div>
                    <div>
                      <div className="font-medium text-[#1e3a4c]">Dark Teal</div>
                      <div className="text-sm text-gray-500">#1e3a4c</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: '#f97316' }}></div>
                    <div>
                      <div className="font-medium text-[#1e3a4c]">Orange</div>
                      <div className="text-sm text-gray-500">#f97316</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Typography</h3>
                <div className="space-y-2">
                  <div>
                    <div className="font-bold text-2xl mb-1">Plus Jakarta Sans</div>
                    <div className="text-sm text-gray-500">Primary typeface for all applications</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-[#1e3a4c] mb-3">Logo Usage</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Maintain clear space around the logo equal to the height of the icon</li>
                <li>• Do not alter colors, stretch, or modify the logo</li>
                <li>• Use the white version on dark backgrounds, dark version on light backgrounds</li>
                <li>• Minimum size: 120px wide for digital, 25mm for print</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Featured Coverage */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-8 text-center">
            Featured Coverage
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">📰</div>
              <div className="font-bold text-[#1e3a4c] mb-2">BBC Wales</div>
              <div className="text-sm text-gray-600">Startup spotlight feature</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">🏔️</div>
              <div className="font-bold text-[#1e3a4c] mb-2">Outdoor Magazine</div>
              <div className="text-sm text-gray-600">Best adventure booking platforms</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="text-4xl mb-3">✈️</div>
              <div className="font-bold text-[#1e3a4c] mb-2">Travel Weekly</div>
              <div className="text-sm text-gray-600">Sustainable tourism innovation</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#1e3a4c] to-[#2a5570] rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Information?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Our press team is here to assist with interviews, additional materials, or any questions 
            about Adventure Wales and the Welsh adventure tourism sector.
          </p>
          <a
            href="mailto:press@adventurewales.co.uk"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#f97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Press Team
          </a>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Press & Media | Adventure Wales",
  description: "Media resources, press releases, and brand assets for journalists covering Adventure Wales and Welsh adventure tourism.",
};
