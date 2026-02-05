import { Waves } from "lucide-react";

interface WaveLevel {
  level: string;
  label: string;
  color: string;
  waveHeight: string;
  description: string;
  spotExample: string;
}

interface SurfGradingGuideProps {
  levels: WaveLevel[];
}

export function SurfGradingGuide({ levels }: SurfGradingGuideProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {levels.map((level) => (
        <div
          key={level.level}
          className="group relative bg-white rounded-2xl p-6 shadow-sm border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          style={{ borderColor: level.color }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ backgroundColor: level.color }}
          />
          
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${level.color}15` }}
            >
              <span style={{ color: level.color }}>
                <Waves className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div
                className="text-lg font-bold"
                style={{ color: level.color }}
              >
                {level.label}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {level.waveHeight}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {level.description}
          </p>

          <div className="text-xs text-gray-500">
            <span className="font-medium">e.g.</span> {level.spotExample}
          </div>
        </div>
      ))}
    </div>
  );
}
