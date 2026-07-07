import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getOperatorWithActivities,
  getOperators,
  getAllActivityTypes
} from "@/lib/queries";
import { UniversalCard } from "@/components/ui/universal-card";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { OperatorCard } from "@/components/cards/operator-card";
import { OperatorSidebar } from "@/components/operators/OperatorSidebar";
import { ShareButton } from "@/components/ui/ShareButton";
import { FavouriteButton } from "@/components/ui/FavouriteButton";
import { JsonLd, createLocalBusinessSchema, createBreadcrumbSchema } from "@/components/seo/JsonLd";
import { ViewTracker } from "@/components/ui/ViewTracker";
import { getEffectiveTier, isTrialActive } from "@/lib/trial-utils";
import { isLaunchCombo } from "@/lib/launch";
import {
  MapPin,
  Star,
  Globe,
  Phone,
  Clock,
  CheckCircle,
  Shield,
  Award,
  Users,
  Calendar,
  ExternalLink,
  ArrowRight,
  Verified
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatTrustSignals(signals: any): { icon: string; label: string }[] {
  if (!signals) return [];

  const formatted: { icon: string; label: string }[] = [];

  // Common trust signals
  if (signals.bcorp || signals.bCorp) {
    formatted.push({ icon: "verified", label: "B Corp" });
  }
  if (signals.aala || signals.AALA) {
    formatted.push({ icon: "shield", label: "AALA Licensed" });
  }
  if (signals.tripadvisor_excellent || signals.tripadvisorExcellent) {
    formatted.push({ icon: "award", label: "TripAdvisor Excellent" });
  }
  if (signals.established || signals.yearsExperience) {
    const years = signals.established || signals.yearsExperience;
    formatted.push({ icon: "history", label: `${years}+ Years` });
  }
  if (signals.localExperts) {
    formatted.push({ icon: "users", label: "Local Providers" });
  }

  return formatted;
}

function getTrustIcon(iconName: string) {
  switch (iconName) {
    case "verified": return <Verified className="w-4 h-4" />;
    case "shield": return <Shield className="w-4 h-4" />;
    case "award": return <Award className="w-4 h-4" />;
    case "history": return <Clock className="w-4 h-4" />;
    case "users": return <Users className="w-4 h-4" />;
    default: return <CheckCircle className="w-4 h-4" />;
  }
}

/** Google's multicolour "G" mark — official brand colours, not a design token. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/** Best-effort activity image: DB-provided hero images only, in scope-safe
 *  fallback order (activity → activity type → region → generic default).
 *  Never fabricates — just resolves to the most specific real photo available. */
function resolveActivityImage(
  activityType?: { heroImage?: string | null } | null,
  region?: { slug?: string | null; heroImage?: string | null } | null
): string {
  if (activityType?.heroImage) return activityType.heroImage;
  if (region?.slug) return `/images/regions/${region.slug}-hero.jpg`;
  if (region?.heroImage) return region.heroImage;
  return "/images/activities/hiking-hero.jpg";
}

const tabLinkClass =
  "border-b-2 border-transparent text-slate-500 hover:text-primary font-semibold text-sm pb-3 whitespace-nowrap transition-colors";

export default async function OperatorProfilePage({ params }: Props) {
  const { slug } = await params;
  const data = await getOperatorWithActivities(slug);

  if (!data) {
    notFound();
  }

  const operator = data;
  const activities = data.activities || [];
  const trustSignals = formatTrustSignals(operator.trustSignals);

  const effectiveTier = getEffectiveTier(operator as any);
  const isTrial = isTrialActive(operator as any);
  const isPremium = effectiveTier === "premium";

  // Get activity types for this operator's activities
  const activityTypes = await getAllActivityTypes();

  // Get related operators in the same region
  const primaryRegion = operator.regions && operator.regions.length > 0 ? operator.regions[0] : null;
  let relatedOperators: Awaited<ReturnType<typeof getOperators>>["operators"] = [];
  if (primaryRegion) {
    const { operators: allOps } = await getOperators({ limit: 50 });
    relatedOperators = allOps
      .filter(op => op.id !== operator.id && op.regions && op.regions.includes(primaryRegion))
      .slice(0, 4);
  }
  // Format region slug to display name
  const regionDisplayName = primaryRegion
    ? primaryRegion.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
    : null;

  // "Explore by activity" combo chips. operator.activityTypes values may be
  // display names ("Zip Lining") or slugs — resolve each against the real
  // activity_type rows, then only link combos inside the launch allowlist.
  const primaryRegionSlug = primaryRegion ? slugify(primaryRegion) : null;
  const launchComboTypes = primaryRegionSlug
    ? (operator.activityTypes ?? [])
        .map((raw: string) => {
          const rawSlug = slugify(raw);
          return activityTypes.find((at) => at.slug === rawSlug || slugify(at.name) === rawSlug);
        })
        .filter((at): at is (typeof activityTypes)[number] =>
          at !== undefined && isLaunchCombo(primaryRegionSlug, at.slug)
        )
        .filter((at, index, arr) => arr.findIndex((other) => other.slug === at.slug) === index)
    : [];

  const sidebarOperator = {
    slug: operator.slug,
    name: operator.name,
    phone: operator.phone,
    email: operator.email,
    website: operator.website,
    bookingPlatform: operator.bookingPlatform,
    bookingWidgetUrl: operator.bookingWidgetUrl,
    address: operator.address,
    lat: operator.lat,
    lng: operator.lng,
    claimStatus: operator.claimStatus,
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12 has-bottom-bar">
      {/* Structured Data */}
      <JsonLd data={createLocalBusinessSchema(operator)} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Directory", url: "/directory" },
        { name: operator.name, url: `/directory/${operator.slug}` },
      ])} />

      {/* Verification Banner — only for claimed (non-premium) operators.
           Premium operators already have a prominent VerifiedBadge next to their name. */}
      {operator.claimStatus === "claimed" && (
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-primary font-semibold">
                Independently verified by Adventure Wales
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hero / Cover Image */}
      <div className="relative w-full h-40 sm:h-52 lg:h-64 overflow-hidden lg:mx-auto lg:max-w-7xl lg:mt-6 lg:rounded-2xl lg:px-4">
        <Image
          src={operator.coverImage || '/images/activities/hiking-hero.jpg'}
          alt={`${operator.name} cover`}
          fill
          className="object-cover lg:rounded-2xl"
          priority
          sizes="(max-width: 1024px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

        {/* Cover Actions (desktop) */}
        <div className="absolute top-4 right-4 lg:right-8 z-20 hidden lg:flex gap-2">
          <FavouriteButton
            id={operator.id}
            type="operator"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            iconClassName="w-5 h-5"
          />
          <ShareButton
            title={operator.name}
            variant="icon-only"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white hover:text-white p-2 rounded-lg transition-colors"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Directory", href: "/directory" },
            { name: operator.name },
          ]}
          className="pt-4"
        />

        {/* Profile Header */}
        <div className="relative z-20 mb-6 mt-4">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-end lg:gap-6">
            {/* Logo — the only element that overlaps the hero image */}
            {operator.logoUrl && (
              <div className="-mt-14 sm:-mt-16 shrink-0 relative h-28 w-28 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5 overflow-hidden">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={operator.logoUrl}
                    alt={operator.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                </div>
              </div>
            )}

            {/* Info — always clear of the hero photo, name is never clipped */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-tight">
                  {operator.name}
                </h1>
                <VerifiedBadge claimStatus={effectiveTier as any} isTrial={isTrial} size="lg" />
              </div>
              {operator.tagline && (
                <p className="text-slate-500 text-sm sm:text-base mt-1">{operator.tagline}</p>
              )}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-sm text-slate-600 mt-2">
                {operator.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {operator.address.split(",")[0]}
                  </span>
                )}
                {operator.googleRating && (
                  <>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <GoogleIcon className="w-4 h-4" />
                      <span className="font-semibold text-primary">{operator.googleRating}</span>
                      {operator.reviewCount && <span>({operator.reviewCount} reviews)</span>}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        {trustSignals.length > 0 && (
          <div className="flex gap-2 sm:gap-3 pb-4 flex-wrap justify-center lg:justify-start">
            {trustSignals.map((signal, i) => (
              <div
                key={i}
                className="flex h-8 items-center gap-2 rounded-full bg-slate-100 px-3 sm:px-4 border border-border"
              >
                {getTrustIcon(signal.icon)}
                <span className="text-xs font-bold text-slate-700">{signal.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats (mobile/tablet) */}
        <div className="flex gap-3 pb-4 lg:hidden">
          <div className="flex-1 flex flex-col gap-1 rounded-xl p-4 bg-white border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-slate-500 text-sm font-medium">Activities</span>
            </div>
            <span className="text-xl font-bold text-primary">{activities.length}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1 rounded-xl p-4 bg-white border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-slate-500 text-sm font-medium">Rating</span>
            </div>
            <span className="text-xl font-bold text-primary">{operator.googleRating || "N/A"}</span>
          </div>
        </div>

        {/* Sticky Tabs — anchor links only; no fake "active" state without scroll-spy JS */}
        <div className="sticky top-[var(--header-height)] z-30 bg-slate-50 pt-2 pb-0 border-b border-border -mx-4 px-4 sm:mx-0 sm:px-0">
          <nav className="flex gap-6 lg:gap-8 overflow-x-auto no-scrollbar">
            <a className={tabLinkClass} href="#experiences">Experiences</a>
            <a className={tabLinkClass} href="#about">About</a>
            {Array.isArray(operator.serviceDetails) && (operator.serviceDetails as any[]).length > 0 && (
              <a className={tabLinkClass} href="#services">Services</a>
            )}
            <a className={tabLinkClass} href="#reviews">Reviews</a>
            <a className={tabLinkClass} href="#contact">Contact</a>
          </nav>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-10">
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* About Section */}
            <section id="about">
              <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">
                About {operator.name}
              </h2>
              {operator.description ? (
                <div className="text-slate-600 leading-relaxed space-y-4">
                  {operator.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 leading-relaxed">
                  {operator.name} is an adventure provider based in Wales, offering exciting outdoor experiences.
                </p>
              )}

              {/* Service Tags */}
              {operator.serviceTypes && operator.serviceTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {operator.serviceTypes.map((service, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Experiences Grid */}
            <section id="experiences">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-primary">
                  Adventures & Experiences
                </h2>
                <span className="text-sm text-slate-500">{activities.length} available</span>
              </div>

              {activities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activities.map((item) => {
                    const { activity, region, activityType } = item;
                    const isPassive = activityType?.slug === "attractions" || activityType?.slug === "sightseeing";

                    return (
                      <UniversalCard
                        key={activity.id}
                        image={resolveActivityImage(activityType, region)}
                        imageAlt={activity.name}
                        title={activity.name}
                        href={`/activities/${activity.slug}`}
                        pill={
                          !isPassive && activity.difficulty ? (
                            <DifficultyBadge level={activity.difficulty} />
                          ) : isPassive ? (
                            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                              {activityType?.slug === "attractions" ? "Attraction" : "Sightseeing"}
                            </Badge>
                          ) : undefined
                        }
                        meta={[activityType?.name, activity.duration].filter(Boolean).join(" · ") || undefined}
                        priceFrom={activity.priceFrom ? parseFloat(activity.priceFrom) : null}
                        priceUnit={isPassive ? "entry" : "pp"}
                        action={
                          <ButtonLink href={`/activities/${activity.slug}`} variant="outline" size="sm">
                            Details
                          </ButtonLink>
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<Calendar />}
                  title="No activities listed yet"
                  description="Check back soon, or contact the provider directly to ask about availability."
                  className="bg-slate-50 rounded-xl border border-border"
                />
              )}
            </section>

            {/* Services & Pricing */}
            {Array.isArray(operator.serviceDetails) && (operator.serviceDetails as any[]).length > 0 && (
              <section id="services">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-primary">
                    Services & Pricing
                  </h2>
                  <span className="text-sm text-slate-500">{(operator.serviceDetails as any[]).length} services</span>
                </div>
                <div className="bg-white rounded-xl border border-border divide-y divide-border">
                  {(operator.serviceDetails as any[]).map((service: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-primary text-sm">
                            {service.name}
                          </h3>
                          {service.category && (
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                              {service.category}
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{service.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          {service.duration && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {service.duration}
                            </span>
                          )}
                          {service.groupSize && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <Users className="w-3 h-3" />
                              {service.groupSize}
                            </span>
                          )}
                          {service.includes && (
                            <span className="text-xs text-slate-400">
                              Includes: {service.includes}
                            </span>
                          )}
                        </div>
                      </div>
                      {service.price && (
                        <span className="text-accent-strong font-bold text-sm whitespace-nowrap sm:text-right">
                          {service.price}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section id="reviews" className="bg-white rounded-xl p-5 sm:p-6 border border-border">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
                <div className="flex flex-col items-center justify-center min-w-[140px]">
                  <span className="text-4xl sm:text-5xl font-bold text-primary">
                    {operator.googleRating || "N/A"}
                  </span>
                  {operator.googleRating && (
                    <div className="flex text-yellow-500 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(parseFloat(operator.googleRating || "0")) ? "fill-yellow-500" : "fill-slate-200 text-slate-200"}`}
                        />
                      ))}
                    </div>
                  )}
                  <span className="text-sm text-slate-500 flex items-center gap-1.5">
                    <GoogleIcon className="w-4 h-4 shrink-0" />
                    {operator.reviewCount ? `Based on ${operator.reviewCount} Google Reviews` : "No reviews yet"}
                  </span>
                </div>

                {/* External Review Links */}
                <div className="flex-1 flex flex-col gap-3">
                  {operator.tripadvisorUrl && (
                    <a
                      href={operator.tripadvisorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700">View on TripAdvisor</span>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  )}
                  {operator.website && (
                    <a
                      href={operator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700">Visit Website</span>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Contact Section (mobile) — same sidebar recipe, no duplicate CTAs */}
            <section id="contact" className="lg:hidden">
              <OperatorSidebar operator={sidebarOperator} isPremium={isPremium} />
            </section>
          </div>

          {/* Sidebar Column (desktop) — the same OperatorSidebar, rendered once more
              for the sticky desktop rail. This is the single source of truth for
              both layouts; no copy-pasted mobile/desktop markup. */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-[calc(var(--header-height)+24px)]">
              <OperatorSidebar operator={sidebarOperator} isPremium={isPremium} />
            </div>
          </aside>
        </div>

        {/* More Providers in Region */}
        {primaryRegion && relatedOperators.length > 0 && (
          <section className="mt-10 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-primary">
                More providers in {regionDisplayName}
              </h2>
              <Link
                href={`/directory?region=${primaryRegion}`}
                className="text-sm text-accent-strong hover:underline font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedOperators.map((relOp) => (
                <OperatorCard key={relOp.id} operator={relOp} />
              ))}
            </div>
          </section>
        )}

        {/* Activity + Region combo links (SEO) — launch-gated, verified slugs only */}
        {primaryRegionSlug && launchComboTypes.length > 0 && (
          <section className="mt-8 mb-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
              Explore by activity in {regionDisplayName}
            </h2>
            <div className="flex flex-wrap gap-2">
              {launchComboTypes.map((type) => (
                <Link
                  key={type.slug}
                  href={`/${primaryRegionSlug}/${type.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-full text-sm font-medium text-primary hover:border-accent-strong hover:text-accent-strong transition-colors"
                >
                  {type.name} in {regionDisplayName}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Bar (mobile only) — one primary action + call; the
          website icon is only shown when it isn't already the primary target. */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-50">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            {/* Primary CTA — Book or Visit Website */}
            <ButtonLink
              href={operator.bookingWidgetUrl || operator.website || "#"}
              external
              variant="primary"
              fullWidth
              className="shadow-lg shadow-accent-strong/20"
            >
              {operator.bookingPlatform === "beyonk" ? "Book via Beyonk"
                : operator.bookingPlatform === "direct" ? "Book Direct"
                : operator.bookingWidgetUrl ? "Book Now"
                : "Visit Website"}
              <ExternalLink className="w-4 h-4" />
            </ButtonLink>

            {/* Call button */}
            {operator.phone && (
              <ButtonLink
                href={`tel:${operator.phone}`}
                external
                variant="secondary"
                size="icon"
                aria-label={`Call ${operator.name}`}
              >
                <Phone className="w-5 h-5" />
              </ButtonLink>
            )}

            {/* Website button — only when distinct from the primary CTA above */}
            {operator.website && operator.bookingWidgetUrl && operator.website !== operator.bookingWidgetUrl && (
              <ButtonLink
                href={operator.website}
                external
                variant="outline"
                size="icon"
                aria-label={`Visit ${operator.name} website`}
              >
                <Globe className="w-5 h-5" />
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
      <ViewTracker pageType="operator" pageSlug={operator.slug} operatorId={operator.id} />
    </div>
  );
}

// Generate static params for all operators
export async function generateStaticParams() {
  const { operators } = await getOperators({ limit: 100 });

  return operators.map(op => ({
    slug: op.slug
  }));
}

// Generate metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const operator = await getOperatorWithActivities(slug);

  if (!operator) {
    return { title: "Provider Not Found" };
  }

  const regionInfo = operator.regions?.length ? ` in ${operator.regions.slice(0, 2).join(" & ")}` : " in Wales";
  const ratingInfo = operator.googleRating ? ` Rated ${operator.googleRating}★` : "";
  const activityInfo = operator.activityTypes?.length
    ? ` offering ${operator.activityTypes.slice(0, 3).join(", ")}`
    : "";

  const title = `${operator.name} — Adventure Provider${regionInfo} | Adventure Wales`;
  const description = operator.tagline
    || operator.description?.slice(0, 150)
    || `${operator.name}${activityInfo}${regionInfo}.${ratingInfo} Book your Welsh adventure today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Adventure Wales",
    },
  };
}
