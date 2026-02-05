"use client";

import { useState } from "react";
import { Copy, Check, Tag } from "lucide-react";

interface DealCodeProps {
  code: string;
  description: string;
  operatorName: string;
  expiryDate?: string;
}

export function DealCode({ code, description, operatorName, expiryDate }: DealCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

  return (
    <div className="border-2 border-dashed border-accent-hover/40 rounded-xl p-4 bg-orange-50/50 relative overflow-hidden">
      {/* Orange accent stripe */}
      <div className="absolute top-0 left-0 w-1 h-full bg-accent-hover" />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent-hover" />
            <span className="text-xs font-bold text-accent-hover uppercase tracking-wider">
              Deal
            </span>
          </div>
          {isExpired && (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              EXPIRED
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-primary font-semibold mt-2">
          {description}
        </p>
        <p className="text-xs text-gray-500 mt-1">at {operatorName}</p>

        {/* Code + copy */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm font-bold text-primary tracking-wider text-center select-all">
            {code}
          </div>
          <button
            onClick={handleCopy}
            disabled={isExpired}
            className={`shrink-0 p-2 rounded-lg transition-all ${
              copied
                ? "bg-green-100 text-green-600"
                : isExpired
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-accent-hover text-white hover:bg-accent-hover/90 shadow-sm"
            }`}
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Expiry */}
        {expiryDate && !isExpired && (
          <p className="text-[10px] text-gray-400 mt-2">
            Valid until{" "}
            {new Date(expiryDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
