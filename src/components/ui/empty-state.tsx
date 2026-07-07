import * as React from "react"

import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  /** Optional icon rendered above the title. */
  icon?: React.ReactNode
  /** Title line. */
  title: string
  /** Optional supporting description. */
  description?: string
  /** Optional actions slot (e.g. a Button/ButtonLink). */
  actions?: React.ReactNode
  className?: string
}

/**
 * EmptyState — centered "nothing here" placeholder.
 * icon + title + description + optional actions. Muted, py-12, no gradients.
 */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-12 text-center",
        className
      )}
    >
      {icon && <div className="mb-4 text-slate-400 [&_svg]:size-10">{icon}</div>}
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-base text-slate-500">{description}</p>
      )}
      {actions && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
    </div>
  )
}
