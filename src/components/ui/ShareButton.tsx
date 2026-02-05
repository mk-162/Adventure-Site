"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  variant?: "icon" | "button" | "icon-only";
  className?: string;
}

export function ShareButton({ title, variant = "button", className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (e) {
        // User cancelled — ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "icon-only") {
    return (
      <button
        onClick={handleShare}
        className={className || "text-gray-500 hover:text-primary transition-colors"}
        aria-label="Share"
        title={copied ? "Link copied!" : "Share"}
      >
        <Share2 className="w-5 h-5" />
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        className={className || "flex flex-col items-center justify-center w-14 gap-1 text-gray-500 hover:text-primary transition-colors"}
        aria-label="Share"
      >
        <Share2 className="w-5 h-5" />
        <span className="text-[10px] font-medium">{copied ? "Copied!" : "Share"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={className || "inline-flex items-center gap-2 px-4 py-2 bg-accent-hover/10 hover:bg-accent-hover/20 text-accent-hover font-semibold text-sm rounded-full border border-accent-hover/30 transition-colors"}
      aria-label="Share"
    >
      <Share2 className="w-4 h-4" />
      {copied ? "Link copied!" : "Share"}
    </button>
  );
}
