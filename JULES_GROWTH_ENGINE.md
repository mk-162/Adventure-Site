# Jules Brief: Growth Engine Foundations + Analytics + Ads

## Context
Adventure Wales — Next.js 15 (App Router), Tailwind CSS, Drizzle ORM, Neon Postgres.
**Schema**: `src/db/schema.ts` | **Queries**: `src/lib/queries.ts`

---

## Task 1: Operator Page View Counter

Track page views on operator directory pages to show operators their visibility.

### Schema Addition
In `src/db/schema.ts`, add a new table:

```ts
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").references(() => sites.id).notNull(),
  pageType: varchar("page_type", { length: 50 }).notNull(), // 'operator', 'activity', 'itinerary', 'event'
  pageSlug: varchar("page_slug", { length: 255 }).notNull(),
  operatorId: integer("operator_id").references(() => operators.id), // null for non-operator pages
  viewDate: date("view_date").notNull(), // aggregate by day
  viewCount: integer("view_count").default(0).notNull(),
  uniqueVisitors: integer("unique_visitors").default(0).notNull(),
}, (table) => [
  index("page_views_operator_id_idx").on(table.operatorId),
  index("page_views_page_slug_idx").on(table.pageSlug),
  index("page_views_date_idx").on(table.viewDate),
  // Unique constraint for upsert
  unique("page_views_unique").on(table.siteId, table.pageType, table.pageSlug, table.viewDate),
]);
```

### API Route
Create `src/app/api/track-view/route.ts`:

```ts
// POST { pageType, pageSlug, operatorId? }
// Uses INSERT ... ON CONFLICT to increment view_count for today
// Uses a cookie/fingerprint to estimate unique_visitors
// Returns 200 OK (fire-and-forget from client)
```

### Client Integration
Create a lightweight client component `src/components/ui/ViewTracker.tsx`:

```tsx
"use client";
import { useEffect } from "react";

export function ViewTracker({ pageType, pageSlug, operatorId }: { 
  pageType: string; pageSlug: string; operatorId?: number 
}) {
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      body: JSON.stringify({ pageType, pageSlug, operatorId }),
      headers: { "Content-Type": "application/json" },
    }).catch(() => {}); // fire and forget
  }, [pageType, pageSlug, operatorId]);
  
  return null;
}
```

### Add ViewTracker to Pages
Add `<ViewTracker>` to:
- `/directory/[slug]/page.tsx` — `pageType="operator"`
- `/activities/[slug]/page.tsx` — `pageType="activity"`
- `/itineraries/[slug]/page.tsx` — `pageType="itinerary"`

### Admin Stats Query
Add to `src/lib/queries.ts`:

```ts
export async function getOperatorViewStats(operatorId: number, days: number = 30) {
  // Return daily view counts for the last N days
  // Plus total views and unique visitors
}
```

---

## Task 2: Premium Trial Fields

Add fields to support giving operators a free premium trial to hook them in.

### Schema Addition
Add to the `operators` table in `src/db/schema.ts`:

```ts
// Trial fields
trialTier: varchar("trial_tier", { length: 50 }), // 'enhanced' or 'premium'
trialStartedAt: timestamp("trial_started_at"),
trialExpiresAt: timestamp("trial_expires_at"),
trialConvertedAt: timestamp("trial_converted_at"), // null = not converted
trialSource: varchar("trial_source", { length: 100 }), // 'outreach', 'self_service', 'campaign_xyz'
```

### Trial Logic Helper
Create `src/lib/trial-utils.ts`:

```ts
export function isTrialActive(operator: { trialTier: string | null; trialExpiresAt: Date | null }): boolean {
  if (!operator.trialTier || !operator.trialExpiresAt) return false;
  return new Date() < operator.trialExpiresAt;
}

export function getEffectiveTier(operator: { 
  billingTier: string; trialTier: string | null; trialExpiresAt: Date | null 
}): string {
  if (isTrialActive(operator)) return operator.trialTier!;
  return operator.billingTier;
}
```

### Update Operator Display Logic
Anywhere the site checks `operator.billingTier` or `operator.claimStatus` to show premium styling (gold borders, badges, etc), it should also check `getEffectiveTier()` so trial operators get premium treatment.

Search for references to `billingTier`, `claimStatus === "premium"`, and premium badge logic. Update them to use `getEffectiveTier()`.

Add a subtle "Trial" badge next to the premium badge for trial operators (so the admin knows, but users just see premium styling).

