import { Lightbulb } from "lucide-react";

interface TopTipProps {
  tip: string;
  context?: string; // e.g., "Pembrokeshire", "Coasteering"
  variant?: "inline" | "card" | "banner";
}

export function TopTip({ tip, context, variant = "card" }: TopTipProps) {
  if (variant === "banner") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <div className="bg-amber-100 rounded-lg p-2 flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-900">
            {context ? `${context} Tip` : "Top Tip"}
          </p>
          <p className="text-sm text-amber-800 mt-0.5">{tip}</p>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-2">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span><strong>Tip:</strong> {tip}</span>
      </p>
    );
  }

  // card (default)
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h4 className="font-bold text-[#1e3a4c] text-sm">
          {context ? `${context} Tip` : "Top Tip"}
        </h4>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
    </div>
  );
}
