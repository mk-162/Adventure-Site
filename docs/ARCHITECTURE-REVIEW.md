# Architecture Review - Adventure Wales Multi-Site Platform

**Date:** February 5, 2025  
**Reviewer:** System Architecture Analysis  
**Current State:** Single-site (Adventure Wales)  
**Target State:** Multi-site platform (2-3 adventure tourism sites)

---

## Executive Summary

The Adventure Wales codebase is a **well-structured Next.js 16 application** with strong foundations in several areas:
- Clean component organization
- Modern RSC (React Server Components) data fetching
- Comprehensive database schema with `siteId` on all content tables
- Good separation of concerns (queries, components, pages)

**However**, the codebase has **ZERO multi-site implementation** despite the database schema being multi-tenant ready. The entire application is hardcoded to "Adventure Wales" with:
- No site context provider
- No middleware for site resolution
- No site filtering in queries
- Hardcoded brand references throughout the UI
- No theming system

**Estimated effort to multi-site readiness:** Medium-Large (2-3 weeks)

---

## A. Current Architecture Assessment

### 1. Folder Structure

```
src/
├── app/                    # Next.js 16 App Router (82 page components)
│   ├── [region]/          # Dynamic region routes
│   ├── activities/        # Activity pages
│   ├── itineraries/       # Itinerary pages
│   ├── admin/             # Admin CMS routes
│   ├── api/               # API routes (18 endpoints)
│   └── ...                # Various content pages
├── components/            # React components (62 files, ~940 lines in cards/)
│   ├── cards/            # Reusable card components (activity, itinerary, etc.)
│   ├── home/             # Homepage-specific components
│   ├── layout/           # Header, Footer
│   ├── ui/               # UI primitives (badges, buttons, maps)
│   └── ...
├── db/
│   ├── schema.ts         # Drizzle schema (~1500+ lines)
│   └── index.ts          # DB connection
├── lib/
│   ├── queries.ts        # Main query functions (~800+ lines)
│   ├── utils.ts          # Utilities
│   └── ...               # Domain-specific utilities
├── types/                # TypeScript types
└── middleware.ts         # Only handles admin auth, NOT site resolution
```

**✅ Clean:**
- Good separation of routes, components, queries
- Logical grouping by feature (activities, itineraries, regions)
- Reusable card components centralized
- Clear distinction between app routes and components

**❌ Issues:**
- No `lib/site-context.ts` or site provider
- No theme configuration or branding abstraction
- Middleware only handles admin auth, not multi-tenancy
- Config files (next.config.ts) have no site-specific settings

### 2. Component Reuse Patterns

**Card Components** (`src/components/cards/`):
- `activity-card.tsx` (188 lines)
- `itinerary-card.tsx`
- `accommodation-card.tsx`
- `region-card.tsx`
- `operator-card.tsx`
- `event-card.tsx`

**✅ Good:**
- Consistent card API with `variant` prop for different layouts
- Shared badge components (`DifficultyBadge`, `PriceBadge`, `VerifiedBadge`)
- All cards use similar hover/transition effects
- Props-driven, no hardcoded URLs

**⚠️ Issues:**
- Local image resolution logic in `activity-card.tsx` (lines 49-84) is duplicated concept across cards
- No shared `CardLayout` wrapper component (each card re-implements shadow/hover/rounded)
- Badge styling is consistent but could use a centralized design token system

### 3. Data Fetching Patterns

**Pattern: React Server Components (RSC) with direct DB queries**

Example from `src/app/page.tsx`:
```typescript
async function getHomePageData() {
  const [regionsData, activitiesData, ...] = await Promise.all([
    db.select().from(regions).where(eq(regions.status, "published")).limit(6),
    db.select().from(activities).where(eq(activities.status, "published")).limit(10),
    // ...
  ]);
  return { regions, activities, ... };
}

export default async function HomePage() {
  const data = await getHomePageData();
  return <div>...</div>;
}
```

**✅ Excellent:**
- Modern RSC pattern (async Server Components)
- Parallel queries with `Promise.all()`
- Type-safe with Drizzle ORM
- Direct DB access (no unnecessary API layer for SSR)
- Queries centralized in `src/lib/queries.ts` (reusable functions)

