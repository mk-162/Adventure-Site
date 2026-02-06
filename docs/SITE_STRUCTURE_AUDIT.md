# Adventure Wales Site Structure Audit

**Date:** 2026-02-06  
**Status:** Critical SEO issues identified  
**Pages audited:** 91 route patterns

---

## Executive Summary

The site has grown organically and now suffers from **severe duplicate content issues**. Multiple URL patterns serve the same user intent, diluting SEO authority and confusing both users and search engines.

**Key problems:**
1. **4+ ways to access activity content** (e.g., mountain biking)
2. **No clear content hierarchy** — hubs, listings, and search compete
3. **Broken routes** (`/search?activity=X` returns empty)
4. **Inconsistent internal linking** — pages don't reinforce each other
5. **Missing canonical tags** — Google sees duplicates as separate pages

---

## Current Route Architecture

### Content Entities (Database)

| Entity | Purpose | Count |
|--------|---------|-------|
| `regions` | Geographic areas (Snowdonia, Pembrokeshire) | ~12 |
| `activityTypes` | Activity taxonomy (mountain-biking, coasteering) | ~15 |
| `activities` | Bookable experiences (individual products) | ~200+ |
| `operators` | Businesses running activities | ~100+ |
| `events` | Races, festivals, workshops | ~100+ |
| `accommodation` | Places to stay | ~50+ |
| `itineraries` | Multi-day trip plans | ~20+ |
| `locations` | Specific spots/venues | ~100+ |
| `answers` | FAQ content | ~50+ |
| `posts` | Blog/journal articles | ~20+ |
| `tags` | Cross-cutting taxonomy | ~50+ |

### Current Route Patterns

#### Activity Content (THE PROBLEM AREA)

| Pattern | Example | Purpose | Status |
|---------|---------|---------|--------|
| `/{activity}` | `/mountain-biking` | **Hub/Mega page** — rich editorial content | ✅ Manual, 5 exist |
| `/activities/type/{type}` | `/activities/type/mountain-biking` | **Listings** — all activities of type | ⚠️ Competes with hub |
| `/{region}/things-to-do/{type}` | `/snowdonia/things-to-do/mountain-biking` | **Region combo** — filtered list + local content | ⚠️ Competes |
| `/search?activity={type}` | `/search?activity=mountain-biking` | **Search results** — filtered list | ❌ Broken (empty) |
| `/activities/{slug}` | `/activities/downhill-mtb-antur-stiniog` | **Detail page** — individual activity | ✅ Correct |

**Result:** 4 competing pages for "mountain biking Wales" keyword.

#### Region Content

| Pattern | Example | Purpose | Status |
|---------|---------|---------|--------|
| `/{region}` | `/snowdonia` | Region hub page | ✅ Good |
| `/{region}/things-to-do` | `/snowdonia/things-to-do` | All activities in region | ✅ Good |
| `/{region}/where-to-stay` | `/snowdonia/where-to-stay` | Accommodation in region | ✅ Good |
| `/{region}/tips` | `/snowdonia/tips` | Local tips page | ⚠️ Thin |
| `/{region}/{bestSlug}` | `/snowdonia/best-hikes` | Best-of lists | ⚠️ Catch-all risk |
| `/regions` | `/regions` | Region index | ✅ Good |

#### Other Content Types

| Pattern | Example | Status |
|---------|---------|--------|
| `/directory/{slug}` | `/directory/adventure-parc` | Operator pages | ✅ |
| `/events/{slug}` | `/events/snowdonia-marathon` | Event detail | ✅ |
| `/events` | `/events` | Event listing | ✅ |
| `/accommodation/{slug}` | `/accommodation/plas-curig` | Stay detail | ✅ |
| `/itineraries/{slug}` | `/itineraries/3-day-snowdonia` | Trip plan | ✅ |
| `/answers/{slug}` | `/answers/best-time-coasteering` | FAQ page | ✅ |
| `/journal/{slug}` | `/journal/winter-mtb-guide` | Blog post | ✅ |
| `/guides/{slug}` | `/guides/getting-started-mountain-biking` | Guide page | ⚠️ Overlaps hub |
| `/tags/{slug}` | `/tags/family-friendly` | Tag aggregate | ✅ |
| `/locations/{slug}` | `/locations/coed-y-brenin` | Spot/venue page | ⚠️ Underused |

---

