"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("aw_cookie_consent");
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("aw_cookie_consent", "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("aw_cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-[#1e3a4c] text-white rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
            onClick={handleDecline}
            className="flex-1 sm:flex-initial px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white border border-white/20 rounded-lg hover:border-white/40 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-initial px-6 py-2.5 text-sm font-bold bg-[#ea580c] hover:bg-orange-600 rounded-lg transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