**❌ Critical Gap:**
```typescript
// src/lib/queries.ts - Line 26
export async function getAllRegions(siteId?: number) {
  const query = db
    .select()
    .from(regions)
    .where(eq(regions.status, "published"))  // ❌ NO siteId FILTER!
    .orderBy(asc(regions.name));
  return query;
}
```

**ALL queries accept `siteId?: number` but NEVER use it!** Every single query function in `queries.ts` has this pattern. This is a massive risk for multi-site deployment — all sites would see all content.

### 4. Styling Approach

- **Framework:** Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **No `tailwind.config.ts`** — relies on CSS-based config (Tailwind v4 style)
- **Colors:** Hardcoded throughout components
  - Primary: `#1e3a4c` (teal/slate)
  - Accent: `#f97316` (orange)
  - Used as inline values like `text-[#f97316]` everywhere

**✅ Clean:**
- Consistent spacing and sizing (16px base, rounded-2xl for cards)
- Good use of hover states and transitions
- Mobile-first responsive (flex/grid patterns)
- Semantic class names

**❌ Issues:**
- **Zero theming system** — colors are hardcoded hex values
- No CSS variables or theme tokens
- Brand color `#1e3a4c` appears in 20+ files
- No dark mode support (not required, but shows lack of theming foundation)
- Tailwind v4 config unclear (no visible config file)

### 5. What's Clean and Working Well

1. **Database Schema** (`src/db/schema.ts`):
   - Comprehensive and well-designed
   - Every table has `siteId` foreign key
   - Relations properly defined with Drizzle
   - Enums for consistent values (`statusEnum`, `operatorTypeEnum`, etc.)
   - Multi-region tagging via junction table (`activityRegions`)
   - Commercial features fully mapped (ads, sponsors, claims, billing)

2. **Query Architecture**:
   - Centralized in `src/lib/queries.ts`
   - Type-safe with Drizzle
   - Good use of SQL `status` filtering and ordering
   - Parallel query patterns with `Promise.all()`

3. **Component Organization**:
   - Logical grouping (cards, layout, home, ui)
   - Small, focused components
   - Props-driven, reusable

4. **Routing**:
   - Clean URL structure (`/[region]/things-to-do/[activity-type]`)
   - Dynamic routes using Next.js 16 conventions
   - Proper 404 handling with `not-found.tsx`

5. **SEO Infrastructure**:
   - JSON-LD schemas (`src/components/seo/JsonLd.tsx`)
   - Sitemap generation (`src/app/sitemap.ts`)
   - Proper metadata in layout files

### 6. What's Messy or Over-Engineered

1. **Image Resolution Logic** (activity-card.tsx lines 49-84):
   - 84 lines of slug-matching logic to find local images
   - Hardcoded `Set` of image names
   - Could be simplified with a convention or config file

2. **Duplicated Badge Components**:
   - `src/components/ui/badge.tsx` has multiple badge types
   - Each card imports badges individually
   - Could use a badge factory or compound component pattern

3. **Admin Routes** (`src/app/admin/`):
   - Basic CRUD but inconsistent patterns
   - Some forms are full page components, others inline
   - No shared form layout or validation library
   - Manual `fetch()` calls instead of React Query or SWR

4. **Query Functions Accept `siteId` But Don't Use It**:
   - Every function signature: `(siteId?: number)` → ignored
   - False sense of multi-site readiness
   - Dangerous: would return all sites' content

5. **Middleware** (`src/middleware.ts`):
   - Only handles admin auth (basic auth check)
   - **Does NOT resolve site from hostname**
   - **Does NOT inject site context into requests**
   - Missing the core multi-tenant logic

6. **Multiple "Featured" or "Get All" patterns**:
   - `getAllRegions()`, `getRegionBySlug()`, `getRegionWithStats()` 
   - Similar patterns for activities, operators, etc.
   - Some overlap — could consolidate with option flags

---

## B. Simplification Opportunities

### 1. Card Component Abstraction

**Current:** Each card component re-implements:
- `rounded-2xl overflow-hidden shadow-sm hover:shadow-xl`
- `group` + hover transforms
- Image gradient overlays

