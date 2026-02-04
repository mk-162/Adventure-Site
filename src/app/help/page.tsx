import Link from "next/link";
import { ChevronRight, Search, HelpCircle, CreditCard, Calendar, MapPin, Shield, Phone, Mail, MessageCircle } from "lucide-react";

export default function HelpPage() {
  const faqCategories = [
    {
      icon: Calendar,
      title: "Booking & Reservations",
      faqs: [
        {
          question: "How do I book an activity?",
          answer: "Browse activities, select your preferred date and time, add participants, and complete payment. You'll receive instant confirmation via email."
        },
        {
          question: "Can I book for someone else?",
          answer: "Yes! You can enter participant details for others. You'll be the booking contact, but any adult can attend as the designated participant."
        },
        {
          question: "How far in advance should I book?",
          answer: "Popular activities fill up quickly, especially in peak season (June-August). We recommend booking 2-4 weeks ahead, though last-minute availability varies by operator."
        },
        {
          question: "Will I receive a booking confirmation?",
          answer: "Yes, you'll receive an email confirmation immediately with booking details, meeting location, what to bring, and operator contact information."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment & Pricing",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay through our secure payment processors."
        },
        {
          question: "When will I be charged?",
          answer: "Most bookings are charged immediately. Some operators offer 'pay later' or deposit options - this is clearly shown during checkout."
        },
        {
          question: "Are there any additional fees?",
          answer: "Prices include VAT and our service fee (if applicable). Some operators charge extra for equipment rental, photos, or insurance - these are shown before payment."
        },
        {
          question: "Can I get a receipt or invoice?",
          answer: "Yes, your confirmation email includes a receipt. You can also download invoices from your account dashboard."
        }
      ]
    },
    {
      icon: XCircle,
      title: "Cancellations & Changes",
      faqs: [
        {
          question: "What's your cancellation policy?",
          answer: "Each operator sets their own policy. Most offer full refunds 7+ days before, partial refunds 3-7 days before, and no refund within 72 hours. Check the specific policy before booking."
        },
        {
          question: "How do I cancel my booking?",
          answer: "Log into your account, go to 'My Bookings', select the booking, and click 'Request Cancellation'. You'll receive confirmation within 24 hours."
        },
        {
          question: "Can I change my booking date?",
          answer: "Yes, subject to availability and the operator's modification policy. Contact us or use the 'Modify Booking' option in your account. Some operators may charge a fee."
        },
        {
          question: "What if the weather is bad?",
          answer: "Operators will contact you if conditions are unsafe. In weather cancellations, you'll receive a full refund or alternative date. Minor rain rarely cancels activities - operators will advise on suitable weather gear."
        }
      ]
    },
    {
      icon: Shield,
      title: "Safety & Requirements",
      faqs: [
        {
          question: "Are the activities safe?",
          answer: "All operators are vetted and hold appropriate insurance, qualifications, and safety certifications. However, adventure activities carry inherent risks - operators will brief you on safety procedures."
        },
        {
          question: "What are the age restrictions?",
          answer: "Each activity has minimum (and sometimes maximum) age requirements shown on the activity page. Children under 18 typically need parental consent."
        },
        {
          question: "Do I need to be fit?",
          answer: "Fitness requirements vary by activity. Check the difficulty level and description. When in doubt, contact the operator before booking."
        },
        {
          question: "What should I disclose about medical conditions?",
          answer: "Disclose any conditions that may affect participation (heart conditions, pregnancy, recent injuries, etc.). Operators will advise if the activity is suitable or needs modifications."
        }
      ]
    },
    {
      icon: MapPin,
      title: "Trip Planning",
      faqs: [
        {
          question: "What should I bring?",
          answer: "Each booking confirmation includes a 'What to Bring' list. Generally: appropriate clothing, water, snacks, and any personal medication. Operators often provide specialized equipment."
        },
        {
          question: "Where do I meet the operator?",
          answer: "Meeting locations and times are in your confirmation email. Arrive 10-15 minutes early. Most activities meet at outdoor car parks or operator bases."
        },
        {
          question: "Is parking available?",
          answer: "Most locations have parking, though it may require fees. Check your booking confirmation for specific parking information and nearby alternatives."
        },
        {
          question: "Can I bring my own equipment?",
          answer: "Operators typically provide all necessary safety equipment. Personal gear (wetsuits, shoes, helmets) is usually welcome if it meets safety standards - confirm with the operator."
        }
      ]
    },
    {
      icon: HelpCircle,
      title: "Account & Technical",
      faqs: [
        {
          question: "Do I need an account to book?",
          answer: "No, you can checkout as a guest. However, accounts make it easier to manage bookings, save favorites, and access past activity history."
        },
        {
          question: "I forgot my password. What do I do?",
          answer: "Click 'Forgot Password' on the login page. Enter your email, and we'll send a reset link. Check spam if you don't see it within 5 minutes."
        },
        {
          question: "Can I change my account email?",
          answer: "Yes, go to Account Settings → Profile Information → Update Email. You'll need to verify the new email address."
        },
        {
          question: "How do I delete my account?",
          answer: "Contact us at privacy@adventurewales.co.uk to request account deletion. We'll process this within 30 days, subject to legal retention requirements."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1e3a4c] font-medium">Help Center</span>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a4c]/20 focus:border-[#1e3a4c] text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link href="/contact" className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#f97316] transition-all group text-center">
            <Mail className="w-10 h-10 text-[#f97316] mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm">Get help from our team within 24 hours</p>
          </Link>

          <a href="tel:+442920123456" className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#f97316] transition-all group text-center">
            <Phone className="w-10 h-10 text-[#f97316] mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm">+44 (0) 29 2012 3456<br />Mon-Fri, 9:00-17:00</p>
          </a>

          <div className="bg-gradient-to-br from-[#1e3a4c] to-[#2a5570] rounded-2xl p-6 text-white text-center">
            <MessageCircle className="w-10 h-10 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Live Chat</h3>
            <p className="text-sm opacity-90 mb-4">Available Mon-Fri, 9:00-17:00</p>
            <button className="px-4 py-2 bg-white text-[#1e3a4c] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm">
              Start Chat
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#1e3a4c] mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {faqCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#f97316]/10 rounded-xl flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1e3a4c]">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq, faqIdx) => (
                    <details key={faqIdx} className="group">
                      <summary className="flex items-start gap-2 cursor-pointer list-none">
                        <ChevronRight className="w-5 h-5 text-[#1e3a4c] mt-0.5 flex-shrink-0 transition-transform group-open:rotate-90" />
                        <span className="font-medium text-[#1e3a4c] group-hover:text-[#f97316] transition-colors">
                          {faq.question}
                        </span>
                      </summary>
                      <div className="mt-2 ml-7 text-sm text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Topics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#1e3a4c] mb-6 text-center">Popular Help Topics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/safety" className="bg-[#1e3a4c]/5 rounded-xl p-4 hover:bg-[#1e3a4c]/10 transition-colors">
              <div className="font-medium text-[#1e3a4c] mb-1">Safety Guidelines</div>
              <div className="text-sm text-gray-600">Learn about our safety standards</div>
            </Link>
            <Link href="/terms" className="bg-[#1e3a4c]/5 rounded-xl p-4 hover:bg-[#1e3a4c]/10 transition-colors">
              <div className="font-medium text-[#1e3a4c] mb-1">Terms of Service</div>
              <div className="text-sm text-gray-600">Understand your rights and obligations</div>
            </Link>
            <Link href="/privacy" className="bg-[#1e3a4c]/5 rounded-xl p-4 hover:bg-[#1e3a4c]/10 transition-colors">
              <div className="font-medium text-[#1e3a4c] mb-1">Privacy Policy</div>
              <div className="text-sm text-gray-600">How we handle your data</div>
            </Link>
            <Link href="/partners" className="bg-[#1e3a4c]/5 rounded-xl p-4 hover:bg-[#1e3a4c]/10 transition-colors">
              <div className="font-medium text-[#1e3a4c] mb-1">Become a Partner</div>
              <div className="text-sm text-gray-600">List your activities with us</div>
            </Link>
            <Link href="/destinations" className="bg-[#1e3a4c]/5 rounded-xl p-4 hover:bg-[#1e3a4c]/10 transition-colors">
              <div className="font-medium text-[#1e3a4c] mb-1">Destinations Guide</div>
              <div className="text-sm text-gray-600">Explore regions across Wales</div>
            </Link>
            <Link href="/contact" className="bg-[#1e3a4c]/5 rounded-xl p-4 hover:bg-[#1e3a4c]/10 transition-colors">
              <div className="font-medium text-[#1e3a4c] mb-1">Contact Us</div>
              <div className="text-sm text-gray-600">Get personalized support</div>
            </Link>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="bg-gradient-to-br from-[#1e3a4c] to-[#2a5570] rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Our friendly support team is here to answer any questions you have about 
            activities, bookings, or planning your Welsh adventure.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-[#f97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0a] transition-colors"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@adventurewales.co.uk"
              className="px-8 py-3 bg-white text-[#1e3a4c] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Email Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
  </svg>
);

export const metadata = {
  title: "Help Center | Adventure Wales",
  description: "Find answers to frequently asked questions about bookings, payments, cancellations, safety, and more at Adventure Wales.",
};
