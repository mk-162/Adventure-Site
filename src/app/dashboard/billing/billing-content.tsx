"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface BillingContentProps {
  currentTier: string;
  verifiedPriceId: string;
  premiumPriceId: string;
}

export function BillingContent({ currentTier, verifiedPriceId, premiumPriceId }: BillingContentProps) {
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
      const res = await fetch("/api/billing/portal", {
        method: "POST",
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
      alert("Failed to open billing portal");
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Current Plan</h2>
          <p className="text-slate-600 capitalize">You are on the <strong className="text-orange-600">{currentTier}</strong> plan.</p>
        </div>
        {currentTier !== "free" && (
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className={`rounded-xl border p-6 flex flex-col ${currentTier === 'free' ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50/50' : 'border-slate-200 bg-white'}`}>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Free</h3>
            <div className="text-2xl font-bold text-slate-900 mt-2">£0<span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Basic Listing</li>
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Contact Details</li>
          </ul>
          <button disabled className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-default">
            {currentTier === 'free' ? 'Current Plan' : 'Included'}
          </button>
        </div>

        {/* Verified Plan */}
        <div className={`rounded-xl border p-6 flex flex-col ${currentTier === 'verified' ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50/50' : 'border-slate-200 bg-white'}`}>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Verified</h3>
            <div className="text-2xl font-bold text-slate-900 mt-2">£9.99<span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Verified Badge</li>
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Full Profile</li>
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Direct Booking Links</li>
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Itinerary Inclusion</li>
          </ul>
          {currentTier === 'verified' ? (
             <button disabled className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 font-medium cursor-default">
                Active Plan
            </button>
          ) : currentTier === 'premium' ? (
             <button disabled className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-default">
                Included in Premium
             </button>
          ) : (
            <button
                onClick={() => handleUpgrade(verifiedPriceId)}
                disabled={!!loading}
                className="w-full py-2 px-4 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:opacity-50"
            >
                {loading === verifiedPriceId ? "Processing..." : "Upgrade"}
            </button>
          )}
        </div>

        {/* Premium Plan */}
        <div className={`rounded-xl border p-6 flex flex-col relative overflow-hidden ${currentTier === 'premium' ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50/50' : 'border-slate-200 bg-white'}`}>
          {currentTier !== 'premium' && <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Premium</h3>
            <div className="text-2xl font-bold text-slate-900 mt-2">£29.99<span className="text-sm font-normal text-slate-500">/mo</span></div>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Everything in Verified</li>
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Featured Placement</li>
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Priority in Search</li>
            <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500 shrink-0" /> Lead Notifications</li>
          </ul>
          {currentTier === 'premium' ? (
             <button disabled className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 font-medium cursor-default">
                Active Plan
            </button>
          ) : (
            <button
                onClick={() => handleUpgrade(premiumPriceId)}
                disabled={!!loading}
                className="w-full py-2 px-4 rounded-lg bg-[#1e3a4c] text-white font-medium hover:bg-[#152833] disabled:opacity-50"
            >
                {loading === premiumPriceId ? "Processing..." : "Upgrade to Premium"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