**Proposal:** Create `<CardBase>` wrapper:
```tsx
// src/components/ui/CardBase.tsx
export function CardBase({ 
  href, 
  variant = "vertical",
  children,
  hoverEffect = "lift" 
}: CardBaseProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300",
        hoverEffect === "lift" && "hover:-translate-y-1"
      )}
    >
      {children}
    </Link>
  );
}
```

**Effort:** Small (1-2 hours)  
**Impact:** High — reduces duplication, easier theming later

### 2. Image Resolution Service

**Current:** `activity-card.tsx` has 84 lines of slug matching.

**Proposal:** Extract to `src/lib/image-resolver.ts`:
```typescript
export const imageRegistry = {
  activities: {
    archery: "/images/activities/archery-hero.jpg",
    caving: "/images/activities/caving-hero.jpg",
    // ...
  },
  fallback: "/images/activities/hiking-hero.jpg"
};

export function getActivityImage(slug: string, type?: string): string {
  // Match logic here
}
```

**Effort:** Small (1 hour)  
**Impact:** Medium — cleaner, testable, reusable

### 3. Consolidate Query Functions

**Current:** Similar patterns repeated:
- `getActivities()`, `getActivityBySlug()`, `getActivitiesByRegion()`, `getActivitiesByType()`

**Proposal:** Use a query builder pattern:
```typescript
export async function queryActivities(options: {
  siteId: number;
  regionId?: number;
  activityTypeId?: number;
  slug?: string;
  limit?: number;
  status?: string;
}) {
  let query = db.select()...;
  if (options.regionId) query = query.where(eq(...));
  if (options.slug) query = query.where(eq(...));
  // etc.
  return query;
}
```

**Effort:** Medium (4-6 hours to refactor safely)  
**Impact:** High — DRYer, easier to maintain, consistent filtering

### 4. Unified Badge Component

**Current:** `badge.tsx` exports multiple named exports:
- `Badge`, `DifficultyBadge`, `PriceBadge`, `VerifiedBadge`

**Proposal:** Use compound component pattern:
```tsx
<Badge variant="difficulty" level="moderate" />
<Badge variant="price" from={50} to={100} />
<Badge variant="verified" status="premium" />
```

**Effort:** Small (2 hours)  
**Impact:** Medium — cleaner imports, easier to style globally

### 5. Shared Form Components for Admin

**Current:** Each admin CRUD page has inline form JSX with manual state.

**Proposal:** Create `<AdminForm>` with field components:
```tsx
<AdminForm onSubmit={handleSubmit}>
  <FormField name="name" label="Name" required />
  <FormField name="description" type="textarea" />
  <FormImageUpload name="heroImage" />
  <FormSubmit />
</AdminForm>
```

**Effort:** Medium (6-8 hours to build + migrate)  
**Impact:** High — consistent validation, better UX, less code

### 6. Centralize Hardcoded Config

**Current:** Repeated throughout:
- Logo URLs
- Social links
- Contact emails
- Footer links

**Proposal:** Create `src/config/site.ts`:
```typescript
export const siteConfig = {
  name: "Adventure Wales",
  tagline: "Your Welsh Adventure Starts Here",
  logo: "/logo.svg",
  social: {
    twitter: "https://...",
    // ...
  },
  navigation: [...],
};
```

**Effort:** Small (2 hours)  
**Impact:** High — single source of truth, easier to change

---

## C. Multi-Site Readiness

### Current State: **NOT MULTI-SITE READY**

Despite the database schema having `siteId` on every table, **ZERO multi-site logic exists** in the application layer.

### Critical Gaps

#### 1. No Site Resolution (Middleware)

**File:** `src/middleware.ts`

**Current:** Only handles admin auth  
**Required:** Extract site from hostname and inject into request context

