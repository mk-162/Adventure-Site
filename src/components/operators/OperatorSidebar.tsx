import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import MapView from "@/components/ui/MapView";
import { ClaimListingBanner } from "@/components/operators/ClaimListingBanner";

export interface OperatorSidebarData {
  slug: string;
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  bookingPlatform: string | null;
  bookingWidgetUrl: string | null;
  address: string | null;
  lat: unknown;
  lng: unknown;
  claimStatus: "stub" | "claimed" | "premium";
}

function primaryCtaLabel(bookingPlatform: string | null, hasBookingWidget: boolean): string {
  if (!hasBookingWidget) return "Visit Website";
  switch (bookingPlatform) {
    case "beyonk":
      return "Book via Beyonk";
    case "rezdy":
      return "Book via Rezdy";
    case "fareharbor":
      return "Book via FareHarbor";
    case "direct":
      return "Book Direct";
    default:
      return "Book Now";
  }
}

function primaryCtaDescription(
  bookingPlatform: string | null,
  hasBookingWidget: boolean,
  hasWebsite: boolean
): string {
  if (hasBookingWidget) {
    switch (bookingPlatform) {
      case "beyonk":
        return "Instant availability — book securely via Beyonk.";
      case "rezdy":
        return "Check availability and book online via Rezdy.";
      case "fareharbor":
        return "Check availability and book online via FareHarbor.";
      case "direct":
        return "Book directly with the provider.";
      default:
        return "Check availability and book online.";
    }
  }
  return hasWebsite
    ? "Visit their website to check availability and book."
    : "Contact them directly to check availability and book.";
}

/**
 * OperatorSidebar — the single sidebar recipe for the operator profile page.
 * Rendered once for the mobile stacked layout and once for the sticky desktop
 * aside; replaces ~200 lines of copy-pasted mobile/desktop markup.
 *
 * Exactly two panels: ONE booking/primary CTA, ONE contact panel (quiet
 * outline/ghost call + direct mailto — no fake enquiry form). The claim
 * banner is a separate, business-owner-facing concern and isn't counted
 * among the customer-facing CTAs.
 */
export function OperatorSidebar({
  operator,
  isPremium,
}: {
  operator: OperatorSidebarData;
  isPremium: boolean;
}) {
  const hasBookingWidget = Boolean(operator.bookingWidgetUrl);
  const primaryHref = operator.bookingWidgetUrl || operator.website;
  const hasContact = Boolean(operator.phone || operator.email);
  const hasLocation = Boolean(operator.lat && operator.lng);
  const showPoweredBy =
    hasBookingWidget &&
    Boolean(operator.bookingPlatform) &&
    operator.bookingPlatform !== "none" &&
    operator.bookingPlatform !== "direct";

  return (
    <div className="space-y-6">
      {operator.claimStatus !== "claimed" && !isPremium && (
        <ClaimListingBanner
          operatorSlug={operator.slug}
          operatorName={operator.name}
          variant="sidebar"
        />
      )}

      {/* Booking / primary CTA panel — exactly one action */}
      {primaryHref ? (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-bold text-primary">
            {hasBookingWidget ? "Book This Experience" : "Get In Touch"}
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            {primaryCtaDescription(operator.bookingPlatform, hasBookingWidget, Boolean(operator.website))}
          </p>
          <ButtonLink href={primaryHref} external variant="primary" size="lg" fullWidth>
            {primaryCtaLabel(operator.bookingPlatform, hasBookingWidget)}
            <ExternalLink className="size-4" />
          </ButtonLink>
          {showPoweredBy && (
            <p className="mt-3 text-center text-xs text-slate-400">
              Powered by{" "}
              {operator.bookingPlatform!.charAt(0).toUpperCase() + operator.bookingPlatform!.slice(1)}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-slate-500">Contact details for booking are coming soon.</p>
        </div>
      )}

      {/* Contact panel — quiet call + direct email, no fake form */}
      {(hasContact || operator.address || hasLocation) && (
        <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="p-5">
            <h4 className="mb-3 text-sm font-bold text-primary">Contact {operator.name}</h4>

            {hasContact && (
              <div className="flex flex-col gap-2">
                {operator.phone && (
                  <ButtonLink href={`tel:${operator.phone}`} external variant="outline" fullWidth>
                    <Phone className="size-4" />
                    Call {operator.phone}
                  </ButtonLink>
                )}
                {operator.email && (
                  <ButtonLink
                    href={`mailto:${operator.email}?subject=${encodeURIComponent("Enquiry from Adventure Wales")}`}
                    external
                    variant="ghost"
                    fullWidth
                  >
                    <Mail className="size-4" />
                    Email {operator.name}
                  </ButtonLink>
                )}
              </div>
            )}

            {operator.address && (
              <p className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {operator.address}
              </p>
            )}
          </div>

          {hasLocation && (
            <div className="border-t border-border">
              <MapView
                markers={[
                  {
                    id: `operator-${operator.slug}`,
                    lat: parseFloat(String(operator.lat)),
                    lng: parseFloat(String(operator.lng)),
                    type: "operator" as const,
                    title: operator.name,
                    subtitle: operator.address?.split(",")[0] || undefined,
                    link: `/directory/${operator.slug}`,
                  },
                ]}
                height="180px"
                zoom={13}
                interactive={false}
              />
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${operator.lat},${operator.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 text-center text-xs font-medium text-accent-strong transition-colors hover:bg-slate-50"
              >
                Get Directions →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
