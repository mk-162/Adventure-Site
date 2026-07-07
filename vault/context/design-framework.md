---
title: Design Framework
status: active
date: 2026-07-06
tags: [context, design, standards]
---

# Design Framework — Adventure Wales

The standard for all UI work. Full audit evidence: July 2026 design audit (token inventory,
component catalog, benchmark research — see session artifacts + `audits/`). Benchmarks:
TripAdvisor's universal card + whitespace-led separation, Airbnb's restraint (one accent,
photo-led depth), AllTrails' tiny semantic token set. Baymard travel-UX findings baked in.

## The prime bug (fix before all else)

`src/app/globals.css` has **two `@theme` blocks**: the brand block (line ~10) and a later
shadcn `@theme inline` block that **redefines** `--color-primary` (→ slate-blue, not teal)
and `--color-accent` (→ near-white gray, making `text-accent` content invisible). This is
why the codebase uses `accent-hover` (#c2410c) as its de-facto orange 800+ times.
Fix: remap shadcn's `:root` `--primary`/`--accent` to brand values (or namespace them),
restore `accent = #ea580c` / `accent-hover = #c2410c`, then sweep usages.

## Tokens (three layers: primitive → semantic → component; JSX uses semantic only)

**Color** — teal is ink, orange is scarce:
- `primary` #1e3a4c (11.9:1 on white, AAA) — headings, primary UI, footer
- `accent` #ea580c — LARGE display text, icons, hovers only (3.56:1 — fails AA for normal text)
- `accent-strong` #c2410c (5.18:1) — orange text/links, filled button + white label
- Neutrals: ONE family — **slate** (matches teal's hue bias): `foreground` slate-900,
  `muted-foreground` slate-500 (the only muted gray — kills gray-400/500/600/700 roulette),
  `border` slate-200, `surface` white, `surface-alt` slate-50. Migrate `gray-*` → slate.
- No raw hex in TSX (138 today, mostly typos of tokens); no raw palette classes for brand roles.
- Semantic status colors (difficulty, success/warn) from ONE map in `design-tokens.ts`.

**Type** — Plus Jakarta Sans (keep). 16px body (`text-base` — today's `text-sm` body is too
small), 1.25 scale: 16/20/25/31/39. Hierarchy by weight (500/600/700), not size sprawl;
retire `font-black`/`font-extrabold`. THREE h1 recipes only (hero / page / dashboard),
one h2 (`text-2xl sm:text-3xl font-bold text-primary`), one h3. Line-height 1.5 body.
Prose always `max-w-3xl` (~68ch) — never full-container-width text.

**Spacing** — 4px grid with a usage contract: 4/8 inside components, 16/24 between elements,
**48/64 between page sections** (96 hero). Section rhythm: `py-12 sm:py-16` standard,
`py-16 sm:py-24` landing. Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (already 107×
— make it a `<Container>` component). Card padding: p-5 minimum (today's p-3/p-4 is cramped).

**Shape & elevation** — one `--radius: 0.75rem` (12px): cards `rounded-xl`, buttons
`rounded-lg`, pills/chips/search `rounded-full`. Two elevation tiers ONLY: flat + 1px
border-border, or `shadow-sm` → `hover:shadow-md`. Depth from photography and whitespace,
not gradients — decorative panel gradients are banned (7 exist today with 3 hand-typed teals).

## Components (build once, adopt everywhere — "rule of 3")

1. **Button** — extend `ui/button.tsx` (primary=accent-strong, secondary=primary,
   outline, ghost; sizes sm/md/lg). Replaces 209 ad-hoc recipes; brings `focus-visible`
   (2px ring, 2px offset) sitewide — currently zero outside ui/.
2. **Universal Card** (TripAdvisor's lesson) — locked 3:2 image, rounded-xl, p-5,
   title/meta/rating+count/"from £X"/ONE primary action. Price + rating are mandatory
   on listing cards. One star color (yellow). Replaces 9 card families.
3. **SectionHeader** — eyebrow (accent-strong, uppercase, tracked) + title + optional
   action link. Fixes the orange/teal eyebrow flip-flop and h2/h3 size inversion.
4. **StatTile, Badge (one difficulty color map), Breadcrumbs, EmptyState, EntityMiniCard**
   — each currently has 3–10 forks.

## Page rules

- Region page (flagship, densest): main column `gap-12 lg:gap-16`, sections get h2 +
  SectionHeader, sticky nav lists every section.
- Operator profile (money page): ONE primary CTA; collapse 5 sidebar panels to 2
  (booking + contact); de-duplicate the copy-pasted mobile/desktop sidebar (~200 lines).
- Detail pages answer Baymard's five above the fold: price, duration/times, meeting
  point + map, fitness/age requirements, cancellation policy.
- Mobile: sticky bottom CTA (price + action) on detail pages; touch targets ≥44px.
- **No fake affordances**: dead filter bars, no-op sorts/buttons/forms are removed or wired.
- Skeletons (matching real card dims), not spinners; animation behind `prefers-reduced-motion`.
- Kill the half-implemented dark mode (or ship a toggle — currently dead classes).
- Imagery: every card image must depict its subject; no image reused twice on one page
  (see [[image-sourcing]] — the audit found parrots for zip lines and one ridge photo ×3).

## Adoption path

1. Fix globals.css token collision + accent rename sweep (1 day, re-brands site correctly)
2. Button + SectionHeader + Card primitives; migrate homepage → region → combo →
   directory/operator in that order (traffic order)
3. Spacing/heading pass per template (region page first)
4. Delete dead UI + dark-mode remnants; extract inline page-file components
5. Imagery audit + replacement pass (biggest perceived-quality lever)

Full visual spec: the "AW Design Framework" artifact (July 2026).