**Proposal:**
```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_MAP: Record<string, number> = {
  "adventurewales.com": 1,
  "localhost:3000": 1, // dev
  "adventurewestcountry.com": 2,
  "adventurescotland.com": 3,
};

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "localhost:3000";
  const siteId = SITE_MAP[hostname] || 1;

  // Inject site context into headers for Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-id", siteId.toString());

  // Admin auth check...
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // existing admin logic
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

**Effort:** Small (1 hour)  
**Risk:** Low

#### 2. No siteId Filtering in Queries

**File:** `src/lib/queries.ts` (800+ lines)

**Current:** Every query function signature accepts `siteId?: number` but **never uses it**.

**Example (Line 26):**
```typescript
export async function getAllRegions(siteId?: number) {
  const query = db
    .select()
    .from(regions)
    .where(eq(regions.status, "published"))  // ❌ Missing: && eq(regions.siteId, siteId)
    .orderBy(asc(regions.name));
  return query;
}
```

**Required:** Add `siteId` filtering to EVERY query function.

**Safe refactor strategy:**
1. Make `siteId` required (not optional): `(siteId: number)`
2. Add `.where(eq(tableName.siteId, siteId))` to every query
3. Update all call sites to pass `siteId`
4. TypeScript will catch any missed calls

**Effort:** Medium (6-8 hours to update 40+ functions safely)  
**Risk:** High if done incorrectly (data leaks between sites)

#### 3. No Site Context Provider

**Missing:** `src/lib/site-context.tsx`

**Required:** React Context to provide site config to components.

**Proposal:**
```tsx
// src/lib/site-context.tsx
"use client";

import { createContext, useContext } from "react";

interface SiteConfig {
  id: number;
  domain: string;
  name: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
}

const SiteContext = createContext<SiteConfig | null>(null);

export function SiteProvider({ 
  site, 
  children 
}: { 
  site: SiteConfig; 
  children: React.ReactNode 
}) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used within SiteProvider");
  return site;
}
```

**Usage in root layout:**
```tsx
// src/app/layout.tsx
import { getSiteByDomain } from "@/lib/queries";
import { SiteProvider } from "@/lib/site-context";

