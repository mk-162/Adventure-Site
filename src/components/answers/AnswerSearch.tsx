"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  HelpCircle,
  Tag,
  ArrowRight,
  Compass,
  X,
} from "lucide-react";

interface Answer {
  slug: string;
  question: string;
  region?: string;
  category: string;
  quickAnswer: string;
}

interface AnswerSearchProps {
  answers: Answer[];
  regions: string[];
}

function formatRegionName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const POPULAR_TAGS = ["Best Time", "Family", "Budget", "Safety", "Beginners"];

export function AnswerSearch({ answers, regions }: AnswerSearchProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredAnswers = useMemo(() => {
    let result = answers;

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.question.toLowerCase().includes(q) ||
          a.quickAnswer.toLowerCase().includes(q)
      );
    }

    // Tag filter
    if (activeTag) {
      const tagLower = activeTag.toLowerCase();
      result = result.filter((a) => {
        const questionLower = a.question.toLowerCase();
        const categoryLower = a.category.toLowerCase();
        // Match tag against question text and derived category
        if (tagLower === "best time") return questionLower.includes("best time") || questionLower.includes("when to") || questionLower.includes("season");
        if (tagLower === "family") return questionLower.includes("family") || questionLower.includes("kid") || questionLower.includes("child");
        if (tagLower === "budget") return questionLower.includes("cost") || questionLower.includes("price") || questionLower.includes("budget") || questionLower.includes("cheap");
        if (tagLower === "safety") return questionLower.includes("safe") || questionLower.includes("danger") || questionLower.includes("risk");
        if (tagLower === "beginners") return questionLower.includes("beginner") || questionLower.includes("first time") || questionLower.includes("how to") || questionLower.includes("start");
        return categoryLower.includes(tagLower);
      });
    }

    return result;
  }, [answers, query, activeTag]);

  // Group filtered answers by category
  const byCategory = useMemo(() => {
    const grouped: Record<string, Answer[]> = {};
    filteredAnswers.forEach((answer) => {
      if (!grouped[answer.category]) grouped[answer.category] = [];
      grouped[answer.category].push(answer);
    });
    return grouped;
  }, [filteredAnswers]);

  const categories = Object.keys(byCategory).sort();
  const isFiltered = query.trim() !== "" || activeTag !== null;

  // Featured: first 4 with regions (only when not filtering)
  const featuredQuestions = useMemo(
    () => (isFiltered ? [] : answers.filter((a) => a.region).slice(0, 4)),
    [answers, isFiltered]
  );

  return (
    <>
      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 mb-8 shadow-sm">
        <div className="flex items-center gap-3 px-4">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions (e.g., 'best time to visit Snowdonia')"
            className="flex-1 py-3 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm text-gray-500 mr-2 self-center">Popular:</span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              activeTag === tag
                ? "bg-[#1e3a4c] text-white border-[#1e3a4c]"
                : "bg-gray-100 hover:bg-[#1e3a4c]/10 text-gray-700 border-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
        {isFiltered && (
          <button
            onClick={() => {
              setQuery("");
              setActiveTag(null);
            }}
            className="px-3 py-1.5 text-sm rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Results count when filtering */}
      {isFiltered && (
        <p className="text-sm text-gray-500 mb-6">
          {filteredAnswers.length === 0
            ? "No questions match your search."
            : `Showing ${filteredAnswers.length} question${filteredAnswers.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Featured Questions (only when not filtering) */}
          {featuredQuestions.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#ea580c]" />
                Popular Questions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredQuestions.map((answer) => (
                  <Link
                    key={answer.slug}
                    href={`/answers/${answer.slug}`}
                    className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-[#1e3a4c]/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-[#1e3a4c]/10 rounded-lg text-[#1e3a4c] shrink-0">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-[#1e3a4c] group-hover:text-[#ea580c] transition-colors line-clamp-2">
                        {answer.question}
                      </h3>
                    </div>
                    {answer.region && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        <MapPin className="w-3 h-3" />
                        {formatRegionName(answer.region)}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Questions by Category */}
          {categories.map((category) => (
            <section key={category} className="mb-8">
              <h2 className="text-lg font-bold text-[#1e3a4c] mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
                <Tag className="w-4 h-4 text-[#ea580c]" />
                {category}
                <span className="text-sm font-normal text-gray-400">
                  ({byCategory[category].length})
                </span>
              </h2>
              <div className="space-y-3">
                {byCategory[category].slice(0, isFiltered ? 20 : 8).map((answer) => (
                  <Link
                    key={answer.slug}
                    href={`/answers/${answer.slug}`}
                    className="group flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-[#1e3a4c]/20 hover:shadow-sm transition-all"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-300 group-hover:text-[#ea580c] shrink-0 mt-0.5 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 group-hover:text-[#1e3a4c] transition-colors line-clamp-1">
                        {answer.question}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {answer.quickAnswer.replace(/\*\*/g, "")}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#ea580c] shrink-0 self-center transition-colors" />
                  </Link>
                ))}

                {!isFiltered && byCategory[category].length > 8 && (
                  <button className="text-sm text-[#1e3a4c] font-medium hover:underline pl-8">
                    View all {byCategory[category].length} questions →
                  </button>
                )}
              </div>
            </section>
          ))}

          {/* Empty state */}
          {filteredAnswers.length === 0 && isFiltered && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">No matching questions</p>
              <p className="text-gray-500 text-sm mb-4">
                Try a different search term or clear your filters.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveTag(null);
                }}
                className="text-[#ea580c] font-medium hover:underline"
              >
                Show all questions
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Browse by Region */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ea580c]" />
                Browse by Region
              </h3>
              <ul className="space-y-2">
                {regions.map((region) => (
                  <li key={region}>
                    <Link
                      href={`/${region}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">
                        {formatRegionName(region)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="bg-[#1e3a4c] rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <h3 className="text-xl font-bold mb-2 relative z-10">
                Can&apos;t find an answer?
              </h3>
              <p className="text-white/80 text-sm mb-4 relative z-10">
                Our local experts are here to help plan your Welsh adventure.
              </p>
              <Link
                href="/contact"
                className="block w-full py-3 bg-white text-[#1e3a4c] font-bold rounded-lg text-sm text-center hover:bg-gray-100 transition-colors relative z-10"
              >
                Ask a Question
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#ea580c]/10 rounded-xl p-5 border border-[#ea580c]/20">
              <p className="text-3xl font-bold text-[#1e3a4c]">
                {answers.length}
              </p>
              <p className="text-sm text-gray-600">Questions answered</p>
              <p className="text-xs text-gray-500 mt-2">
                Updated regularly by our local Wales experts
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
