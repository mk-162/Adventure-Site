"use client";

import { Target, Trophy, PoundSterling, Users, Sparkles } from "lucide-react";
import Link from "next/link";

interface QuickAnswer {
  label: string;
  venue: string;
  link: string;
  reason?: string;
}

interface QuickAnswerBoxProps {
  bestForBeginners: QuickAnswer;
  bestOverall: QuickAnswer;
  bestValue: QuickAnswer;
  bestForFamilies?: QuickAnswer;
  bestForExperts?: QuickAnswer;
}

export function QuickAnswerBox({
  bestForBeginners,
  bestOverall,
  bestValue,
  bestForFamilies,
  bestForExperts,
}: QuickAnswerBoxProps) {
  const answers = [
    { icon: Target, color: "text-green-600 bg-green-50", ...bestForBeginners, key: "beginners" },
    { icon: Trophy, color: "text-amber-600 bg-amber-50", ...bestOverall, key: "overall" },
    { icon: PoundSterling, color: "text-blue-600 bg-blue-50", ...bestValue, key: "value" },
    ...(bestForFamilies ? [{ icon: Users, color: "text-purple-600 bg-purple-50", ...bestForFamilies, key: "families" }] : []),
    ...(bestForExperts ? [{ icon: Sparkles, color: "text-red-600 bg-red-50", ...bestForExperts, key: "experts" }] : []),
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-accent-hover" />
        Quick Answer — Where Should I Go?
      </h2>
      <div className="grid gap-3">
        {answers.map((answer) => (
          <Link
            key={answer.key}
            href={answer.link}
            className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${answer.color}`}>
              <answer.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">{answer.label}</span>
              </div>
              <p className="font-bold text-primary group-hover:text-accent-hover transition-colors">
                {answer.venue}
              </p>
              {answer.reason && (
                <p className="text-sm text-slate-500 mt-0.5">{answer.reason}</p>
              )}
            </div>
            <span className="text-slate-400 group-hover:text-accent-hover transition-colors">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