export default async function RootLayout({ children }) {
  const hostname = headers().get("host") || "localhost:3000";
  const site = await getSiteByDomain(hostname);
  
  return (
    <html>
      <body>
        <SiteProvider site={site}>
          <Header />
          {children}
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
```

**Effort:** Medium (3-4 hours including migration)  
**Risk:** Low

#### 4. Hardcoded Brand References

**Locations:** Found in 15+ files

**Examples:**
- `src/app/layout.tsx`: `"Adventure Wales | Honest Guide..."` (title, og:title)
- `src/components/layout/header.tsx`: `"Adventure Wales"` logo text
- `src/components/layout/footer.tsx`: `"© 2025 Adventure Wales"`
- `src/components/home/hero-section.tsx`: `"Adventure Wales"` badge, `"Wales. Properly Wild."`

**Required:** Replace with dynamic values from site context.

**Example fix:**
```tsx
// Before
<span className="font-bold">Adventure Wales</span>

// After
import { useSite } from "@/lib/site-context";

const { name } = useSite();
<span className="font-bold">{name}</span>
```

**Effort:** Medium (4-6 hours to find/replace all instances)  
**Risk:** Low (TypeScript + search/replace)

#### 5. Hardcoded Colors

**Locations:** 30+ files with inline Tailwind colors

**Examples:**
- `text-[#1e3a4c]` (primary color) → used in 20+ files
- `bg-[#f97316]` (accent color) → used in 15+ files
- `hover:bg-[#f97316]/90` (hover states)

**Required:** Theme system using CSS variables or Tailwind config.

**Proposal (CSS Variables):**
```css
/* src/app/globals.css */
:root {
  --color-primary: 30 58 76; /* #1e3a4c as RGB */
  --color-accent: 249 115 22; /* #f97316 as RGB */
}

[data-site="adventure-wales"] {
  --color-primary: 30 58 76;
  --color-accent: 249 115 22;
}

[data-site="adventure-west-country"] {
  --color-primary: 45 78 95;
  --color-accent: 234 88 12;
}
```

**Usage:**
```tsx
// Before
<button className="bg-[#f97316] hover:bg-[#f97316]/90">

// After
<button className="bg-accent hover:bg-accent/90">
```

**Effort:** Large (8-10 hours to update all color references)  
**Risk:** Medium (visual regressions possible)

#### 6. Site-Specific Content Filtering

**Current:** Homepage, region pages, activity pages show ALL content from DB.

**Required:** Every page must filter by `siteId`.

**Example fix for homepage:**
```tsx
// src/app/page.tsx - Before
const data = await getHomePageData();

// After
import { headers } from "next/headers";

const siteId = parseInt(headers().get("x-site-id") || "1");
const data = await getHomePageData(siteId);
```

**Effort:** Medium (5-6 hours to update all pages)  
**Risk:** High (missing a page = data leak)

#### 7. Domain Routing Setup

**Required:** Environment config for domain → site mapping.

**Proposal:**
```env
# .env
SITE_1_DOMAIN=adventurewales.com
SITE_2_DOMAIN=adventurewestcountry.com
SITE_3_DOMAIN=adventurescotland.com
```

**Vercel deployment:**
- Add custom domains in Vercel dashboard
- Each domain points to same deployment
- Middleware resolves correct site

**Effort:** Small (1 hour + DNS config)  
**Risk:** Low

### 8. Image/Asset Management Per Site

**Current:** All images in `/public/images/`

**Challenge:** Sites will have different hero images, logos, region photos.

**Proposal:**
```
/public/
├── images/
│   ├── shared/          # Generic activity images (reusable)
│   ├── wales/           # Adventure Wales assets
│   │   ├── logo.svg
│   │   ├── hero/
│   │   └── regions/
│   ├── west-country/    # Adventure West Country assets
│   └── scotland/        # Adventure Scotland assets
```

**Effort:** Medium (3-4 hours to reorganize + update paths)  
**Risk:** Low

### 9. SEO Per Site (Sitemaps, Metadata)

**Current:** 
- `src/app/sitemap.ts` generates single sitemap
- `src/app/layout.tsx` has hardcoded metadata

**Required:**
- Multi-site sitemaps (one per domain)
- Dynamic metadata based on site context

**Example:**
```typescript
// src/app/sitemap.ts
import { headers } from "next/headers";
import { getSiteByDomain } from "@/lib/queries";

export default async function sitemap() {
  const hostname = headers().get("host") || "";
  const site = await getSiteByDomain(hostname);
  
  // Generate sitemap filtered by site.id
  const regions = await getAllRegions(site.id);
  // ...
  
  return [{
    url: `https://${site.domain}`,
    // ...
  }];
}
```

**Effort:** Medium (4 hours)  
**Risk:** Low

### 10. Shared vs Site-Specific Components

**Decision needed:** Which components are shared?

**Recommendation:**
- **Shared (reusable across sites):**
  - Card components (activity, itinerary, etc.)
  - UI primitives (badges, buttons)
  - Maps (Leaflet integration)
  - Admin CMS components

- **Site-specific (customizable per site):**
  - Hero section wording/imagery
  - Footer content/links
  - "About" page content
  - Newsletter copy

**Implementation:**
- Keep shared components in `src/components/`
- Create `src/content/[site-slug]/` for site-specific text/config
- Use site context to load correct content

**Effort:** Medium (varies by component)  
**Risk:** Low

---

## D. Performance Observations

### 1. Large Components That Could Be Split

**Finding:** `src/components/home/hero-section.tsx` (150+ lines)

- Handles image carousel logic
- Renders stats
- Mixed concerns: data + presentation

**Recommendation:** Extract carousel logic to `useImageCarousel()` hook.

**Effort:** Small (1 hour)  
**Impact:** Medium (better maintainability)

### 2. Missing Loading States

**Finding:** Most pages fetch data in Server Components with no fallback.

**Issue:** Users see blank screen during SSR delay (especially on cold starts).

**Recommendation:** Use `loading.tsx` files:
```tsx
// src/app/itineraries/loading.tsx
export default function Loading() {
  return <SkeletonItineraryList />;
}
```

**Effort:** Small (2-3 hours to add to key pages)  
**Impact:** High (perceived performance improvement)

### 3. Missing Suspense Boundaries

**Finding:** No `<Suspense>` boundaries for non-critical content.

**Example:** Homepage loads 6 data sources in parallel, but all-or-nothing.

**Recommendation:** Wrap non-critical sections:
```tsx
<Suspense fallback={<NewsletterSkeleton />}>
  <Newsletter />
