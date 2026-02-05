import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getRegionBySlug } from "@/lib/queries";
import { getBestListData, getAllBestListSlugs } from "@/lib/best-list-data";
import { 
  ChevronRight, 
  MapPin, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Info,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Map as MapIcon,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{
    region: string;
    bestSlug: string;
  }>;
}

// Generate static params for all best-of lists
export async function generateStaticParams() {
  const allSlugs = getAllBestListSlugs();
  
  return allSlugs.map(({ region, bestSlug }) => ({
    region,
    bestSlug,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: regionSlug, bestSlug } = await params;
  
  // Only process if slug starts with "best-"
  if (!bestSlug.startsWith("best-")) {
    return { title: "Not Found" };
  }
  
  const listData = getBestListData(regionSlug, bestSlug);
  
  if (!listData) {
    return { title: "Not Found" };
  }
  
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

export default async function BestOfListPage({ params }: PageProps) {
  const { region: regionSlug, bestSlug } = await params;
  
  // IMPORTANT: Only handle slugs starting with "best-"
  // This prevents this route from catching other slugs like "where-to-stay", "things-to-do", etc.
  if (!bestSlug.startsWith("best-")) {
    notFound();
  }
  
  const [region, listData] = await Promise.all([
    getRegionBySlug(regionSlug),
    Promise.resolve(getBestListData(regionSlug, bestSlug)),
  ]);
  
  if (!region || !listData) {
    notFound();
  }
  
  // Generate Schema.org ItemList JSON-LD
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listData.title,
    "description": listData.introduction,
    "numberOfItems": listData.entries.length,
    "itemListElement": listData.entries.map((entry, index) => ({
      "@type": "ListItem",
      "position": entry.rank,
      "name": entry.name,
      "description": entry.whyItMadeTheList,
      "url": entry.relatedActivitySlug 
        ? `https://adventurewales.co.uk/activities/${entry.relatedActivitySlug}`
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
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            Jump to:
          </p>
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
              {/* Entry Header with Image */}
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
              
              {/* Entry Content */}
              <div className="p-5 lg:p-8">
                
                {/* Title & Verdict */}
                <div className="mb-5">
                  <h2 className="text-2xl lg:text-3xl font-black text-primary mb-2">
                    {entry.name}
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-600 font-medium italic">
                    {entry.verdict}
                  </p>
                </div>
                
                {/* Why It Made The List */}
                <div className="mb-5">
                  <p className="text-gray-700 leading-relaxed">
                    {entry.whyItMadeTheList}
                  </p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                  <StatBadge label="Difficulty" value={entry.difficulty} />
                  <StatBadge label="Duration" value={entry.duration} />
                  <StatBadge label="Distance" value={entry.distance} />
                  <StatBadge label="Elevation" value={entry.elevationGain} />
                  <StatBadge label="Cost" value={entry.cost} />
                </div>
                
                {/* Best For / Skip If */}
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
                
                {/* Insider Tip */}
                <div className="bg-accent-hover/5 border-l-4 border-accent-hover rounded-r-xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-accent-hover shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-accent-hover text-sm mb-1">Insider Tip</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{entry.insiderTip}</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info Grid */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  
                  {/* Season */}
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-primary">Best Season</p>
                      <p className="text-gray-600">{entry.season}</p>
                    </div>
                  </div>
                  
                  {/* Parking */}
                  {entry.parking && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-primary">Parking</p>
                        <p className="text-gray-600">{entry.parking.location} — {entry.parking.cost}</p>
                        {entry.parking.notes && (
                          <p className="text-gray-500 text-xs mt-1">{entry.parking.notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                </div>
                
                {/* Action Buttons */}
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
        
        {/* Comparison Table */}
        {listData.comparisonTable && (
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-primary mb-5">
              Quick Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">#</th>
                    <th className="px-4 py-3 text-left font-bold">Name</th>
                    <th className="px-4 py-3 text-left font-bold">Difficulty</th>
                    <th className="px-4 py-3 text-left font-bold">Duration</th>
                    <th className="px-4 py-3 text-left font-bold">Distance</th>
                    <th className="px-4 py-3 text-left font-bold">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {listData.entries.map((entry, index) => (
                    <tr 
                      key={entry.rank}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3 font-bold text-accent-hover">{entry.rank}</td>
                      <td className="px-4 py-3">
                        <a href={`#entry-${entry.rank}`} className="font-bold text-primary hover:underline">
                          {entry.name}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{entry.difficulty}</td>
                      <td className="px-4 py-3 text-gray-600">{entry.duration}</td>
                      <td className="px-4 py-3 text-gray-600">{entry.distance}</td>
                      <td className="px-4 py-3 text-gray-600">{entry.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        
        {/* Seasonal Recommendations */}
        {listData.seasonalPicks && (
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-primary mb-5">
              Best Times to Visit
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {listData.seasonalPicks.spring && (
                <SeasonCard 
                  season="Spring"
                  entries={listData.seasonalPicks.spring.entries.map(rank => 
                    listData.entries.find(e => e.rank === rank)?.name || ""
                  ).filter(Boolean)}
                  note={listData.seasonalPicks.spring.note}
                  color="green"
                />
              )}
              {listData.seasonalPicks.summer && (
                <SeasonCard 
                  season="Summer"
                  entries={listData.seasonalPicks.summer.entries.map(rank => 
                    listData.entries.find(e => e.rank === rank)?.name || ""
                  ).filter(Boolean)}
                  note={listData.seasonalPicks.summer.note}
                  color="yellow"
                />
              )}
              {listData.seasonalPicks.autumn && (
                <SeasonCard 
                  season="Autumn"
                  entries={listData.seasonalPicks.autumn.entries.map(rank => 
                    listData.entries.find(e => e.rank === rank)?.name || ""
                  ).filter(Boolean)}
                  note={listData.seasonalPicks.autumn.note}
                  color="orange"
                />
              )}
              {listData.seasonalPicks.winter && (
                <SeasonCard 
                  season="Winter"
                  entries={listData.seasonalPicks.winter.entries.map(rank => 
                    listData.entries.find(e => e.rank === rank)?.name || ""
                  ).filter(Boolean)}
                  note={listData.seasonalPicks.winter.note}
                  color="blue"
                />
              )}
            </div>
          </section>
        )}
        
        {/* Map Section (placeholder for now) */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-black text-primary mb-5">
            Map
          </h2>
          <div className="bg-gray-100 rounded-2xl h-[400px] flex items-center justify-center border border-gray-200">
            <p className="text-gray-500 font-medium">
              Interactive map showing all {listData.entries.length} locations
            </p>
          </div>
        </section>
        
        {/* Related Content */}
        {listData.comboPageLink && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black mb-3">
                Want more info?
              </h3>
              <p className="text-white/90 mb-4">
                Check out our comprehensive guide covering everything you need to know.
              </p>
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
            <h2 className="text-2xl lg:text-3xl font-black text-primary mb-5">
              Frequently Asked Questions
            </h2>
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
                  <div className="px-5 pb-5 pt-2 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
        
        {/* Related Lists */}
        {listData.relatedLists && listData.relatedLists.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-primary mb-5">
              You Might Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listData.relatedLists.map((related, index) => (
                <Link
                  key={index}
                  href={related.slug}
                  className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-accent-hover hover:shadow-md transition-all"
                >
                  <span className="font-bold text-primary group-hover:text-accent-hover transition-colors">
                    {related.label}
                  </span>
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
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  );
}

function SeasonCard({ 
  season, 
  entries, 
  note, 
  color 
}: { 
  season: string; 
  entries: string[]; 
  note: string; 
  color: "green" | "yellow" | "orange" | "blue";
}) {
  const colorClasses = {
    green: "bg-green-50 border-green-200 text-green-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
    orange: "bg-orange-50 border-orange-200 text-orange-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
  };
  
  return (
    <div className={`rounded-xl border-2 p-5 ${colorClasses[color]}`}>
      <h3 className="font-black text-lg mb-2">{season}</h3>
      <p className="text-sm mb-3 opacity-80">{note}</p>
      <ul className="text-sm space-y-1">
        {entries.map((entry, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-xs mt-0.5">•</span>
            <span className="font-medium">{entry}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
