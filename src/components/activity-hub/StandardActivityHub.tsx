import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/cards/activity-card";
import { RegionMap } from "@/components/ui/RegionMap";
import { getActivities, getActivityTypeBySlug, getItineraries } from "@/lib/queries";
import { isLaunchCombo, isLaunchRegion } from "@/lib/launch";
import { Map, Calendar, MessageCircle, ChevronDown, ArrowRight, Star, Clock, PoundSterling, Users, Gauge, Compass, Sparkles } from "lucide-react";
import { JsonLd, createTouristDestinationSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";

/**
 * Shared plumbing for the standard activity hub pages (bouldering, canoeing,
 * fishing, ...). Each page owns its content via a StandardHubConfig; this
 * component owns the page skeleton, data fetching, metadata shape, and
 * structured data so cross-cutting fixes land everywhere at once.
 *
 * The mega hubs (hiking, surfing, caving, coasteering, mountain-biking,
 * skydiving) are deliberately bespoke and do NOT use this component.
 */
export interface StandardHubConfig {
  slug: string;
  name: string;
  title: string;
  strapline: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  icon: string;
  /** Hero stat tiles; camelCase keys are split into words for display */
  stats: Record<string, string>;
  quickFacts: {
    bestTime: string;
    price: string;
    difficulty: string;
    duration: string;
    bestFor: string;
  };
  regions: { name: string; slug: string; tagline: string; highlights: string[] }[];
  relatedActivities: { name: string; slug: string; emoji: string }[];
  faqs: { question: string; answer: string }[];
  /** Intro paragraph rendered under the breadcrumb */
  intro: string;
  /** Hero scroll-down button label, e.g. "Find Swim Spots" */
  heroCtaLabel: string;
  /** Map section heading, e.g. "Find Swim Spots Near You" */
  mapHeading: string;
  /** Experiences section heading, e.g. "Guided Wild Swimming Experiences" */
  experiencesHeading: string;
  /** Bottom CTA copy */
  ctaHeading: string;
  ctaSubtext: string;
  ctaButtonLabel: string;
  /** "View all ..." link label in the experiences section (default "View all experiences") */
  viewAllLabel?: string;
  /** Keyword matching (lowercase substring) for the optional itineraries section */
  itineraryMatch?: { title: string[]; description: string[] };
  /** Render the "Trip Itineraries" section (requires itineraryMatch) */
  showItinerariesSection?: boolean;
}

export function standardHubMetadata(config: StandardHubConfig): Metadata {
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      images: [config.heroImage],
    },
  };
}

