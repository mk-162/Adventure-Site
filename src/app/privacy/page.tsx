import Link from "next/link";
import { ChevronRight, Shield, Eye, Lock, UserCheck, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1e3a4c] font-medium">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#1e3a4c] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a4c]">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Last updated: January 2024
          </p>
          <p className="text-gray-600 mt-4">
            Adventure Wales ("we", "us", or "our") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you visit our website and use our services.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-[#1e3a4c]/5 rounded-2xl p-6 mb-12">
          <h2 className="font-bold text-[#1e3a4c] mb-3">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <a href="#information-we-collect" className="text-[#1e3a4c] hover:underline">1. Information We Collect</a>
            <a href="#how-we-use" className="text-[#1e3a4c] hover:underline">2. How We Use Your Information</a>
            <a href="#legal-basis" className="text-[#1e3a4c] hover:underline">3. Legal Basis for Processing</a>
            <a href="#sharing" className="text-[#1e3a4c] hover:underline">4. Sharing Your Information</a>
            <a href="#data-retention" className="text-[#1e3a4c] hover:underline">5. Data Retention</a>
            <a href="#your-rights" className="text-[#1e3a4c] hover:underline">6. Your Rights Under GDPR</a>
            <a href="#cookies" className="text-[#1e3a4c] hover:underline">7. Cookies and Tracking</a>
            <a href="#security" className="text-[#1e3a4c] hover:underline">8. Data Security</a>
            <a href="#children" className="text-[#1e3a4c] hover:underline">9. Children's Privacy</a>
            <a href="#changes" className="text-[#1e3a4c] hover:underline">10. Changes to This Policy</a>
            <a href="#contact" className="text-[#1e3a4c] hover:underline">11. Contact Us</a>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section id="information-we-collect" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-[#ea580c]" />
              1. Information We Collect
            </h2>
            
            <h3 className="text-xl font-bold text-[#1e3a4c] mt-6 mb-3">Information You Provide</h3>
            <p className="text-gray-600 mb-4">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li><strong>Account Information:</strong> Name, email address, password, phone number</li>
              <li><strong>Booking Information:</strong> Participant details, emergency contacts, medical information relevant to activities</li>
              <li><strong>Payment Information:</strong> Billing address and payment details (processed securely by our payment processor)</li>
              <li><strong>Communications:</strong> Messages you send to us, feedback, reviews, and survey responses</li>
              <li><strong>Profile Information:</strong> Preferences, interests, profile photos you choose to add</li>
            </ul>

            <h3 className="text-xl font-bold text-[#1e3a4c] mt-6 mb-3">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li><strong>Usage Data:</strong> Pages viewed, search queries, clicks, time spent on pages</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address (precise location only with your permission)</li>
              <li><strong>Cookies and Similar Technologies:</strong> See our <Link href="/cookies" className="text-[#ea580c] hover:underline">Cookie Policy</Link></li>
            </ul>

            <h3 className="text-xl font-bold text-[#1e3a4c] mt-6 mb-3">Information from Third Parties</h3>
            <p className="text-gray-600 mb-4">
              We may receive information from activity operators, payment processors, analytics providers, 
              and social media platforms (if you choose to connect your accounts).
            </p>
          </section>

          <section id="how-we-use" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Process and manage bookings, payments, and cancellations</li>
              <li>Communicate with you about your bookings and account</li>
              <li>Provide customer support and respond to enquiries</li>
              <li>Send you booking confirmations, updates, and safety information</li>
              <li>Improve and personalize your experience on our platform</li>
              <li>Send marketing communications (with your consent, where required)</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations and enforce our terms</li>
              <li>Conduct analytics and research to improve our services</li>
            </ul>
          </section>

          <section id="legal-basis" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">3. Legal Basis for Processing (GDPR)</h2>
            <p className="text-gray-600 mb-4">Under the UK GDPR, we process your personal data based on:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Contract Performance:</strong> Processing necessary to fulfill bookings and provide services</li>
              <li><strong>Legitimate Interests:</strong> Improving our platform, fraud prevention, business analytics</li>
              <li><strong>Legal Obligation:</strong> Compliance with tax, accounting, and safety regulations</li>
              <li><strong>Consent:</strong> Marketing communications, optional features, and cookies (where required)</li>
              <li><strong>Vital Interests:</strong> Emergency situations requiring disclosure of medical information</li>
            </ul>
          </section>

          <section id="sharing" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">4. Sharing Your Information</h2>
            <p className="text-gray-600 mb-4">We share your information with:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Activity Operators:</strong> Booking details, participant information necessary to provide the activity safely</li>
              <li><strong>Payment Processors:</strong> Stripe, PayPal, and other payment providers to process transactions</li>
              <li><strong>Service Providers:</strong> Email services, analytics tools, hosting providers, customer support platforms</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            </ul>
            <p className="text-gray-600 mt-4">
              <strong>We do not sell your personal data to third parties.</strong>
            </p>
          </section>

          <section id="data-retention" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">5. Data Retention</h2>
            <p className="text-gray-600 mb-4">We retain your personal data for:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Account Data:</strong> Until you request deletion or close your account</li>
              <li><strong>Booking Data:</strong> 7 years for tax and accounting purposes</li>
              <li><strong>Communications:</strong> 3 years from last interaction</li>
              <li><strong>Marketing Data:</strong> Until you unsubscribe or withdraw consent</li>
              <li><strong>Legal Claims:</strong> As long as necessary to defend or pursue legal claims</li>
            </ul>
          </section>

          <section id="your-rights" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-[#ea580c]" />
              6. Your Rights Under GDPR
            </h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
              <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Object:</strong> Object to processing based on legitimate interests or for marketing</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for processing at any time</li>
              <li><strong>Lodge a Complaint:</strong> File a complaint with the UK Information Commissioner's Office (ICO)</li>
            </ul>
            <p className="text-gray-600 mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@adventurewales.co.uk" className="text-[#ea580c] hover:underline">privacy@adventurewales.co.uk</a>.
            </p>
          </section>

          <section id="cookies" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, and deliver 
              personalized content. For detailed information, please see our <Link href="/cookies" className="text-[#ea580c] hover:underline">Cookie Policy</Link>.
            </p>
            <p className="text-gray-600">
              You can manage cookie preferences through your browser settings or our cookie consent tool.
            </p>
          </section>

          <section id="security" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#ea580c]" />
              8. Data Security
            </h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Encryption of data in transit (SSL/TLS) and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
              <li>Incident response and breach notification procedures</li>
            </ul>
            <p className="text-gray-600 mt-4">
              However, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section id="children" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">9. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our services are not directed to children under 16. We do not knowingly collect personal data 
              from children. Parents/guardians make bookings on behalf of children participating in activities.
            </p>
            <p className="text-gray-600">
              If you believe we have collected data from a child, contact us immediately at{" "}
              <a href="mailto:privacy@adventurewales.co.uk" className="text-[#ea580c] hover:underline">privacy@adventurewales.co.uk</a>.
            </p>
          </section>

          <section id="international" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">10. International Data Transfers</h2>
            <p className="text-gray-600 mb-4">
              Your data may be transferred to and processed in countries outside the UK/EEA. When we transfer 
              data internationally, we ensure appropriate safeguards are in place, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Standard Contractual Clauses (SCCs) approved by the UK/EU</li>
              <li>Adequacy decisions by the UK/EU for certain countries</li>
              <li>Binding corporate rules and certifications</li>
            </ul>
          </section>

          <section id="changes" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy periodically. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Posting the updated policy with a new "Last Updated" date</li>
              <li>Sending an email notification to registered users</li>
              <li>Displaying a prominent notice on our website</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Continued use of our services after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section id="contact" className="mb-10">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#ea580c]" />
              12. Contact Us
            </h2>
            <div className="bg-[#1e3a4c]/5 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                For questions about this Privacy Policy or to exercise your rights, contact our Data Protection Officer:
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
                <p className="mt-4"><strong>UK ICO Registration:</strong> [Registration Number]</p>
              </div>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-[#1e3a4c] mb-4">Related Policies</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-[#ea580c] hover:underline">Terms of Service</Link>
            <Link href="/cookies" className="text-[#ea580c] hover:underline">Cookie Policy</Link>
            <Link href="/contact" className="text-[#ea580c] hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Privacy Policy | Adventure Wales",
  description: "Learn how Adventure Wales collects, uses, and protects your personal data. GDPR-compliant privacy policy for UK adventure tourism.",
};
