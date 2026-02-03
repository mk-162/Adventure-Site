import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { AlertTriangle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function getSafetyContent(slug: string): { title: string; content: string } | null {
  const safetyPath = path.join(process.cwd(), "content", "safety", `${slug}.md`);
  
  if (!fs.existsSync(safetyPath)) {
    return null;
  }

  const content = fs.readFileSync(safetyPath, "utf-8");
  const titleMatch = content.match(/^#\s+(.+)$/m);
  
  return {
    title: titleMatch?.[1] || slug.replace(/-/g, " "),
    content: content.replace(/^#.+\n/, ""),
  };
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
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#f97316] hover:underline">$1</a>')
    // Paragraphs
    .replace(/^(?!<[hul]|<li)(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>')
    // Clean up
    .replace(/<p[^>]*>\s*<\/p>/g, "");
}

export default async function SafetyGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getSafetyContent(slug);

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
            <Link href="/safety" className="hover:text-white">
              Safety
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{guide.title}</span>
          </nav>
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-[#f97316]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {guide.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-50 border-b border-red-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm">
              Emergency: 999
            </div>
            <span className="text-red-800 text-sm">
              Mountain Rescue / Coastguard
            </span>
          </div>
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
            href="/safety"
            className="text-[#f97316] hover:underline flex items-center gap-2"
          >
            ← Back to safety information
          </Link>
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const safetyDir = path.join(process.cwd(), "content", "safety");
  
  if (!fs.existsSync(safetyDir)) {
    return [];
  }

  const files = fs.readdirSync(safetyDir).filter((f) => f.endsWith(".md"));
  return files.map((f) => ({ slug: f.replace(".md", "") }));
}
