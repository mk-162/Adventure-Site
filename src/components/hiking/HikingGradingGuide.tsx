import { Circle, Square, Diamond, Skull, Mountain } from "lucide-react";

interface Grade {
  level: string;
  label: string;
  color: string;
  description: string;
  example: string;
  icon: string;
}

interface HikingGradingGuideProps {
  grades: Grade[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  circle: Circle,
  square: Square,
  diamond: Diamond,
  skull: Skull,
  "double-diamond": Mountain,
};

export function HikingGradingGuide({ grades }: HikingGradingGuideProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {grades.map((grade) => {
        const Icon = iconMap[grade.icon] || Circle;
        
        return (
          <div
            key={grade.level}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            style={{ borderColor: grade.color }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ backgroundColor: grade.color }}
            />
            
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${grade.color}15` }}
              >
                <span style={{ color: grade.color }}>
                  <Icon className="w-5 h-5" />
                </span>
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: grade.color }}
              >
                {grade.label}
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {grade.description}
            </p>

            <div className="text-xs text-gray-500">
              <span className="font-medium">e.g.</span> {grade.example}
            </div>
          </div>
        );
      })}
    </div>
  );
}
