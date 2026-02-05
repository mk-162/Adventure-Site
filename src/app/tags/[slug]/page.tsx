import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getTagBySlug,
  getTaggedActivities,
  getTaggedAccommodation,
  getTaggedItineraries,
  getRelatedTags,
  getAllTagSlugs,
} from "@/lib/queries";
import { ActivityCard } from "@/components/cards/activity-card";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { ChevronRight, Calendar, MapPin, Tag } from "lucide-react";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  return {
    title: `${tag.name} | Adventure Wales`,
    description: tag.description || `Explore content tagged with ${tag.name} on Adventure Wales.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const [activities, accommodation, itineraries, relatedTags] = await Promise.all([
    getTaggedActivities(tag.id),
    getTaggedAccommodation(tag.id),
    getTaggedItineraries(tag.id),
    getRelatedTags(tag.type),
  ]);

  // Filter out the current tag from related tags
  const otherTags = relatedTags.filter((t) => t.id !== tag.id).slice(0, 8);

  // Helper for itinerary difficulty color
  function getDifficultyColor(difficulty: string | null): string {
    if (!difficulty) return "bg-gray-100 text-gray-700";
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "challenging":
      case "hard":
        return "bg-orange-100 text-orange-700";
      case "extreme":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

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
            <Link href="/tags" className="hover:text-primary">
              Tags
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">{tag.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
             <h1 className="text-3xl lg:text-4xl font-bold text-primary">
                {tag.name}
             </h1>
             <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                {tag.type.replace("_", " ")}
             </span>
          </div>
          
          {tag.description && (
            <p className="text-gray-600 max-w-2xl text-lg">
              {tag.description}
            </p>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          
          {/* Activities */}
          {activities.length > 0 && (
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-primary">
                        Activities
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {activities.length}
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activities.map((item) => (
                        <ActivityCard
                            key={item.activity.id}
                            activity={{
                                ...item.activity,
                                priceFrom: item.activity.priceFrom?.toString() ?? null,
                                priceTo: item.activity.priceTo?.toString() ?? null,
                            }}
                            region={item.region}
                            operator={item.operator ? {
                                name: item.operator.name,
                                slug: item.operator.slug,
                                googleRating: item.operator.googleRating?.toString() ?? null,
                            } : null}
                            activityType={item.activityType}
                        />
                    ))}
                </div>
            </section>
          )}

          {/* Accommodation */}
          {accommodation.length > 0 && (
             <section>
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-primary">
                        Places to Stay
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {accommodation.length}
                    </span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {accommodation.map((item) => (
                         <AccommodationCard
                             key={item.accommodation.id}
                             accommodation={{
                                 ...item.accommodation,
                                 priceFrom: item.accommodation.priceFrom?.toString() ?? null,
                                 priceTo: item.accommodation.priceTo?.toString() ?? null,
                                 googleRating: item.accommodation.googleRating?.toString() ?? null,
                             }}
                             region={item.region}
                         />
                     ))}
                 </div>
             </section>
          )}

          {/* Itineraries */}
          {itineraries.length > 0 && (
            <section>
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-primary">
                        Itineraries
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {itineraries.length}
                    </span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itineraries.map((item) => (
                        <Link
                            key={item.itinerary.id}
                            href={`/itineraries/${item.itinerary.slug}`}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-primary/30 block"
                        >
                            {/* Card Image */}
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${item.itinerary.heroImage || `/images/regions/${item.region?.slug || 'wales'}-hero.jpg`}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                
                                {item.itinerary.durationDays && (
                                    <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                    {item.itinerary.durationDays} DAY{item.itinerary.durationDays > 1 ? "S" : ""}
                                    </div>
                                )}

                                {item.region && (
                                    <div className="absolute bottom-3 left-3">
                                    <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {item.region.name}
                                    </span>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-primary mb-2 group-hover:text-accent-hover transition-colors line-clamp-2">
                                {item.itinerary.title}
                                </h3>
                                
                                {item.itinerary.tagline && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.itinerary.tagline}</p>
                                )}

                                <div className="flex flex-wrap gap-2 mb-4">
                                {item.itinerary.difficulty && (
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(item.itinerary.difficulty)}`}>
                                    {item.itinerary.difficulty.charAt(0).toUpperCase() + item.itinerary.difficulty.slice(1)}
                                    </span>
                                )}
                                
                                {item.itinerary.bestSeason && (
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-700 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {item.itinerary.bestSeason}
                                    </span>
                                )}
                                </div>

                                {item.itinerary.priceEstimateFrom && (
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">Estimated cost</span>
                                    <span className="font-bold text-primary">
                                    £{item.itinerary.priceEstimateFrom}
                                    {item.itinerary.priceEstimateTo && item.itinerary.priceEstimateTo !== item.itinerary.priceEstimateFrom && (
                                        <span> - £{item.itinerary.priceEstimateTo}</span>
                                    )}
                                    </span>
                                </div>
                                )}
                            </div>
                        </Link>
                    ))}
                 </div>
            </section>
          )}

          {/* Related Tags */}
          {otherTags.length > 0 && (
             <section className="pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-accent-hover" />
                    Related {tag.type.replace("_", " ")} Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                    {otherTags.map((t) => (
                        <Link
                            key={t.id}
                            href={`/tags/${t.slug}`}
                            className="bg-gray-50 hover:bg-white border border-gray-200 hover:border-accent-hover text-gray-700 hover:text-accent-hover px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium"
                        >
                            {t.name}
                        </Link>
                    ))}
                </div>
             </section>
          )}
          
          {/* Empty State */}
          {activities.length === 0 && accommodation.length === 0 && itineraries.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-500">No content found for this tag yet.</p>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllTagSlugs();
  return slugs.map((slug) => ({ slug }));
}
