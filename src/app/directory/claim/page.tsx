import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, CheckCircle, ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Claim Your Listing | Adventure Wales",
  description:
    "Run an adventure business in Wales? Claim your free listing on Adventure Wales and reach thousands of adventure seekers.",
};

export default function ClaimListingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-[#2d5568] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="h-16 w-16 mx-auto mb-6 text-accent-hover" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Claim Your Business Listing
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Free listing for qualified, insured Welsh adventure operators. Get
            found by thousands of adventure seekers.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* How it works */}
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              step: "1",
              title: "Find Your Listing",
              description:
                "Search the directory for your business. If it's not there yet, we'll create one for you.",
            },
            {
              step: "2",
              title: "Verify Ownership",
              description:
                "Confirm you're the business owner via email verification. Takes under 2 minutes.",
            },
            {
              step: "3",
              title: "Complete Your Profile",
              description:
                "Add photos, services, pricing, and booking links. Make your listing shine.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-accent-hover text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div className="bg-slate-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6">
            What You Get (Free)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Business name, location & contact details",
              "Category listing (activity, gear hire, food, transport)",
              "Link to your website",
              "Appear in directory search results",
              "Region & activity type tags",
              "Basic listing visible to all visitors",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-primary to-[#2d5568] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Listed?</h2>
          <p className="text-slate-200 mb-8 max-w-lg mx-auto">
            Email us with your business name, website, and what you offer.
            We&apos;ll get your listing set up within 24 hours.
          </p>
          <a
            href="mailto:hello@adventurewales.co.uk?subject=Claim%20My%20Listing&body=Business%20name%3A%0AWebsite%3A%0AWhat%20we%20offer%3A%0ALocation%3A%0A"
            className="inline-flex items-center gap-2 bg-accent-hover text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            <Mail className="h-5 w-5" />
            Claim Your Listing
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-sm text-slate-300 mt-4">
            Already listed?{" "}
            <Link href="/directory" className="underline hover:text-white">
              Find your business in the directory
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
