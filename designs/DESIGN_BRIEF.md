# Adventure Wales - Design Brief

## Overview

Build a mobile-first adventure tourism platform for Wales. These designs are the visual reference for all 12 page templates.

**First site:** Adventure Wales (adventurewales.com)
**Future sites:** Adventure West Country, Adventure Scotland (same codebase, multi-tenant)

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI / shadcn patterns
- **Maps:** Leaflet + OpenStreetMap (free, no API key)
- **Database:** Vercel Postgres + Drizzle ORM
- **Icons:** Lucide React

---

## Design Files

Each folder contains `mobile.png` and `desktop.png` (mobile-first approach).

| # | Page Type | Folder | Route Example | Notes |
|---|-----------|--------|---------------|-------|
| 01 | Homepage | `01-homepage/` | `/` | Hero, search, regions grid, itineraries |
| 02 | Region Hub | `02-region-hub/` | `/snowdonia` | Region overview with activities, stays, map |
| 03 | Activity Listing | `03-activity-listing/` | `/snowdonia/coasteering` | Filtered activity cards with operators |
| 04 | Itinerary Detail | `04-itinerary-detail/` | `/itineraries/3-day-adventure` | Day-by-day breakdown with map |
| 05 | Experience Detail | `05-experience-detail/` | `/experiences/velocity-2` | Single bookable activity page |
| 06 | Operator Directory | `06-operator-directory/` | `/directory` | Business listings with filters |
| 07 | Operator Profile | `07-operator-profile/` | `/directory/tyf-adventure` | Premium partner landing page |
| 08 | Accommodation Listing | `08-accommodation-listing/` | `/snowdonia/where-to-stay` | Property cards with adventure features |
| 09 | Events Calendar | `09-events-calendar/` | `/events` | Calendar/list view of races & events |
| 10 | FAQ/Answer Page | `10-faq-answer/` | `/answers/best-time-to-visit-snowdonia` | SEO-optimized answer page |
| 11 | Trip Planner | `11-trip-planner/` | `/plan` | Interactive wizard (mobile only designed) |
| 12 | Claim Listing | `12-claim-listing/` | `/directory/claim` | **NOT DESIGNED** - simple form page |

**Additional:** `ui-kit/` contains a component reference sheet.

---

## Design System

### Colors

```css
--brand-slate: #1e3a4c     /* Primary - dark teal/slate */
--brand-orange: #f97316    /* Accent - vibrant orange */
--success: #22c55e         /* Green */
--warning: #f59e0b         /* Amber */
--background: #ffffff      /* White */
--muted: #f8fafc           /* Light gray */
```

### Typography

- **Headings:** Bold, uppercase for section titles
- **Body:** Clean sans-serif, 16px minimum on mobile
- **Font display:** uppercase, bold, tracking-wider (for hero text)

### Spacing & Corners

- **Card radius:** 8-12px (rounded-lg to rounded-xl)
- **Mobile padding:** 16px horizontal
- **Desktop container:** max-width 1200px
- **Section spacing:** 48-64px vertical

### Interactive States

- Subtle hover lift on cards (shadow-md → shadow-lg)
- Orange accent on primary CTAs
- Bottom sheets for mobile filters/modals

---

## Key UI Patterns

### Partner Tier System

Partners have 3 tiers affecting display:

| Tier | Visual Treatment |
|------|------------------|
| **Stub** | Blurred image, lock icon overlay, "Claim Listing" CTA |
| **Claimed** | Full image, verified badge, contact info shown |
| **Premium** | Orange border, featured placement, booking CTA, offers section |

### Service Cards (Plan Your Trip)

Color-coded service icons:
- Accommodation: emerald
- Holidays: violet
- Rental: orange
- Transfers: sky blue
- Guides: amber
- Equipment: slate
- Experiences: rose

### Map Pins

Color-coded by content type:
- Blue: Activities
- Green: Accommodation
- Orange: Primary operators
- Gray: Secondary operators
- Red: Events
- Purple: Locations
- Black: Transport

---

## Page-by-Page Implementation Notes

