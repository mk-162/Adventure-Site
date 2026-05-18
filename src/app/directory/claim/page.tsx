import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, CheckCircle, ArrowRight } from "lucide-react";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { ClaimSearch } from "./ClaimSearch";

export const metadata: Metadata = {
  title: "Claim Your Listing | Adventure Wales",
  description:
    "Run an adventure business in Wales? Find your listing and claim it free in under two minutes.",
};

export const revalidate = 300;

export default async function ClaimListingPage() {
  // Pull all claimable (stub) operators so users can find their business client-side.
  const claimable = await db
    .select({
      slug: operators.slug,
      name: operators.name,
      type: operators.type,
      claimStatus: operators.claimStatus,
    })
    .from(operators)
    .where(eq(operators.claimStatus, "stub"))
    .orderBy(asc(operators.name));

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-primary to-[#2d5568] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="h-16 w-16 mx-auto mb-6 text-accent-hover" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Claim Your Business Listing
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Find your business below, verify ownership, and start managing your
            free Adventure Wales listing in under two minutes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Find your business
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            Search our directory for your business. If we haven&apos;t listed
            you yet,{" "}
            <Link
              href="/advertise"
              className="text-accent-hover font-semibold underline"
            >
              get in touch and we&apos;ll create your stub
            </Link>
            .
          </p>
          <ClaimSearch operators={claimable} />
        </div>

        <h2 className="text-3xl font-bold text-primary mb-8 text-center">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              step: "1",
              title: "Find Your Listing",
              description:
                "Search the directory above for your business. If it's not there yet, we'll create one for you.",
            },
            {
              step: "2",
              title: "Verify Ownership",
              description:
                "Submit your business email — we send a magic link to confirm you own the business. Takes under two minutes.",
            },
            {
              step: "3",
              title: "Manage Your Profile",
              description:
                "Once verified you can update photos, services, opening hours and respond to enquiries direct.",
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

        <div className="bg-slate-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6">
            What You Get (Free)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Verified business badge on your listing",
              "Edit description, photos, contact details, hours",
              "Direct enquiries from adventure seekers",
              "Appear in directory search results",
              "Region & activity type tags",
              "Upsell to Premium for featured placement",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-primary to-[#2d5568] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Not listed yet?</h2>
          <p className="text-slate-200 mb-8 max-w-lg mx-auto">
            We add new operators every week. Tell us a little about your
            business and we&apos;ll build your stub within 24 hours, ready for
            you to claim.
          </p>
          <Link
            href="/advertise"
            className="inline-flex items-center gap-2 bg-accent-hover text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            Get my business listed
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
