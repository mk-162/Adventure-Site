import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getAllPosts, getAllTags, getItineraries, getOperators } from "@/lib/queries";
import JournalClient from "@/components/journal/JournalClient";

export const metadata: Metadata = {
  title: "Adventure Journal | Stories, Guides & Insights | Adventure Wales",
  description:
    "Expert guides, gear reviews, trip reports and seasonal tips for outdoor adventures across Wales. From Snowdonia to Pembrokeshire — plan your next Welsh adventure.",
  openGraph: {
    title: "The Adventure Journal | Adventure Wales",
    description:
      "Stories, guides, and insights from the heart of Welsh adventure",
    type: "website",
  },
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JournalPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedCategory = (typeof params.category === "string" ? params.category : "") || "";
  const selectedTag = (typeof params.tag === "string" ? params.tag : "") || "";

  // Fetch all data server-side in parallel
  const [postsData, tagsData, itinerariesData, { operators: operatorsData }] = await Promise.all([
    getAllPosts({
      category: selectedCategory || undefined,
      tagSlug: selectedTag || undefined,
      limit: 12,
    }),
    getAllTags(),
    getItineraries({ limit: 5 }),
    getOperators({ limit: 5 }),
  ]);

  // Get total count for the current filter
  const totalPosts = await getAllPosts({
    category: selectedCategory || undefined,
    tagSlug: selectedTag || undefined,
  });
  const totalCount = totalPosts.length;

  // Filter tags to post-related ones
  const postTags = tagsData.filter((t) => t.type === "activity" || t.type === "terrain" || t.type === "region");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-[#2d5568] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-accent-hover" />
          <h1 className="text-5xl font-bold mb-4">The Adventure Journal</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Stories, guides, and insights from the heart of Welsh adventure
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <JournalClient
          initialPosts={postsData}
          tags={postTags}
          itineraries={itinerariesData}
          operators={operatorsData}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
