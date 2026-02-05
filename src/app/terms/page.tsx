import Link from "next/link";
import { ChevronRight, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-medium">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Last updated: January 2024
          </p>
          <p className="text-gray-600 mt-4">
            These Terms of Service ("Terms") govern your use of Adventure Wales and the booking 
            of adventure activities through our platform. Please read them carefully.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-accent-hover/10 border-l-4 border-accent-hover rounded-xl p-6 mb-8">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-accent-hover flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-primary mb-2">Important Notice</h3>
              <p className="text-gray-700 text-sm">
                Adventure activities carry inherent risks. By booking through Adventure Wales, you 
                acknowledge these risks and agree to follow all safety instructions provided by activity 
                operators. Please read Section 5 (Assumption of Risk) carefully.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-primary/5 rounded-2xl p-6 mb-12">
          <h2 className="font-bold text-primary mb-3">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <a href="#acceptance" className="text-primary hover:underline">1. Acceptance of Terms</a>
            <a href="#platform" className="text-primary hover:underline">2. Our Platform</a>
            <a href="#accounts" className="text-primary hover:underline">3. User Accounts</a>
            <a href="#bookings" className="text-primary hover:underline">4. Bookings and Payments</a>
            <a href="#risk" className="text-primary hover:underline">5. Assumption of Risk</a>
            <a href="#cancellations" className="text-primary hover:underline">6. Cancellations and Refunds</a>
            <a href="#conduct" className="text-primary hover:underline">7. User Conduct</a>
            <a href="#content" className="text-primary hover:underline">8. User Content</a>
            <a href="#intellectual" className="text-primary hover:underline">9. Intellectual Property</a>
            <a href="#liability" className="text-primary hover:underline">10. Limitation of Liability</a>
            <a href="#disputes" className="text-primary hover:underline">11. Disputes and Governing Law</a>
            <a href="#general" className="text-primary hover:underline">12. General Provisions</a>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section id="acceptance" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using Adventure Wales ("we", "us", "our"), you ("user", "you", "your") 
              agree to be bound by these Terms of Service and our <Link href="/privacy" className="text-accent-hover hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-gray-600 mb-4">
              If you do not agree to these Terms, you may not use our services. We reserve the right 
              to modify these Terms at any time, with changes effective upon posting.
            </p>
          </section>

          <section id="platform" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">2. Our Platform</h2>
            
            <h3 className="text-xl font-bold text-primary mt-6 mb-3">2.1 Platform Role</h3>
            <p className="text-gray-600 mb-4">
              Adventure Wales operates as a booking platform connecting users with third-party activity 
              operators. We facilitate bookings but do not provide the adventure activities ourselves.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">2.2 Operator Relationships</h3>
            <p className="text-gray-600 mb-4">
              Activity operators are independent businesses. Your booking creates a contract directly 
              between you and the operator. We are not responsible for operator services, safety, or conduct.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">2.3 Information Accuracy</h3>
            <p className="text-gray-600 mb-4">
              While we strive for accuracy, activity information is provided by operators. We do not 
              guarantee completeness or accuracy. Always verify details with operators before participating.
            </p>
          </section>

          <section id="accounts" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-bold text-primary mt-6 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-600 mb-4">You must:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Be at least 18 years old to create an account</li>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of unauthorized account access</li>
            </ul>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">3.2 Account Responsibilities</h3>
            <p className="text-gray-600 mb-4">
              You are responsible for all activities under your account. We are not liable for losses 
              resulting from unauthorized use of your account.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">3.3 Account Termination</h3>
            <p className="text-gray-600 mb-4">
              We may suspend or terminate accounts that violate these Terms or engage in fraudulent, 
              abusive, or illegal activity.
            </p>
          </section>

          <section id="bookings" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">4. Bookings and Payments</h2>
            
            <h3 className="text-xl font-bold text-primary mt-6 mb-3">4.1 Booking Process</h3>
            <p className="text-gray-600 mb-4">
              When you book an activity, you enter into a contract with the operator. Confirmation 
              constitutes acceptance of the operator's terms and conditions.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">4.2 Pricing and Fees</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>All prices are in GBP (£) unless stated otherwise</li>
              <li>Prices include VAT where applicable</li>
              <li>We may charge a service fee (clearly displayed before payment)</li>
              <li>Operators may charge additional fees (equipment, insurance, etc.)</li>
            </ul>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">4.3 Payment Processing</h3>
            <p className="text-gray-600 mb-4">
              Payments are processed through secure third-party providers (Stripe, PayPal). By providing 
              payment information, you authorize charges for bookings and applicable fees.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">4.4 Booking Modifications</h3>
            <p className="text-gray-600 mb-4">
              Modification availability and fees are determined by the operator. Contact the operator 
              directly or use our platform to request changes.
            </p>
          </section>

          <section id="risk" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-accent-hover" />
              5. Assumption of Risk
            </h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-4">
              <p className="text-gray-800 font-semibold mb-2">Adventure Activities Carry Inherent Risks</p>
              <p className="text-gray-700 text-sm">
                By booking through our platform, you acknowledge that adventure activities involve 
                risks including but not limited to injury, illness, and in extreme cases, death.
              </p>
            </div>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">5.1 Your Acknowledgment</h3>
            <p className="text-gray-600 mb-4">You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Adventure activities involve physical exertion and environmental hazards</li>
              <li>You participate at your own risk</li>
              <li>You must follow all safety instructions from operators</li>
              <li>You will disclose relevant medical conditions and limitations</li>
              <li>You have appropriate physical fitness for chosen activities</li>
            </ul>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">5.2 Operator Waivers</h3>
            <p className="text-gray-600 mb-4">
              Operators may require you to sign additional waivers. These are separate agreements 
              between you and the operator.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">5.3 Insurance</h3>
            <p className="text-gray-600 mb-4">
              We strongly recommend purchasing appropriate travel and activity insurance. Operators 
              typically have liability insurance, but personal coverage is your responsibility.
            </p>
          </section>

          <section id="cancellations" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">6. Cancellations and Refunds</h2>
            
            <h3 className="text-xl font-bold text-primary mt-6 mb-3">6.1 Cancellation Policies</h3>
            <p className="text-gray-600 mb-4">
              Each operator sets their own cancellation policy, displayed during booking. Refund 
              eligibility depends on timing and operator terms.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">6.2 Weather Cancellations</h3>
            <p className="text-gray-600 mb-4">
              Operators may cancel due to unsafe weather. In such cases, you'll receive a full refund 
              or alternative date, per the operator's policy.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">6.3 Platform Service Fees</h3>
            <p className="text-gray-600 mb-4">
              Our service fees may be non-refundable, even if the activity is canceled. This will be 
              clearly stated during booking.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">6.4 Refund Processing</h3>
            <p className="text-gray-600 mb-4">
              Approved refunds are processed within 7-14 business days to the original payment method.
            </p>
          </section>

          <section id="conduct" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">7. User Conduct</h2>
            
            <p className="text-gray-600 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Provide false information or impersonate others</li>
              <li>Use the platform for illegal or fraudulent purposes</li>
              <li>Interfere with platform security or functionality</li>
              <li>Scrape, mine, or harvest data from our platform</li>
              <li>Post offensive, defamatory, or inappropriate content</li>
              <li>Circumvent payment systems or fees</li>
              <li>Engage in spam or unauthorized advertising</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section id="content" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">8. User Content</h2>
            
            <h3 className="text-xl font-bold text-primary mt-6 mb-3">8.1 Reviews and Feedback</h3>
            <p className="text-gray-600 mb-4">
              You may post reviews, photos, and feedback. By posting, you grant us a worldwide, 
              royalty-free license to use, display, and distribute your content.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">8.2 Content Standards</h3>
            <p className="text-gray-600 mb-4">
              Your content must be honest, relevant, and respectful. We reserve the right to remove 
              content that violates our standards or these Terms.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">8.3 Content Responsibility</h3>
            <p className="text-gray-600 mb-4">
              You are solely responsible for your content. We are not liable for user-generated content.
            </p>
          </section>

          <section id="intellectual" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">9. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All platform content, including text, graphics, logos, and software, is owned by Adventure 
              Wales or our licensors and protected by UK and international intellectual property laws.
            </p>
            <p className="text-gray-600 mb-4">
              You may not copy, modify, distribute, or create derivative works without our express 
              written permission.
            </p>
          </section>

          <section id="liability" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">10. Limitation of Liability</h2>
            
            <h3 className="text-xl font-bold text-primary mt-6 mb-3">10.1 Platform Provided "As Is"</h3>
            <p className="text-gray-600 mb-4">
              Our platform is provided "as is" without warranties of any kind. We do not guarantee 
              uninterrupted, error-free, or secure operation.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">10.2 Activity Liability</h3>
            <p className="text-gray-600 mb-4">
              We are not liable for injuries, losses, or damages arising from activities booked through 
              our platform. Operators are responsible for their services.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">10.3 Limitation of Damages</h3>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, our total liability for any claim shall not exceed 
              the amount you paid us in the 12 months preceding the claim.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">10.4 Exclusions</h3>
            <p className="text-gray-600 mb-4">
              Nothing in these Terms excludes liability for death or personal injury caused by our 
              negligence, fraud, or other liabilities that cannot be excluded by UK law.
            </p>
          </section>

          <section id="disputes" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">11. Disputes and Governing Law</h2>
            
            <h3 className="text-xl font-bold text-primary mt-6 mb-3">11.1 Governing Law</h3>
            <p className="text-gray-600 mb-4">
              These Terms are governed by the laws of England and Wales. You agree to the exclusive 
              jurisdiction of the courts of England and Wales.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">11.2 Dispute Resolution</h3>
            <p className="text-gray-600 mb-4">
              We encourage resolving disputes informally. Contact us at{" "}
              <a href="mailto:legal@adventurewales.co.uk" className="text-accent-hover hover:underline">legal@adventurewales.co.uk</a>{" "}
              before pursuing legal action.
            </p>

            <h3 className="text-xl font-bold text-primary mt-6 mb-3">11.3 Consumer Rights</h3>
            <p className="text-gray-600 mb-4">
              Nothing in these Terms affects your statutory consumer rights under UK law.
            </p>
          </section>

          <section id="general" className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">12. General Provisions</h2>
            
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
              <li><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and Adventure Wales.</li>
              <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect.</li>
              <li><strong>Waiver:</strong> Our failure to enforce any right does not constitute a waiver of that right.</li>
              <li><strong>Assignment:</strong> You may not assign these Terms. We may assign our rights and obligations to affiliates or successors.</li>
              <li><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our reasonable control.</li>
              <li><strong>Contact:</strong> For questions about these Terms, contact <a href="mailto:legal@adventurewales.co.uk" className="text-accent-hover hover:underline">legal@adventurewales.co.uk</a>.</li>
            </ul>
          </section>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-primary rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Questions About These Terms?</h3>
          <p className="mb-6 opacity-90">
            Our legal team is here to help clarify any questions you may have.
          </p>
          <a
            href="mailto:legal@adventurewales.co.uk"
            className="inline-block px-6 py-3 bg-accent-hover text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors"
          >
            Contact Legal Team
          </a>
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-primary mb-4">Related Policies</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="text-accent-hover hover:underline">Privacy Policy</Link>
            <Link href="/cookies" className="text-accent-hover hover:underline">Cookie Policy</Link>
            <Link href="/help" className="text-accent-hover hover:underline">Help Center</Link>
            <Link href="/contact" className="text-accent-hover hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Terms of Service | Adventure Wales",
  description: "Read our Terms of Service governing the use of Adventure Wales and booking of adventure activities across Wales.",
};
