"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Tag as TagIcon } from "lucide-react";

const categories = [
  { value: "", label: "All" },
  { value: "guide", label: "Guides", color: "#3b82f6" },
  { value: "gear", label: "Gear", color: "#22c55e" },
  { value: "safety", label: "Safety", color: "#ef4444" },
  { value: "seasonal", label: "Seasonal", color: "#f59e0b" },
  { value: "news", label: "News", color: "#a855f7" },
  { value: "trip-report", label: "Trip Reports", color: "#14b8a6" },
  { value: "spotlight", label: "Spotlight", color: "#f97316" },
];

const categoryColors: Record<string, string> = {
  guide: "#3b82f6",
  gear: "#22c55e",
  safety: "#ef4444",
  seasonal: "#f59e0b",
  news: "#a855f7",
  "trip-report": "#14b8a6",
  spotlight: "#f97316",
};

export default function JournalPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedTag]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch posts
      const postsRes = await fetch(
        `/api/posts?${new URLSearchParams({
          ...(selectedCategory && { category: selectedCategory }),
          ...(selectedTag && { tagSlug: selectedTag }),
        })}`
      );
      const postsData = await postsRes.json();
      setPosts(postsData);

      // Fetch tags
      const tagsRes = await fetch("/api/tags");
      const tagsData = await tagsRes.json();
      setTags(tagsData);

      // Fetch itineraries
      const itinerariesRes = await fetch("/api/itineraries?limit=5");
      const itinerariesData = await itinerariesRes.json();
      setItineraries(itinerariesData);

      // Fetch operators
      const operatorsRes = await fetch("/api/operators?limit=5");
      const operatorsData = await operatorsRes.json();
      setOperators(operatorsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1e3a4c] to-[#2d5568] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-[#f97316]" />
          <h1 className="text-5xl font-bold mb-4">The Adventure Journal</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Stories, guides, and insights from the heart of Welsh adventure
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setSelectedTag("");
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? "bg-[#1e3a4c] text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tag pills */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-500 self-center mr-2">Filter by tag:</span>
              {tags.slice(0, 10).map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag.slug ? "" : tag.slug);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedTag === tag.slug
                      ? "bg-[#f97316] text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Article cards (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a4c] mx-auto"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No articles found. Try adjusting your filters.</p>
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.post.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    {post.post.heroImage && (
                      <div className="relative h-48 md:h-full">
                        <Image
                          src={post.post.heroImage}
                          alt={post.post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className={post.post.heroImage ? "md:col-span-2 p-6" : "md:col-span-3 p-6"}>
                      {/* Category badge */}
                      <div className="mb-3">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: categoryColors[post.post.category] }}
                        >
                          {post.post.category.replace("-", " ").toUpperCase()}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-[#1e3a4c] mb-3 hover:text-[#f97316] transition-colors">
                        <Link href={`/journal/${post.post.slug}`}>{post.post.title}</Link>
                      </h2>

                      <p className="text-slate-600 mb-4 line-clamp-2">{post.post.excerpt}</p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 4).map((tag: any) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md"
                            >
                              <TagIcon className="h-3 w-3" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        {post.post.author && <span>By {post.post.author}</span>}
                        {post.post.readTimeMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.post.readTimeMinutes} min read
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/journal/${post.post.slug}`}
                        className="inline-block text-[#f97316] font-semibold hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* RIGHT: Sidebar (1/3) */}
          <div className="space-y-8">
            {/* Popular Itineraries */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Popular Itineraries</h3>
              <div className="space-y-3">
                {itineraries.map((item) => (
                  <Link
                    key={item.itinerary.id}
                    href={`/itineraries/${item.itinerary.slug}`}
                    className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-slate-200"
                  >
                    <h4 className="font-semibold text-[#1e3a4c] text-sm mb-1">
                      {item.itinerary.title}
                    </h4>
                    {item.itinerary.tagline && (
                      <p className="text-xs text-slate-600 line-clamp-2">{item.itinerary.tagline}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Operators */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Featured Operators</h3>
              <div className="space-y-3">
                {operators.map((op) => (
                  <Link
                    key={op.id}
                    href={`/directory/${op.slug}`}
                    className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-slate-200"
                  >
                    <h4 className="font-semibold text-[#1e3a4c] text-sm mb-1">{op.name}</h4>
                    {op.tagline && (
                      <p className="text-xs text-slate-600 line-clamp-2">{op.tagline}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Browse by Tag */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Browse by Tag</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 20).map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tags/${tag.slug}`}
                    className="px-3 py-1 bg-white text-slate-700 text-xs rounded-full hover:bg-[#f97316] hover:text-white transition-colors border border-slate-200"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
