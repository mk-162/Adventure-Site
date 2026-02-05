"use client";

import { useState } from "react";
import { Circle, Square, Diamond, Skull, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

interface DifficultyLevel {
  level: string;
  label: string;
  color: string;
  description: string;
  whatToExpect: string[];
  physicalRequirements: string;
  suitableCaves: string[];
  icon: string;
}

interface DifficultyGuideProps {
  levels: DifficultyLevel[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  circle: Circle,
  square: Square,
  diamond: Diamond,
  skull: Skull,
};

export function DifficultyGuide({ levels }: DifficultyGuideProps) {
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {levels.map((level) => {
        const Icon = iconMap[level.icon] || Circle;
        const isExpanded = expandedLevel === level.level;

        return (
          <div
            key={level.level}
            className="bg-white rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            style={{ borderColor: level.color }}
          >
            {/* Color bar */}
            <div
              className="h-1.5"
              style={{ backgroundColor: level.color }}
            />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${level.color}15` }}
                >
                  <span style={{ color: level.color }}>
                    <Icon className="w-6 h-6" />
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {level.level}
                  </div>
                  <div
                    className="text-xl font-bold"
                    style={{ color: level.color }}
                  >
                    {level.label}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {level.description}
              </p>

              {/* Suitable caves */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Example caves
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {level.suitableCaves.map((cave, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full border"
                      style={{
                        borderColor: level.color,
                        color: level.color,
                        backgroundColor: `${level.color}10`,
                      }}
                    >
                      {cave}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setExpandedLevel(isExpanded ? null : level.level)}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-accent-hover transition-colors"
              >
                {isExpanded ? "Less details" : "More details"}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                {/* What to expect */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2">
                    What to expect
                  </h4>
                  <ul className="space-y-1.5">
                    {level.whatToExpect.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle
                          className="h-4 w-4 flex-shrink-0 mt-0.5"
                          style={{ color: level.color }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Physical requirements */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2">
                    Physical requirements
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {level.physicalRequirements}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
