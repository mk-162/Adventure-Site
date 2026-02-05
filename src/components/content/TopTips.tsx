import { Lightbulb } from "lucide-react";

interface TopTipsProps {
  tips: string[];
  title?: string;
}

export function TopTips({ tips, title = "Top Tips" }: TopTipsProps) {
  return (
    <div className="bg-white rounded-2xl border-l-4 border-accent p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-primary">{title}</h3>
      </div>

      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0 font-bold text-sm">
              {index + 1}
            </div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base pt-0.5">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
