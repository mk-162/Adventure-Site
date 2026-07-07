import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export interface UniversalCardProps {
  /** Image source for the locked 3:2 media slot. */
  image: string
  /** Accessible alt text — must describe the subject of the photo. */
  imageAlt: string
  /** Responsive sizes hint for next/image. */
  sizes?: string
  /** Card title (rendered as an <h3>-style heading). */
  title: string
  /** Optional href — when set the whole card title/media links here. */
  href?: string
  /** Optional pill rendered top-left over the image. */
  pill?: React.ReactNode
  /** Optional meta line under the title (e.g. location, activity type). */
  meta?: React.ReactNode
  /** Rating value 0–5. Omit / null to hide the rating row entirely (never fabricate). */
  rating?: number | null
  /** Review count shown next to the rating. */
  reviewCount?: number | null
  /** "from £X pp" price. Pass the numeric value; unit defaults to "pp". */
  priceFrom?: number | null
  priceUnit?: string
  /** Footer action slot (a Button/ButtonLink or link). */
  action?: React.ReactNode
  className?: string
}

/**
 * UniversalCard — the single listing-card primitive (TripAdvisor pattern).
 * Locked 3:2 image, optional pill, p-5 body, optional rating row, and a
 * border-t footer with "from £X" + one action slot.
 * rounded-xl, 1px border, shadow-sm → hover:shadow-md.
 */
export function UniversalCard({
  image,
  imageAlt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  title,
  href,
  pill,
  meta,
  rating,
  reviewCount,
  priceFrom,
  priceUnit = "pp",
  action,
  className,
}: UniversalCardProps) {
  const heading = href ? (
    <Link href={href} className="hover:text-accent-strong transition-colors">
      {title}
    </Link>
  ) : (
    title
  )

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Locked 3:2 image slot */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
        <Image src={image} alt={imageAlt} fill sizes={sizes} className="object-cover" />
        {pill && <div className="absolute left-3 top-3 z-10">{pill}</div>}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-primary leading-snug">{heading}</h3>

        {meta && <p className="mt-1 text-sm text-slate-500">{meta}</p>}

        {rating != null && (
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Star className="size-4 fill-yellow-500 text-yellow-500" />
            <span className="font-bold text-primary">{rating.toFixed(1)}</span>
            {reviewCount != null && (
              <span className="text-slate-500">({reviewCount} reviews)</span>
            )}
          </div>
        )}

        {/* Footer */}
        {(priceFrom != null || action) && (
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
            {priceFrom != null ? (
              <span className="text-sm text-slate-500">
                from{" "}
                <span className="text-base font-bold text-primary">£{priceFrom}</span> {priceUnit}
              </span>
            ) : (
              <span />
            )}
            {action}
          </div>
        )}
      </div>
    </div>
  )
}
