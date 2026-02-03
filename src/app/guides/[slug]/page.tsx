import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";

interface Props {
  params: Promise<{ slug: string }>;
}

function getGuideContent(slug: string): { title: string; content: string } | null {
  const contentDir = path.join(process.cwd(), "content");
  
  // Check guides folder first
  const guidePath = path.join(contentDir, "guides", `${slug}.md`);
  if (fs.existsSync(guidePath)) {
    const content = fs.readFileSync(guidePath, "utf-8");
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return {
      title: titleMatch?.[1] || slug.replace(/-/g, " "),
      content: content.replace(/^#.+\n/, ""), // Remove first heading
    };
  }

  // Check categories folder
  const categoryPath = path.join(contentDir, "categories", `${slug}.md`);
  if (fs.existsSync(categoryPath)) {
    const content = fs.readFileSync(categoryPath, "utf-8");
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return {
      title: titleMatch?.[1] || slug.replace(/-/g, " "),
      content: content.replace(/^#.+\n/, ""),
    };
  }

  return null;
}

// Simple markdown to HTML converter
function markdownToHtml(md: string): string {
  return md
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-[#1e3a4c] mt-8 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-[#1e3a4c] mt-10 mb-4">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-2 my-4">$&</ul>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#f97316] hover:underline">$1</a>')
    // Paragraphs
    .replace(/^(?!<[hul]|<li)(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p[^>]*>\s*<\/p>/g, "");
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideContent(slug);

  if (!guide) {
    notFound();
  }

  const htmlContent = markdownToHtml(guide.content);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-[#1e3a4c] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-gray-400 mb-4">
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

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

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
  );
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
