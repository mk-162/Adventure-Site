import Link from "next/link";
import fs from "fs";
import path from "path";
import { ChevronRight } from "lucide-react";
import { Newsletter } from "@/components/commercial/Newsletter";
import { AnswerSearch } from "@/components/answers/AnswerSearch";
import {
  JsonLd,
  createBreadcrumbSchema,
} from "@/components/seo/JsonLd";

interface AnswerFrontmatter {
  slug: string;
  question: string;
  region?: string;
  category?: string;
}

// Parse YAML frontmatter from markdown content
function parseFrontmatter(
  content: string
): { frontmatter: AnswerFrontmatter; body: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n*([\s\S]*)$/);
  if (!match) return null;

  const yamlContent = match[1];
  const body = match[2];

  const frontmatter: Record<string, string> = {};
  yamlContent.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      value = value.replace(/^["'](.*)["']$/, "$1");
      frontmatter[key] = value;
    }
  });

  return { frontmatter: frontmatter as unknown as AnswerFrontmatter, body };
}

// Get quick answer (first paragraph after Quick Answer heading, or first paragraph)
function extractQuickAnswer(body: string): string {
  const quickMatch = body.match(/## Quick Answer\s*\n+([^\n#]+)/i);
  if (quickMatch) {
    return quickMatch[1].trim().slice(0, 200) + "...";
  }
  const lines = body.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  return lines[0]?.slice(0, 200) + "..." || "";
}

// Categorize answers by type based on question content
function categorizeAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("best time") || q.includes("when to") || q.includes("season"))
    return "Planning";
  if (q.includes("where") || q.includes("location") || q.includes("spot"))
    return "Places";
  if (q.includes("how to") || q.includes("beginner") || q.includes("start"))
    return "Getting Started";
  if (
    q.includes("cost") ||
    q.includes("price") ||
    q.includes("budget") ||
    q.includes("cheap")
  )
    return "Budget";
  if (q.includes("safe") || q.includes("danger") || q.includes("risk"))
    return "Safety";
  if (q.includes("family") || q.includes("kid") || q.includes("child"))
    return "Family";
  if (q.includes("best") || q.includes("top")) return "Best Of";
  return "General";
}

function getAllAnswers(): (AnswerFrontmatter & {
  quickAnswer: string;
  category: string;
})[] {
  const answersDir = path.join(process.cwd(), "content", "answers");

  if (!fs.existsSync(answersDir)) {
    return [];
  }

  const files = fs.readdirSync(answersDir).filter((f) => f.endsWith(".md"));

  const answers: (AnswerFrontmatter & { quickAnswer: string; category: string })[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(answersDir, file), "utf-8");
    const parsed = parseFrontmatter(content);
    if (parsed) {
      answers.push({
        ...parsed.frontmatter,
        quickAnswer: extractQuickAnswer(parsed.body),
        category: categorizeAnswer(parsed.frontmatter.question),
      });
    }
  }

  return answers.sort((a, b) => a.question.localeCompare(b.question));
}

// Get unique regions
function getRegions(answers: AnswerFrontmatter[]): string[] {
  const regions = new Set<string>();
  answers.forEach((a) => {
    if (a.region) regions.add(a.region);
  });
  return [...regions].sort();
}

export default async function AnswersPage() {
  const answers = getAllAnswers();
  const regions = getRegions(answers);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Answers & Guides", url: "/answers" },
  ];

  return (
    <>
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <div className="min-h-screen pt-4 lg:pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary font-medium">
                Answers &amp; Guides
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
              Quick Answers
            </h1>
            <p className="text-gray-600 max-w-2xl">
              The questions everyone asks before their first Welsh adventure.
              Straight answers with local knowledge, no waffle.
            </p>
          </div>

          {/* Client-side search + filtered results */}
          <AnswerSearch answers={answers} regions={regions} />

          {/* Newsletter Signup */}
          <Newsletter source="answers" />
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: "Answers & FAQs | Adventure Wales",
  description:
    "Straight answers to common Welsh adventure questions. Best Snowdon routes, when to visit, what to pack, and the stuff guidebooks skip.",
  alternates: {
    canonical: "https://adventurewales.co.uk/answers",
  },
  openGraph: {
    title: "Answers & FAQs | Adventure Wales",
    description:
      "Straight answers to common Welsh adventure questions. Best Snowdon routes, when to visit, what to pack, and the stuff guidebooks skip.",
    type: "website",
    locale: "en_GB",
    url: "https://adventurewales.co.uk/answers",
    siteName: "Adventure Wales",
  },
};