Generate and run the Drizzle migration.

---

## Task 3: Ad Slots Rendering Verification + Fix

### Problem
Demo ad content was seeded (campaigns, creatives, ad slots) but it's unclear if ads actually render on answer/guide pages.

### What to Do

1. **Audit**: Check these page templates for ad slot rendering:
   - `/answers/[slug]/page.tsx`
   - `/journal/[slug]/page.tsx`  
   - `/guides/[slug]/page.tsx` (if exists)
   - `/[region]/page.tsx`
   - `/activities/[slug]/page.tsx`

2. **Check for AdSlot component**: Look in `src/components/` for any ad-related components (`AdSlot`, `SponsorBanner`, `AdvertiseWidget`, etc). Verify they:
   - Query the `page_ads` or `ad_slots` table
   - Render creative content (image + link)
   - Fall back to "Advertise Here" CTA when no paid ad exists

3. **Fix or Create**: If ad slots aren't rendering on answer/guide pages, add them:
   - **Sidebar ad** (300x250) on desktop, between content sections on mobile
   - **Banner ad** (728x90) below the main content
   - Each should query for a matching ad campaign, or show the AdvertiseWidget fallback
   
4. **Fallback**: When no paid ad exists for a slot, show:
   ```
   [Adventure Wales logo]
   "Want your business here?"
   "Reach thousands of adventure seekers"
   [Advertise with us →] (links to /advertise)
   ```

---

## Task 4: Campaign Tracking Schema

Build the schema for tracking outreach campaigns to operators.

### Schema
Add to `src/db/schema.ts`:

```ts
export const outreachCampaigns = pgTable("outreach_campaigns", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").references(() => sites.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  bodyTemplate: text("body_template"), // HTML email template
  status: varchar("status", { length: 50 }).default("draft").notNull(), // draft, sending, sent, paused
  sentCount: integer("sent_count").default(0),
  openedCount: integer("opened_count").default(0),
  clickedCount: integer("clicked_count").default(0),
  claimedCount: integer("claimed_count").default(0), // operators who claimed listing after email
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
});

export const outreachRecipients = pgTable("outreach_recipients", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => outreachCampaigns.id).notNull(),
  operatorId: integer("operator_id").references(() => operators.id).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, sent, opened, clicked, bounced, unsubscribed
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  claimedAt: timestamp("claimed_at"),
}, (table) => [
  index("outreach_recipients_campaign_id_idx").on(table.campaignId),
  index("outreach_recipients_operator_id_idx").on(table.operatorId),
  unique("outreach_unique_recipient").on(table.campaignId, table.operatorId),
]);
```

### Tracking Pixel Route
Create `src/app/api/track/open/route.ts`:
- Serves a 1x1 transparent GIF
- Query param: `?r=RECIPIENT_ID`
- Updates `outreach_recipients.openedAt` and increments `outreach_campaigns.openedCount`

### Click Tracking Route
Create `src/app/api/track/click/route.ts`:
- Query params: `?r=RECIPIENT_ID&url=DESTINATION_URL`
- Updates `outreach_recipients.clickedAt` and increments `outreach_campaigns.clickedCount`
- Redirects to destination URL

### Admin Campaign Page
Create `src/app/admin/campaigns/page.tsx`:
- List all campaigns with stats (sent, opened %, clicked %, claimed %)
- Click into a campaign to see per-recipient status
- "Create Campaign" button (just the form — actual sending is a future task)
- Campaign form: name, subject, body template (textarea), select operators to include

Generate and run Drizzle migrations for all new tables.

---

## Testing

1. `npm run build` must pass with zero errors
2. Visit any operator page → check network tab for `/api/track-view` call
3. Check admin area for campaign management page
4. Verify ad slots render (or show fallback) on answer/guide pages
5. Trial fields: no visible change yet (just schema + helpers), but build must be clean

## Files You'll Create
- `src/app/api/track-view/route.ts`
- `src/app/api/track/open/route.ts`
- `src/app/api/track/click/route.ts`
- `src/components/ui/ViewTracker.tsx`
- `src/lib/trial-utils.ts`
- `src/app/admin/campaigns/page.tsx`
- Drizzle migration files

## Files NOT to Touch
- Don't modify the homepage
- Don't change existing operator card components (only add new logic)
- Don't alter seed data
- Don't modify `src/lib/combo-data.ts`
