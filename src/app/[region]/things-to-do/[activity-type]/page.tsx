import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  getRegionBySlug, 
  getActivityTypeBySlug, 
  getActivitiesByType, 
  getAllActivityTypes 
} from "@/lib/queries";
import { getComboPageData } from "@/lib/combo-data";
import { ActivityCard } from "@/components/cards/activity-card";
import { ComboEnrichment } from "@/components/combo/ComboEnrichment";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { 
  ChevronRight, 
  MapPin, 
  Clock, 
  Star, 
  Filter, 
  ChevronDown,
  ArrowRight,
  Compass,
  Map
} from "lucide-react";
import { getAllRegions } from "@/lib/queries";

interface PageProps {
  params: Promise<{
    region: string;
    "activity-type": string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { region: regionSlug, "activity-type": activityTypeSlug } = await params;
  const comboData = getComboPageData(regionSlug, activityTypeSlug);
  
  if (comboData) {
    return {
      title: comboData.metaTitle,
      description: comboData.metaDescription,
    };
  }
  
  return {
    title: `${activityTypeSlug.replace(/-/g, " ")} in ${regionSlug.replace(/-/g, " ")} | Adventure Wales`,
  };
}

export default async function ActivityListingPage({ params }: PageProps) {
  const { region: regionSlug, "activity-type": activityTypeSlug } = await params;

  // 1. Fetch Data
  const [region, activityType] = await Promise.all([
    getRegionBySlug(regionSlug),
    getActivityTypeBySlug(activityTypeSlug),
  ]);

  if (!region || !activityType) {
    notFound();
  }

  const activities = await getActivitiesByType(regionSlug, activityTypeSlug);
  const allActivityTypes = await getAllActivityTypes();
  const comboData = getComboPageData(regionSlug, activityTypeSlug);

  // If no activities found, show a helpful empty state
  if (activities.length === 0) {
    // Find other regions that might have this activity type
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
          <Link href={`/${region.slug}/things-to-do`} className="hover:text-primary">Things to Do</Link>
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
            We haven&apos;t found any {activityType.name.toLowerCase()} experiences in {region.name} yet, but we&apos;re always adding new adventures. Try one of these nearby regions or explore other activities in {region.name}.
          </p>

          {/* Other regions to try */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Try {activityType.name} in these regions
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {otherRegions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}/things-to-do/${activityTypeSlug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all text-sm font-medium text-primary"
                >
                  <Map className="w-4 h-4" />
                  {r.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Other activity types in this region */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Other activities in {region.name}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {otherActivityTypes.map((type) => (
                <Link
                  key={type.id}
                  href={`/${region.slug}/things-to-do/${type.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-accent-hover/30 hover:shadow-md transition-all text-sm font-medium text-primary"
                >
                  {type.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${region.slug}/things-to-do`}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-[#2d5568] transition-colors"
            >
              All Things to Do in {region.name}
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

        {/* Combo enrichment content still shows (SEO value) */}
        {comboData && (
          <div className="mb-10">
            <ComboEnrichment data={comboData} regionName={region.name} />
          </div>
        )}
      </main>
    );
  }

  // 2. Calculate Stats
  const uniqueOperators = new Set(activities.map((a) => a.operator?.id).filter(Boolean));
  const minPrice = activities.reduce((min, curr) => {
    const price = curr.activity.priceFrom ? parseFloat(curr.activity.priceFrom) : Infinity;
    return price < min ? price : min;
  }, Infinity);
  const displayMinPrice = minPrice === Infinity ? null : minPrice;

  // 3. Select Featured Operator (simple logic: first premium or just first operator)
  const featuredItem = activities.find((a) => a.operator?.claimStatus === "premium") || activities[0];
  const featuredOperator = featuredItem?.operator;

  // 4. "You Might Also Like" - filter out current type
  const otherActivityTypes = allActivityTypes
    .filter((t) => t.id !== activityType.id)
    .slice(0, 4);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-500 mb-4 lg:mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/${region.slug}`} className="hover:text-primary">
          {region.name}
        </Link>
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
          <p className="text-xl lg:text-2xl font-bold text-primary">{activities.length}</p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
            Experiences
          </p>
        </div>
        <div className="flex min-w-[100px] flex-1 flex-col gap-1 rounded-xl border border-gray-200 p-3 lg:p-4 items-center text-center bg-white shadow-sm shrink-0 sm:shrink">
          <p className="text-xl lg:text-2xl font-bold text-primary">{uniqueOperators.size}</p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
            Operators
          </p>
        </div>
        <div className="flex min-w-[100px] flex-1 flex-col gap-1 rounded-xl border border-gray-200 p-3 lg:p-4 items-center text-center bg-white shadow-sm shrink-0 sm:shrink">
          <p className="text-xl lg:text-2xl font-bold text-primary">
            {displayMinPrice ? `£${displayMinPrice}+` : "N/A"}
          </p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
            From
          </p>
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
        <p className="text-gray-500 text-sm font-medium">
          {activities.length} Adventures
        </p>
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
        {activities.slice(0, 3).map((item) => (
          <ActivityCard
            key={item.activity.id}
            activity={item.activity}
            region={item.region}
            operator={item.operator}
          />
        ))}

        {/* Featured Operator Banner (inserted after 3rd item if available) */}
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
              <h2 className="text-xl lg:text-2xl font-black leading-tight">
                {featuredOperator.name}
              </h2>
              <p className="text-white/80 text-sm lg:text-base">
                {featuredOperator.tagline ||
                  "Experience the best adventures with our top-rated partners."}
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

        {activities.slice(3).map((item) => (
          <ActivityCard
            key={item.activity.id}
            activity={item.activity}
            region={item.region}
            operator={item.operator}
          />
        ))}
      </div>

      {/* Combo Page Enrichment — editorial content, spots, practical info */}
      {comboData && (
        <div className="mb-10">
          <ComboEnrichment data={comboData} regionName={region.name} />
        </div>
      )}

      {/* About Section (Accordion) */}
      <div className="mb-8 lg:mb-12">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-primary">
          About {activityType.name}
        </h2>
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-200 shadow-sm">
          <details className="group mb-4" open>
            <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-primary">
              <span>What to Expect</span>
              <ChevronDown className="transition-transform group-open:rotate-180 w-5 h-5" />
            </summary>
            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              {activityType.description ||
                `${activityType.name} offers an incredible way to explore the natural beauty of ${region.name}. Prepare for an adventure that combines excitement with breathtaking scenery.`}
            </p>
          </details>
          <div className="h-px bg-gray-200 my-4" />
          <details className="group">
            <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-primary">
              <span>Requirements</span>
              <ChevronDown className="transition-transform group-open:rotate-180 w-5 h-5" />
            </summary>
            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              Most {activityType.name.toLowerCase()} experiences are suitable for beginners, but a reasonable level of fitness is recommended. Operators will provide all necessary safety equipment. Please check individual activity details for age restrictions and specific requirements.
            </p>
          </details>
        </div>
      </div>

      {/* Voice Tips Section */}
      <div className="mb-10">
        <CommentsSection 
          pageSlug={`${activityTypeSlug}-${regionSlug}`} 
          pageType="combo" 
          title="Local Tips"
          subtitle={`Been ${activityType.name.toLowerCase()} in ${region.name}? Share what you learned.`}
        />
      </div>

      {/* You Might Also Like */}
      <div className="mb-8">
        <h3 className="text-xl lg:text-2xl font-bold mb-4 text-primary">
          You Might Also Like
        </h3>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-2 sm:pb-0">
            {otherActivityTypes.map((type) => (
              <Link
                key={type.id}
                href={`/${region.slug}/things-to-do/${type.slug}`}
                className="flex-shrink-0 w-[140px] sm:w-auto group"
              >
                <div className="w-full aspect-[4/3] rounded-lg bg-gray-200 relative overflow-hidden mb-2">
                  {/* Placeholder for activity type image if available, otherwise gray bg */}
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">
                      {type.name}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <p className="font-bold text-sm leading-tight text-primary group-hover:text-accent-hover transition-colors">
                  {type.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Explore</p>
              </Link>
            ))}

            <Link
              href={`/${region.slug}/things-to-do`}
              className="flex-shrink-0 w-[140px] sm:w-auto group hidden lg:block"
            >
              <div className="w-full aspect-[4/3] rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <ArrowRight className="text-primary w-8 h-8" />
              </div>
              <p className="font-bold text-sm leading-tight text-primary group-hover:text-accent-hover transition-colors mt-2">
                View All Activities
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Browse everything</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
