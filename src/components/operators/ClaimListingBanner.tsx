import Link from "next/link";
import { Shield, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

interface ClaimListingBannerProps {
  operatorSlug: string;
  operatorName: string;
  /** Compact variant for sidebar placement */
  variant?: "full" | "sidebar" | "inline";
  /** Is this a stub/thin listing? Shows stronger messaging */
  isStub?: boolean;
}

export function ClaimListingBanner({
  operatorSlug,
  operatorName,
  variant = "full",
  isStub = false,
}: ClaimListingBannerProps) {
  if (variant === "sidebar") {
    return (
      <div className="bg-gradient-to-br from-primary to-[#2d5a73] rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-accent-hover" />
          <span className="font-bold text-sm">Is this your business?</span>
        </div>
        <p className="text-white/80 text-xs leading-relaxed mb-4">
          Claim this listing to update your info, respond to enquiries, and reach more customers.
        </p>
        <ul className="space-y-1.5 mb-4">
          <li className="flex items-center gap-2 text-xs text-white/90">
            <CheckCircle className="w-3.5 h-3.5 text-accent-hover shrink-0" />
            Update your description &amp; photos
          </li>
          <li className="flex items-center gap-2 text-xs text-white/90">
            <CheckCircle className="w-3.5 h-3.5 text-accent-hover shrink-0" />
            Get enquiry notifications
          </li>
          <li className="flex items-center gap-2 text-xs text-white/90">
            <CheckCircle className="w-3.5 h-3.5 text-accent-hover shrink-0" />
            Free to claim — upgrade anytime
          </li>
        </ul>
        <Link
          href={`/claim/${operatorSlug}`}
          className="block w-full text-center px-4 py-2.5 bg-accent-hover hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Claim Listing
        </Link>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <Shield className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm text-amber-900">
            <strong>Business owner?</strong> Claim this listing to manage your info.
          </span>
        </div>
        <Link
          href={`/claim/${operatorSlug}`}
          className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Claim
        </Link>
      </div>
    );
  }

  // Full variant — prominent banner for stub pages
  return (
    <div className={`rounded-2xl overflow-hidden ${isStub ? "border-2 border-accent-hover" : "border border-gray-200"}`}>
      <div className="bg-gradient-to-r from-primary via-primary to-[#2d5a73] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isStub && <Sparkles className="w-5 h-5 text-accent-hover" />}
              <h3 className="text-white font-bold text-lg">
                {isStub ? "This listing needs your help!" : `Own ${operatorName}?`}
              </h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-lg">
              {isStub
                ? `We've created a basic listing for ${operatorName} but it needs the real details. Claim it for free to add your description, photos, pricing, and start receiving enquiries from adventurers across Wales.`
                : `Claim this listing to take control of your page. Update your info, add photos, respond to enquiries, and reach thousands of adventure-seekers.`}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5">
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <CheckCircle className="w-4 h-4 text-accent-hover" />
                Free to claim
              </div>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <CheckCircle className="w-4 h-4 text-accent-hover" />
                Edit your listing
              </div>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <CheckCircle className="w-4 h-4 text-accent-hover" />
                Get enquiry alerts
              </div>
              <div className="flex items-center gap-1.5 text-white/90 text-xs">
                <CheckCircle className="w-4 h-4 text-accent-hover" />
                Verified badge
              </div>
            </div>
            <Link
              href={`/claim/${operatorSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-hover hover:bg-accent-hover text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <Shield className="w-4 h-4" />
              Claim This Listing — It&apos;s Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
