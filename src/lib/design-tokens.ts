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

// Difficulty level colors
export const difficultyColors = {
  easy: '#10b981',
  moderate: '#f59e0b',
  difficult: '#ef4444',
  advanced: '#dc2626',
}

// Region colors (optional - for future region-specific theming)
export const regionColors = {
  snowdonia: '#1e3a4c',
  pembrokeshire: '#0ea5e9',
  breconBeacons: '#84cc16',
  gower: '#f97316',
}
