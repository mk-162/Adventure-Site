"use client";

import { Share2, Copy, Check, Mail } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareEventButtonProps {
  eventName: string;
  eventUrl: string; // Absolute URL
}

export function ShareEventButton({ eventName, eventUrl }: ShareEventButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventName,
          text: `Check out ${eventName} on Adventure Wales!`,
          url: eventUrl,
        });
      } catch (err) {
        // Fallback to custom menu
        setIsOpen(!isOpen);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition-all duration-300">
          <Share2 className="w-6 h-6" />
        </div>
        <span className="text-xs font-medium text-gray-500">Share</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-20 flex flex-col gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out ${eventName}: ${eventUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {/* WhatsApp Icon placeholder or Lucide */}
              <span className="font-bold text-green-600">WA</span> WhatsApp
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(eventName)}&body=${encodeURIComponent(`Check out this event: ${eventUrl}`)}`}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" /> Email
            </a>
          </div>
        </>
      )}
    </div>
  );
}
