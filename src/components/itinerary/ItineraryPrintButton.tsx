"use client";

import { Printer } from "lucide-react";

interface ItineraryPrintButtonProps {
  className?: string;
}

export function ItineraryPrintButton({ className }: ItineraryPrintButtonProps) {
  return (
    <button
      onClick={() => window.print()}
      className={
        className ||
        "inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold text-sm rounded-full border border-white/30 transition-all active:scale-95"
      }
      title="Download as PDF"
      data-print-hide
    >
      <Printer className="w-4 h-4" />
      <span>Download PDF</span>
    </button>
  );
}
