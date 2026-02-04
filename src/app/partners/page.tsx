import Link from "next/link";
import { ChevronRight, Handshake, TrendingUp, Users, Shield, Calendar, CreditCard, BarChart, Mail, CheckCircle } from "lucide-react";

export default function PartnersPage() {
  const benefits = [
    {
      icon: Users,
      title: "Reach More Customers",
      description: "Connect with thousands of adventure-seekers actively searching for experiences across Wales."
    },
    {
      icon: Calendar,
      title: "Easy Booking Management",
      description: "Simple dashboard to manage availability, pricing, and bookings in real-time."
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Get paid quickly and securely. We handle all payment processing and customer service."
    },
    {
      icon: BarChart,
      title: "Business Insights",
      description: "Track performance with detailed analytics on bookings, revenue, and customer trends."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "We verify all customers and handle disputes, so you can focus on delivering great experiences."
    },
    {
      icon: TrendingUp,
      title: "Marketing Support",
      description: "Professional photography, SEO optimization, and promotion across our channels."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Apply to Join",
      description: "Complete our partner application with details about your business and activities."
    },
    {
      step: "2",
      title: "Verification",
      description: "We'll review your qualifications, insurance, and safety certifications."
    },
    {
      step: "3",
      title: "List Your Activities",
      description: "Create detailed listings with photos, descriptions, pricing, and availability."
    },
    {
      step: "4",
      title: "Start Receiving Bookings",
      description: "Go live and start welcoming customers through Adventure Wales!"
    }
  ];

  const requirements = [
    "Valid public liability insurance (minimum £5 million)",
    "Appropriate activity qualifications and certifications",
    "Registered business in the UK",
    "Commitment to safety and customer service excellence",
    "Equipment and facilities meet industry standards",
    "Compliance with UK health & safety regulations"
  ];

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1e3a4c] font-medium">Partners</span>
        </div>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#f97316]/10 px-4 py-2 rounded-full text-[#f97316] font-medium text-sm mb-6">
            <Handshake className="w-4 h-4" />
            Partner with Us
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-6">
            Grow Your Adventure Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join Wales' leading adventure booking platform and connect with thousands of 
            travelers looking for their next unforgettable experience.
          </p>
          <a
            href="mailto:partners@adventurewales.co.uk?subject=Partner Enquiry"
            className="inline-block px-8 py-4 bg-[#f97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors text-lg"
          >
            Become a Partner
          </a>
        </div>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-[#1e3a4c] mb-2">50+</div>
              <div className="text-gray-600">Partner Operators</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-[#1e3a4c] mb-2">10K+</div>
              <div className="text-gray-600">Monthly Visitors</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-[#1e3a4c] mb-2">£2M+</div>
              <div className="text-gray-600">Bookings in 2024</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-[#1e3a4c] mb-2">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-8 text-center">
            Why Partner with Adventure Wales?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-[#f97316]/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-[#f97316]" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-8 text-center">
            How to Get Started
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-[#f97316] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-8 text-center">
            Simple, Transparent Pricing
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#1e3a4c] to-[#2a5570] rounded-2xl p-8 lg:p-12 text-white">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-2">12%</div>
                <div className="text-xl opacity-90">Commission per Booking</div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>No setup fees or monthly charges</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Only pay when you receive bookings</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Commission covers payment processing, support, and marketing</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Get paid weekly via bank transfer</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Full transparency with detailed reporting</span>
                </div>
              </div>
              <p className="text-sm opacity-75 text-center">
                * Volume discounts available for high-performing partners
              </p>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-6">
                Partner Requirements
              </h2>
              <p className="text-gray-600 mb-6">
                To maintain the highest standards of safety and quality, we require all partners to meet 
                the following criteria:
              </p>
              <ul className="space-y-3">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#f97316]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-[#f97316]" />
                    </div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1e3a4c]/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">What We Provide</h3>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#f97316] rounded-full flex-shrink-0 mt-2"></div>
                  <div>
                    <div className="font-semibold text-[#1e3a4c] mb-1">Dedicated Partner Portal</div>
                    <div className="text-sm text-gray-600">Manage bookings, availability, and pricing</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#f97316] rounded-full flex-shrink-0 mt-2"></div>
                  <div>
                    <div className="font-semibold text-[#1e3a4c] mb-1">Marketing Support</div>
                    <div className="text-sm text-gray-600">Photography sessions, SEO, social media promotion</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#f97316] rounded-full flex-shrink-0 mt-2"></div>
                  <div>
                    <div className="font-semibold text-[#1e3a4c] mb-1">Customer Service</div>
                    <div className="text-sm text-gray-600">We handle inquiries, booking support, and issues</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#f97316] rounded-full flex-shrink-0 mt-2"></div>
                  <div>
                    <div className="font-semibold text-[#1e3a4c] mb-1">Business Insights</div>
                    <div className="text-sm text-gray-600">Analytics on bookings, trends, and customer behavior</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#f97316] rounded-full flex-shrink-0 mt-2"></div>
                  <div>
                    <div className="font-semibold text-[#1e3a4c] mb-1">Partner Success Team</div>
                    <div className="text-sm text-gray-600">Dedicated support to help you succeed</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4c] mb-8 text-center">
            What Our Partners Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="text-[#f97316] text-2xl mb-3">★★★★★</div>
              <p className="text-gray-600 mb-4 italic">
                "Adventure Wales has been fantastic for our business. Bookings are up 40% and the 
                platform is so easy to use. Highly recommend!"
              </p>
              <div>
                <div className="font-bold text-[#1e3a4c]">Sarah Williams</div>
                <div className="text-sm text-gray-500">Coastal Adventures Pembrokeshire</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="text-[#f97316] text-2xl mb-3">★★★★★</div>
              <p className="text-gray-600 mb-4 italic">
                "The team is incredibly supportive. They helped us with photography, created great 
                listings, and we're seeing customers from all over the UK."
              </p>
              <div>
                <div className="font-bold text-[#1e3a4c]">Tom Davies</div>
                <div className="text-sm text-gray-500">Snowdonia Mountain Guides</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="text-[#f97316] text-2xl mb-3">★★★★★</div>
              <p className="text-gray-600 mb-4 italic">
                "Simple commission structure, fast payments, and they handle all the admin. It's 
                freed us up to focus on what we do best - great adventures!"
              </p>
              <div>
                <div className="font-bold text-[#1e3a4c]">Rhys Evans</div>
                <div className="text-sm text-gray-500">Brecon Outdoor Centre</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#1e3a4c] to-[#2a5570] rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join Adventure Wales today and start reaching more customers. Our team is ready to help 
            you get set up and maximize your bookings.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:partners@adventurewales.co.uk?subject=Partner Application"
              className="px-8 py-3 bg-[#f97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Apply to Partner
            </a>
            <Link
              href="/contact"
              className="px-8 py-3 bg-white text-[#1e3a4c] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Ask Questions
            </Link>
          </div>
          <p className="text-sm opacity-75 mt-6">
            Questions? Email us at{" "}
            <a href="mailto:partners@adventurewales.co.uk" className="underline hover:opacity-100">
              partners@adventurewales.co.uk
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Partner with Us | Adventure Wales",
  description: "Join Adventure Wales and grow your adventure business. Connect with thousands of travelers and manage bookings through our platform.",
};
