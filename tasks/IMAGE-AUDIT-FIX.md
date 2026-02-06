# Task: Fix Activity Card Images

## Problem
Activity cards across the site have wrong images — USA landscapes for Welsh MTB, grass hills for white water rafting, etc. The images were bulk-downloaded without proper location filtering.

## Goal
Audit all activity images and replace incorrect ones with Welsh-specific alternatives.

## Workflow

### Step 1: Run the Audit Script
```bash
cd /home/minigeek/Adventure-Site
npx tsx scripts/image-audit-fix.ts
```

This outputs `scripts/image-issues.json` with all activities needing attention.

### Step 2: Visual Audit (Browser)
For each activity type with issues:

1. Navigate to `/activities/type/{type}` (e.g., `/activities/type/mountain-biking`)
2. Take a screenshot
3. Identify which cards have obviously wrong images:
   - USA/non-UK landscapes (desert, red rock, tropical)
   - Wrong activity (hiking photo for kayaking)
   - Generic stock photos that look fake
   - Grass fields / empty landscapes with no activity

### Step 3: Source Correct Images

**Use Unsplash API with Welsh-specific queries:**
```bash
# Example for mountain biking
curl -s "https://api.unsplash.com/search/photos?query=wales+mountain+biking&per_page=10&orientation=landscape" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"

# Snowdonia specific
curl -s "https://api.unsplash.com/search/photos?query=snowdonia+cycling+trail&per_page=10&orientation=landscape" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

**Query patterns that work:**
- `wales {activity}` — e.g., "wales coasteering"
- `{welsh place} {activity}` — e.g., "pembrokeshire kayaking"
- `snowdonia mountain biking`
- `brecon beacons hiking`
- `UK {activity}` — fallback if Wales-specific fails

**Query patterns to AVOID:**
- Generic queries like "mountain biking" (gets USA photos)
- "adventure" alone
- Activity without location

### Step 4: Download & Save Images

Save to `public/images/activities/` with naming convention:
- Hero images: `{type}-hero.jpg`
- Variants: `{type}-{nn}-{hash}.jpg` (where nn is 02-06, hash is 8 chars from URL)

```bash
# Download and resize
curl -L "https://images.unsplash.com/photo-xxx?w=1200&q=80" -o public/images/activities/mountain-biking-02-abc12345.jpg
```

### Step 5: Update Variant Registry

Edit `src/components/cards/activity-card.tsx` and add the new variant to `activityImageVariants`:

```typescript
const activityImageVariants: Record<string, string[]> = {
  "mountain-biking": ["02-abc12345", "03-def67890", ...],
  // Add your new variants here
};
```

### Step 6: Update Database (if needed)

For activities with direct `heroImage` URLs pointing to wrong images:

```typescript
import { db } from "../src/db";
import { activities } from "../src/db/schema";
import { eq } from "drizzle-orm";

await db.update(activities)
  .set({ heroImage: "/images/activities/mountain-biking-02-abc12345.jpg" })
  .where(eq(activities.slug, "activity-slug-here"));
```

### Step 7: Verify & Commit

1. Run dev server: `npm run dev`
2. Check `/activities/type/{type}` pages
3. Verify cards show correct images
4. Commit:
```bash
git add -A && git commit -m "images: fix {type} activity card images" && git push
```

## Priority Order

Fix in this order (based on visibility):
1. **mountain-biking** — high traffic, homepage featured
2. **coasteering** — hero activity for Wales
3. **white-water-rafting** — currently showing grass hill
4. **surfing** — check for non-UK beaches
5. **hiking** — check for American landscapes
6. **kayaking**
7. **caving**
8. Other types as needed

## Rate Limits

- **Unsplash**: 50 requests/hour on free tier
- Space out requests, batch by activity type
- Cache search results to avoid re-querying

## Validation Rules

An image is WRONG if:
- Clearly non-UK landscape (desert, red rocks, tropical vegetation, American architecture)
- Wrong activity entirely (hiking photo for kayaking)
- No activity visible (just a grass field)
- Obviously AI-generated (uncanny valley faces, weird hands)

An image is ACCEPTABLE if:
- Shows the correct activity
- Could plausibly be Wales/UK (green hills, grey skies OK)
- Real photograph, not obviously stock

## Exit Criteria

- [ ] All high-traffic activity types audited
- [ ] No obviously wrong images (USA/tropical) on visible pages
- [ ] Variant images provide variety (not same image repeated)
- [ ] Changes committed and deployed
