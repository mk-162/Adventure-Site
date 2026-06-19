# Jules Brief: Codex Audit Fixes — Directory, Images, Sitemap, Type Safety

## Context
Adventure Wales — Next.js 15 (App Router), Tailwind CSS, Drizzle ORM, Neon Postgres.
This brief addresses findings from a Codex code audit. The quick wins (search ?q, a11y labels, LocalBusiness schema) are already done. These are the medium/large items.

---

## Task 1: URL-Synced Directory Filters (QW-3)

### Problem
Directory filters (`src/components/directory/DirectoryFilters.tsx`) use local `useState` only. Filters are lost on reload, can't be shared via URL, and aren't crawlable.

### What to Do
1. Import `useRouter` and `useSearchParams` from `next/navigation`
2. Initialize filter state from URL search params on mount
3. Update URL when any filter changes (using `router.replace` with `scroll: false`)
4. Add active filter chips below the filter bar showing current filters with "×" to remove each
5. Add "Clear all" button when any filter is active

### URL Format
```
/directory?q=climbing&region=snowdonia&activity=climbing&category=activity_provider&rating=4%2B
```

### Implementation Notes
- Use `useSearchParams()` to read initial values
- Use `router.replace()` (not `push`) so filter changes don't pollute browser history
- Debounce the search input (300ms) before updating URL
- Keep all existing filtering logic working — just sync state with URL
- Wrap the component in `<Suspense>` if needed for `useSearchParams`

---

## Task 2: Server-Side Directory Filtering + Pagination (HL-1)

### Problem
The directory page (`src/app/directory/page.tsx`) fetches only 50 operators and filters client-side. We have 61+ operators — some are invisible.

### What to Do

1. **Update `getOperators` in `src/lib/queries.ts`** to support actual SQL filtering:
```ts
export async function getOperators(options: {
  limit?: number;
  offset?: number;
  regionSlug?: string;
  activityTypeSlug?: string;
  category?: string;
  minRating?: number;
  query?: string;
} = {}) {
  // Build WHERE conditions based on provided options
  // For regionSlug: WHERE regions @> ARRAY[regionSlug]
  // For activityTypeSlug: WHERE activity_types @> ARRAY[activityTypeSlug]
  // For query: WHERE name ILIKE %query% OR tagline ILIKE %query%
  // For category: WHERE category = category
  // For minRating: WHERE google_rating >= minRating
  // Return { operators, total }
}
```

2. **Update the directory page** to read filters from `searchParams` and pass to `getOperators`:
```ts
// src/app/directory/page.tsx
export default async function DirectoryPage({ searchParams }: { searchParams: { ... } }) {
  const { operators, total } = await getOperators({
    limit: 24,
    offset: (page - 1) * 24,
    regionSlug: searchParams.region,
    activityTypeSlug: searchParams.activity,
    category: searchParams.category,
    minRating: searchParams.rating ? parseFloat(searchParams.rating) : undefined,
    query: searchParams.q,
  });
  // Pass to DirectoryFilters component
}
```

3. **Add pagination** at the bottom of the directory listing:
   - 24 operators per page
   - URL-based: `/directory?page=2`
   - Show "Showing 1-24 of 61 providers"
   - Simple numbered pagination: `← 1 2 3 →`

4. **Update DirectoryFilters** to receive `total` count and display it, but no longer filter in-memory (server already filtered).

---

## Task 3: Replace `<img>` and CSS Backgrounds with `next/image` (HL-2)

### Problem
Operator detail pages use raw `<img>` tags and CSS `background-image` for hero and logo images, bypassing Next.js image optimization. This hurts LCP and Core Web Vitals.

### What to Do

1. **Audit** `src/app/directory/[slug]/page.tsx` for:
   - Any `<img` tags (not `<Image` from next/image)
   - Any `style={{ backgroundImage: ... }}` or `bg-[url(...)]` patterns
   - Any `<div>` with background images used as hero sections

2. **Replace with `<Image>`** from `next/image`:
   - Hero image: Use `<Image>` with `fill`, `priority`, and appropriate `sizes`
   - Logo: Use `<Image>` with fixed `width`/`height`
   - Gallery images: Use `<Image>` with `sizes` for responsive

3. **Update `next.config.ts`** to add `remotePatterns` for image domains:
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.unsplash.com' },
    { protocol: 'https', hostname: '**.googleusercontent.com' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    // Add any other domains found in operator data
  ],
},
```

4. **Also check** these pages for raw `<img>` usage:
   - `src/app/activities/[slug]/page.tsx`
   - `src/app/itineraries/[slug]/page.tsx`
   - `src/components/cards/operator-card.tsx`

---

## Task 4: Fix Sitemap — Exclude Empty Combo Pages (HL-4)

### Problem
The sitemap generates URLs for every region × activityType combination, even when there's no content. This creates ~241 thin/empty pages that Google indexes.

### What to Do

1. **Find the sitemap generator** — likely `src/app/sitemap.ts` or `src/app/sitemap.xml/route.ts`

2. **Filter combo pages**: Only include `/{region}/things-to-do/{activity-type}` URLs where:
   - There is at least 1 published activity matching that region + activity type combination, OR
   - There is an enrichment data file at `data/combo-pages/{region}--{activity}.json`

3. **Query the DB** to get valid region + activity type combinations:
```sql
SELECT DISTINCT r.slug as region_slug, at.slug as activity_slug
FROM activities a
JOIN regions r ON a.region_id = r.id
JOIN activity_types at ON a.activity_type_id = at.id
WHERE a.status = 'published'
```

4. **Only emit URLs** for combinations that have real content. This should reduce the sitemap from ~276 combo URLs to ~35-50.

---

## Task 5: Re-enable TypeScript Strict Mode (BB-2)

### Problem
`next.config.ts` has `typescript: { ignoreBuildErrors: true }` which allows broken code to ship to production.

### What to Do

1. **Run `npx tsc --noEmit`** and catalogue all current type errors
2. **Fix all type errors** — there are currently only 2 known ones:
   - `src/app/api/admin/billing/route.ts` line 118-119: Stripe `current_period_end` type mismatch
3. **Remove `ignoreBuildErrors: true`** from `next.config.ts`
4. **Also remove `eslint: { ignoreDuringBuilds: true }`** if present, and fix any lint errors
5. **Verify** `npm run build` passes cleanly with no errors

### Approach
- Fix errors file by file
- For complex Stripe types, use type assertions where the runtime type is known to be correct
- Don't change any business logic — only fix types
- If there are more than ~10 type errors, fix the obvious ones and list the rest for follow-up

---

## Testing

1. `npm run build` must pass with zero errors (especially after Task 5)
2. `/directory` — filters reflected in URL, pagination works, all 61+ operators accessible
3. `/directory?region=snowdonia&rating=4%2B` — shareable filtered URL works on reload
4. `/directory/[any-operator]` — hero/logo use Next/Image (check DevTools → Elements)
5. Sitemap — verify only pages with content are listed
6. `npx tsc --noEmit` — zero errors

## Files You'll Touch
- `src/components/directory/DirectoryFilters.tsx` — URL sync
- `src/app/directory/page.tsx` — server-side filtering
- `src/lib/queries.ts` — getOperators enhancement
- `src/app/directory/[slug]/page.tsx` — Next/Image migration
- `src/app/sitemap.ts` (or equivalent) — filter empty pages
- `next.config.ts` — remotePatterns + remove ignoreBuildErrors
- Any files with TypeScript errors

## Files NOT to Touch
- Don't modify the homepage
- Don't change existing slugs or URLs
- Don't alter seed data
- Don't modify `src/lib/combo-data.ts`
