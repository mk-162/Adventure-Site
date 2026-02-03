import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { 
  ChevronRight, 
  MapPin, 
  Clock,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Lightbulb,
  HelpCircle,
  User,
  ExternalLink,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface AnswerFrontmatter {
  slug: string;
  question: string;
  region?: string;
  category?: string;
}

// Parse YAML frontmatter
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

// Extract quick answer from body
function extractQuickAnswer(body: string): string | null {
  // Look for ## Quick Answer section
  const quickMatch = body.match(/## Quick Answer\s*\n+([\s\S]*?)(?=\n##|$)/i);
  if (quickMatch) {
    return quickMatch[1].trim();
  }
  return null;
}

// Extract related questions from body
function extractRelatedQuestions(body: string): string[] {
  const relatedMatch = body.match(/## Related Questions\s*\n+([\s\S]*?)$/i);
  if (!relatedMatch) return [];
  
  const lines = relatedMatch[1].split("\n");
  return lines
    .filter(l => l.trim().startsWith("-"))
    .map(l => l.replace(/^-\s*/, "").trim())
    .slice(0, 5);
}

// Convert markdown to HTML (simplified)
function markdownToHtml(md: string): string {
  return md
    // Remove Quick Answer section (we display it separately)
    .replace(/## Quick Answer[\s\S]*?(?=\n##|$)/i, "")
    // Remove Related Questions section
    .replace(/## Related Questions[\s\S]*$/i, "")
    // Headers
    .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold text-[#1e3a4c] mt-6 mb-3">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-[#1e3a4c] mt-8 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-[#1e3a4c] mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#1e3a4c]">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(c => c.trim());
      const isHeader = cells.every(c => c.trim());
      const cellTag = isHeader ? 'th' : 'td';
      const cellClass = isHeader 
        ? 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase bg-gray-50' 
        : 'px-4 py-3 text-sm text-gray-700';
      return `<tr>${cells.map(c => `<${cellTag} class="${cellClass}">${c.trim()}</${cellTag}>`).join('')}</tr>`;
    })
    // Wrap table rows
    .replace(/(<tr>[\s\S]*?<\/tr>)+/g, (match) => {
      return `<div class="overflow-x-auto my-6 rounded-xl border border-gray-200"><table class="w-full">${match}</table></div>`;
    })
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-3 py-1"><span class="text-[#f97316] shrink-0">•</span><span>$1</span></li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (match) => {
      if (match.includes('flex items-start')) {
        return `<ul class="space-y-1 my-4">${match}</ul>`;
      }
      return match;
    })
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#f97316] hover:underline font-medium">$1</a>')
    // Paragraphs
    .replace(/^(?!<[hultd]|<li|<div|<tr)(.+)$/gm, (match, p1) => {
      if (p1.trim()) {
        return `<p class="text-gray-700 leading-relaxed mb-4">${p1}</p>`;
      }
      return '';
    })
    // Clean up
    .replace(/<p[^>]*>\s*<\/p>/g, "")
    .replace(/\n{3,}/g, "\n\n");
}

function getAnswer(slug: string): { frontmatter: AnswerFrontmatter; quickAnswer: string | null; content: string; relatedQuestions: string[] } | null {
  const filePath = path.join(process.cwd(), "content", "answers", `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const parsed = parseFrontmatter(rawContent);
  
  if (!parsed) return null;

  const quickAnswer = extractQuickAnswer(parsed.body);
  const relatedQuestions = extractRelatedQuestions(parsed.body);
  const content = markdownToHtml(parsed.body);

  return { 
    frontmatter: parsed.frontmatter,
    quickAnswer,
    content,
    relatedQuestions
  };
}

// Get related answers based on region or category
function getRelatedAnswers(currentSlug: string, region?: string): AnswerFrontmatter[] {
  const answersDir = path.join(process.cwd(), "content", "answers");
  if (!fs.existsSync(answersDir)) return [];

  const files = fs.readdirSync(answersDir).filter(f => f.endsWith(".md") && f !== `${currentSlug}.md`);
  const related: AnswerFrontmatter[] = [];

  for (const file of files.slice(0, 20)) {
    const content = fs.readFileSync(path.join(answersDir, file), "utf-8");
    const parsed = parseFrontmatter(content);
    if (parsed) {
      if (!region || parsed.frontmatter.region === region) {
        related.push(parsed.frontmatter);
      }
    }
    if (related.length >= 4) break;
  }

  return related;
}

function formatRegionName(slug: string): string {
  return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function slugifyQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[?]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AnswerPage({ params }: Props) {
  const { slug } = await params;
  const data = getAnswer(slug);

  if (!data) {
    notFound();
  }

  const { frontmatter, quickAnswer, content, relatedQuestions } = data;
  const relatedAnswers = getRelatedAnswers(slug, frontmatter.region);

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs (Desktop) */}
        <div className="hidden lg:flex flex-wrap items-center gap-2 mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#1e3a4c] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {frontmatter.region && (
            <>
              <Link href={`/${frontmatter.region}`} className="text-gray-500 hover:text-[#1e3a4c] transition-colors">
                {formatRegionName(frontmatter.region)}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </>
          )}
          <Link href="/answers" className="text-gray-500 hover:text-[#1e3a4c] transition-colors">Answers</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-[#1e3a4c] font-medium truncate max-w-xs">
            {frontmatter.question.length > 40 ? frontmatter.question.slice(0, 40) + "..." : frontmatter.question}
          </span>
        </div>

        {/* Content Grid */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Main Article Column */}
          <article className="lg:col-span-8">
            {/* Article Header */}
            <header className="pb-6 lg:pb-8 border-b border-gray-200 mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight text-[#1e3a4c]">
                {frontmatter.question}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3">
                  {/* Region Tag */}
                  {frontmatter.region && (
                    <Link 
                      href={`/${frontmatter.region}`}
                      className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      {formatRegionName(frontmatter.region)}
                    </Link>
                  )}
                  
                  {/* Updated date (placeholder) */}
                  <span className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Updated recently
                  </span>
                </div>

                {/* Share/Save Buttons */}
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-gray-700">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-semibold">Share</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-gray-700">
                    <Bookmark className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-semibold">Save</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Hero Image (if region exists) */}
            {frontmatter.region && (
              <div className="hidden lg:block w-full h-[300px] rounded-2xl overflow-hidden relative shadow-lg mb-8">
                <img 
                  alt={`${formatRegionName(frontmatter.region)} landscape`} 
                  className="w-full h-full object-cover"
                  src={`/images/regions/${frontmatter.region}-hero.jpg`}
                />
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg">
                  {formatRegionName(frontmatter.region)}
                </div>
              </div>
            )}

            {/* Quick Answer Box */}
            {quickAnswer && (
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-xl bg-teal-50 border border-teal-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-teal-700" />
                    <p className="text-teal-900 text-sm font-bold uppercase tracking-wider">Quick Answer</p>
                  </div>
                  <p className="text-teal-950 text-base leading-relaxed font-medium">
                    {quickAnswer.replace(/\*\*/g, "")}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-teal-200 pt-3">
                    <span className="text-xs text-teal-800 font-medium">Was this helpful?</span>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-full hover:bg-teal-200 transition-colors">
                        <ThumbsUp className="w-5 h-5 text-teal-800" />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-teal-200 transition-colors">
                        <ThumbsDown className="w-5 h-5 text-teal-800" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table of Contents (Mobile - collapsible) */}
            <div className="lg:hidden mb-8">
              <details className="group bg-white rounded-lg border border-gray-200 overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-[#1e3a4c] select-none">
                  <span>Jump to Section</span>
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4 border-t border-gray-100 pt-2">
                  <p className="text-sm text-gray-500">Scroll down to read the full answer</p>
                </div>
              </details>
            </div>

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* People Also Ask / Related Questions */}
            {relatedQuestions.length > 0 && (
              <section className="mt-10 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#f97316]" />
                  Related Questions
                </h2>
                <div className="flex flex-col gap-3">
                  {relatedQuestions.map((question, i) => {
                    const questionSlug = slugifyQuestion(question);
                    return (
                      <Link
                        key={i}
                        href={`/answers/${questionSlug}`}
                        className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-[#1e3a4c]/30 hover:shadow-sm transition-all"
                      >
                        <span className="text-gray-800 group-hover:text-[#1e3a4c] font-medium transition-colors">
                          {question}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#f97316] transition-colors shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Feedback Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-col gap-4 text-center">
                <p className="text-lg font-bold text-[#1e3a4c]">Was this guide helpful?</p>
                <div className="flex justify-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-2 bg-[#1e3a4c]/10 text-[#1e3a4c] rounded-lg hover:bg-[#1e3a4c]/20 transition-colors font-medium">
                    <ThumbsUp className="w-5 h-5" /> Yes
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <ThumbsDown className="w-5 h-5" /> No
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar (Desktop only) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* CTA Card */}
              <div className="bg-[#1e3a4c] rounded-xl p-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <h3 className="text-xl font-bold mb-2 relative z-10">Book an Adventure</h3>
                <p className="text-white/80 text-sm mb-4 relative z-10">
                  Ready to explore? Find guided adventures in {frontmatter.region ? formatRegionName(frontmatter.region) : "Wales"}.
                </p>
                <Link
                  href={frontmatter.region ? `/${frontmatter.region}/things-to-do` : "/activities"}
                  className="block w-full py-3 bg-white text-[#1e3a4c] font-bold rounded-lg text-sm text-center hover:bg-gray-100 transition-colors relative z-10"
                >
                  Find Activities
                </Link>
              </div>

              {/* More Questions */}
              {relatedAnswers.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="font-bold text-[#1e3a4c] mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#f97316]" />
                    More Questions
                  </h3>
                  <ul className="space-y-3">
                    {relatedAnswers.map(answer => (
                      <li key={answer.slug}>
                        <Link
                          href={`/answers/${answer.slug}`}
                          className="flex items-start gap-2 text-sm text-gray-600 hover:text-[#1e3a4c] transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{answer.question}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/answers"
                    className="block mt-4 text-sm text-[#f97316] font-medium hover:underline"
                  >
                    View all questions →
                  </Link>
                </div>
              )}

              {/* Region Map Preview */}
              {frontmatter.region && (
                <div className="rounded-xl overflow-hidden h-40 relative shadow-sm border border-gray-200">
                  <img 
                    alt={`Map of ${formatRegionName(frontmatter.region)}`}
                    className="w-full h-full object-cover opacity-80"
                    src={`/images/regions/${frontmatter.region}-hero.jpg`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer">
                    <Link
                      href={`/${frontmatter.region}`}
                      className="bg-white/90 backdrop-blur text-[#1e3a4c] px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Explore {formatRegionName(frontmatter.region)}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all answers
export async function generateStaticParams() {
  const answersDir = path.join(process.cwd(), "content", "answers");
  
  if (!fs.existsSync(answersDir)) {
    return [];
  }

  const files = fs.readdirSync(answersDir).filter(f => f.endsWith(".md"));
  
  return files.map(file => ({
    slug: file.replace(".md", "")
  }));
}

// Generate metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = getAnswer(slug);
  
  if (!data) {
    return { title: "Answer Not Found" };
  }

  return {
    title: `${data.frontmatter.question} | Adventure Wales`,
    description: data.quickAnswer?.slice(0, 160) || `Find the answer to: ${data.frontmatter.question}`,
  };
}
