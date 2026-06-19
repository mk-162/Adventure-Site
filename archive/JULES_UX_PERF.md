# Jules Brief: UX Fixes + Performance + Top Experiences

## Context
Adventure Wales — Next.js 15 (App Router), Tailwind CSS, Drizzle ORM, Neon Postgres.
**Schema**: `src/db/schema.ts` | **Queries**: `src/lib/queries.ts` | **Seed**: `scripts/seed.ts`

---

## Task 1: Quantity Selector for Multi-Site Pricing

On the `/advertise` page, operators can buy listings for multiple sites. Currently it's a flat price. Add a quantity selector.

### Location
`src/app/advertise/page.tsx` — find the pricing cards section.

### What to Build
Add a quantity selector (+ / - buttons with a number) to the pricing cards for Enhanced (£9.99/mo) and Premium (£29.99/mo) tiers.

```
[–]  1 site  [+]

1 site: £9.99/mo
2 sites: £17.99/mo (10% discount)
3 sites: £24.99/mo (17% discount)  
4+ sites: Contact us
```

**Pricing logic:**
- 1 site = base price
- 2 sites = base × 2 × 0.9 (10% off)
- 3 sites = base × 3 × 0.83 (17% off)
- 4+ sites = show "Contact us for volume pricing" with mailto link

### Implementation
- Client component with `useState` for quantity
- Animate the price change (simple transition)
- Update the CTA button text: "Get Started — £X/mo" with the calculated price
- Same pattern for both Enhanced and Premium tiers
- Min quantity: 1, Max: 10 (but show "Contact us" message for 4+)
- Persist selection to the enquiry/signup form if one exists

### Styling
Match existing card styling. Quantity selector should be compact — inline with the price, not a separate row. Use the site's teal/orange colour scheme.

---

## Task 2: Journal Performance — Server-Side Fetching

### Problem
The journal page (`/app/journal/page.tsx`) fetches 133+ posts client-side, which is slow. Move to server-side.

### Current State
Check `src/app/journal/page.tsx` — it likely uses `useEffect` + `fetch` to load posts from an API route client-side.

### What to Do
1. Convert to a **server component** that fetches posts directly from the database
2. Use the existing query function or create one: `getAllPosts()` in `src/lib/queries.ts`
3. Add **pagination** — 12 posts per page, with page navigation at bottom
4. URL-based pagination: `/journal?page=2` using `searchParams`
5. Keep the existing card layout and styling
6. Add category filter tabs at the top (if categories exist in the data)

### Query
```ts
// In src/lib/queries.ts
export async function getPaginatedPosts(page: number = 1, perPage: number = 12, category?: string) {
  const offset = (page - 1) * perPage;
  
  let query = db.select().from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
    .limit(perPage)
    .offset(offset);
    
  // Add category filter if provided
  // Return { posts, total, totalPages }
}
```

### Pagination Component
Simple page numbers: `← 1 2 3 4 ... 12 →`
- Use `Link` components (not client-side state) so pages are crawlable
- Highlight current page
- Show total count: "Showing 1-12 of 133 articles"

---

## Task 3: "Top Experiences" Scope Expansion

### Problem
Region pages (`/app/[region]/page.tsx`) have a "Top Experiences" section that only shows operator-linked activities. It should also include Attractions, Walks, Sightseeing, and Beaches.

### What to Do

1. **Query expansion**: The Top Experiences query should include activities from ALL activity types, not just adventure ones. Check the current query — it may filter by specific type IDs. Remove that filter or expand it to include the new types (sightseeing, attractions, beaches etc).

2. **Category tabs**: Add filter tabs above the Top Experiences grid:
   - "All" (default)
   - "Adventures" (existing adventure activity types)
   - "Attractions" (activity_type slug = 'attractions')
   - "Sightseeing" (activity_type slug = 'sightseeing')
   
   These should be client-side filter tabs (no page reload), filtering the already-fetched list.

3. **Card differentiation**: Activities with type "attractions" or "sightseeing" should show a slightly different card style:
   - Show an "Attraction" or "Sightseeing" badge instead of difficulty level
   - Show entry price instead of activity price range
   - Link to the attraction's website if no internal page exists
   - Use a landmark/camera icon instead of the activity type icon

4. **Empty state**: If a region has no attractions yet, don't show the attractions tab. Only show tabs for categories that have content.

### Files
- `src/app/[region]/page.tsx` — main region page
- `src/lib/queries.ts` — activity queries
- `src/components/cards/activity-card.tsx` — card component (may need variant)

---

## Testing

1. `npm run build` must pass with zero errors
2. `/advertise` — quantity selector works, prices calculate correctly, 4+ shows contact message
3. `/journal` — loads server-side, pagination works, category filter works
4. `/snowdonia` (or any region) — Top Experiences shows expanded types with filter tabs

## Files NOT to Touch
- Don't modify the homepage layout
- Don't change existing activity type slugs
- Don't alter the database schema (no migrations needed for these tasks)
- Don't modify `src/lib/combo-data.ts`
