"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

export function AlreadyListedTooltip() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-base cursor-pointer"
      >
        Already listed? Claim your page →
      </button>
      {open && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-3 w-80 bg-white text-slate-700 rounded-xl shadow-xl border border-slate-200 p-5 z-50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-accent-hover shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Find your attraction in our directory and click the{" "}
              <strong>&lsquo;Claim&rsquo;</strong> button on your listing page.
            </p>
          </div>
          <div className="absolute -top-2 left-12 sm:left-auto sm:right-12 w-4 h-4 bg-white border-l border-t border-slate-200 rotate-45" />
        </div>
      )}
    </div>
  );
}