### 01 - Homepage
- Full-bleed hero with gradient overlay
- Search bar: Where/What/When dropdowns
- 2x3 region card grid
- Horizontal scroll itineraries on mobile
- Activity type icon grid
- Newsletter signup section

### 02 - Region Hub
- Sticky tab navigation (Overview, Things to Do, Itineraries, etc.)
- Quick stats bar (78 Activities, 12 Operators...)
- Interactive Leaflet map with filtered pins
- Accordion for practical info sections

### 03 - Activity Listing
- Sticky filter bar with chips
- Activity cards: image, operator, location, price, duration, difficulty
- "Featured Operator" callout card after 3rd result
- FAQ accordion at bottom

### 04 - Itinerary Detail
- Day-by-day timeline layout
- Numbered map pins showing route
- Travel time indicators between stops
- Estimated costs breakdown table
- "Customize" CTA

### 05 - Experience Detail
- Image carousel with dots
- Floating booking card (price, date picker, guest count)
- What's Included two-column checklist
- Reviews section with rating breakdown
- Location map with directions

### 06 - Operator Directory
- Search bar with filters
- Featured Partners section (premium operators highlighted)
- Card list with: logo, name, location, activity tags, rating
- Alphabet quick-nav (optional)

### 07 - Operator Profile
- Cover image + circular logo
- Trust badges row
- Tab navigation (Experiences, About, Reviews, Location, Contact)
- Experience cards grid
- Special offers section (premium only)

### 08 - Accommodation Listing
- Type filters (Hostel, Hotel, B&B, Camping, Bunkhouse)
- Adventure feature tags (Bike Storage, Drying Room, Dog Friendly)
- Map/List view toggle
- "Adventure Pick" featured property callout

### 09 - Events Calendar
- Calendar/List view toggle
- Month navigation with prev/next
- Event cards grouped by month
- Date badge (day large, month small)
- Event type tags

### 10 - FAQ/Answer Page
- Quick Answer box (teal background) for featured snippets
- Table of contents sidebar (desktop)
- Month-by-month comparison table
- "People Also Ask" accordion
- "Was this helpful?" feedback buttons

### 11 - Trip Planner
- Step wizard: Where → When → What → Review
- Multi-select region cards
- Date range picker
- Activity type icons
- Generated itinerary with drag-to-reorder

### 12 - Claim Listing (not designed)
- Simple business search
- Claim form: name, email, role, verification
- Free vs Premium comparison table
- Testimonials from claimed businesses

---

## Database

Full schema in `docs/PLATFORM_DESIGN.md`. Key tables:

**Core Content:** sites, regions, activity_types, activities, locations, accommodation, events, transport, itineraries, itinerary_items, answers

**Commercial:** operators, operator_offers, advertisers, ad_campaigns, ad_creatives, ad_slots, page_ads, page_sponsors, service_slots

**Admin:** admin_users, content_rules, bulk_operations, status_history

---

## Seed Data

Wales CSV files in `data/wales/`:
- Activities.csv (78 records)
- Operators.csv (36 records)
- Locations.csv (64 records with GPS)
- Accommodation.csv (71 records)
- Events.csv (48 records)
- Transport.csv (64 records)
- Commercial Partners.csv (28 affiliate programs)

---

## Reference Implementations

See `docs/FRANCE_COMPONENT_PATTERNS.md` for:
- PlanYourTrip component (service grid)
- PartnerCard component (tier-based display)
- Ad components (HeroBanner, SponsorBadge)
- Service configuration patterns

---

## Priority Order

Build in this order:

1. **Foundation:** Site config, multi-tenant middleware, database schema
2. **Homepage + Region Hub:** Core navigation flow
3. **Activity Listing + Experience Detail:** Content consumption
4. **Operator Directory + Profile:** Business directory
5. **Accommodation + Events:** Supporting content
6. **Itinerary Detail + Trip Planner:** Trip planning features
7. **FAQ/Answer:** SEO content
8. **Claim Listing:** Partner acquisition
9. **Admin Dashboard:** Content management

---

## Questions?

Full technical spec: `docs/PLATFORM_DESIGN.md`
Component patterns: `docs/FRANCE_COMPONENT_PATTERNS.md`
