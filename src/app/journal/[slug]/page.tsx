import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Tag as TagIcon, Share2, Home, ChevronRight } from "lucide-react";
import { getPostBySlug, getRelatedPosts, getItineraries, getOperators, getLocations } from "@/lib/queries";
import { MarkdownRenderer } from "@/components/markdown-renderer";

const categoryColors: Record<string, string> = {
  guide: "#3b82f6",
  gear: "#22c55e",
  safety: "#ef4444",
  seasonal: "#f59e0b",
  news: "#a855f7",
  "trip-report": "#14b8a6",
  spotlight: "#f97316",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.post.title} | Adventure Wales Journal`,
    description: post.post.excerpt || `Read ${post.post.title} on Adventure Wales`,
    openGraph: {
      title: post.post.title,
      description: post.post.excerpt || "",
      images: post.post.heroImage ? [post.post.heroImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch related content for sidebar
  const [relatedPosts, itineraries, operators, locations] = await Promise.all([
    getRelatedPosts(post.post.id, post.post.category, 3),
    getItineraries({ regionId: post.post.regionId || undefined, limit: 5 }),
    getOperators({ limit: 5 }),
    post.post.regionId ? getLocations({ regionId: post.post.regionId, limit: 5 }) : [],
  ]);

  // Schema.org structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.post.title,
    description: post.post.excerpt || "",
    image: post.post.heroImage || "",
    datePublished: post.post.publishedAt,
    dateModified: post.post.updatedAt,
    author: {
      "@type": "Person",
      name: post.post.author || "Adventure Wales",
    },
    publisher: {
      "@type": "Organization",
      name: "Adventure Wales",
      logo: {
        "@type": "ImageObject",
        url: "https://adventurewales.com/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-[#1e3a4c] flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/journal" className="hover:text-[#1e3a4c]">
                Journal
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="capitalize">{post.post.category.replace("-", " ")}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-400 truncate">{post.post.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEFT: Article content (2/3) */}
            <article className="lg:col-span-2">
              {/* Category badge */}
              <div className="mb-4">
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: categoryColors[post.post.category] }}
                >
                  {post.post.category.replace("-", " ").toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl font-bold text-[#1e3a4c] mb-6">{post.post.title}</h1>

              {/* Meta */}
              <div className="flex items-center gap-6 text-slate-600 mb-8 pb-8 border-b border-slate-200">
                {post.post.author && (
                  <span className="font-semibold">By {post.post.author}</span>
                )}
                {post.post.publishedAt && (
                  <span>{new Date(post.post.publishedAt).toLocaleDateString()}</span>
                )}
                {post.post.readTimeMinutes && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.post.readTimeMinutes} min read
                  </span>
                )}
              </div>

              {/* Hero image */}
              {post.post.heroImage && (
                <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
                  <Image
                    src={post.post.heroImage}
                    alt={post.post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-12">
                <MarkdownRenderer content={post.post.content} />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8 pb-8 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-500 mb-3">TAGS</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full hover:bg-[#1e3a4c] hover:text-white transition-colors"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share buttons */}
              <div className="mb-12 pb-8 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-500 mb-3">SHARE THIS ARTICLE</h3>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a4c] text-white rounded-lg hover:bg-[#2d5568] transition-colors">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-[#1e3a4c] mb-6">Related Articles</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.post.id}
                        href={`/journal/${related.post.slug}`}
                        className="group"
                      >
                        {related.post.heroImage && (
                          <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                            <Image
                              src={related.post.heroImage}
                              alt={related.post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <h4 className="font-bold text-[#1e3a4c] group-hover:text-[#f97316] transition-colors line-clamp-2">
                          {related.post.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* RIGHT: Sidebar (1/3) */}
            <aside className="space-y-8">
              {/* Related Itineraries */}
              {itineraries.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Related Itineraries</h3>
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
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {item.itinerary.tagline}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Relevant Operators */}
              {operators.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Relevant Operators</h3>
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
              )}

              {/* Nearby Locations */}
              {locations.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">Nearby Locations</h3>
                  <div className="space-y-3">
                    {locations.map((item) => (
                      <Link
                        key={item.location.id}
                        href={`/locations/${item.location.slug}`}
                        className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-slate-200"
                      >
                        <h4 className="font-semibold text-[#1e3a4c] text-sm">
                          {item.location.name}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* More from Category */}
              {relatedPosts.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-[#1e3a4c] mb-4">
                    More from {post.post.category.replace("-", " ")}
                  </h3>
                  <div className="space-y-3">
                    {relatedPosts.slice(0, 3).map((related) => (
                      <Link
                        key={related.post.id}
                        href={`/journal/${related.post.slug}`}
                        className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-slate-200"
                      >
                        <h4 className="font-semibold text-[#1e3a4c] text-sm line-clamp-2">
                          {related.post.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
