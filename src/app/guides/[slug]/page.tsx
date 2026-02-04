import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { AdSlot } from "@/components/commercial/AdSlot";
import {
  JsonLd,
  createBreadcrumbSchema,
} from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

interface GuideInfo {
  slug: string;
  title: string;
  category: "gear" | "seasonal" | "category";
}

// Remove YAML frontmatter from markdown content
function stripFrontmatter(content: string): string {
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n*/;
  return content.replace(frontmatterRegex, "");
}

function getGuideContent(slug: string): { title: string; content: string; source: "guides" | "categories" } | null {
  const contentDir = path.join(process.cwd(), "content");

  // Check guides folder first
  const guidePath = path.join(contentDir, "guides", `${slug}.md`);
  if (fs.existsSync(guidePath)) {
    let content = fs.readFileSync(guidePath, "utf-8");
    content = stripFrontmatter(content);
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return {
      title: titleMatch?.[1] || slug.replace(/-/g, " "),
      content: content.replace(/^#.+\n/, ""),
      source: "guides",
    };
  }

  // Check categories folder
  const categoryPath = path.join(contentDir, "categories", `${slug}.md`);
  if (fs.existsSync(categoryPath)) {
    let content = fs.readFileSync(categoryPath, "utf-8");
    content = stripFrontmatter(content);
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return {
      title: titleMatch?.[1] || slug.replace(/-/g, " "),
      content: content.replace(/^#.+\n/, ""),
      source: "categories",
    };
  }

  return null;
}

// Extract h2/h3 headings for table of contents
function extractHeadings(md: string): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  const lines = md.split("\n");
  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);
    if (h2Match) {
      const text = h2Match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ level: 2, text, id });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ level: 3, text, id });
    }
  }
  return headings;
}

// Get related guides in the same category
function getRelatedGuides(currentSlug: string, source: "guides" | "categories"): GuideInfo[] {
  const contentDir = path.join(process.cwd(), "content");
  const related: GuideInfo[] = [];

  // Determine category of current guide
  let currentCategory: "gear" | "seasonal" | "category" = "category";
  if (source === "guides") {
    currentCategory = currentSlug.includes("gear") ? "gear" : "seasonal";
  }

  // If it's a category guide, get other category guides
  if (source === "categories") {
    const dir = path.join(contentDir, "categories");
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f !== `${currentSlug}.md`);
      for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), "utf-8");
        const stripped = stripFrontmatter(content);
        const titleMatch = stripped.match(/^#\s+(.+)$/m);
        related.push({
          slug: file.replace(".md", ""),
          title: titleMatch?.[1] || file.replace(".md", "").replace(/-/g, " "),
          category: "category",
        });
      }
    }
  } else {
    // Get other guides in the same sub-category (gear or seasonal)
    const dir = path.join(contentDir, "guides");
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f !== `${currentSlug}.md`);
      for (const file of files) {
        const fileSlug = file.replace(".md", "");
        const fileCategory = fileSlug.includes("gear") ? "gear" : "seasonal";
        if (fileCategory === currentCategory) {
          const content = fs.readFileSync(path.join(dir, file), "utf-8");
          const stripped = stripFrontmatter(content);
          const titleMatch = stripped.match(/^#\s+(.+)$/m);
          related.push({
            slug: fileSlug,
            title: titleMatch?.[1] || fileSlug.replace(/-/g, " "),
            category: currentCategory,
          });
        }
      }
    }
  }

  return related.slice(0, 6);
}

