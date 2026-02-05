"use client";

import { useState } from "react";
import {
  Sparkles,
  Users,
  XCircle,
  Backpack,
  PoundSterling,
  Cloud,
  Car,
  CalendarCheck,
  Dumbbell,
  ChevronDown,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

interface ItineraryFactSheetProps {
  description: string;
  title: string;
}

interface ParsedSection {
  heading: string;
  content: string;
  subSections?: { heading: string; content: string }[];
}

function parseDescription(md: string): { intro: string; sections: ParsedSection[] } {
  const lines = md.split("\n");
  let intro = "";
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let currentSubSection: { heading: string; content: string } | null = null;

  for (const line of lines) {
    // H2 heading
    if (line.startsWith("## ")) {
      // Save previous
      if (currentSubSection && currentSection) {
        (currentSection.subSections ??= []).push(currentSubSection);
        currentSubSection = null;
      }
      if (currentSection) sections.push(currentSection);

      currentSection = { heading: line.replace("## ", "").trim(), content: "" };
      continue;
    }
    // H3 heading (sub-section)
    if (line.startsWith("### ")) {
      if (currentSubSection && currentSection) {
        (currentSection.subSections ??= []).push(currentSubSection);
      }
      currentSubSection = { heading: line.replace("### ", "").trim(), content: "" };
      continue;
    }

    if (currentSubSection) {
      currentSubSection.content += line + "\n";
    } else if (currentSection) {
      currentSection.content += line + "\n";
    } else {
      intro += line + "\n";
    }
  }

  if (currentSubSection && currentSection) {
    (currentSection.subSections ??= []).push(currentSubSection);
  }
  if (currentSection) sections.push(currentSection);

  return { intro: intro.trim(), sections };
}

function parseList(content: string): string[] {
  return content
    .split("\n")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => l.replace(/^-\s*/, "").trim());
}

function parseCostBreakdown(section: ParsedSection): {
  standard: { label: string; amount: string }[];
  standardTotal: string;
  budget: { label: string; amount: string }[];
  budgetTotal: string;
} | null {
  const result = {
    standard: [] as { label: string; amount: string }[],
    standardTotal: "",
    budget: [] as { label: string; amount: string }[],
    budgetTotal: "",
  };

  for (const sub of section.subSections ?? []) {
    const isStandard = sub.heading.toLowerCase().includes("standard");
    const isBudget = sub.heading.toLowerCase().includes("budget");
    const target = isStandard ? "standard" : isBudget ? "budget" : null;
    if (!target) continue;

    for (const line of sub.content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("- **Total")) {
        const match = trimmed.match(/£([\d,]+)/);
        if (match) result[`${target}Total`] = match[1];
      } else if (trimmed.startsWith("- ")) {
        const parts = trimmed.replace(/^-\s*/, "").split(":");
        if (parts.length === 2) {
          const amount = parts[1].trim().match(/£([\d,]+)/);
          if (amount) {
            result[target].push({ label: parts[0].trim(), amount: amount[1] });
          }
        }
      }
    }
  }

  return result.standard.length > 0 ? result : null;
}

const sectionIcons: Record<string, any> = {
  highlights: Sparkles,
  "who this is for": Users,
  "not suitable for": XCircle,
  "what to pack": Backpack,
  "cost breakdown": PoundSterling,
  "know before you go": Info,
};

const knowBeforeIcons: Record<string, any> = {
  weather: Cloud,
  traffic: Car,
  booking: CalendarCheck,
  fitness: Dumbbell,
};

function CollapsibleCard({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  variant = "default",
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: "default" | "warning" | "success" | "info";
}) {
  const [open, setOpen] = useState(defaultOpen);

  const variantStyles = {
    default: "bg-white border-gray-200",
    warning: "bg-amber-50 border-amber-200",
    success: "bg-emerald-50 border-emerald-200",
    info: "bg-blue-50 border-blue-200",
  };

  const iconStyles = {
    default: "bg-[#1e3a4c]/10 text-[#1e3a4c]",
    warning: "bg-amber-100 text-amber-700",
    success: "bg-emerald-100 text-emerald-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`rounded-xl border ${variantStyles[variant]} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-[#1e3a4c] flex-1 text-sm">{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 pt-0">{children}</div>}
    </div>
  );
}

export function ItineraryFactSheet({ description, title }: ItineraryFactSheetProps) {
  const { intro, sections } = parseDescription(description);

  const highlights = sections.find((s) => s.heading.toLowerCase() === "highlights");
  const whoFor = sections.find((s) => s.heading.toLowerCase() === "who this is for");
  const notFor = sections.find((s) => s.heading.toLowerCase() === "not suitable for");
  const whatToPack = sections.find((s) => s.heading.toLowerCase() === "what to pack");
  const costBreakdown = sections.find((s) => s.heading.toLowerCase() === "cost breakdown");
  const knowBefore = sections.find((s) => s.heading.toLowerCase() === "know before you go");

  const costs = costBreakdown ? parseCostBreakdown(costBreakdown) : null;

  return (
    <div className="space-y-4">
      {/* Intro text */}
      {intro && (
        <p className="text-gray-600 text-base leading-relaxed">{intro}</p>
      )}

      {/* Highlights - always visible */}
      {highlights && (
        <div className="bg-gradient-to-br from-[#1e3a4c] to-[#2d5a73] rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#ea580c]" />
            <h3 className="font-bold text-sm uppercase tracking-wide">Highlights</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {parseList(highlights.content).map((item, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Who For / Not For - side by side on desktop */}
      {(whoFor || notFor) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {whoFor && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-emerald-900 text-sm">Who It&apos;s For</h3>
              </div>
              <p className="text-emerald-800 text-sm leading-relaxed">
                {whoFor.content.trim()}
              </p>
            </div>
          )}
          {notFor && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-amber-900 text-sm">Not Suitable For</h3>
              </div>
              <p className="text-amber-800 text-sm leading-relaxed">
                {notFor.content.trim()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cost Breakdown - visual cards */}
      {costs && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <PoundSterling className="w-5 h-5 text-[#1e3a4c]" />
            <h3 className="font-bold text-[#1e3a4c] text-sm">Cost Breakdown</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Standard */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Standard</div>
              {costs.standard.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">£{item.amount}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-[#1e3a4c] text-sm">Total</span>
                <span className="font-bold text-[#1e3a4c] text-lg">£{costs.standardTotal}</span>
              </div>
            </div>
            {/* Budget */}
            <div className="space-y-3 border-l border-gray-100 pl-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</div>
              {costs.budget.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">£{item.amount}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-[#1e3a4c] text-sm">Total</span>
                <span className="font-bold text-[#ea580c] text-lg">£{costs.budgetTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What to Pack */}
      {whatToPack && (
        <CollapsibleCard title="What to Pack" icon={Backpack} defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
            {parseList(whatToPack.content).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </CollapsibleCard>
      )}

      {/* Know Before You Go */}
      {knowBefore && knowBefore.subSections && knowBefore.subSections.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Info className="w-4 h-4 text-[#1e3a4c]" />
            <h3 className="font-bold text-[#1e3a4c] text-sm">Know Before You Go</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {knowBefore.subSections.map((sub, i) => {
              const Icon = knowBeforeIcons[sub.heading.toLowerCase()] || Info;
              return (
                <CollapsibleCard
                  key={i}
                  title={sub.heading}
                  icon={Icon}
                  defaultOpen={false}
                  variant={sub.heading.toLowerCase() === "weather" ? "info" : "default"}
                >
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">
                    {sub.content.trim()}
                  </p>
                </CollapsibleCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
