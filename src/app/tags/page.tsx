import Link from "next/link";
import { Metadata } from "next";
import { getAllTags } from "@/lib/queries";
import { ChevronRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse by Tag | Adventure Wales",
  description: "Explore Adventure Wales content by tags including activities, terrain, difficulty, and amenities.",
};

export default async function TagsPage() {
  const tags = await getAllTags();

  // Group tags by type
  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<string, typeof tags>);

  // Predefined order for categories
  const categoryOrder = ["activity", "terrain", "difficulty", "feature", "amenity"];
  const sortedCategories = Object.keys(groupedTags).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="min-h-screen pt-4 lg:pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">Tags</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
            Browse by Tag
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our collection of adventures, accommodations, and itineraries by specific features and types.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {sortedCategories.map((category) => (
            <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-primary mb-6 capitalize flex items-center gap-2">
                <Tag className="w-5 h-5 text-accent-hover" />
                {category.replace("_", " ")} Tags
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedTags[category].map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-gray-50/50 hover:bg-white group"
                  >
                    <span className="font-medium text-gray-700 group-hover:text-primary">
                      {tag.name}
                    </span>
                    <span className="text-xs font-semibold bg-white text-accent-hover px-2 py-1 rounded-full border border-gray-100 group-hover:border-accent-hover/20">
                      {tag.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {tags.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No tags found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