</Suspense>
```

**Effort:** Medium (3-4 hours)  
**Impact:** High (progressive rendering, faster TTI)

### 4. Image Optimization

**Finding:** Images use `backgroundImage` CSS (not Next.js `<Image>`).

**Issue:** No lazy loading, no format optimization (WebP/AVIF), no responsive sizes.

**Recommendation:** Migrate to Next.js Image:
```tsx
// Before
<div style={{ backgroundImage: `url(${img})` }} />

// After
<Image src={img} fill className="object-cover" />
```

**Effort:** Medium (5-6 hours to migrate cards)  
**Impact:** High (40-60% image size reduction, lazy loading)

### 5. Potential Query N+1 Problems

**Finding:** Some pages fetch itineraries, then loop to fetch related data.

**Example (hypothetical):**
```typescript
const itineraries = await getItineraries();
for (const itin of itineraries) {
  const tags = await getItineraryTags(itin.id); // N+1!
}
```

**Not observed directly** (would need runtime profiling), but possible with Drizzle relations.

**Recommendation:** Use Drizzle's query builder with joins or eager loading:
```typescript
const itineraries = await db.query.itineraries.findMany({
  with: { tags: true, region: true },
});
```

**Effort:** Small per occurrence (30 min each)  
**Impact:** High (reduces DB round-trips)

### 6. No Database Connection Pooling Visible

**Finding:** Using `@vercel/postgres` but no explicit pool config in code.

**Assumption:** Vercel handles pooling, but should verify.

**Recommendation:** Check `/src/db/index.ts` for proper pool setup if self-hosting.

**Effort:** Small (30 min audit)  
**Risk:** High (connection exhaustion under load)

### 7. Bundle Size Concerns

**Finding:** No analysis performed, but potential issues:
- `leaflet` (~150KB) loaded on all pages (even those without maps)
- `react-leaflet` adds more

**Recommendation:** Dynamic import maps:
```tsx
const MapView = dynamic(() => import("@/components/ui/MapView"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});
```

**Effort:** Small (1-2 hours)  
**Impact:** Medium (15-20% bundle reduction for non-map pages)

---

## E. Recommended Priority Actions

### Top 10 Fixes/Improvements (Ranked by Impact × Urgency)

| # | Action | Effort | Impact | Priority |
|---|--------|--------|--------|----------|
| **1** | **Add siteId filtering to ALL queries** | M (6-8h) | 🔴 Critical | P0 |
| **2** | **Implement site resolution middleware** | S (1h) | 🔴 Critical | P0 |
| **3** | **Create Site Context Provider** | M (3-4h) | 🔴 Critical | P0 |
| **4** | **Replace hardcoded brand references** | M (4-6h) | 🔴 Critical | P0 |
| **5** | **Implement theme system (CSS variables)** | L (8-10h) | 🟠 High | P1 |
| **6** | **Add loading states & Suspense boundaries** | S (3-4h) | 🟠 High | P1 |
| **7** | **Migrate to Next.js Image component** | M (5-6h) | 🟠 High | P1 |
| **8** | **Create centralized site config file** | S (2h) | 🟡 Medium | P2 |
| **9** | **Extract CardBase component** | S (1-2h) | 🟡 Medium | P2 |
| **10** | **Add site-specific sitemaps** | M (4h) | 🟡 Medium | P2 |

**Legend:**
- **Effort:** S = Small (<4h), M = Medium (4-8h), L = Large (8-16h)
- **Priority:** P0 = Blocker, P1 = Must-have, P2 = Should-have

---

## Phase 1: Multi-Site Minimum Viable Product (MVP)

**Goal:** Launch Adventure Wales + Adventure West Country (2 sites)

**Timeline:** 2-3 weeks

### Week 1: Core Multi-Site Infrastructure (Priority 1-4)
**Days 1-2:**
- [ ] Implement middleware site resolution (`x-site-id` header injection)
- [ ] Create Site Context Provider + `useSite()` hook
- [ ] Update root layout to fetch and provide site config
- [ ] Add `sites` table seed data (Wales + West Country)

**Days 3-5:**
- [ ] Audit and update ALL query functions to filter by `siteId`
  - Make `siteId` required (not optional)
  - Add `.where(eq(table.siteId, siteId))` to every query
  - Update all call sites to pass `siteId`
  - Write integration tests for multi-site data isolation

### Week 2: Brand Abstraction (Priority 5 + 6)
**Days 1-2:**
- [ ] Replace hardcoded "Adventure Wales" with `useSite().name`
- [ ] Update metadata generation to use site context
- [ ] Update Header, Footer, Hero components

**Days 3-5:**
- [ ] Implement CSS variable theme system
- [ ] Replace hardcoded colors with Tailwind theme classes
- [ ] Test both sites with different color schemes
- [ ] Add site-specific logo/image paths

### Week 3: Polish & Testing
**Days 1-2:**
- [ ] Add loading.tsx and Suspense boundaries
- [ ] Implement site-specific sitemaps
- [ ] Add domain routing config (Vercel setup)

**Days 3-5:**
- [ ] End-to-end testing both sites
- [ ] Performance audit (Lighthouse, Web Vitals)
- [ ] Deploy to production with custom domains
- [ ] Monitor for data leaks between sites

---

## Phase 2: Performance & DX Improvements (Priority 7-10)

**Timeline:** 1 week post-launch

- [ ] Migrate cards to Next.js Image
- [ ] Extract CardBase component
- [ ] Centralize site config
- [ ] Dynamic import for maps (reduce bundle size)
- [ ] Add admin UI for site management

---

## Appendix: Specific File Changes Required

### Critical Changes (P0)

#### 1. `src/middleware.ts`
```typescript
// ADD site resolution logic
const hostname = request.headers.get("host") || "localhost:3000";
const siteId = resolveSiteId(hostname);
requestHeaders.set("x-site-id", siteId.toString());
```

#### 2. `src/lib/queries.ts` (40+ functions)
```typescript
// BEFORE (every function)
export async function getAllRegions(siteId?: number) {
  return db.select().from(regions).where(eq(regions.status, "published"));
}