## Duplicate Content Analysis

### Mountain Biking Example (applies to all activities)

| URL | Title | Content | Google sees |
|-----|-------|---------|-------------|
| `/mountain-biking` | "Mountain Biking in Wales \| Trail Centres, Guides..." | 8,700 chars, rich guide | Primary? |
| `/activities/type/mountain-biking` | "Mountain Biking Experiences in Wales" | 1,400 chars, activity list | Duplicate |
| `/snowdonia/things-to-do/mountain-biking` | "Adventure Wales \| Honest Guide..." | 4,200 chars, region-filtered | Duplicate |
| `/search?activity=mountain-biking` | "Adventure Wales \| Honest Guide..." | Empty/broken | Waste |
| `/guides/getting-started-mountain-biking` | "Getting Started Mountain Biking" | Beginner guide | Maybe OK |

**SEO impact:**
- Link equity split across 4+ pages
- No clear canonical signal
- Keyword cannibalization
- Crawl budget waste

### This Pattern Repeats For:

- Coasteering (4 routes)
- Hiking (4 routes)
- Surfing (4 routes)
- Caving (4 routes)
- Every activity type × Every region = **100+ duplicate intent pages**

---

## Root Causes

### 1. Organic Growth Without Architecture

Features added incrementally:
- Hub pages added for rich content ✓
- Activity type listings already existed ✗
- Region combos added for local SEO ✓ (but compete)
- Search never properly integrated ✗

### 2. No URL Hierarchy

Current: Flat structure with overlapping patterns
```
/mountain-biking           ← manual hub
/activities/type/mountain-biking  ← dynamic list
/snowdonia/things-to-do/mountain-biking  ← combo
```

Should be: Hierarchical under hub
```
/mountain-biking           ← canonical hub
/mountain-biking/book      ← listings (or section on hub)
/mountain-biking/snowdonia ← region-specific
```

### 3. Home Page Search Routes to Wrong Place

```tsx
// search-bar.tsx line 91
window.location.href = `/search?activity=${what}`;  // ← Goes to broken page
```

Should go to hub or listings page.

### 4. No Canonical Tags

Pages don't specify which version is authoritative. Google guesses (usually wrong).

### 5. Internal Links Don't Reinforce Hierarchy

- Hubs don't link prominently to region variants
- Region combos don't link back to canonical hub
- Breadcrumbs are inconsistent

---

## Sitemap Analysis

