import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { getEffectiveTier } from "@/lib/trial-utils";

interface Operator {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  googleRating: string | number | null;
  claimStatus: string | null;
  billingTier: string | null;
  trialTier: string | null;
  trialExpiresAt: Date | string | null;
}

interface TrustedPartnersProps {
  operators: Operator[];
}

/**
 * Trusted Partners — grid of operator tiles linking into the directory.
 * Extracted from page.tsx; uses next/link (was raw <a>, causing full page reloads).
 */
export function TrustedPartners({ operators }: TrustedPartnersProps) {
  if (operators.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="Trusted Partners"
          title="Adventure Providers We Recommend"
          subtitle="Vetted, insured, and reviewed by real adventurers across Wales."
          align="center"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {operators.map((op) => (
            <Link
              key={op.id}
              href={`/directory/${op.slug}`}
              className="group text-center rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
            >
              {op.logoUrl ? (
                <Image
                  src={op.logoUrl}
                  alt={op.name}
                  width={48}
                  height={48}
                  className="mx-auto mb-3 h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                  {op.name.charAt(0)}
                </div>
              )}
              <h3 className="line-clamp-1 text-sm font-semibold text-primary transition-colors group-hover:text-accent-strong">
                {op.name}
              </h3>
              {op.googleRating && (
                <div className="mt-1 flex items-center justify-center gap-1">
                  <span className="text-xs text-yellow-500">★</span>
                  <span className="text-xs text-slate-500">{op.googleRating}</span>
                </div>
              )}
              {getEffectiveTier({
                billingTier: op.billingTier,
                trialTier: op.trialTier,
                trialExpiresAt:
                  typeof op.trialExpiresAt === "string" ? new Date(op.trialExpiresAt) : op.trialExpiresAt,
              }) === "premium" && (
                <span
                  className="mt-2 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600"
                  aria-label="Sponsored listing"
                >
                  Sponsored
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/directory" className="text-sm font-bold text-accent-strong hover:underline">
            View all providers →
          </Link>
        </div>
      </div>
    </section>
  );
}
