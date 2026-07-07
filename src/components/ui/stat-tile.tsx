import * as React from "react"

import { cn } from "@/lib/utils"

export interface StatTileProps {
  /** Muted label describing the metric. */
  label: string
  /** The value — string or number (rendered with tabular-nums). */
  value: React.ReactNode
  /** Optional leading icon. */
  icon?: React.ReactNode
  className?: string
}

/**
 * StatTile — a single bordered metric tile.
 * label (muted, sm) + value (2xl bold teal, tabular-nums) + optional icon.
 */
export function StatTile({ label, value, icon, className }: StatTileProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-white p-5",
        className
      )}
    >
      {icon && <div className="text-accent-strong shrink-0">{icon}</div>}
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold tabular-nums text-primary">{value}</p>
      </div>
    </div>
  )
}
