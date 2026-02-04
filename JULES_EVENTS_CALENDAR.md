# Jules Task: Events & Calendar System — Full Build

## CRITICAL RULES
- **DO NOT delete any existing files** unless explicitly told to
- **DO NOT modify** files outside the scope of this task
- **DO NOT remove** safety guards, null checks, or fallback values from existing code
- **DO NOT touch** data files, images, scripts, briefs, plans, or docs folders
- After building, run `npm run build` — it MUST pass clean
- If you need to modify an existing file, make MINIMAL changes — only add/change what's needed

## Overview
Build a full events and calendar system for Adventure Wales. The site already has a basic events listing (`/events`) and event detail pages (`/events/[slug]`). You're enhancing these and adding a calendar view, external feed ingestion, user interactions (save/share), and commercial features (promoted events, "Add Your Event" for paying advertisers).

**Repo:** mk-162/Adventure-Site  
**Stack:** Next.js 16, TypeScript, Tailwind CSS, Drizzle ORM, Neon Postgres (`@neondatabase/serverless`)  
**Brand colours:** Primary `#1e3a4c`, Accent `#f97316`  
**Icons:** lucide-react (already installed)  
**Maps:** Leaflet via `src/components/ui/MapView` (already installed)

---

## Part 1: Database Schema Additions

Add these to `src/db/schema.ts`. **Do NOT modify the existing `events` table definition** — use ALTER TABLE migrations for new columns.

### 1.1 New columns on `events` table

```typescript
// Add these fields to the existing events table:
heroImage: text("hero_image"),
imageGallery: jsonb("image_gallery"), // string[] of image URLs
category: varchar("category", { length: 100 }), // 'race', 'festival', 'workshop', 'family', 'competition', 'social'
tags: text("tags").array(),
isRecurring: boolean("is_recurring").default(false),
recurringSchedule: varchar("recurring_schedule", { length: 255 }), // e.g. "Every Saturday", "First Sunday of month"
isFeatured: boolean("is_featured").default(false),
isPromoted: boolean("is_promoted").default(false), // paid placement
promotedUntil: timestamp("promoted_until"),
operatorId: integer("operator_id").references(() => operators.id), // which operator submitted it
externalSource: varchar("external_source", { length: 100 }), // 'eventbrite', 'manual', 'visitwales'
externalId: varchar("external_id", { length: 255 }), // ID from external source
externalUrl: text("external_url"), // direct link to external event page
ticketUrl: text("ticket_url"),
difficulty: varchar("difficulty", { length: 50 }), // 'beginner', 'intermediate', 'advanced', 'elite'
ageRange: varchar("age_range", { length: 100 }), // 'all-ages', '18+', 'family-friendly'
```

### 1.2 New table: `event_saves` (user favourites/hearts)

```typescript
export const eventSaves = pgTable("event_saves", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  sessionId: varchar("session_id", { length: 255 }).notNull(), // anonymous session or operator ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueSave: unique().on(table.eventId, table.sessionId),
}));
```

### 1.3 SQL Migration

Create `scripts/migrate-events.sql` with the ALTER TABLE and CREATE TABLE statements for all the above. Include `IF NOT EXISTS` / `IF NOT EXISTS` guards so it's idempotent.

---

## Part 2: Calendar Page (`/calendar`)

Build a new page at `src/app/calendar/page.tsx`.

### 2.1 Layout
- Full-width hero banner: "What's On in Wales" with a scenic background
- Below hero: **View toggles** — "Calendar" | "List" | "Map" (default to List on mobile, Calendar on desktop)
- **Quick filters**: "This Weekend" | "This Month" | "Next Month" | "All Upcoming"
- **Category filters**: All | Races | Festivals | Workshops | Family | Competitions
- **Region filter**: dropdown with all Welsh regions
- **Search**: text search for event names

### 2.2 Calendar View
Build a proper monthly calendar grid component at `src/components/events/EventCalendar.tsx`:
- Standard month grid (Mon-Sun columns, ~5-6 week rows)
- Previous/Next month navigation
- Days with events show a coloured dot (colour by category)
- Clicking a day shows a popover/panel listing that day's events
- Each event in the popover links to `/events/[slug]`
- Featured/promoted events show with a star icon and accent border
- Mobile: switch to a scrollable list grouped by date instead of grid

