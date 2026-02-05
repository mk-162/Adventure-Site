import { Lightbulb } from "lucide-react";

interface ProTipProps {
  tip: string;
}

export function ProTip({ tip }: ProTipProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 flex gap-3 items-start">
      <div className="shrink-0 mt-0.5">
        <Lightbulb className="w-5 h-5 text-amber-600" />
      </div>
      <div>
        <span className="font-bold text-amber-900 text-sm">Pro tip: </span>
        <span className="text-amber-800 text-sm leading-relaxed">{tip}</span>
      </div>
    </div>
  );
}
