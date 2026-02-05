"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ChevronDown, ChevronUp } from "lucide-react";

interface CookiePreferences {
  essential: boolean; // always true
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

function getStoredConsent(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem("aw_cookie_consent");
    if (!stored) return null;
    return JSON.parse(stored) as CookiePreferences;
  } catch {
    return null;
  }
}

function storeConsent(prefs: CookiePreferences) {
  localStorage.setItem("aw_cookie_consent", JSON.stringify(prefs));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAcceptAll() {
    const prefs: CookiePreferences = { essential: true, analytics: true, marketing: true };
    storeConsent(prefs);
    setVisible(false);
  }

  function handleRejectAll() {
    const prefs: CookiePreferences = { essential: true, analytics: false, marketing: false };
    storeConsent(prefs);
    setVisible(false);
  }

  function handleSavePreferences() {
    storeConsent({ ...preferences, essential: true });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-[#1e3a4c] text-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Main bar */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Cookie className="w-8 h-8 text-[#ea580c] flex-shrink-0 hidden sm:block" />
          <div className="flex-1">
            <p className="text-sm sm:text-base">
              We use cookies to improve your experience and analyse site traffic.{" "}
              <Link href="/cookies" className="underline text-[#ea580c] hover:text-orange-400">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={handleRejectAll}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white border border-white/20 rounded-lg hover:border-white/40 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-initial px-6 py-2.5 text-sm font-bold bg-[#ea580c] hover:bg-orange-700 rounded-lg transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Manage preferences toggle */}
        <div className="px-5 sm:px-6 pb-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            Manage preferences
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Granular controls */}
        {showDetails && (
          <div className="px-5 sm:px-6 pb-5 border-t border-white/10 pt-4 space-y-3">
            {/* Essential — always on */}
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Essential</span>
                <p className="text-xs text-white/50">Required for the site to function. Cannot be disabled.</p>
              </div>
              <div className="relative">
                <input type="checkbox" checked disabled className="sr-only" />
                <div className="w-10 h-5 bg-[#ea580c] rounded-full opacity-60 cursor-not-allowed" />
                <div className="absolute top-0.5 left-5 w-4 h-4 bg-white rounded-full" />
              </div>
            </label>

            {/* Analytics */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium">Analytics</span>
                <p className="text-xs text-white/50">Help us understand how visitors use the site.</p>
              </div>
              <div className="relative" onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}>
                <div className={`w-10 h-5 rounded-full transition-colors ${preferences.analytics ? "bg-[#ea580c]" : "bg-white/20"}`} />
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${preferences.analytics ? "left-5" : "left-0.5"}`} />
              </div>
            </label>

            {/* Marketing */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium">Marketing</span>
                <p className="text-xs text-white/50">Used for targeted advertising and promotions.</p>
              </div>
              <div className="relative" onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}>
                <div className={`w-10 h-5 rounded-full transition-colors ${preferences.marketing ? "bg-[#ea580c]" : "bg-white/20"}`} />
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${preferences.marketing ? "left-5" : "left-0.5"}`} />
              </div>
            </label>

            <button
              onClick={handleSavePreferences}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-colors mt-2"
            >
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
