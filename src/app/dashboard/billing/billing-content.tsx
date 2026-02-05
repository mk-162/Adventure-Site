"use client";

import { useState } from "react";
import { Check, Star, Rocket, Phone } from "lucide-react";
import Link from "next/link";

interface BillingContentProps {
  currentTier: string;
  enhancedPriceId: string;
  premiumPriceId: string;
}

export function BillingContent({ currentTier, enhancedPriceId, premiumPriceId }: BillingContentProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(priceId: string) {
    setLoading(priceId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong");
        setLoading(null);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to start checkout");
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong");
        setLoading(null);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to open billing portal");
      setLoading(null);
    }
  }

  const isPaid = currentTier === "verified" || currentTier === "premium";

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Current Plan</h2>
          <p className="text-slate-600">
            You are on the <strong className="text-orange-600 capitalize">{currentTier === "verified" ? "Enhanced" : currentTier}</strong> plan.
          </p>
        </div>
        {isPaid && (
          <button
            onClick={handlePortal}
            disabled={!!loading}
            className="text-slate-600 font-medium hover:text-slate-900 border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-50 disabled:opacity-50"
          >
            {loading === "portal" ? "Loading..." : "Manage Billing"}
          </button>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Free */}
        <div className={`rounded-xl border p-5 flex flex-col ${currentTier === "free" ? "border-orange-500 ring-1 ring-orange-500 bg-orange-50/50" : "border-slate-200 bg-white"}`}>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Free</h3>
            <div className="text-2xl font-bold text-slate-900 mt-2">£0<span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-2.5 mb-6 flex-1 text-sm">
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Basic listing</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Contact details shown</li>
          </ul>
          <button disabled className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-default text-sm">
            {currentTier === "free" ? "Current Plan" : "Included"}
          </button>
        </div>

        {/* Enhanced (£9.99/mo) */}
        <div className={`rounded-xl border p-5 flex flex-col ${currentTier === "verified" ? "border-orange-500 ring-1 ring-orange-500 bg-orange-50/50" : "border-slate-200 bg-white"}`}>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Enhanced</h3>
            <div className="text-2xl font-bold text-slate-900 mt-2">£9.99<span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-2.5 mb-6 flex-1 text-sm">
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Verified badge</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Full profile & description</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Direct booking links</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Included in itineraries</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Manage your own listing</li>
          </ul>
          {currentTier === "verified" ? (
            <button disabled className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 font-medium cursor-default text-sm">Active Plan</button>
          ) : currentTier === "premium" ? (
            <button disabled className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-default text-sm">Included</button>
          ) : (
            <button
              onClick={() => handleUpgrade(enhancedPriceId)}
              disabled={!!loading || !enhancedPriceId}
              className="w-full py-2.5 px-4 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors text-sm"
            >
              {loading === enhancedPriceId ? "Processing..." : "Upgrade"}
            </button>
          )}
        </div>

        {/* Premium (£29.99/mo) */}
        <div className={`rounded-xl border p-5 flex flex-col relative overflow-hidden ${currentTier === "premium" ? "border-orange-500 ring-1 ring-orange-500 bg-orange-50/50" : "border-slate-200 bg-white"}`}>
          {currentTier !== "premium" && (
            <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-bl-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> POPULAR
            </div>
          )}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Premium</h3>
            <div className="text-2xl font-bold text-slate-900 mt-2">£29.99<span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-2.5 mb-6 flex-1 text-sm">
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Everything in Enhanced</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Featured placement across site</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Priority in search & directory</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Lead notifications</li>
            <li className="flex gap-2 text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Analytics dashboard</li>
          </ul>
          {currentTier === "premium" ? (
            <button disabled className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 font-medium cursor-default text-sm">Active Plan</button>
          ) : (
            <button
              onClick={() => handleUpgrade(premiumPriceId)}
              disabled={!!loading || !premiumPriceId}
              className="w-full py-2.5 px-4 rounded-lg bg-[#1e3a4c] text-white font-bold hover:bg-[#152833] disabled:opacity-50 transition-colors shadow-lg text-sm"
            >
              {loading === premiumPriceId ? "Processing..." : "Upgrade to Premium"}
            </button>
          )}
        </div>

        {/* Enterprise / Corporate */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-[#1e3a4c] to-[#152833] p-5 flex flex-col text-white">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold">Enterprise</h3>
            </div>
            <div className="text-2xl font-bold mt-2">Custom<span className="text-sm font-normal text-white/60 ml-1">pricing</span></div>
          </div>
          <ul className="space-y-2.5 mb-6 flex-1 text-sm">
            <li className="flex gap-2 text-white/80"><Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" /> Everything in Premium</li>
            <li className="flex gap-2 text-white/80"><Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" /> Homepage & category takeovers</li>
            <li className="flex gap-2 text-white/80"><Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" /> Custom branded pages</li>
            <li className="flex gap-2 text-white/80"><Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" /> Native content campaigns</li>
            <li className="flex gap-2 text-white/80"><Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" /> Multi-location packages</li>
          </ul>
          <Link
            href="/partners/enterprise"
            className="w-full py-2.5 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-center transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Let&apos;s Talk
          </Link>
        </div>
      </div>
    </div>
  );
}
