// Design token mapping for Adventure Wales brand
// Maps existing brand colors to shadcn theme system

export const colors = {
  primary: '#1e3a4c',      // Teal (Adventure Wales brand)
  primaryDark: '#152a38',
  primaryLight: '#2a5470',
  accent: '#ea580c',       // Orange (Adventure Wales accent)
  accentHover: '#c2410c',
  accentLight: 'rgba(234, 88, 12, 0.125)',
  background: '#ffffff',
  foreground: '#1e3a4c',
  muted: '#f1f5f9',
  border: '#e2e8f0',
}

// Activity type colors
export const activityColors = {
  hiking: '#10b981',
  surfing: '#3b82f6',
  climbing: '#ef4444',
  kayaking: '#06b6d4',
  coasteering: '#8b5cf6',
  mtb: '#f59e0b',
  default: colors.primary,
}

// Difficulty level colors (raw hex — kept for chart/map theming)
export const difficultyHexColors = {
  easy: '#10b981',
  moderate: '#f59e0b',
  difficult: '#ef4444',
  advanced: '#dc2626',
}

// Canonical difficulty badge colors (Tailwind class strings).
// Single source of truth merging the two divergent maps that previously
// lived in ui/badge.tsx and components/combo/ComboSpotCard.tsx.
// Keyed by the lowercased difficulty label; use getDifficultyColor() to resolve.
export const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  beginner: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  intermediate: 'bg-amber-100 text-amber-700',
  challenging: 'bg-orange-100 text-orange-700',
  hard: 'bg-orange-100 text-orange-700',
  difficult: 'bg-orange-100 text-orange-700',
  advanced: 'bg-red-100 text-red-700',
  expert: 'bg-red-100 text-red-700',
  extreme: 'bg-red-100 text-red-700',
}

// Neutral fallback for unknown difficulty labels (slate, per design framework).
export const DIFFICULTY_FALLBACK = 'bg-slate-100 text-slate-700'

export function getDifficultyColor(level?: string | null): string {
  if (!level) return DIFFICULTY_FALLBACK
  return difficultyColors[level.toLowerCase()] ?? DIFFICULTY_FALLBACK
}

// Region colors (optional - for future region-specific theming)
export const regionColors = {
  snowdonia: '#1e3a4c',
  pembrokeshire: '#0ea5e9',
  breconBeacons: '#84cc16',
  gower: '#f97316',
}
