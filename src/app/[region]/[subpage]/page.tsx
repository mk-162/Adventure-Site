import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { 
  getRegionBySlug, 
  getActivityTypeBySlug, 
  getActivitiesByType, 
  getAllActivityTypes,
  getAllRegions
} from "@/lib/queries";
import { getComboPageData } from "@/lib/combo-data";
import { getBestListData, getAllBestListSlugs } from "@/lib/best-list-data";
import { ActivityCard } from "@/components/cards/activity-card";
import { ComboEnrichment } from "@/components/combo/ComboEnrichment";
import { VoiceTipsSection } from "@/components/voice-tips";
import { 
  ChevronRight, 
  Filter, 
  ChevronDown,
  ArrowRight,
  Compass,
  Map,
  MapPin, 
  Clock, 
  TrendingUp, 
  Calendar,
  Info,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Map as MapIcon,
  ExternalLink,
} from "lucide-react";
import { db } from "@/db";
import { regions, activities, activityTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{
    region: string;
    subpage: string;
  }>;
}

// Generate static params for all region subpages (activity types + best-of lists)
export async function generateStaticParams() {
  // Get activity type combos
  const activityCombos = await db
    .selectDistinct({
      regionSlug: regions.slug,
      activityTypeSlug: activityTypes.slug,
    })
    .from(activities)
    .innerJoin(regions, eq(activities.regionId, regions.id))
    .innerJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(eq(activities.status, "published"));

  const activityParams = activityCombos.map((combo) => ({
    region: combo.regionSlug,
    subpage: combo.activityTypeSlug,
  }));

  // Get best-of list params
  const bestListParams = getAllBestListSlugs().map(({ region, bestSlug }) => ({
    region,
    subpage: bestSlug,
  }));

  return [...activityParams, ...bestListParams];
}

// Generate metadata based on page type
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: regionSlug, subpage } = await params;
  
  // Check if it's a best-of list
  if (subpage.startsWith("best-")) {
    const listData = getBestListData(regionSlug, subpage);
    if (listData) {
      return {
        title: listData.metaTitle,
        description: listData.metaDescription,
        keywords: [
          listData.keywords.primary,
          ...listData.keywords.secondary,
          ...listData.keywords.longTail,
        ].join(", "),
        openGraph: {
          title: listData.metaTitle,
          description: listData.metaDescription,
          type: "article",
          publishedTime: listData.updatedDate,
          url: `https://adventurewales.co.uk${listData.urlPath}`,
          images: [{ url: listData.heroImage }],
        },
      };
    }
  }
  
  // Otherwise it's an activity type combo page
  const comboData = getComboPageData(regionSlug, subpage);
  
  if (comboData) {
    return {
      title: comboData.metaTitle,
      description: comboData.metaDescription,
    };
  }
  
  return {
    title: `${subpage.replace(/-/g, " ")} in ${regionSlug.replace(/-/g, " ")} | Adventure Wales`,
  };
}

export default async function RegionSubpage({ params }: PageProps) {
  const { region: regionSlug, subpage } = await params;
  
  // Route to appropriate handler based on slug pattern
  if (subpage.startsWith("best-")) {
    return <BestOfListPage regionSlug={regionSlug} bestSlug={subpage} />;
  }
  
  // Default: treat as activity type combo page
  return <ActivityComboPage regionSlug={regionSlug} activitySlug={subpage} />;
}

// =====================================================
// ACTIVITY COMBO PAGE COMPONENT
// =====================================================

