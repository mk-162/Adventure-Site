# Jules Build Spec - Adventure Wales

## Project Overview

Multi-tenant adventure tourism platform. First site: **Adventure Wales**.

- **Stack**: Next.js 15, Tailwind CSS, Drizzle ORM, Vercel Postgres
- **Design**: Mobile-first, adventure/outdoor aesthetic
- **Colors**: Primary teal (#1e3a4c), Accent orange (#f97316)

---

## What's Built

### Database ✅
- 27 tables fully schemaed in `src/db/schema.ts`
- Seeded with Wales data: 78 activities, 70 accommodation, 63 locations, 47 events, 35 operators, 11 regions

### Data Layer ✅
- Query functions in `src/lib/queries.ts` for all entities
- Supports filtering, relations, and search

### Components ✅
- **UI Components**: `src/components/ui/` (button, badge, card)
- **Card Components**: `src/components/cards/` (activity, operator, accommodation, event, region)
- **Layout**: `src/components/layout/` (header, footer)
- **Homepage**: `src/components/home/` (hero, search, regions grid, activities row, itineraries, events, newsletter)

### Pages ✅
| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ Built | Homepage with all sections |
| `/[region]` | ✅ Built | Region hub with stats, tabs, activities, accommodation |
| `/[region]/things-to-do` | ✅ Built | Activity listing with filters |
| `/[region]/where-to-stay` | ✅ Built | Accommodation listing |
| `/events` | ✅ Built | Events calendar/list |
| `/directory` | ✅ Built | Operator directory with filters |
| `/activities/[slug]` | ✅ Built | Single activity detail page |

---

## Pages Needed

### Priority 1 - Core Pages

#### `/directory/[slug]` - Operator Profile
Reference: `docs/PLATFORM_DESIGN.md` Section 7
- Hero with cover image, logo, trust badges
- Tabs: Experiences, About, Reviews, Location, Contact
- List of operator's activities
- Trust signals (years in business, ratings, certifications)

#### `/[region]/things-to-do/[activity-type]` - Activity Type Listing
Reference: `docs/PLATFORM_DESIGN.md` Section 3
- Filter by activity type within region
- Featured operator callout
- Activity description section
- FAQ accordion

#### `/itineraries` - Itineraries Listing
- Grid of curated multi-day trip itineraries
- Filter by region, duration, difficulty
- Card shows: image, duration badge, title, price estimate

#### `/itineraries/[slug]` - Single Itinerary
Reference: `docs/PLATFORM_DESIGN.md` Section 4
- Day-by-day breakdown with timeline
- Interactive map showing route
- Pricing breakdown table
- Activities linked to booking

### Priority 2 - Supporting Pages

#### `/accommodation/[slug]` - Accommodation Detail
- Image gallery
- Adventure features highlighted
- Map location
- Booking links (external)

#### `/events/[slug]` - Event Detail
- Event info, date, location
- Registration link
- Map

#### `/answers` - FAQ/Answer Engine
Reference: `docs/PLATFORM_DESIGN.md` Section 10
- Search-optimized FAQ pages
- Quick answer box for featured snippets
- Related questions accordion

#### `/answers/[slug]` - Single Answer Page
- Full article format
- Table of contents
- Related itineraries

#### `/plan` - Trip Planner Wizard
Reference: `docs/PLATFORM_DESIGN.md` Section 11
- Multi-step wizard (Where → When → What → Review)
- Generate custom itinerary
- Drag/drop to customize
- Save/share functionality

#### `/directory/claim` - Claim Your Listing
Reference: `docs/PLATFORM_DESIGN.md` Section 12
- Business search
- Claim form
- Free vs Premium comparison

---

## Design References

- **Design Brief**: `designs/DESIGN_BRIEF.md` (start here!)
- **Full design spec**: `docs/PLATFORM_DESIGN.md`
- **Component patterns**: `docs/FRANCE_COMPONENT_PATTERNS.md`
- **HTML Designs**: `designs/` folder with numbered HTML files

### Design Files
| File | Page |
|------|------|
| `designs/01-homepage.html` | Homepage |
| `designs/02-region-hub.html` | Region Hub |
| `designs/03-activity-listing.html` | Activity Type Listing |
| `designs/04-itinerary-detail.html` | Single Itinerary |
| `designs/05-experience-detail.html` | Single Activity/Experience |
| `designs/06-operator-directory.html` | Operator Directory |
| `designs/07-operator-profile.html` | Operator Profile |
| `designs/08-accommodation-listing.html` | Accommodation Listing |
| `designs/09-events-calendar.html` | Events Calendar |
| `designs/10-faq-answer.html` | FAQ/Answer Page |
| `designs/11-trip-planner.html` | Trip Planner Wizard |
| `designs/ui-kit.html` | Component Reference |
| `designs/index.html` | Design Index (open in browser)

---

## Patterns to Follow

### Data Fetching
```tsx
// Use query functions from lib/queries.ts
import { getRegionBySlug, getActivitiesByRegion } from "@/lib/queries";

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getRegionBySlug(slug);
  // ...
}
```

### Page Structure
```tsx
<div className="min-h-screen pt-16">
  {/* Header/Hero Section */}
  <section className="bg-[#1e3a4c] py-12">
    {/* Breadcrumb + Title */}
  </section>

  {/* Filters (sticky) */}
  <section className="bg-white border-b sticky top-16 z-30">
    {/* Filter chips/dropdowns */}
  </section>

  {/* Main Content */}
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Content */}
  </div>
</div>
```

### Using Card Components
```tsx
import { ActivityCard, OperatorCard } from "@/components/cards";

<ActivityCard
  activity={item.activity}
  region={item.region}
  operator={item.operator}
/>
```

### Styling Conventions
- Max width container: `max-w-7xl mx-auto px-4`
- Section padding: `py-8` to `py-16`
- Card grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Primary text: `text-[#1e3a4c]`
- Accent color: `text-[#f97316]` or `bg-[#f97316]`

---

## Notes

1. **Database is seeded** - all queries return real data
2. **Images are placeholders** - using Unsplash URLs for now
3. **Maps not implemented** - show placeholder, will use Leaflet + OpenStreetMap
4. **Auth not implemented** - admin features are future work
5. **Build works** - run `npm run build` to verify changes compile
6. **Dev server issues** - Vercel Postgres struggles in dev mode, use build for testing

---

## Commands

```bash
npm run dev        # Start dev server (may crash - use build instead)
npm run build      # Build for production
npm run db:push    # Push schema changes to database
npm run db:seed    # Re-seed database
npm run db:studio  # Open Drizzle Studio
```
