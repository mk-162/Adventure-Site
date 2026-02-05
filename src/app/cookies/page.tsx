import Link from "next/link";
import { ChevronRight, Cookie, Settings, Shield, BarChart } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1e3a4c] font-medium">Cookie Policy</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#1e3a4c] rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a4c]">
              Cookie Policy
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Last updated: February 2026
          </p>
          <p className="text-gray-600 mt-4">
            This Cookie Policy explains how Adventure Wales uses cookies and similar technologies 
            when you visit our website. It also explains your choices regarding these technologies.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1e3a4c]/5 rounded-2xl p-6 mb-12">
          <h2 className="font-bold text-[#1e3a4c] mb-4">Manage Your Preferences</h2>
          <p className="text-gray-600 text-sm mb-4">
            Most browsers let you control cookies through their settings. You can block or delete cookies at any time.
          </p>
          <Link
            href="/privacy"
            className="inline-flex px-6 py-3 bg-[#1e3a4c] text-white font-semibold rounded-xl hover:bg-[#2a5570] transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files placed on your device when you visit a website. They are 
              widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-600 mb-4">
              Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device 
              after you close your browser, while session cookies are deleted when you close your browser.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">How We Use Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies for several purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li><strong>Essential functionality:</strong> To make our website work properly</li>
              <li><strong>Performance and analytics:</strong> To understand how visitors use our site</li>
              <li><strong>Personalization:</strong> To remember your preferences and settings</li>
              <li><strong>Marketing:</strong> To deliver relevant advertising and measure campaign effectiveness</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#ea580c]" />
              Types of Cookies We Use
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-3">1. Strictly Necessary Cookies</h3>
                <p className="text-gray-600 mb-4">
                  These cookies are essential for the website to function and cannot be switched off. 
                  They are usually only set in response to actions you take, such as setting privacy 
                  preferences, logging in, or filling in forms.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                  <div className="font-semibold text-[#1e3a4c] mb-2">Examples:</div>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Authentication cookies (keep you logged in)</li>
                    <li>Security cookies (prevent fraud)</li>
                    <li>Session management cookies</li>
                    <li>Cookie consent preferences</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">Cannot be disabled</span>
                  <span className="text-gray-500">Required for site functionality</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-3 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-[#ea580c]" />
                  2. Performance & Analytics Cookies
                </h3>
                <p className="text-gray-600 mb-4">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve how our website works.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm mb-4">
                  <div className="font-semibold text-[#1e3a4c] mb-2">Examples:</div>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Google Analytics (page views, traffic sources, user behavior)</li>
                    <li>Hotjar (heatmaps, session recordings)</li>
                    <li>Performance monitoring (page load times, errors)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                  <div className="font-semibold text-blue-900 mb-2">What we collect:</div>
                  <ul className="list-disc pl-5 text-blue-800 space-y-1">
                    <li>Pages visited and time spent</li>
                    <li>Browser and device information</li>
                    <li>Geographic location (country/city level)</li>
                    <li>Referring websites and search terms</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Optional</span>
                  <span className="text-gray-500">Helps us improve the site</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-3">3. Functionality Cookies</h3>
                <p className="text-gray-600 mb-4">
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your preferences, language settings, and region.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                  <div className="font-semibold text-[#1e3a4c] mb-2">Examples:</div>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Language preferences</li>
                    <li>Region/location selection</li>
                    <li>Display preferences (e.g., map vs. list view)</li>
                    <li>Recently viewed activities</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Optional</span>
                  <span className="text-gray-500">Improves your experience</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-bold text-[#1e3a4c] mb-3">4. Marketing & Advertising Cookies</h3>
                <p className="text-gray-600 mb-4">
                  These cookies track your online activity to help us deliver more relevant advertising 
                  and measure the effectiveness of our marketing campaigns.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                  <div className="font-semibold text-[#1e3a4c] mb-2">Examples:</div>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Google Ads (retargeting, conversion tracking)</li>
                    <li>Facebook Pixel (ad targeting, campaign measurement)</li>
                    <li>LinkedIn Insight Tag</li>
                    <li>Third-party advertising networks</li>
                  </ul>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Optional</span>
                  <span className="text-gray-500">Supports relevant advertising</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">Third-Party Cookies</h2>
            <p className="text-gray-600 mb-4">
              Some cookies are set by third-party services that appear on our pages. We do not control 
              these cookies. Common third parties include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Google Analytics:</strong> Website traffic analysis</li>
              <li><strong>Stripe/PayPal:</strong> Payment processing</li>
              <li><strong>Google Maps:</strong> Location services and mapping</li>
              <li><strong>Social Media Platforms:</strong> Sharing buttons and embedded content</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#ea580c]" />
              Managing Your Cookie Preferences
            </h2>
            
            <h3 className="text-xl font-bold text-[#1e3a4c] mt-6 mb-3">On Our Website</h3>
            <p className="text-gray-600 mb-4">
              You can manage your cookie preferences at any time using our cookie settings tool. 
              You can manage cookies through your browser settings.
            </p>
            <button className="px-6 py-3 bg-[#1e3a4c] text-white font-semibold rounded-xl hover:bg-[#2a5570] transition-colors mb-6">
              Update Cookie Preferences
            </button>

            <h3 className="text-xl font-bold text-[#1e3a4c] mt-6 mb-3">In Your Browser</h3>
            <p className="text-gray-600 mb-4">
              Most browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>See what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific websites</li>
              <li>Block all cookies entirely</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-6 mb-4">
              <p className="text-gray-700 text-sm">
                <strong>Note:</strong> Blocking all cookies may prevent you from using certain features 
                of our website, such as making bookings or saving preferences.
              </p>
            </div>

            <h3 className="text-xl font-bold text-[#1e3a4c] mt-6 mb-3">Browser-Specific Instructions</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Chrome:</strong>{" "}
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#ea580c] hover:underline">
                    Cookie settings guide
                  </a>
                </li>
                <li>
                  <strong>Firefox:</strong>{" "}
                  <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[#ea580c] hover:underline">
                    Cookie settings guide
                  </a>
                </li>
                <li>
                  <strong>Safari:</strong>{" "}
                  <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#ea580c] hover:underline">
                    Cookie settings guide
                  </a>
                </li>
                <li>
                  <strong>Edge:</strong>{" "}
                  <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#ea580c] hover:underline">
                    Cookie settings guide
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">Opt-Out of Targeted Advertising</h2>
            <p className="text-gray-600 mb-4">
              You can opt out of personalized advertising from participating companies:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <a href="https://www.youronlinechoices.com/uk/" target="_blank" rel="noopener noreferrer" className="text-[#ea580c] hover:underline">
                  Your Online Choices (UK/EU)
                </a>
              </li>
              <li>
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#ea580c] hover:underline">
                  Google Ads Settings
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener noreferrer" className="text-[#ea580c] hover:underline">
                  Facebook Ad Preferences
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">Do Not Track</h2>
            <p className="text-gray-600 mb-4">
              Some browsers support a "Do Not Track" (DNT) feature. Currently, there is no industry 
              standard for how to respond to DNT signals, so our website does not respond to DNT 
              browser settings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">Updates to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Cookie Policy periodically to reflect changes in our practices or 
              legal requirements. We'll notify you of significant changes by posting a notice on our 
              website or updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">Contact Us</h2>
            <div className="bg-[#1e3a4c]/5 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="text-gray-700 space-y-2">
                <p><strong>Email:</strong> <a href="mailto:privacy@adventurewales.co.uk" className="text-[#ea580c] hover:underline">privacy@adventurewales.co.uk</a></p>
                <p><strong>Post:</strong><br />
                  Data Protection Officer<br />
                  Adventure Wales<br />
                  Innovation Centre<br />
                  Cardiff Bay, CF10 4BZ<br />
                  Wales, United Kingdom
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-[#1e3a4c] mb-4">Related Policies</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="text-[#ea580c] hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-[#ea580c] hover:underline">Terms of Service</Link>
            <Link href="/contact" className="text-[#ea580c] hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Cookie Policy | Adventure Wales",
  description: "Learn how Adventure Wales uses cookies and similar technologies, and how to manage your cookie preferences.",
};