Current sitemap.ts includes:
- ✅ `/{region}` pages
- ✅ `/{region}/things-to-do/{type}` combos
- ✅ `/activities/{slug}` details
- ❌ Missing `/activities/type/{type}` (good — shouldn't index)
- ❌ Missing `/{activity}` hubs (BAD — should index)
- ❌ No canonical hints

**Critical:** Hub pages (`/mountain-biking`, etc.) are NOT in sitemap!

---

## Recommended Architecture

### Target State: Activity-First Hierarchy

```
/{activity}                          ← Canonical hub (rich content)
  ├── /{activity}/book               ← All bookable experiences
  ├── /{activity}/{region}           ← Region-specific (redirect from combo)
  ├── /{activity}/events             ← Related events
  └── /{activity}/guides/{topic}     ← Related guides

/{region}                            ← Region hub
  ├── /{region}/things-to-do         ← All activities (links to activity hubs)
  └── /{region}/where-to-stay        ← Accommodation

/activities/{slug}                   ← Individual activity detail (unchanged)
/directory/{slug}                    ← Operator pages (unchanged)
```

### URL Mapping

| Current | New | Action |
|---------|-----|--------|
| `/mountain-biking` | `/mountain-biking` | Keep (canonical) |
| `/activities/type/mountain-biking` | `/mountain-biking` | 301 redirect |
| `/snowdonia/things-to-do/mountain-biking` | `/mountain-biking/snowdonia` | 301 redirect |
| `/search?activity=mountain-biking` | `/mountain-biking` | 301 redirect |
| `/guides/getting-started-mountain-biking` | `/mountain-biking/guides/getting-started` | Move under hub |

### Content Strategy

#### Hub Page (`/{activity}`)
- Comprehensive guide (current mega pages)
- Trail centre tables, maps, videos
- FAQs, best time, gear
- **NEW:** Embedded bookable experiences section
- **NEW:** Region quick-nav (Snowdonia, Pembrokeshire, etc.)
- **NEW:** Upcoming events widget

#### Region Variant (`/{activity}/{region}`)
- Regional introduction
- Filtered activities from that region
- Local gear shops, cafes
- Weather/conditions specific to region
- Cross-links to other regions

#### Listings (embedded or `/book`)
- Pure transactional: filter, sort, book
- No editorial — that's on hub
- Could be a section on hub page, not separate URL

---

## Implementation Plan

### Phase 1: Stop the Bleeding (Week 1)

1. **Fix home page routing**
   ```tsx
   // Change search-bar.tsx
   window.location.href = `/${what}`;  // Go to hub
   ```

2. **Add canonical tags**
   ```tsx
   // In /activities/type/[type]/page.tsx
   export const metadata = {
     alternates: { canonical: `/${type}` }
   }
   ```

3. **Add hubs to sitemap**
   ```ts
   // sitemap.ts
   ['mountain-biking', 'coasteering', 'hiking', 'surfing', 'caving'].forEach(hub => {
     sitemap.push({ url: `${BASE_URL}/${hub}`, priority: 0.95 })
   })
   ```

4. **Fix/remove broken search**
   - Either fix search page to work
   - Or redirect `/search?activity=X` to `/{activity}`

### Phase 2: Consolidate (Weeks 2-3)

1. **Create redirects in next.config.js**
   ```js
   redirects: [
     { source: '/activities/type/:type', destination: '/:type', permanent: true },
     // etc.
   ]
   ```

2. **Restructure region combos**
   - New route: `/{activity}/{region}`
   - Redirect old: `/{region}/things-to-do/{activity}` → `/{activity}/{region}`

3. **Merge content**
   - Move unique content from deleted pages to canonical pages
   - Ensure nothing is lost

### Phase 3: Enhance (Weeks 3-4)

1. **Internal linking audit**
   - Every page links to parent in hierarchy
   - Breadcrumbs reflect new structure
   - Cross-links between related hubs

2. **Schema markup**
   - Add proper JSON-LD for activity hubs
   - BreadcrumbList reflecting hierarchy
   - FAQPage schema

3. **Performance**
   - Lazy load sections on hub pages
   - Infinite scroll for listings

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Losing existing rankings | 301 redirects preserve equity |
| Broken internal links | Search & replace old URLs |
| User confusion | Clear navigation, good redirects |
| Development time | Phase rollout, test thoroughly |

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Duplicate content pages | 100+ | 0 |
| Pages with canonical tags | ~10% | 100% |
| Hub pages in sitemap | 0 | 5+ |
| Avg. pages per session (activity) | Low | +30% |
| Organic traffic to hubs | Diluted | Consolidated |

---

## Files to Modify

### Core Routing
- `src/app/activities/type/[type]/page.tsx` — Add canonical, eventually redirect
- `src/app/[region]/things-to-do/[activity-type]/page.tsx` — Restructure
- `src/app/search/page.tsx` — Fix or redirect
- `src/components/home/search-bar.tsx` — Fix routing
- `src/app/sitemap.ts` — Add hubs

### Redirects
- `next.config.js` — Add redirect rules

### New Routes (Phase 2)
- `src/app/[activity]/page.tsx` — Dynamic hub (or keep manual)
- `src/app/[activity]/[region]/page.tsx` — Region variant
- `src/app/[activity]/book/page.tsx` — Listings

---

## Decision Points

1. **Keep manual hub pages or make dynamic?**
   - Manual: More control, but 5+ files to maintain
   - Dynamic: Single template, data-driven
   - Recommendation: Keep manual for now, rich content hard to template

2. **Embed listings on hub or separate `/book` page?**
   - Embedded: Better UX, one canonical page
   - Separate: Cleaner, but another URL
   - Recommendation: Embed top 6-8, link to full filtered list

3. **Handle guides?**
   - Keep separate `/guides/` (discoverable)
   - Move under `/{activity}/guides/` (hierarchy)
   - Recommendation: Keep separate but add prominent cross-links

---

## Next Steps

1. Review this audit — agree on target architecture
2. Prioritize Phase 1 fixes (same-day if approved)
3. Plan Phase 2 restructure (needs careful execution)
4. Monitor Search Console for crawl errors after changes

---

*This audit reveals architectural debt that will only worsen as content grows. Fixing now prevents compounding SEO damage.*
