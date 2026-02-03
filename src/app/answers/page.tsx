import Link from "next/link";
import fs from "fs";
import path from "path";
import { 
  ChevronRight, 
  Search, 
  MapPin, 
  HelpCircle, 
  Tag,
  ArrowRight,
  Compass
} from "lucide-react";

interface AnswerFrontmatter {
  slug: string;
  question: string;
  region?: string;
  category?: string;
}

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: AnswerFrontmatter; body: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n*([\s\S]*)$/);
  if (!match) return null;

  const yamlContent = match[1];
  const body = match[2];
  
  const frontmatter: Record<string, any> = {};
  yamlContent.split("\n").forEach(line => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      value = value.replace(/^["'](.*)["']$/, "$1");
      frontmatter[key] = value;
    }
  });

  return { frontmatter: frontmatter as AnswerFrontmatter, body };
}

// Get quick answer (first paragraph after Quick Answer heading, or first paragraph)
function extractQuickAnswer(body: string): string {
  // Look for ## Quick Answer section
  const quickMatch = body.match(/## Quick Answer\s*\n+([^\n#]+)/i);
  if (quickMatch) {
    return quickMatch[1].trim().slice(0, 200) + "...";
  }
  
  // Otherwise get first non-heading paragraph
  const lines = body.split("\n").filter(l => l.trim() && !l.startsWith("#"));
  return lines[0]?.slice(0, 200) + "..." || "";
}

function getAllAnswers(): (AnswerFrontmatter & { quickAnswer: string })[] {
  const answersDir = path.join(process.cwd(), "content", "answers");
  
  if (!fs.existsSync(answersDir)) {
    return [];
  }

  const files = fs.readdirSync(answersDir).filter(f => f.endsWith(".md"));
  
  const answers: (AnswerFrontmatter & { quickAnswer: string })[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(answersDir, file), "utf-8");
    const parsed = parseFrontmatter(content);
    if (parsed) {
      answers.push({
        ...parsed.frontmatter,
        quickAnswer: extractQuickAnswer(parsed.body)
      });
    }
  }

  return answers.sort((a, b) => a.question.localeCompare(b.question));
}

// Categorize answers by type based on question content
function categorizeAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("best time") || q.includes("when to") || q.includes("season")) return "Planning";
  if (q.includes("where") || q.includes("location") || q.includes("spot")) return "Places";
  if (q.includes("how to") || q.includes("beginner") || q.includes("start")) return "Getting Started";
  if (q.includes("cost") || q.includes("price") || q.includes("budget") || q.includes("cheap")) return "Budget";
  if (q.includes("safe") || q.includes("danger") || q.includes("risk")) return "Safety";
  if (q.includes("family") || q.includes("kid") || q.includes("child")) return "Family";
  if (q.includes("best") || q.includes("top")) return "Best Of";
  return "General";
}