// Determine a relevant activity link based on slug
function getActivityLink(slug: string): { href: string; label: string } {
  const activityMap: Record<string, { href: string; label: string }> = {
    "coasteering": { href: "/activities?category=coasteering", label: "Find Coasteering Adventures" },
    "climbing": { href: "/activities?category=climbing", label: "Find Climbing Adventures" },
    "hiking": { href: "/activities?category=hiking", label: "Find Hiking Adventures" },
    "surfing": { href: "/activities?category=surfing", label: "Find Surfing Adventures" },
    "kayaking": { href: "/activities?category=kayaking", label: "Find Kayaking Adventures" },
    "caving": { href: "/activities?category=caving", label: "Find Caving Adventures" },
    "gorge-walking": { href: "/activities?category=gorge-walking", label: "Find Gorge Walking Adventures" },
    "mountain-biking": { href: "/activities?category=mountain-biking", label: "Find Mountain Biking Adventures" },
    "wild-swimming": { href: "/activities?category=wild-swimming", label: "Find Wild Swimming Adventures" },
    "zip-lining": { href: "/activities?category=zip-lining", label: "Find Zip Line Adventures" },
  };

  // Check if the slug contains any known activity
  for (const [key, value] of Object.entries(activityMap)) {
    if (slug.includes(key)) return value;
  }

  // For seasonal guides or others, link to the directory
  return { href: "/activities", label: "Browse All Adventures" };
}

