import { Star, Zap, Waves, Thermometer } from "lucide-react";

interface SurfSeason {
  months: string;
  conditions: string;
  rating: number;
  waveHeight: string;
  waterTemp: string;
  wetsuit: string;
  tip: string;
}

interface SurfSeasonGuideProps {
  seasons: {
    spring: SurfSeason;
    summer: SurfSeason;
    autumn: SurfSeason;
    winter: SurfSeason;
  };
}

const seasonConfig = {
  spring: {
    name: "Spring",
    color: "from-green-50 to-green-100",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
  },
  summer: {
    name: "Summer",
    color: "from-yellow-50 to-yellow-100",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-600",
  },
  autumn: {
    name: "Autumn",
    color: "from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
    iconColor: "text-orange-600",
  },
  winter: {
    name: "Winter",
    color: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
  },
};

export function SurfSeasonGuide({ seasons }: SurfSeasonGuideProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {(Object.keys(seasons) as Array<keyof typeof seasons>).map((season) => {
        const data = seasons[season];
        const config = seasonConfig[season];

        return (
          <div
            key={season}
            className={`bg-gradient-to-br ${config.color} rounded-2xl border-2 ${config.borderColor} p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-primary mb-1">
                {config.name}
              </h3>
              <div className="text-sm font-medium text-gray-600">
                {data.months}
              </div>
            </div>

            <div className="flex items-center gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < data.rating
                      ? `${config.iconColor} fill-current`
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Wave & Temp Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <Waves className={`h-4 w-4 mx-auto mb-1 ${config.iconColor}`} />
                <div className="text-xs text-gray-600 font-medium">{data.waveHeight}</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <Thermometer className={`h-4 w-4 mx-auto mb-1 ${config.iconColor}`} />
                <div className="text-xs text-gray-600 font-medium">{data.waterTemp}</div>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {data.conditions}
            </p>

            <div className="text-xs text-gray-600 mb-3 bg-white/50 rounded p-2">
              <span className="font-medium">Wetsuit:</span> {data.wetsuit}
            </div>

            <div className={`bg-white/80 rounded-lg p-3 border ${config.borderColor}`}>
              <div className={`flex items-start gap-2 ${config.iconColor}`}>
                <Zap className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 leading-relaxed">
                  {data.tip}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
