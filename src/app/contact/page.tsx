import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Mail, MapPin, Phone, Send, MessageCircle, HelpCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1e3a4c] font-medium">Contact</span>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question about your adventure? Need help planning your trip? 
            We're here to help you discover the best of Wales.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/help" className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#f97316] transition-all group">
            <HelpCircle className="w-8 h-8 text-[#f97316] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">Help Center</h3>
            <p className="text-gray-600 text-sm">Browse FAQs and self-service guides</p>
          </Link>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <Mail className="w-8 h-8 text-[#f97316] mb-4" />
            <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">Email Support</h3>
            <a href="mailto:support@adventurewales.co.uk" className="text-[#f97316] hover:underline text-sm">
              support@adventurewales.co.uk
            </a>
            <p className="text-gray-600 text-sm mt-2">Response within 24 hours</p>
          </div>

          <Link href="/for-operators" className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#f97316] transition-all group">
            <MessageCircle className="w-8 h-8 text-[#f97316] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">List Your Business</h3>
            <p className="text-gray-600 text-sm">Partner with us to reach more adventurers</p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20 focus:border-[#1e3a4c] transition-colors"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20 focus:border-[#1e3a4c] transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20 focus:border-[#1e3a4c] transition-colors"
                >
                  <option value="">Select a topic...</option>
                  <option value="booking">Booking Enquiry</option>
                  <option value="activity">Activity Question</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20 focus:border-[#1e3a4c] transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-3 bg-[#f97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>

              <p className="text-sm text-gray-500 text-center">
                We typically respond within 24 hours during business days
              </p>
            </form>
          </div>

          {/* Contact Info & Image */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#1e3a4c] to-[#2a5570] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Email</div>
                    <a href="mailto:support@adventurewales.co.uk" className="text-sm opacity-90 hover:opacity-100">
                      support@adventurewales.co.uk
                    </a>
                    <div className="text-sm opacity-90 mt-1">
                      For partnership enquiries:<br />
                      <a href="mailto:partners@adventurewales.co.uk" className="hover:opacity-100">
                        partners@adventurewales.co.uk
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Phone</div>
                    <div className="text-sm opacity-90">
                      Coming soon
                    </div>
                    <div className="text-xs opacity-75 mt-1">Currently email only</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Office</div>
                    <div className="text-sm opacity-90">
                      Adventure Wales HQ<br />
                      Innovation Centre<br />
                      Cardiff Bay, CF10 4BZ<br />
                      Wales, United Kingdom
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/images/misc/contact-help-01-081f0c1f.jpg"
                alt="Customer support"
                width={300}
                height={200}
                className="rounded-2xl object-cover w-full h-40"
              />
              <Image
                src="/images/misc/contact-help-02-d4265ed9.jpg"
                alt="Team collaboration"
                width={300}
                height={200}
                className="rounded-2xl object-cover w-full h-40"
              />
            </div>

            {/* Response Time */}
            <div className="bg-[#f97316]/10 border border-[#f97316]/20 rounded-2xl p-6">
              <h4 className="font-bold text-[#1e3a4c] mb-2">Fast Response Times</h4>
              <p className="text-sm text-gray-600 mb-3">
                Our dedicated support team is here to help with any questions about activities, 
                bookings, or planning your Welsh adventure.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Email responses within 24 hours</li>
                <li>✓ Urgent enquiries handled same-day</li>
                <li>✓ Comprehensive help center available 24/7</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <section className="bg-white rounded-2xl p-8 lg:p-12 border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">
            Looking for Quick Answers?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Check out our Help Center for instant answers to common questions about bookings, 
            activities, safety, and more.
          </p>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a4c] text-white font-semibold rounded-xl hover:bg-[#2a5570] transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Visit Help Center
          </Link>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Contact Us | Adventure Wales",
  description: "Get in touch with Adventure Wales. Contact our support team for help with bookings, activities, or partnership opportunities.",
};