// Markdown to HTML converter — now with heading IDs for TOC
function markdownToHtml(md: string): string {
  let html = md
    // Images (before links to avoid conflict)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-6 w-full" />')
    // Headers with IDs for TOC anchor links
    .replace(/^#### (.+)$/gm, (_match, text) => {
      const id = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return `<h4 id="${id}" class="text-lg font-semibold text-[#1e3a4c] mt-6 mb-3">${text}</h4>`;
    })
    .replace(/^### (.+)$/gm, (_match: string, text: string) => {
      const id = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return `<h3 id="${id}" class="text-xl font-semibold text-[#1e3a4c] mt-8 mb-4">${text}</h3>`;
    })
    .replace(/^## (.+)$/gm, (_match: string, text: string) => {
      const id = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return `<h2 id="${id}" class="text-2xl font-bold text-[#1e3a4c] mt-10 mb-4">${text}</h2>`;
    })
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
    // Bold + Italic combos
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-semibold"><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-[#1e3a4c] px-1.5 py-0.5 rounded text-sm">$1</code>')
    // Blockquotes
    .replace(/^>\s?(.+)$/gm, '<blockquote class="border-l-4 border-[#f97316] pl-4 my-4 text-gray-600 italic">$1</blockquote>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#f97316] hover:underline">$1</a>')
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, '<li class="ml-4">$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs (anything that's not already a tag)
    .replace(/^(?!<[hublido]|<li|<img|<hr|<code|<str|<em|<a )(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\s*)+)/g, '<ul class="list-disc list-inside space-y-2 my-4">$1</ul>');
  // Clean up empty paragraphs
  html = html.replace(/<p[^>]*>\s*<\/p>/g, "");
  // Clean double-wrapped blockquotes
  html = html.replace(/<p[^>]*>(<blockquote)/g, "$1");
  html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");

  return html;
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideContent(slug);

  if (!guide) {
    notFound();
  }

  const htmlContent = markdownToHtml(guide.content);
  const headings = extractHeadings(guide.content);
  const relatedGuides = getRelatedGuides(slug, guide.source);
  const activityLink = getActivityLink(slug);
  const isShortContent = guide.content.trim().split("\n").length < 30;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: guide.title, url: `/guides/${slug}` },
  ];

  return (
    <>
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <div className="min-h-screen pt-16">
        {/* Hero */}
        <section className="bg-[#1e3a4c] py-12">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="text-sm text-gray-400 mb-4">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/guides" className="hover:text-white">
                Guides
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{guide.title}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {guide.title}
            </h1>
          </div>
        </section>

        {/* Content with sidebar layout */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            {/* Table of Contents — Sidebar (Desktop) */}
            {headings.length >= 3 && (
              <aside className="hidden lg:block lg:col-span-3">
                <nav className="sticky top-24">
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    In this guide
                  </h2>
                  <ul className="space-y-2 border-l-2 border-gray-200">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className={`block text-sm hover:text-[#f97316] transition-colors ${
                            h.level === 2
                              ? "pl-4 text-gray-700 font-medium"
                              : "pl-6 text-gray-500"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}

            {/* Main Content */}
            <article className={headings.length >= 3 ? "lg:col-span-9" : "lg:col-span-12 max-w-4xl"}>
              {/* Mobile TOC */}
              {headings.length >= 3 && (
                <details className="lg:hidden mb-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-bold text-[#1e3a4c] select-none">
                    <span>📑 Table of Contents</span>
                    <svg className="w-5 h-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <ul className="px-4 pb-4 space-y-2">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className={`block text-sm hover:text-[#f97316] transition-colors ${
                            h.level === 2 ? "text-gray-700 font-medium" : "pl-4 text-gray-500"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {/* Short content notice */}
              {isShortContent && (
                <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-2xl">🚧</span>
                  <div>
                    <p className="font-semibold text-amber-900">This guide is being expanded</p>
                    <p className="text-sm text-amber-700 mt-1">
                      We&apos;re adding more detail to this guide. Check back soon for the full version, or{" "}
                      <Link href="/contact" className="underline hover:text-amber-900">let us know</Link>{" "}
                      what you&apos;d like us to cover.
                    </p>
                  </div>
                </div>
              )}

              {/* Article content */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Ad Slot */}
              <div className="my-8">
                <AdSlot slotName="guide-sidebar" pageType="guide" pageSlug={slug} />
              </div>

              {/* CTA Banner */}
              <div className="my-10 bg-gradient-to-r from-[#1e3a4c] to-[#2d5568] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-[#f97316]/20 rounded-full blur-xl" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Ready for an adventure?</h2>
                  <p className="text-white/80 mb-5 max-w-lg">
                    Now you know what&apos;s involved, find real activities from vetted Welsh operators — with instant booking.
                  </p>
                  <Link
                    href={activityLink.href}
                    className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3 px-6 rounded-full transition-colors"
                  >
                    {activityLink.label}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Related Guides */}
              {relatedGuides.length > 0 && (
                <section className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-[#1e3a4c] mb-6">
                    Related Guides
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedGuides.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/guides/${g.slug}`}
                        className="group block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[#f97316]/40 transition-all"
                      >
                        <h3 className="font-semibold text-[#1e3a4c] group-hover:text-[#f97316] transition-colors">
                          {g.title}
                        </h3>
                        <span className="text-sm text-gray-500 mt-2 inline-flex items-center gap-1">
                          Read guide →
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Back link */}
              <div className="mt-12 pt-8 border-t">
                <Link
                  href="/guides"
                  className="text-[#f97316] hover:underline flex items-center gap-2"
                >
                  ← Back to all guides
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideContent(slug);

  if (!guide) {
    return { title: "Guide Not Found | Adventure Wales" };
  }

  // Extract first paragraph for description
  const firstParagraph = guide.content
    .split("\n")
    .find((line) => line.trim() && !line.startsWith("#") && !line.startsWith("-") && !line.startsWith("*"));
  const description = firstParagraph?.slice(0, 160) || `${guide.title} — practical guide for Welsh adventures.`;

  return {
    title: `${guide.title} | Adventure Wales`,
    description,
    openGraph: {
      title: guide.title,
      description,
      type: "article",
      locale: "en_GB",
      url: `https://adventurewales.co.uk/guides/${slug}`,
      siteName: "Adventure Wales",
    },
    twitter: {
      card: "summary",
      title: guide.title,
      description,
    },
    alternates: {
      canonical: `https://adventurewales.co.uk/guides/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content");
  const slugs: { slug: string }[] = [];

  // Guides
  const guidesDir = path.join(contentDir, "guides");
  if (fs.existsSync(guidesDir)) {
    const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith(".md"));
    slugs.push(...files.map((f) => ({ slug: f.replace(".md", "") })));
  }

  // Categories
  const categoriesDir = path.join(contentDir, "categories");
  if (fs.existsSync(categoriesDir)) {
    const files = fs.readdirSync(categoriesDir).filter((f) => f.endsWith(".md"));
    slugs.push(...files.map((f) => ({ slug: f.replace(".md", "") })));
  }

  return slugs;
}
