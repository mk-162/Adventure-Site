import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  getOperatorWithActivities,
  getOperators,
  getAllActivityTypes
} from "@/lib/queries";
import { ActivityCard } from "@/components/cards/activity-card";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ClaimListingBanner } from "@/components/operators/ClaimListingBanner";
import { ShareButton } from "@/components/ui/ShareButton";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { 
  ChevronRight, 
  MapPin, 
  Star, 
  Globe, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  Shield,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Heart,
  Share2,
  ExternalLink,
  ArrowRight,
  Verified
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
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
    formatted.push({ icon: "users", label: "Local Experts" });
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

export default async function OperatorProfilePage({ params }: Props) {
  const { slug } = await params;
  const data = await getOperatorWithActivities(slug);

  if (!data) {
    notFound();
  }

  const operator = data;
  const activities = data.activities || [];
  const trustSignals = formatTrustSignals(operator.trustSignals);

  // Get activity types for this operator's activities
  const activityTypes = await getAllActivityTypes();

  // Get related operators in the same region
  const primaryRegion = operator.regions && operator.regions.length > 0 ? operator.regions[0] : null;
  let relatedOperators: Awaited<ReturnType<typeof getOperators>> = [];
  if (primaryRegion) {
    const allOps = await getOperators({ limit: 50 });
    relatedOperators = allOps
      .filter(op => op.id !== operator.id && op.regions && op.regions.includes(primaryRegion))
      .slice(0, 4);
  }
  // Format region slug to display name
  const regionDisplayName = primaryRegion
    ? primaryRegion.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
    : null;

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      {/* Verification Banner — only for claimed (non-premium) operators.
           Premium operators already have a prominent VerifiedBadge next to their name. */}
      {operator.claimStatus === "claimed" && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-[#1e3a4c] font-semibold">
                Independently verified by Adventure Wales
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero / Cover Image */}
      <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden lg:mx-auto lg:max-w-7xl lg:mt-6 lg:rounded-2xl lg:px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center lg:rounded-2xl"
          style={{ 
            backgroundImage: operator.coverImage 
              ? `url('${operator.coverImage}')` 
              : `url('/images/activities/hiking-hero.jpg')` 
          }}
        />

        {/* Cover Actions (desktop) */}
        <div className="absolute top-4 right-4 lg:right-8 z-20 hidden lg:flex gap-2">
          <FavoriteButton
            itemId={operator.id}
            itemType="operator"
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
        {/* Profile Header */}
        <div className="relative -mt-16 sm:-mt-20 z-20 mb-6">
          <div className="flex flex-col items-center lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6">
            {/* Logo + Info */}
            <div className="flex flex-col items-center lg:flex-row lg:items-end gap-4 lg:gap-6">
              {/* Logo */}
              {operator.logoUrl && (
                <div className="h-28 w-28 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                  <img 
                    src={operator.logoUrl} 
                    alt={operator.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left pb-2 lg:pb-4">
                <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e3a4c] leading-tight">
                    {operator.name}
                  </h1>
                  <VerifiedBadge claimStatus={operator.claimStatus} size="lg" />
                </div>
                {operator.tagline && (
                  <p className="text-gray-500 text-sm sm:text-base mt-1">{operator.tagline}</p>
                )}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                  {operator.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#1e3a4c]" />
                      {operator.address.split(",")[0]}
                    </span>
                  )}
                  {operator.googleRating && (
                    <>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        <span className="font-semibold text-[#1e3a4c]">{operator.googleRating}</span>
                        {operator.reviewCount && <span>({operator.reviewCount} reviews)</span>}
                      </span>
                    </>
                  )}
                </div>
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
                className="flex h-8 items-center gap-2 rounded-full bg-gray-100 px-3 sm:px-4 border border-gray-200"
              >
                {getTrustIcon(signal.icon)}
                <span className="text-xs font-bold text-gray-700">{signal.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats (mobile/tablet) */}
        <div className="flex gap-3 pb-4 lg:hidden">
          <div className="flex-1 flex flex-col gap-1 rounded-xl p-4 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-[#1e3a4c]" />
              <span className="text-gray-500 text-sm font-medium">Activities</span>
            </div>
            <span className="text-xl font-bold text-[#1e3a4c]">{activities.length}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1 rounded-xl p-4 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-500 text-sm font-medium">Rating</span>
            </div>
            <span className="text-xl font-bold text-[#1e3a4c]">{operator.googleRating || "N/A"}</span>
          </div>
        </div>

        {/* Sticky Tabs */}
        <div className="sticky top-[64px] z-30 bg-slate-50 pt-2 pb-0 border-b border-gray-200 -mx-4 px-4 sm:mx-0 sm:px-0">
          <nav className="flex gap-6 lg:gap-8 overflow-x-auto no-scrollbar">
            <a className="border-b-2 border-[#1e3a4c] text-[#1e3a4c] font-bold text-sm pb-3 whitespace-nowrap" href="#experiences">
              Experiences
            </a>
            <a className="border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold text-sm pb-3 whitespace-nowrap transition-colors" href="#about">
              About
            </a>
            {Array.isArray(operator.serviceDetails) && (operator.serviceDetails as any[]).length > 0 && (
              <a className="border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold text-sm pb-3 whitespace-nowrap transition-colors" href="#services">
                Services
              </a>
            )}
            <a className="border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold text-sm pb-3 whitespace-nowrap transition-colors" href="#reviews">
              Reviews
            </a>
            <a className="border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold text-sm pb-3 whitespace-nowrap transition-colors" href="#contact">
              Contact
            </a>
          </nav>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-6">
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* About Section */}
            <section id="about">
              <h2 className="text-lg sm:text-xl font-bold text-[#1e3a4c] mb-4">
                About {operator.name}
              </h2>
              {operator.description ? (
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {operator.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {operator.name} is an adventure provider based in Wales, offering exciting outdoor experiences.
                </p>
              )}

              {/* Service Tags */}
              {operator.serviceTypes && operator.serviceTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {operator.serviceTypes.map((service, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1e3a4c]/10 border border-[#1e3a4c]/20 text-xs font-semibold text-[#1e3a4c]"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Claim Banner — inline for mobile (sidebar handles desktop) */}
            {operator.claimStatus !== "claimed" && operator.claimStatus !== "premium" && (
              <div className="lg:hidden">
                <ClaimListingBanner
                  operatorSlug={operator.slug}
                  operatorName={operator.name}
                  variant="inline"
                />
              </div>
            )}

            {/* Experiences Grid */}
            <section id="experiences">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#1e3a4c]">
                  Adventures & Experiences
                </h2>
                <span className="text-sm text-gray-500">{activities.length} available</span>
              </div>

              {activities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activities.map((item) => (
                    <ActivityCard
                      key={item.activity.id}
                      activity={item.activity}
                      region={item.region}
                      operator={item.operator}
                      activityType={item.activityType}
                      hideOperator={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No activities listed yet</p>
                  <p className="text-sm text-gray-400 mt-1">Check back soon or contact the provider directly</p>
                </div>
              )}
            </section>

            {/* Services & Pricing */}
            {Array.isArray(operator.serviceDetails) && (operator.serviceDetails as any[]).length > 0 && (
              <section id="services">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1e3a4c]">
                    Services & Pricing
                  </h2>
                  <span className="text-sm text-gray-500">{(operator.serviceDetails as any[]).length} services</span>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                  {(operator.serviceDetails as any[]).map((service: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#1e3a4c] text-sm">
                            {service.name}
                          </h3>
                          {service.category && (
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                              {service.category}
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{service.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          {service.duration && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {service.duration}
                            </span>
                          )}
                          {service.groupSize && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <Users className="w-3 h-3" />
                              {service.groupSize}
                            </span>
                          )}
                          {service.includes && (
                            <span className="text-xs text-gray-400">
                              Includes: {service.includes}
                            </span>
                          )}
                        </div>
                      </div>
                      {service.price && (
                        <span className="text-[#f97316] font-bold text-sm whitespace-nowrap sm:text-right">
                          {service.price}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section id="reviews" className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">
                <div className="flex flex-col items-center justify-center min-w-[140px]">
                  <span className="text-4xl sm:text-5xl font-black text-[#1e3a4c]">
                    {operator.googleRating || "N/A"}
                  </span>
                  {operator.googleRating && (
                    <div className="flex text-yellow-500 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.round(parseFloat(operator.googleRating || "0")) ? "fill-yellow-500" : "fill-gray-200 text-gray-200"}`} 
                        />
                      ))}
                    </div>
                  )}
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
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
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700">View on TripAdvisor</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  {operator.website && (
                    <a 
                      href={operator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700">Visit Website</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Contact Section (mobile) */}
            <section id="contact" className="lg:hidden bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="font-bold text-[#1e3a4c] mb-4">Contact Information</h3>
              
              {/* Prominent Visit Website button */}
              {operator.website && (
                <a 
                  href={operator.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-[#1e3a4c] hover:bg-[#1e3a4c]/90 text-white font-bold rounded-xl transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <div className="space-y-3">
                {operator.phone && (
                  <a href={`tel:${operator.phone}`} className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-[#1e3a4c]" />
                    <span>{operator.phone}</span>
                  </a>
                )}
                {operator.email && (
                  <a href={`mailto:${operator.email}?subject=${encodeURIComponent("Enquiry from Adventure Wales")}`} className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-[#1e3a4c]" />
                    <span>{operator.email}</span>
                  </a>
                )}
                {operator.address && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#1e3a4c] shrink-0 mt-0.5" />
                    <span>{operator.address}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column (desktop only) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            {/* Claim CTA - Only if not claimed */}
            {operator.claimStatus !== "claimed" && operator.claimStatus !== "premium" && (
              <ClaimListingBanner
                operatorSlug={operator.slug}
                operatorName={operator.name}
                variant="sidebar"
              />
            )}

            {/* Action CTA Card — Always visible */}
            <div className="bg-gradient-to-br from-[#f97316]/5 to-amber-50 rounded-xl border border-[#f97316]/20 p-6 shadow-lg shadow-[#f97316]/10">
              <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">
                {operator.bookingPlatform && operator.bookingPlatform !== "none"
                  ? (operator.bookingPlatform === "direct" ? "Book Direct" : "Book Online")
                  : "Get In Touch"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {operator.bookingPlatform === "beyonk" 
                  ? "Instant availability — book securely via Beyonk"
                  : operator.bookingPlatform === "rezdy"
                  ? "Check availability and book online via Rezdy"
                  : operator.bookingPlatform === "fareharbor"
                  ? "Check availability and book online via FareHarbor"
                  : operator.bookingPlatform === "direct"
                  ? "Book directly with the provider"
                  : "Contact them to check availability and book"}
              </p>

              <div className="flex flex-col gap-3">
                {/* Primary — Book or Visit Website */}
                <a
                  href={operator.bookingWidgetUrl || operator.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-[#f97316]/30"
                >
                  {operator.bookingPlatform === "beyonk" ? "Book via Beyonk" 
                    : operator.bookingPlatform === "rezdy" ? "Book via Rezdy"
                    : operator.bookingPlatform === "fareharbor" ? "Book via FareHarbor"
                    : operator.bookingPlatform === "direct" ? "Book Direct"
                    : "Visit Website"}
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Call button */}
                {operator.phone && (
                  <a
                    href={`tel:${operator.phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#1e3a4c] hover:bg-[#1e3a4c]/90 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call {operator.phone}
                  </a>
                )}

                {/* Website link (if booking button isn't already the website) */}
                {operator.bookingPlatform && operator.bookingPlatform !== "none" && operator.bookingPlatform !== "direct" && operator.website && (
                  <a
                    href={operator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-[#1e3a4c] hover:text-[#f97316] font-medium py-2 text-sm transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>

              {operator.bookingPlatform && operator.bookingPlatform !== "none" && operator.bookingPlatform !== "direct" && (
                <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
                  Powered by {operator.bookingPlatform.charAt(0).toUpperCase() + operator.bookingPlatform.slice(1)}
                </p>
              )}
            </div>

            {/* Quick Enquiry Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg shadow-gray-200/50 sticky top-[120px]">
              <h3 className="text-lg font-bold text-[#1e3a4c] mb-4">Quick Enquiry</h3>
              <form className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text"
                    className="w-full rounded-lg bg-gray-50 border-gray-200 text-sm focus:ring-[#1e3a4c] focus:border-[#1e3a4c] px-4 py-2.5"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    className="w-full rounded-lg bg-gray-50 border-gray-200 text-sm focus:ring-[#1e3a4c] focus:border-[#1e3a4c] px-4 py-2.5"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                  <textarea 
                    className="w-full rounded-lg bg-gray-50 border-gray-200 text-sm focus:ring-[#1e3a4c] focus:border-[#1e3a4c] resize-none px-4 py-2.5"
                    rows={3}
                    placeholder="I'm interested in..."
                  />
                </div>
                <button 
                  type="button"
                  className="w-full bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2"
                >
                  Send Enquiry
                </button>
                {operator.email && (
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Or email us directly:{" "}
                    <a 
                      href={`mailto:${operator.email}?subject=${encodeURIComponent("Enquiry from Adventure Wales")}`}
                      className="text-[#1e3a4c] hover:text-[#f97316] underline font-medium"
                    >
                      {operator.email}
                    </a>
                  </p>
                )}
                {!operator.email && (
                  <p className="text-xs text-center text-gray-400">
                    Or call {operator.phone || "directly"}
                  </p>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="text-sm font-bold text-[#1e3a4c] mb-3">Contact Details</h4>
              <ul className="space-y-3">
                {operator.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#1e3a4c]" />
                    <a href={`tel:${operator.phone}`} className="text-sm text-gray-600 hover:text-[#1e3a4c]">
                      {operator.phone}
                    </a>
                  </li>
                )}
                {operator.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#1e3a4c]" />
                    <a href={`mailto:${operator.email}?subject=${encodeURIComponent("Enquiry from Adventure Wales")}`} className="text-sm text-gray-600 hover:text-[#1e3a4c]">
                      {operator.email}
                    </a>
                  </li>
                )}
              </ul>

              {/* Prominent action buttons */}
              <div className="mt-4 space-y-2">
                {operator.website && (
                  <a 
                    href={operator.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1e3a4c] hover:bg-[#1e3a4c]/90 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {operator.email && (
                  <a 
                    href={`mailto:${operator.email}?subject=${encodeURIComponent("Enquiry from Adventure Wales")}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-[#1e3a4c] text-[#1e3a4c] font-semibold rounded-xl text-sm hover:bg-[#1e3a4c]/5 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email Directly
                  </a>
                )}
              </div>
            </div>

            {/* Location Map Placeholder */}
            {(operator.lat && operator.lng) && (
              <div className="rounded-xl overflow-hidden h-48 relative shadow-sm border border-gray-200 bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-[#1e3a4c] mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{operator.address?.split(",")[0]}</p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* More Providers in Region */}
        {primaryRegion && relatedOperators.length > 0 && (
          <section className="mt-10 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#1e3a4c]">
                More providers in {regionDisplayName}
              </h2>
              <Link
                href={`/directory?region=${primaryRegion}`}
                className="text-sm text-[#f97316] hover:text-[#ea580c] font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedOperators.map((relOp) => (
                <Link
                  key={relOp.id}
                  href={`/directory/${relOp.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {relOp.logoUrl ? (
                      <img src={relOp.logoUrl} alt={relOp.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#1e3a4c]/10 flex items-center justify-center text-[#1e3a4c] font-bold text-sm">
                        {relOp.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#1e3a4c] text-sm truncate group-hover:text-[#f97316] transition-colors">
                        {relOp.name}
                      </h3>
                      {relOp.googleRating && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {relOp.googleRating}
                        </span>
                      )}
                    </div>
                  </div>
                  {relOp.tagline && (
                    <p className="text-xs text-gray-500 line-clamp-2">{relOp.tagline}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Bar (mobile only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            {/* Primary CTA — Book or Enquire */}
            {operator.bookingPlatform && operator.bookingPlatform !== "none" ? (
              <a 
                href={operator.bookingWidgetUrl || operator.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#f97316] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#f97316]/30 hover:bg-[#f97316]/90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {operator.bookingPlatform === "beyonk" ? "Book via Beyonk" 
                  : operator.bookingPlatform === "direct" ? "Book Direct"
                  : "Book Now"}
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <a 
                href={operator.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#f97316] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#f97316]/30 hover:bg-[#f97316]/90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Enquire
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Call button */}
            {operator.phone && (
              <a
                href={`tel:${operator.phone}`}
                className="bg-[#1e3a4c] text-white p-3 rounded-xl hover:bg-[#1e3a4c]/90 transition-all active:scale-95"
                aria-label={`Call ${operator.name}`}
              >
                <Phone className="w-5 h-5" />
              </a>
            )}

            {/* Website button */}
            {operator.website && (
              <a
                href={operator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 text-[#1e3a4c] p-3 rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                aria-label={`Visit ${operator.name} website`}
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all operators
export async function generateStaticParams() {
  const operators = await getOperators({ limit: 100 });
  
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

  return {
    title: `${operator.name} | Adventure Wales`,
    description: operator.tagline || operator.description?.slice(0, 160) || `${operator.name} - Adventure provider in Wales`,
  };
}