export async function StandardActivityHub({ config }: { config: StandardHubConfig }) {
  const activityType = await getActivityTypeBySlug(config.slug);

  const [activitiesData, allItineraries] = await Promise.all([
    activityType ? getActivities({ activityTypeId: activityType.id, limit: 12 }) : Promise.resolve([]),
    config.showItinerariesSection ? getItineraries({ limit: 50 }) : Promise.resolve([]),
  ]);

  const itineraryMatch = config.itineraryMatch;
  const relatedItineraries = itineraryMatch
    ? allItineraries
        .filter(
          (row) =>
            itineraryMatch.title.some((k) => row.itinerary.title?.toLowerCase().includes(k)) ||
            itineraryMatch.description.some((k) => row.itinerary.description?.toLowerCase().includes(k))
        )
        .slice(0, 4)
    : [];

  const mapMarkers = activitiesData.filter(row => row.activity.lat && row.activity.lng).map((row) => ({
    id: row.activity.slug || String(row.activity.id),
    lat: parseFloat(String(row.activity.lat)),
    lng: parseFloat(String(row.activity.lng)),
    title: row.activity.name,
    type: "activity" as const,
    link: `/activities/${row.activity.slug}`,
    subtitle: row.region?.name || undefined,
  }));

  const breadcrumbSchema = createBreadcrumbSchema([{ name: "Home", url: "/" }, { name: config.title, url: `/${config.slug}` }]);
  const destinationSchema = createTouristDestinationSchema({ name: config.title, description: config.metaDescription, slug: config.slug }, { imageUrl: config.heroImage });

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={destinationSchema} />
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${config.heroImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <span className="text-xl">{config.icon}</span>
            The Complete Guide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">{config.title}</h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">{config.strapline}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {Object.entries(config.stats).map(([key, value]) => (
              <div key={key} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-white/80 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
              </div>
            ))}
          </div>
          <a href="#experiences" className="inline-flex items-center gap-2 bg-accent-hover hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg">
            {config.heroCtaLabel} <ChevronDown className="h-5 w-5" />
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><Calendar className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Best Time</span></div><div className="font-bold text-gray-900">{config.quickFacts.bestTime}</div></div>
              <div><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><PoundSterling className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Price</span></div><div className="font-bold text-gray-900">{config.quickFacts.price}</div></div>
              <div><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><Gauge className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Difficulty</span></div><div className="font-bold text-gray-900">{config.quickFacts.difficulty}</div></div>
              <div><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><Clock className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Duration</span></div><div className="font-bold text-gray-900">{config.quickFacts.duration}</div></div>
              <div className="col-span-2 md:col-span-1"><div className="flex items-center justify-center gap-1.5 text-primary mb-1"><Users className="h-4 w-4" /><span className="text-xs font-medium uppercase tracking-wide">Best For</span></div><div className="font-bold text-gray-900 text-sm">{config.quickFacts.bestFor}</div></div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-20 md:h-16" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6"><ol className="flex items-center gap-2 text-sm text-gray-600"><li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li><li>/</li><li className="text-primary font-medium">{config.title}</li></ol></nav>
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">{config.intro}</p>
        </div>
      </div>
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4"><Map className="h-4 w-4" />Explore by Region</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Where to Go {config.name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.regions.map((region) => {
              // Launch gate: only link to combo pages that are live; fall back to
              // the region landing page, or render unlinked if the region isn't launched.
              const href = isLaunchCombo(region.slug, config.slug)
                ? `/${region.slug}/${config.slug}`
                : isLaunchRegion(region.slug)
                  ? `/${region.slug}`
                  : null;
              const cardBody = (
                <>
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-hover transition-colors">{region.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 italic">{region.tagline}</p>
                  <div className="space-y-2 mb-4">{region.highlights.map((h, i) => (<div key={i} className="flex items-start gap-2 text-sm text-gray-700"><Star className="h-4 w-4 text-accent-hover flex-shrink-0 mt-0.5" /><span>{h}</span></div>))}</div>
                </>
              );
              return href ? (
                <Link key={region.slug} href={href} className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-1">
                  {cardBody}
                  <div className="flex items-center gap-2 text-accent-hover font-semibold group-hover:gap-3 transition-all">Explore <ArrowRight className="h-4 w-4" /></div>
                </Link>
              ) : (
                <div key={region.slug} className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200">
                  {cardBody}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {mapMarkers.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{config.mapHeading}</h2></div>
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200"><RegionMap markers={mapMarkers} center={[52.0, -4.0]} zoom={7} height="500px" /></div>
          </div>
        </section>
      )}
      {activitiesData.length > 0 && (
        <section id="experiences" className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{config.experiencesHeading}</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activitiesData.map((row) => (<ActivityCard key={row.activity.id} activity={row.activity} region={row.region} operator={row.operator} activityType={activityType} />))}
            </div>
            <div className="text-center mt-8"><Link href={`/activities/type/${config.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors font-semibold">{config.viewAllLabel ?? "View all experiences"} <ArrowRight className="h-5 w-5" /></Link></div>
          </div>
        </section>
      )}
      {config.showItinerariesSection && relatedItineraries.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12"><div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4"><Compass className="h-4 w-4" />Trip Ideas</div><h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{config.name} Trip Itineraries</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItineraries.map((row) => (<Link key={row.itinerary.id} href={`/itineraries/${row.itinerary.slug}`} className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary transition-all"><div className="text-sm text-accent-hover font-semibold mb-2">{row.itinerary.durationDays} days</div><h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent-hover transition-colors">{row.itinerary.title}</h3></Link>))}
            </div>
          </div>
        </section>
      )}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10"><div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4"><Sparkles className="h-4 w-4" />Related Adventures</div><h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Combine {config.name} With...</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.relatedActivities.map((activity) => (<Link key={activity.slug} href={`/${activity.slug}`} className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-accent-hover transition-all text-center"><div className="text-4xl mb-3">{activity.emoji}</div><h3 className="font-bold text-primary group-hover:text-accent-hover mb-2">{activity.name}</h3></Link>))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4"><MessageCircle className="h-4 w-4" />Common Questions</div><h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2></div>
          <div className="space-y-4">
            {config.faqs.map((faq, i) => (<details key={i} className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden"><summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"><h3 className="text-lg font-semibold text-primary pr-4">{faq.question}</h3><ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" /></summary><div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">{faq.answer}</div></details>))}
          </div>
        </div>
      </section>
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{config.ctaHeading}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{config.ctaSubtext}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Some hub slugs (e.g. bouldering, paragliding, rock-climbing) aren't DB activity
                types, so /activities/type/<slug> would 404 — fall back to /activities. */}
            <Link href={activityType ? `/activities/type/${config.slug}` : "/activities"} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-colors">{config.ctaButtonLabel} <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
