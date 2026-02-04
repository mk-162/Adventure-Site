import Link from "next/link";
import fs from "fs";
import path from "path";
import { Newsletter } from "@/components/commercial/Newsletter";

interface Guide {
  slug: string;
  title: string;
  description: string;
  category: "gear" | "seasonal" | "category";
}

function getGuides(): Guide[] {
  const guides: Guide[] = [];
  const contentDir = path.join(process.cwd(), "content");

  // Gear guides
  const guidesDir = path.join(contentDir, "guides");
  if (fs.existsSync(guidesDir)) {
    const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(guidesDir, file), "utf-8");
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const descMatch = content.match(/^#.+\n\n([^\n]+)/m);
      guides.push({
        slug: file.replace(".md", ""),
        title: titleMatch?.[1] || file.replace(".md", "").replace(/-/g, " "),
        description: descMatch?.[1] || "",
        category: file.includes("gear") ? "gear" : "seasonal",
      });
    }
  }

  // Category guides (activity types)
  const categoriesDir = path.join(contentDir, "categories");
  if (fs.existsSync(categoriesDir)) {
    const files = fs.readdirSync(categoriesDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(categoriesDir, file), "utf-8");
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const descMatch = content.match(/^#.+\n\n([^\n]+)/m);
      guides.push({
        slug: file.replace(".md", ""),
        title: titleMatch?.[1] || file.replace(".md", "").replace(/-/g, " "),
        description: descMatch?.[1] || "",
        category: "category",
      });
    }
  }

  return guides;
}

export default function GuidesPage() {
  const guides = getGuides();
  const gearGuides = guides.filter((g) => g.category === "gear");
  const seasonalGuides = guides.filter((g) => g.category === "seasonal");
  const categoryGuides = guides.filter((g) => g.category === "category");

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-[#1e3a4c] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Adventure Guides
          </h1>
          <p className="text-gray-300 text-lg">
            Everything you need to plan your Welsh adventure
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Activity Guides */}
        {categoryGuides.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-6">
              Activity Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#f97316] transition-all"
                >
                  <h3 className="text-lg font-semibold text-[#1e3a4c] mb-2 capitalize">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Gear Guides */}
        {gearGuides.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-6">
              Gear Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gearGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#f97316] transition-all"
                >
                  <h3 className="text-lg font-semibold text-[#1e3a4c] mb-2 capitalize">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Seasonal Guides */}
        {seasonalGuides.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e3a4c] mb-6">
              Seasonal Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seasonalGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#f97316] transition-all"
                >
                  <h3 className="text-lg font-semibold text-[#1e3a4c] mb-2 capitalize">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <Newsletter source="guides" />
      </div>
    </div>
  );
}
