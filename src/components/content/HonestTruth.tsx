import { CheckCircle, AlertCircle } from "lucide-react";

interface HonestTruthProps {
  great: string[];
  notGreat: string[];
}

export function HonestTruth({ great, notGreat }: HonestTruthProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
      <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-6">The Honest Truth</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* What's Great */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h4 className="text-lg font-bold text-emerald-900">What's Great</h4>
          </div>
          <ul className="space-y-3">
            {great.map((item, index) => (
              <li key={index} className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What's Not */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h4 className="text-lg font-bold text-amber-900">What's Not</h4>
          </div>
          <ul className="space-y-3">
            {notGreat.map((item, index) => (
              <li key={index} className="flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