### 2.3 List View
- Chronologically sorted upcoming events
- Grouped by month with sticky month headers ("February 2026", "March 2026", etc.)
- Use the existing `EventCard` component (list variant)
- Promoted events appear first within each month, with a subtle "Promoted" badge
- Show a "Load more" button or infinite scroll for past months

### 2.4 Map View
- Full-width Leaflet map using the existing `MapView` component
- Pins for each event with lat/lng
- Clicking a pin shows a popup with: event name, date, type, "View details →" link
- Cluster pins when zoomed out (use marker clustering if available, otherwise just show individual pins)

### 2.5 "This Weekend" Widget
Create `src/components/events/ThisWeekendWidget.tsx`:
- Compact card showing events happening this weekend (Sat/Sun)
- Can be embedded on homepage and region pages
- Shows max 3 events with "See all →" link to `/calendar?filter=weekend`

---

## Part 3: Enhanced Event Detail Pages

Enhance the existing `/events/[slug]` page at `src/app/events/[slug]/page.tsx`.

### 3.1 Hero Image
- If `event.heroImage` exists, use it as the hero background
- If not, fall back to current behaviour (generic gradient)

### 3.2 Save/Heart Button
Add a heart button to event detail pages:
- Uses `sessionId` from a cookie (create one if it doesn't exist)
- POST to `/api/events/[id]/save` to toggle save
- Heart fills when saved, outline when not
- Show save count: "42 people saved this"
- Create a client component `src/components/events/SaveEventButton.tsx`

### 3.3 Share Button
Add share functionality:
- Web Share API on mobile (title + URL)
- Desktop fallback: copy link to clipboard with "Link copied!" toast
- WhatsApp share button: `https://wa.me/?text=Check%20out%20${encodeURIComponent(event.name)}%20${encodeURIComponent(url)}`
- Email share: `mailto:?subject=${event.name}&body=Check%20out%20this%20event%20${url}`
- Create a client component `src/components/events/ShareEventButton.tsx`

### 3.4 Add to Calendar
Add "Add to Calendar" button:
- Generate `.ics` file download for iCal/Outlook
- Google Calendar link: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${name}&dates=${start}/${end}&location=${location}&details=${description}`
- Create `src/components/events/AddToCalendarButton.tsx`

### 3.5 Weather Forecast
- If event date is within 7 days, show weather forecast for the event location
- The site already has weather components — check `src/components/weather/` and reuse

### 3.6 Related Events
- Show related events (same region or same type)
- Already partially implemented — enhance to prioritise same-type events

### 3.7 Event Schema Markup
Add JSON-LD Event structured data for Google rich results:
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "...",
  "startDate": "...",
  "endDate": "...",
  "location": { "@type": "Place", "name": "...", "address": "..." },
  "description": "...",
  "offers": { "@type": "Offer", "price": "...", "priceCurrency": "GBP", "url": "..." },
  "organizer": { "@type": "Organization", "name": "...", "url": "..." }
}
```
Check `src/components/seo/JsonLd.tsx` for the existing pattern and add a `createEventSchema` function.

---

## Part 4: API Routes

### 4.1 Save/Unsave Event
Create `src/app/api/events/[id]/save/route.ts`:
- POST: toggle save (create or delete `eventSaves` record)
- Use a `sessionId` cookie — generate with `crypto.randomUUID()` if not present
- Return `{ saved: boolean, count: number }`

### 4.2 External Feed Ingestion
Create `src/app/api/events/ingest/route.ts`:
- POST with `{ source: 'eventbrite' | 'manual', apiKey?: string }`
- Protected by `ADMIN_SECRET` header check
- For EventBrite: fetch from `https://www.eventbriteapi.com/v3/events/search/?location.address=Wales&categories=108&token=${EVENTBRITE_TOKEN}`
  - Category 108 = Sports & Fitness
  - Map EventBrite fields to our events schema
  - Set `externalSource: 'eventbrite'`, `externalId`, `externalUrl`
  - Skip events that already exist (check by `externalId`)
  - Set `status: 'draft'` so admin can review before publishing
- Return `{ imported: number, skipped: number }`
- If `EVENTBRITE_TOKEN` env var is not set, return a helpful error message

### 4.3 Submit Event (for operators)
Create `src/app/api/events/submit/route.ts`:
- POST: accepts event data from authenticated operators
- Requires valid operator session (use `getOperatorSession()` from `src/lib/auth.ts`)
- Creates event with `status: 'draft'`, `operatorId` set to the authenticated operator
- Promoted events: if `promoted: true`, check operator has `billingTier` of 'verified' or 'premium'
- Return `{ success: true, eventId: number }`

---

## Part 5: Operator "Add Event" Flow

### 5.1 Submit Event Page
Create `src/app/dashboard/events/page.tsx`:
- List operator's submitted events with status (draft/published)
- "Add New Event" button

Create `src/app/dashboard/events/new/page.tsx`:
- Form with fields: name, description, type/category, date start/end, location, lat/lng, website, ticket URL, registration cost, capacity, difficulty, age range, hero image URL
- Submit calls POST `/api/events/submit`
- Success message: "Your event has been submitted for review"

### 5.2 Promote Event CTA
On the operator's event list, if they're on verified/premium tier:
- "Promote this event" button → sets `isPromoted: true`, `promotedUntil: 30 days from now`
- If on free tier: "Upgrade to promote your events" → link to `/dashboard/billing`

### 5.3 Public "Add Your Event" Button
On the `/calendar` and `/events` pages, show a call-to-action:
- "List your event on Adventure Wales" → links to `/auth/login` (or `/dashboard/events/new` if already logged in)
- Styled as an accent-coloured banner, not intrusive

---

## Part 6: Events on Other Pages

### 6.1 Homepage Widget
Add to the homepage (`src/app/page.tsx` or the relevant homepage component):
- "What's On This Weekend" section showing 3 upcoming events
- Uses `ThisWeekendWidget` component from Part 2
- If no weekend events, show "Upcoming Events" instead

### 6.2 Region Pages Widget
In region pages, if events exist for that region:
- Show "Upcoming Events in [Region]" section
- Max 3 events, with "See all →" link to `/calendar?region=[slug]`
- Don't show the section if no events exist for the region

---

## Part 7: Admin Enhancements

### 7.1 Events Admin
Check if `src/app/admin/` has an events management page. If not, create `src/app/admin/events/page.tsx`:
- Table of all events: name, date, type, status, source (manual/eventbrite), promoted
- Approve/publish button for draft events
- Edit link for each event
- Filter by status (draft/published) and source
- "Run EventBrite Import" button that calls POST `/api/events/ingest`

---

## Environment Variables Needed

```
EVENTBRITE_TOKEN=           # Optional — EventBrite API key for feed ingestion
```

All other env vars (DATABASE_URL, JWT_SECRET, etc.) already exist.

---

## Files to Create (expected)

```
src/app/calendar/page.tsx
src/components/events/EventCalendar.tsx
src/components/events/ThisWeekendWidget.tsx
src/components/events/SaveEventButton.tsx
src/components/events/ShareEventButton.tsx
src/components/events/AddToCalendarButton.tsx
src/app/api/events/[id]/save/route.ts
src/app/api/events/ingest/route.ts
src/app/api/events/submit/route.ts
src/app/dashboard/events/page.tsx
src/app/dashboard/events/new/page.tsx
src/app/admin/events/page.tsx
scripts/migrate-events.sql
```

## Files to Modify (minimal changes only)

```
src/db/schema.ts — add new columns + eventSaves table
src/lib/queries.ts — add new event query functions
src/app/events/[slug]/page.tsx — enhance with save/share/calendar/schema
src/app/events/page.tsx — add "Add Your Event" CTA
src/components/seo/JsonLd.tsx — add createEventSchema
src/app/page.tsx — add ThisWeekendWidget (or the relevant homepage layout component)
```

---

## After Building

1. Run `npm run build` — must pass with zero errors
2. List all files created and modified
3. List any new environment variables needed
4. Do NOT delete any files
5. Do NOT modify files outside the scope listed above