// AFTER
export async function getAllRegions(siteId: number) {
  return db.select().from(regions).where(
    and(
      eq(regions.siteId, siteId),
      eq(regions.status, "published")
    )
  );
}
```

#### 3. `src/app/layout.tsx`
```typescript
// ADD site context
import { getSiteByDomain } from "@/lib/queries";
import { SiteProvider } from "@/lib/site-context";

export async function generateMetadata() {
  const hostname = headers().get("host") || "";
  const site = await getSiteByDomain(hostname);
  return {
    title: `${site.name} | ${site.tagline}`,
    // ...
  };
}

export default async function RootLayout({ children }) {
  const site = await getCurrentSite();
  return (
    <html>
      <body>
        <SiteProvider site={site}>
          {/* ... */}
        </SiteProvider>
      </body>
    </html>
  );
}
```

#### 4. `src/components/layout/header.tsx`
```typescript
// REPLACE hardcoded name
import { useSite } from "@/lib/site-context";

export function Header() {
  const { name, logoUrl } = useSite();
  return <span className="font-bold">{name}</span>;
}
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Data leak between sites** | High | Critical | Comprehensive query tests, manual audit |
| **Breaking existing Wales site** | Medium | High | Feature flags, gradual rollout |
| **Performance regression** | Low | Medium | Lighthouse CI, monitoring |
| **Theme conflicts** | Medium | Low | Consistent design tokens |
| **SEO impact from domain changes** | Low | High | Proper redirects, sitemaps |

---

## Conclusion

The Adventure Wales codebase is **fundamentally sound** with clean architecture and modern patterns. However, it is **NOT currently multi-site ready** despite database schema support.

**Estimated total effort for 2-site MVP:** ~80-100 hours (2-3 weeks for 1 developer)

**Recommended approach:**
1. Phase 1 (multi-site infrastructure) is **essential** before launching a second site
2. Start with Priority 1-4 items (middleware, queries, context, branding)
3. Theme system (Priority 5) can launch with basic CSS variables, iterate later
4. Performance improvements (Priority 6-10) can be done post-launch

**Key success factors:**
- Rigorous testing of `siteId` filtering (write integration tests)
- Gradual rollout with feature flags
- Monitoring for data leaks between sites
- Clear documentation for adding new sites

---

**Next Steps:**
1. Review this document with team
2. Create GitHub issues for P0 items
3. Set up test sites table in database
4. Begin Phase 1 implementation

