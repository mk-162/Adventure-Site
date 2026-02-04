"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ItinerarySocialShareProps {
  itineraryName: string;
  durationDays: number;
  stopCount: number;
  /** A few notable stop names to highlight */
  highlightStops?: string[];
  className?: string;
}

export function ItinerarySocialShare({
  itineraryName,
  durationDays,
  stopCount,
  highlightStops = [],
  className,
}: ItinerarySocialShareProps) {
  const [copied, setCopied] = useState(false);

  function buildShareText(): string {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const highlights =
      highlightStops.length > 0
        ? ` including ${highlightStops.slice(0, 3).join(", ")}`
        : "";

    return `Just planned my ${itineraryName} adventure in Wales! 🏴󠁧󠁢󠁷󠁬󠁳󠁿 ${durationDays} day${durationDays !== 1 ? "s" : ""}, ${stopCount} stop${stopCount !== 1 ? "s" : ""}${highlights}. Plan yours: ${url}`;
  }

  async function handleShare() {
    const text = buildShareText();

    // Try native share first (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${itineraryName} — Adventure Wales`,
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled — fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Older browsers: textarea fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button
      onClick={handleShare}
      className={
        className ||
        "inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold text-sm rounded-full border border-white/30 transition-all active:scale-95"
      }
      title={copied ? "Copied to clipboard!" : "Share this trip"}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-300" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Share Trip</span>
        </>
      )}
    </button>
  );
}