async function ActivityComboPage({ regionSlug, activitySlug }: { regionSlug: string; activitySlug: string }) {
  const [region, activityType] = await Promise.all([
    getRegionBySlug(regionSlug),
    getActivityTypeBySlug(activitySlug),
  ]);

  if (!region || !activityType) {
    notFound();
  }

  const activitiesData = await getActivitiesByType(regionSlug, activitySlug);
  const allActivityTypes = await getAllActivityTypes();
  const comboData = getComboPageData(regionSlug, activitySlug);

  // If no activities found, show a helpful empty state
  if (activitiesData.length === 0) {
    const allRegions = await getAllRegions();
    const otherRegions = allRegions.filter(r => r.slug !== regionSlug).slice(0, 6);
    const otherActivityTypes = allActivityTypes
      .filter((t) => t.id !== activityType.id)
      .slice(0, 4);

    return (
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-500 mb-4 lg:mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${region.slug}`} className="hover:text-primary">{region.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#141515] font-medium">{activityType.name}</span>
        </nav>

        <div className="bg-gradient-to-br from-primary/5 to-accent-hover/5 rounded-2xl p-8 lg:p-12 text-center border border-gray-200 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-hover/10 mb-6">
            <Compass className="w-8 h-8 text-accent-hover" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-primary mb-3">
            No {activityType.name} in {region.name} yet
          </h1>
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto mb-8">
            We haven&apos;t found any {activityType.name.toLowerCase()} experiences in {region.name} yet, but we&apos;re always adding new adventures.
          </p>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Try {activityType.name} in these regions
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {otherRegions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}/${activitySlug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all text-sm font-medium text-primary"
                >
                  <Map className="w-4 h-4" />
                  {r.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Other activities in {region.name}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {otherActivityTypes.map((type) => (
                <Link
                  key={type.id}
                  href={`/${region.slug}/${type.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-accent-hover/30 hover:shadow-md transition-all text-sm font-medium text-primary"
                >
                  {type.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${region.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-[#2d5568] transition-colors"
            >
              Explore {region.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/activities"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-full border border-gray-200 hover:border-primary/30 transition-colors"
            >
              Browse All Activities
            </Link>
          </div>
        </div>

        {comboData && (
          <div className="mb-10">
            <ComboEnrichment data={comboData} regionName={region.name} />
          </div>
        )}
      </main>
    );
  }

  // Calculate Stats
  const uniqueOperators = new Set(activitiesData.map((a) => a.operator?.id).filter(Boolean));
  const minPrice = activitiesData.reduce((min, curr) => {
    const price = curr.activity.priceFrom ? parseFloat(curr.activity.priceFrom) : Infinity;
    return price < min ? price : min;
  }, Infinity);
  const displayMinPrice = minPrice === Infinity ? null : minPrice;

  const featuredItem = activitiesData.find((a) => a.operator?.claimStatus === "premium") || activitiesData[0];
  const featuredOperator = featuredItem?.operator;

  const otherActivityTypes = allActivityTypes
    .filter((t) => t.id !== activityType.id)
    .slice(0, 4);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-500 mb-4 lg:mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/${region.slug}`} className="hover:text-primary">{region.name}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#141515] font-medium">{activityType.name}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2 text-primary">
          {activityType.name} in {region.name}
        </h1>
        <p className="text-sm lg:text-lg text-gray-500 max-w-3xl">
          {comboData?.strapline || activityType.description || `Explore the best ${activityType.name.toLowerCase()} experiences in ${region.name}.`}
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 mb-4 lg:mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
        <div className="flex min-w-[100px] flex-1 flex-col gap-1 rounded-xl border border-gray-200 p-3 lg:p-4 items-center text-center bg-white shadow-sm shrink-0 sm:shrink">
          <p className="text-xl lg:text-2xl font-bold text-primary">{activitiesData.length}</p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Experiences</p>
        </div>
        <div className="flex min-w-[100px] flex-1 flex-col gap-1 rounded-xl border border-gray-200 p-3 lg:p-4 items-center text-center bg-white shadow-sm shrink-0 sm:shrink">
          <p className="text-xl lg:text-2xl font-bold text-primary">{uniqueOperators.size}</p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Operators</p>
        </div>
        <div className="flex min-w-[100px] flex-1 flex-col gap-1 rounded-xl border border-gray-200 p-3 lg:p-4 items-center text-center bg-white shadow-sm shrink-0 sm:shrink">
          <p className="text-xl lg:text-2xl font-bold text-primary">
            {displayMinPrice ? `£${displayMinPrice}+` : "N/A"}
          </p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">From</p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-40 bg-[#f7f7f7] py-2 mb-4 lg:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-gray-200 lg:border-none">
        <div className="flex gap-2 overflow-x-auto no-scrollbar lg:overflow-visible pb-2">
          <button className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 shadow-sm hover:border-primary transition-colors text-sm font-medium text-primary">
            Difficulty
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 shadow-sm hover:border-primary transition-colors text-sm font-medium text-primary">
            Price
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 shadow-sm hover:border-primary transition-colors text-sm font-medium text-primary">
            Duration
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-primary text-white px-4 shadow-sm hover:bg-primary/90 transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            All Filters
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm font-medium">{activitiesData.length} Adventures</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:inline">Sort:</span>
          <select className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer p-0 text-primary">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Rating</option>
          </select>
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
        {activitiesData.slice(0, 3).map((item) => (
          <ActivityCard
            key={item.activity.id}
            activity={item.activity}
            region={item.region}
            operator={item.operator}
          />
        ))}

        {featuredOperator && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 w-full rounded-2xl bg-primary text-white overflow-hidden relative my-4 lg:my-6 min-h-[250px] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent z-10" />
            {featuredOperator.coverImage && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url('${featuredOperator.coverImage}')` }}
              />
            )}
            <div className="relative z-20 p-6 lg:p-8 flex flex-col items-start gap-3 lg:gap-4 max-w-lg">
              <span className="bg-accent-hover text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                Featured Operator
              </span>
              <h2 className="text-xl lg:text-2xl font-black leading-tight">{featuredOperator.name}</h2>
              <p className="text-white/80 text-sm lg:text-base">
                {featuredOperator.tagline || "Experience the best adventures with our top-rated partners."}
              </p>
              <Link
                href={`/directory/${featuredOperator.slug}`}
                className="mt-1 bg-white text-primary hover:bg-gray-100 font-bold py-2.5 lg:py-3 px-5 lg:px-6 rounded-xl transition-colors flex items-center gap-2 text-sm lg:text-base"
              >
                View Their Trips <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {activitiesData.slice(3).map((item) => (
          <ActivityCard
            key={item.activity.id}
            activity={item.activity}
            region={item.region}
            operator={item.operator}
          />
        ))}
      </div>

      {comboData && (
        <div className="mb-10">
          <ComboEnrichment data={comboData} regionName={region.name} />
        </div>
      )}

      {/* About Section */}
      <div className="mb-8 lg:mb-12">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-primary">About {activityType.name}</h2>
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-200 shadow-sm">
          <details className="group mb-4" open>
            <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-primary">
              <span>What to Expect</span>
              <ChevronDown className="transition-transform group-open:rotate-180 w-5 h-5" />
            </summary>
            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              {activityType.description || `${activityType.name} offers an incredible way to explore the natural beauty of ${region.name}.`}
            </p>
          </details>
          <div className="h-px bg-gray-200 my-4" />
          <details className="group">
            <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-primary">
              <span>Requirements</span>
              <ChevronDown className="transition-transform group-open:rotate-180 w-5 h-5" />
            </summary>
            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              Most {activityType.name.toLowerCase()} experiences are suitable for beginners, but a reasonable level of fitness is recommended.
            </p>
          </details>
        </div>
      </div>

      {/* Voice Tips Section */}
      <div className="mb-10">
        <VoiceTipsSection 
          pageSlug={`${activitySlug}-${regionSlug}`} 
          pageType="combo" 
          pageName={`${activityType.name} in ${region.name}`}
          title="Local Tips"
          subtitle={`Been ${activityType.name.toLowerCase()} in ${region.name}? Share what you learned.`}
        />
      </div>

      {/* You Might Also Like */}
      <div className="mb-8">
        <h3 className="text-xl lg:text-2xl font-bold mb-4 text-primary">You Might Also Like</h3>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-2 sm:pb-0">
            {otherActivityTypes.map((type) => (
              <Link
                key={type.id}
                href={`/${region.slug}/${type.slug}`}
                className="flex-shrink-0 w-[140px] sm:w-auto group"
              >
                <div className="w-full aspect-[4/3] rounded-lg bg-gray-200 relative overflow-hidden mb-2">
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">{type.name}</span>
                  </div>
                </div>
                <p className="font-bold text-sm leading-tight text-primary group-hover:text-accent-hover transition-colors">{type.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Explore</p>
              </Link>
            ))}

            <Link href={`/${region.slug}`} className="flex-shrink-0 w-[140px] sm:w-auto group hidden lg:block">
              <div className="w-full aspect-[4/3] rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <ArrowRight className="text-primary w-8 h-8" />
              </div>
              <p className="font-bold text-sm leading-tight text-primary group-hover:text-accent-hover transition-colors mt-2">
                Explore {region.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">All adventures</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// =====================================================
// BEST-OF LIST PAGE COMPONENT
// =====================================================

async function BestOfListPage({ regionSlug, bestSlug }: { regionSlug: string; bestSlug: string }) {
  const [region, listData] = await Promise.all([
    getRegionBySlug(regionSlug),
    Promise.resolve(getBestListData(regionSlug, bestSlug)),
  ]);
  
  if (!region || !listData) {
    notFound();
  }
  
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listData.title,
    "description": listData.introduction,
    "numberOfItems": listData.entries.length,
    "itemListElement": listData.entries.map((entry) => ({
      "@type": "ListItem",
      "position": entry.rank,
      "name": entry.name,
      "description": entry.whyItMadeTheList,
      "url": entry.relatedActivitySlug 
        ? `https://adventurewales.co.uk/${entry.relatedActivitySlug}`
        : entry.comboPageAnchor
        ? `https://adventurewales.co.uk${listData.comboPageLink}#${entry.comboPageAnchor}`
        : undefined,
    })),
  };
  
  return (
    <>
      <JsonLd data={itemListSchema} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-500 mb-4 lg:mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${region.slug}`} className="hover:text-primary">{region.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#141515] font-medium">{listData.title}</span>
        </nav>
        
        {/* Hero Section */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-6 lg:mb-8 h-[350px] lg:h-[450px]">
          <div className="absolute inset-0 bg-gray-900">
            <img 
              alt={listData.heroAlt}
              className="w-full h-full object-cover"
              src={listData.heroImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          
          <div className="relative z-10 flex flex-col gap-3 lg:gap-4 p-6 lg:p-10 text-white h-full justify-end max-w-3xl">
            <div className="flex items-center gap-3 text-sm">
              <span className="bg-accent-hover text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Best Of
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4" />
                Updated {new Date(listData.updatedDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              {listData.h1}
            </h1>
            
            <p className="text-base lg:text-xl text-gray-200 font-medium">
              {listData.strapline}
            </p>
          </div>
        </div>
        
        {/* Quick Jump Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 mb-6 lg:mb-8 shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Jump to:</p>
          <div className="flex flex-wrap gap-2">
            {listData.entries.map((entry) => (
              <a
                key={entry.rank}
                href={`#entry-${entry.rank}`}
                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-primary/10 rounded-full text-primary font-medium transition-colors"
              >
                #{entry.rank} {entry.name}
              </a>
            ))}
          </div>
        </div>
        
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {listData.introduction}
          </p>
        </div>
        
        {/* How We Picked These */}
        <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-5 lg:p-6 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-primary text-lg mb-2">How We Picked These</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{listData.rankingCriteria}</p>
            </div>
          </div>
        </div>
        
        {/* The Ranked List */}
        <div className="space-y-8 lg:space-y-10 mb-12">
          {listData.entries.map((entry) => (
            <article 
              key={entry.rank}
              id={`entry-${entry.rank}`}
              className="scroll-mt-32 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative h-[250px] lg:h-[350px] bg-gray-900">
                <img 
                  alt={entry.imageAlt}
                  className="w-full h-full object-cover"
                  src={entry.image}
                />
                <div className="absolute top-4 left-4 bg-accent-hover text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center font-black text-2xl lg:text-3xl shadow-lg">
                  {entry.rank}
                </div>
              </div>
              
              <div className="p-5 lg:p-8">
                <div className="mb-5">
                  <h2 className="text-2xl lg:text-3xl font-black text-primary mb-2">{entry.name}</h2>
                  <p className="text-lg lg:text-xl text-gray-600 font-medium italic">{entry.verdict}</p>
                </div>
                
                <div className="mb-5">
                  <p className="text-gray-700 leading-relaxed">{entry.whyItMadeTheList}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                  <StatBadge label="Difficulty" value={entry.difficulty} />
                  <StatBadge label="Duration" value={entry.duration} />
                  <StatBadge label="Distance" value={entry.distance} />
                  <StatBadge label="Elevation" value={entry.elevationGain} />
                  <StatBadge label="Cost" value={entry.cost} />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <div className="flex items-start gap-2 bg-green-50 p-4 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-green-900 text-sm mb-1">Best for:</p>
                      <p className="text-green-800 text-sm">{entry.bestFor}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-orange-50 p-4 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-orange-900 text-sm mb-1">Skip if:</p>
                      <p className="text-orange-800 text-sm">{entry.skipIf}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-accent-hover/5 border-l-4 border-accent-hover rounded-r-xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-accent-hover shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-accent-hover text-sm mb-1">Insider Tip</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{entry.insiderTip}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-primary">Best Season</p>
                      <p className="text-gray-600">{entry.season}</p>
                    </div>
                  </div>
                  
                  {entry.parking && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-primary">Parking</p>
                        <p className="text-gray-600">{entry.parking.location} — {entry.parking.cost}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-200">
                  {entry.startPoint && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${entry.startPoint.lat},${entry.startPoint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                      <MapIcon className="w-4 h-4" />
                      Get Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  
                  {entry.operatorSlug && (
                    <Link
                      href={`/directory/${entry.operatorSlug}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-primary rounded-full font-bold text-sm hover:border-primary transition-colors"
                    >
                      View Operator
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                  
                  {entry.guidedOption && (
                    <div className="text-sm text-gray-600 flex items-center gap-1 px-4 py-2">
                      <Info className="w-4 h-4" />
                      {entry.guidedOption}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Related Content */}
        {listData.comboPageLink && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black mb-3">Want more info?</h3>
              <p className="text-white/90 mb-4">Check out our comprehensive guide covering everything you need to know.</p>
              <Link
                href={listData.comboPageLink}
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-5 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                View Full Guide
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
        
        {/* FAQs */}
        {listData.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-primary mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {listData.faqs.map((faq, index) => (
                <details 
                  key={index}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-bold text-primary hover:bg-gray-50 transition-colors">
                    <span>{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                  </summary>
                  <div className="px-5 pb-5 pt-2 text-gray-700 leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}
        
        {/* Related Lists */}
        {listData.relatedLists && listData.relatedLists.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-primary mb-5">You Might Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listData.relatedLists.map((related, index) => (
                <Link
                  key={index}
                  href={related.slug}
                  className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-accent-hover hover:shadow-md transition-all"
                >
                  <span className="font-bold text-primary group-hover:text-accent-hover transition-colors">{related.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent-hover group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </section>
        )}
        
      </main>
    </>
  );
}

// Helper Components

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  );
}
