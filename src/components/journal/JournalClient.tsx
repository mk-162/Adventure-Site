"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Clock, Tag as TagIcon } from "lucide-react";

const categories = [
  { value: "guide", label: "Guides", color: "#3b82f6", image: "/images/activities/hiking-hero.jpg", description: "Expert tips and how-tos for Welsh adventures" },
  { value: "gear", label: "Gear", color: "#22c55e", image: "/images/misc/gear-hiking-01-918f1952.jpg", description: "Reviews and recommendations for adventure kit" },
  { value: "safety", label: "Safety", color: "#ef4444", image: "/images/misc/safety-mountain-02-79505242.jpg", description: "Stay safe on your Welsh outdoor adventures" },
  { value: "seasonal", label: "Seasonal", color: "#f59e0b", image: "/images/misc/seasonal-autumn-01-b078c4e2.jpg", description: "What to do each season across Wales" },
  { value: "news", label: "News", color: "#a855f7", image: "/images/misc/events-festival-01-33fb98e2.jpg", description: "Latest from the Welsh adventure scene" },
  { value: "trip-report", label: "Trip Reports", color: "#14b8a6", image: "/images/activities/coasteering-hero.jpg", description: "Real stories from real adventures in Wales" },
  { value: "spotlight", label: "Spotlight", color: "#f97316", image: "/images/misc/partner-business-01-7f12dce4.jpg", description: "Profiles of Wales' best adventure operators" },
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

const categoryFallbackImages: Record<string, string> = {
  guide: "/images/activities/hiking-hero.jpg",
  gear: "/images/misc/gear-hiking-01-918f1952.jpg",
  safety: "/images/misc/safety-mountain-02-79505242.jpg",
  seasonal: "/images/misc/seasonal-autumn-01-b078c4e2.jpg",
  news: "/images/misc/events-festival-01-33fb98e2.jpg",
  "trip-report": "/images/activities/coasteering-hero.jpg",
  spotlight: "/images/misc/partner-business-01-7f12dce4.jpg",
};

interface JournalClientProps {
  initialPosts: any[];
  tags: any[];
  itineraries: any[];
  operators: any[];
  selectedCategory: string;
  selectedTag: string;
  totalCount: number;
}

export default function JournalClient({
  initialPosts,
  tags,
  itineraries,
  operators,
  selectedCategory,
  selectedTag,
  totalCount,
}: JournalClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(initialPosts.length >= totalCount);

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? "" : category;
    const params = new URLSearchParams();
    if (newCategory) params.set("category", newCategory);
    router.push(`/journal${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleTagChange = (tagSlug: string) => {
    const newTag = selectedTag === tagSlug ? "" : tagSlug;
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (newTag) params.set("tag", newTag);
    router.push(`/journal${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedTag) params.set("tagSlug", selectedTag);
      params.set("offset", String(posts.length));
      params.set("limit", "12");

      const res = await fetch(`/api/posts?${params.toString()}`);
      const morePosts = await res.json();

      if (morePosts.length === 0) {
        setAllLoaded(true);
      } else {
        setPosts((prev) => [...prev, ...morePosts]);
        if (posts.length + morePosts.length >= totalCount) {
          setAllLoaded(true);
        }
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // For initial render, use visibleCount for client-side "load more" of already-fetched posts
  // Once we fetch from API, show all fetched posts
  const displayPosts = posts;

  return (
    <>
      {/* Category Cards */}
      <div className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`group relative overflow-hidden rounded-xl h-32 transition-all ${
                selectedCategory === cat.value
                  ? "ring-3 ring-[#f97316] shadow-xl scale-[1.02]"
                  : "hover:shadow-lg hover:scale-[1.01]"
              }`}
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-1"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.label.toUpperCase()}
                </span>
                <p className="text-white text-xs leading-tight line-clamp-2">{cat.description}</p>
              </div>
              {selectedCategory === cat.value && (
                <div className="absolute top-2 right-2 bg-[#f97316] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</div>
              )}
            </button>
          ))}
        </div>
        {selectedCategory && (
          <button
            onClick={() => handleCategoryChange(selectedCategory)}
            className="text-sm text-slate-500 hover:text-[#f97316] transition-colors"
          >
            ← Show all articles
          </button>
        )}

        {/* Tag pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-500 self-center mr-2">Filter by tag:</span>
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag.slug}
                onClick={() => handleTagChange(tag.slug)}
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
          {displayPosts.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No articles found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              {displayPosts.map((post: any) => {
                const heroImg = post.post.heroImage || categoryFallbackImages[post.post.category] || "/images/activities/hiking-hero.jpg";
                return (
                  <Link
                    key={post.post.id}
                    href={`/journal/${post.post.slug}`}
                    className="block"
                  >
                    <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                      <div className="grid md:grid-cols-3">
                        <div className="relative h-48 md:h-full min-h-[12rem]">
                          <Image
                            src={heroImg}
                            alt={post.post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="md:col-span-2 p-6">
                          {/* Category badge */}
                          <div className="mb-3">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: categoryColors[post.post.category] }}
                            >
                              {post.post.category.replace("-", " ").toUpperCase()}
                            </span>
                          </div>

                          <h2 className="text-xl md:text-2xl font-bold text-[#1e3a4c] mb-3 group-hover:text-[#f97316] transition-colors">
                            {post.post.title}
                          </h2>

                          <p className="text-slate-600 mb-4 line-clamp-3">{post.post.excerpt}</p>

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
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            {post.post.author && <span>By {post.post.author}</span>}
                            {post.post.readTimeMinutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {post.post.readTimeMinutes} min read
                              </span>
                            )}
                            <span className="ml-auto text-[#f97316] font-semibold group-hover:underline">
                              Read More →
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}

              {/* Load More */}
              {!allLoaded && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-[#1e3a4c] text-white rounded-full font-semibold hover:bg-[#2d5568] transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Loading...
                      </span>
                    ) : (
                      `Load More Articles`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT: Sidebar (1/3) */}
        <div className="space-y-8">
          {/* Popular Itineraries */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Popular Itineraries</h3>
            <div className="space-y-3">
              {itineraries.map((item: any) => (
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
              {operators.map((op: any) => (
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
              {tags.slice(0, 20).map((tag: any) => (
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
    </>
  );
}