function formatRegionName(slug: string): string {
  return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

// Get unique regions for filters
function getRegions(answers: AnswerFrontmatter[]): string[] {
  const regions = new Set<string>();
  answers.forEach(a => {
    if (a.region) regions.add(a.region);
  });
  return [...regions].sort();
}

// Group answers by category
function groupByCategory(answers: (AnswerFrontmatter & { quickAnswer: string })[]): Record<string, (AnswerFrontmatter & { quickAnswer: string })[]> {
  const grouped: Record<string, (AnswerFrontmatter & { quickAnswer: string })[]> = {};
  
  answers.forEach(answer => {
    const category = categorizeAnswer(answer.question);
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(answer);
  });
  
  return grouped;
}

// Group answers by region
function groupByRegion(answers: (AnswerFrontmatter & { quickAnswer: string })[]): Record<string, (AnswerFrontmatter & { quickAnswer: string })[]> {
  const grouped: Record<string, (AnswerFrontmatter & { quickAnswer: string })[]> = {
    "General (All Wales)": []
  };
  
  answers.forEach(answer => {
    const region = answer.region || "General (All Wales)";
    const regionName = region === "General (All Wales)" ? region : formatRegionName(region);
    if (!grouped[regionName]) grouped[regionName] = [];
    grouped[regionName].push(answer);
  });
  
  return grouped;
}

export default async function AnswersPage() {
  const answers = getAllAnswers();
  const regions = getRegions(answers);
  const byCategory = groupByCategory(answers);
  const categories = Object.keys(byCategory).sort();
  
  // Featured questions (just grab first 4 with regions)
  const featuredQuestions = answers
    .filter(a => a.region)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-4 lg:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#1e3a4c]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1e3a4c] font-medium">Answers & Guides</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a4c] mb-3">
            Answers & Travel Guides
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Expert answers to your questions about adventure travel in Wales. 
            From the best times to visit to insider tips on activities.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-2 mb-8 shadow-sm">
          <div className="flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search questions (e.g., 'best time to visit Snowdonia')"
              className="flex-1 py-3 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
            />
            <button className="px-4 py-2 bg-[#1e3a4c] text-white text-sm font-bold rounded-lg hover:bg-[#1e3a4c]/90 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-gray-500 mr-2 self-center">Popular:</span>
          {["Best Time", "Family", "Budget", "Safety", "Beginners"].map(tag => (
            <button 
              key={tag}
              className="px-3 py-1.5 bg-gray-100 hover:bg-[#1e3a4c]/10 text-gray-700 text-sm rounded-full border border-gray-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Featured Questions */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#f97316]" />
                Popular Questions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredQuestions.map(answer => (
                  <Link
                    key={answer.slug}
                    href={`/answers/${answer.slug}`}
                    className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-[#1e3a4c]/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-[#1e3a4c]/10 rounded-lg text-[#1e3a4c] shrink-0">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-[#1e3a4c] group-hover:text-[#f97316] transition-colors line-clamp-2">
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

            {/* Questions by Category */}
            {categories.map(category => (
              <section key={category} className="mb-8">
                <h2 className="text-lg font-bold text-[#1e3a4c] mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Tag className="w-4 h-4 text-[#f97316]" />
                  {category}
                  <span className="text-sm font-normal text-gray-400">({byCategory[category].length})</span>
                </h2>
                <div className="space-y-3">
                  {byCategory[category].slice(0, 8).map(answer => (
                    <Link
                      key={answer.slug}
                      href={`/answers/${answer.slug}`}
                      className="group flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-[#1e3a4c]/20 hover:shadow-sm transition-all"
                    >
                      <HelpCircle className="w-5 h-5 text-gray-300 group-hover:text-[#f97316] shrink-0 mt-0.5 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 group-hover:text-[#1e3a4c] transition-colors line-clamp-1">
                          {answer.question}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {answer.quickAnswer.replace(/\*\*/g, "")}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#f97316] shrink-0 self-center transition-colors" />
                    </Link>
                  ))}
                  
                  {byCategory[category].length > 8 && (
                    <button className="text-sm text-[#1e3a4c] font-medium hover:underline pl-8">
                      View all {byCategory[category].length} questions →
                    </button>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Browse by Region */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#f97316]" />
                  Browse by Region
                </h3>
                <ul className="space-y-2">
                  {regions.map(region => (
                    <li key={region}>
                      <Link
                        href={`/${region}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm text-gray-700">{formatRegionName(region)}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Card */}
              <div className="bg-[#1e3a4c] rounded-xl p-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <h3 className="text-xl font-bold mb-2 relative z-10">Can't find an answer?</h3>
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
              <div className="bg-[#f97316]/10 rounded-xl p-5 border border-[#f97316]/20">
                <p className="text-3xl font-bold text-[#1e3a4c]">{answers.length}</p>
                <p className="text-sm text-gray-600">Questions answered</p>
                <p className="text-xs text-gray-500 mt-2">
                  Updated regularly by our local Wales experts
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Answers & Travel Guides | Adventure Wales",
  description: "Expert answers to your questions about adventure travel in Wales. Find the best times to visit, top activities, and insider tips.",
};
