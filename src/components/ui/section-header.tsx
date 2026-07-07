import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  /** Small uppercase kicker above the title (accent-strong, tracked). */
  eyebrow?: string
  /** Section title, rendered as an <h2>. */
  title: string
  /** Optional supporting line under the title. */
  subtitle?: string
  /** Optional right-aligned action link. */
  action?: { label: string; href: string }
  /** Alignment of the eyebrow/title/subtitle block. */
  align?: "left" | "center"
  className?: string
}

/**
 * SectionHeader — the one section-heading recipe.
 * eyebrow (accent-strong, uppercase, tracked) + h2 title + optional subtitle,
 * with an optional right-aligned action link.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  const centered = align === "center"

  return (
    <div
      className={cn(
        "mb-6 gap-4 sm:mb-8",
        centered
          ? "flex flex-col items-center text-center"
          : "flex flex-col sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(centered && "flex flex-col items-center")}>
        {eyebrow && (
          <p className="text-[13px] font-bold uppercase tracking-wider text-accent-strong">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-2xl font-bold text-primary sm:text-3xl">{title}</h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-base text-slate-500">{subtitle}</p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-accent-strong hover:underline"
        >
          {action.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
