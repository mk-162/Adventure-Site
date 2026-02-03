# Adventure Network - Multi-Site Platform Design

## Overview
Mobile-first page templates for a **multi-tenant adventure tourism platform**. First site: Adventure Wales. Future sites: Adventure West Country, Adventure Scotland, etc.

These prompts are designed for Google Stitch to generate initial UI drafts.

---

## Platform Architecture

**Multi-tenant from day one:**
- Single codebase, single database
- Sites differentiated by domain (adventurewales.com, adventurewestcountry.com)
- All content scoped by `site_id`
- Shared components, site-specific theming/branding
- One admin dashboard manages all sites

**Key architectural features:**
- Every record has `lat`, `lng` for mapping
- Operators split: `primary` (integrated into UX) vs `secondary` (directory-only)
- Full commercial system: ads, sponsors, affiliates, partner tiers
- Bulk content management with consistency enforcement
- Status workflows: draft → review → published → archived

---

## Complete Database Schema

### Core Content Tables

```sql
-- Multi-tenant sites
sites (
  id, domain, name, tagline,
  logo_url, primary_color, accent_color,
  created_at, updated_at
)

-- Regions within a site
regions (
  id, site_id, name, slug, description,
  hero_image, hero_credit, lat, lng,
  status, -- draft|review|published|archived
  completeness_score, -- 0-100 calculated
  created_at, updated_at
)

-- Activity types taxonomy
activity_types (
  id, site_id, name, slug, icon, description
)

-- Activities/experiences
activities (
  id, site_id, region_id, operator_id, activity_type_id,
  name, slug, description, meeting_point,
  lat, lng, price_from, price_to, duration, difficulty,
  min_age, season, booking_url, source_url,
  status, completeness_score,
  created_at, updated_at
)

-- Locations/spots
locations (
  id, site_id, region_id, name, slug, description,
  lat, lng, parking_info, facilities, access_notes,
  best_time, crowd_level,
  status, created_at
)

-- Accommodation
accommodation (
  id, site_id, region_id, name, slug, type,
  address, lat, lng, website,
  price_from, price_to, adventure_features,
  booking_url, airbnb_url, google_rating, description,
  status, created_at
)

-- Events
events (
  id, site_id, region_id, name, slug, type,
  description, date_start, date_end, month_typical,
  location, lat, lng, website,
  registration_cost, capacity,
  status, created_at
)

-- Transport options
transport (
  id, site_id, region_id, type, name, route,
  stops, frequency, season, cost, website,
  lat, lng, notes, created_at
)

-- Itineraries
itineraries (
  id, site_id, region_id, title, slug, tagline,
  description, duration_days, difficulty, best_season,
  hero_image, price_estimate_from, price_estimate_to,
  status, completeness_score,
  created_at, updated_at
)

-- Itinerary day items
itinerary_items (
  id, itinerary_id, day_number, order_index,
  activity_id, accommodation_id, location_id,
  time_of_day, title, description, duration,
  travel_time_to_next
)

-- FAQ/Answer engine pages
answers (
  id, site_id, region_id, question, slug,
  quick_answer, full_content, related_questions,
  status, created_at, updated_at
)
```

### Commercial/Monetization Tables

```sql
-- Operators/Partners (activity providers + support services)
operators (
  id, site_id, name, slug,
  type, -- 'primary' | 'secondary'
  category, -- activity_provider|accommodation|food_drink|gear_rental|transport
  website, email, phone, address,
  lat, lng, description, tagline,
  logo_url, cover_image,
  google_rating, review_count, tripadvisor_url,
  price_range, -- £|££|£££
  unique_selling_point,

  -- Claim/tier system
  claim_status, -- stub|claimed|premium
  claimed_by_email, claimed_at,

  -- Trust signals (JSON)
  trust_signals, -- {verified, yearsInBusiness, rating, reviewCount}

  -- Service types this operator provides
  service_types, -- text[] (guides, rental, accommodation, transfers, lessons, holidays, experiences)

  -- Regions and activities covered
  regions, -- text[] of region slugs
  activity_types, -- text[] of activity type slugs

  created_at, updated_at
)

-- Partner offers/promotions
operator_offers (
  id, operator_id, title, discount,
  valid_from, valid_until, status
)

-- Advertisers (companies buying ads)
advertisers (
  id, site_id, name, contact_email,
  website, status, created_at
)

-- Ad campaigns
ad_campaigns (
  id, site_id, advertiser_id, name,
  status, -- draft|active|paused|ended
  start_date, end_date, budget,
  created_at, updated_at
)

-- Ad creatives
ad_creatives (
  id, campaign_id, slot_type,
  image_url, link_url, alt_text,
  targeting_regions, -- text[]
  targeting_activities, -- text[]
  priority, status
)

-- Ad slots configuration
ad_slots (
  id, site_id, page_type, slot_name,
  enabled, min_priority, -- direct|affiliate|programmatic|none
  fallback_creative_id,
  exclude_advertisers -- text[]
)

-- Page-specific ad assignments (like ads.json)
page_ads (
  id, site_id, page_type, page_slug,
  hero_banner, -- JSON: {creative_id, partner_slug, image, headline, cta, link}
  mpu_slots, -- JSON array
  link_list, -- JSON array
  created_at, updated_at
)

-- Sponsored content config
page_sponsors (
  id, site_id, page_type, page_slug,
  operator_id, display_name, tagline,
  cta_text, cta_url,
  exclude_other_ads, -- boolean
  created_at
)

-- Service slots config (cascading: default → sport → region → spot)
service_slots (
  id, site_id,
  scope_type, -- global|activity_type|region|location
  scope_slug, -- null for global, else the slug
  service_type, -- transfers|accommodation|rental|lessons|guides|holidays|experiences
  label, description, href,
  operator_id, -- linked partner
  visible, featured, icon, notes,
  expires_at
)
```

### Admin/CMS Tables

```sql
-- Admin users
admin_users (
  id, email, name, role, -- super|admin|editor|viewer
  site_permissions, -- text[] of site_ids they can access, null = all
  created_at, last_login
)

-- Content validation rules
content_rules (
  id, site_id, content_type, -- region|activity|itinerary|operator
  field_name, rule_type, -- required|min_length|max_length|regex|custom
  rule_value, error_message
)

-- Bulk operations log
bulk_operations (
  id, site_id, admin_user_id,
  operation_type, -- status_change|field_update|delete|export
  content_type, affected_ids, -- text[]
  changes, -- JSON of what changed
  created_at
)

-- Content status history
status_history (
  id, content_type, content_id,
  old_status, new_status,
  changed_by, reason, created_at
)
```

---

## Commercial System Architecture

### Partner Tier System

```
┌─────────────────────────────────────────────────────────┐
│                    PARTNER TIERS                        │
├─────────────┬─────────────┬─────────────────────────────┤
│    STUB     │   CLAIMED   │         PREMIUM             │
├─────────────┼─────────────┼─────────────────────────────┤
│ Basic info  │ Full info   │ All claimed features +      │
│ Blurred img │ Verified ✓  │ • Featured placements       │
│ "Claim" CTA │ Trust signs │ • In itineraries            │
│ No booking  │ Photos      │ • Hero CTA slots            │
│ No links    │ Contact     │ • Booking links             │
│             │ Website     │ • Special offers            │
│             │             │ • Analytics (future)        │
└─────────────┴─────────────┴─────────────────────────────┘
```

### Ad Slot System

```
Page Type          Available Slots
─────────────────────────────────────────────────
Homepage           hero_banner, featured_sponsor,
                   newsletter_sponsor, footer_banner

Region Page        hero_banner, sidebar_mpu,
                   in_content_1, in_content_2,
                   operator_spotlight

Activity Listing   top_banner, sidebar_mpu,
                   featured_operator (after 3rd),
                   bottom_banner

Itinerary Page     hero_sponsor_badge, day_sponsor,
                   accommodation_partner, booking_cta

Operator Page      (no ads - their own page)

Answer/FAQ Page    sidebar_mpu, bottom_banner
```

### Slot Filling Priority Waterfall

```
1. DIRECT CAMPAIGN (highest value)
   └─ Active campaign targeting this slot + context

2. PREMIUM OPERATOR
   └─ For operator_spotlight slots, rotate premium partners

3. AFFILIATE WIDGET
   └─ Booking.com, GetYourGuide, etc.

4. PROGRAMMATIC BACKFILL (lowest)
   └─ AdSense fills remaining inventory
```

### Service Types Matrix

```
Service Type    │ Icon    │ Applicable Sports
────────────────┼─────────┼──────────────────────────
transfers       │ Car     │ All
accommodation   │ Home    │ All
rental          │ Bike    │ skiing, mtb, surfing, kayaking
lessons         │ Users   │ skiing, surfing, climbing, kayaking
guides          │ Compass │ hiking, climbing, canyoning, mtb
holidays        │ Map     │ All
experiences     │ MapPin  │ All
```

### Service Slots Cascading Config

```
Lookup order (most specific wins):
1. Location-specific: /snowdonia/llanberis → service_slots where scope=location
2. Region-specific: /snowdonia → service_slots where scope=region
3. Activity-specific: /hiking → service_slots where scope=activity_type
4. Global defaults: service_slots where scope=global
```

---

## Admin Dashboard Architecture

```
/admin/
│
├── /dashboard
│   └─ Overview stats, alerts, recent activity
│
├── /content/
│   ├── /regions          → CRUD + map view + bulk edit
│   ├── /activities       → CRUD + map view + bulk edit
│   ├── /itineraries      → Builder UI + bulk edit
│   ├── /operators        → CRUD + claim queue + bulk edit
│   ├── /accommodation    → CRUD + map view + bulk edit
│   ├── /events           → CRUD + calendar view + bulk edit
│   ├── /locations        → CRUD + map view + bulk edit
│   ├── /answers          → CRUD + bulk edit
│   └── /bulk-ops         → Batch operations center
│
├── /commercial/
│   ├── /advertisers      → Advertiser accounts
│   ├── /campaigns        → Campaign management
│   ├── /creatives        → Creative assets
│   ├── /slots            → Slot configuration
│   ├── /sponsors         → Sponsored content setup
│   ├── /service-slots    → Service grid config
│   └── /claims           → Partner claim requests
│
├── /sites/
│   └── /[site]/
│       ├── /settings     → Domain, theme, branding
│       ├── /users        → Site-specific admins
│       └── /analytics    → (Future) site stats
│
└── /settings/
    ├── /users            → Global admin users
    ├── /rules            → Content validation rules
    └── /system           → Platform config
```

---

## Bulk Content Management

### Consistency Enforcement

Every content type has validation rules:

```
Region Requirements:
  ✓ Hero image (required)
  ✓ Description (min 100 chars)
  ✓ Coordinates (lat/lng)
  ✓ Meta title + description
  ✓ At least 1 linked activity

Activity Requirements:
  ✓ Name + description
  ✓ Price range (from/to)
  ✓ Duration + difficulty
  ✓ Operator linked
  ✓ Region assigned
  ✓ At least 1 image

Itinerary Requirements:
  ✓ Title + tagline
  ✓ Duration (days)
  ✓ At least 1 day with items
  ✓ Hero image
  ✓ Difficulty + best season

Operator Requirements:
  ✓ Name + description
  ✓ Website OR email
  ✓ At least 1 region
  ✓ At least 1 service type
  ✓ Address + coordinates (primary only)
```

### Completeness Scoring

Each record gets a 0-100 completeness score:
- Missing required field: -20 points
- Missing recommended field: -5 points
- No image: -15 points
- Short description (<100 chars): -10 points

Dashboard shows: "Average completeness: 78% (12 items need attention)"

### Batch Editing Operations

```
Supported batch operations:
├── Status change (draft → published, etc.)
├── Field updates (set region, set difficulty, etc.)
├── Bulk assign operator
├── Bulk assign activity type
├── Bulk geocode (fill missing lat/lng)
├── Bulk export (CSV/JSON)
├── Bulk delete (with confirmation)
└── Bulk duplicate (for templates)
```

### Status Workflow

```
draft ──→ review ──→ published ──→ archived
  ↑         │            │
  └─────────┴────────────┘
       (can go back)
```

- **draft**: Work in progress, not public
- **review**: Ready for editor approval
- **published**: Live on site
- **archived**: Hidden but preserved

---

## Maps System

### Technology
- **Leaflet** (free, no API key)
- **OpenStreetMap** tiles
- **react-leaflet** for React integration

### Map Locations (Public Site)

```
Page                │ What's Mapped
────────────────────┼─────────────────────────────
Region hub          │ All content in region
Activity listing    │ Spots for that activity
Itinerary page      │ Day-by-day route (numbered)
Operator page       │ Business location + meeting points
Accommodation page  │ Property location
Trip planner        │ Interactive as you build
```

### Map Locations (Admin)

```
Feature             │ Purpose
────────────────────┼─────────────────────────────
List view toggle    │ Switch any table to map view
Edit form picker    │ Click map to set/adjust coordinates
Bulk geocode tool   │ Map interface for batch operations
Coverage heatmap    │ See content density by area
```

### Pin Types (Color-Coded)

```
🔵 Blue    → Activities/experiences
🟢 Green   → Accommodation
🟠 Orange  → Operators (primary)
⚪ Gray    → Operators (secondary)
🔴 Red     → Events
📍 Purple  → Locations/spots
🚉 Black   → Transport
```

### Pin Popup Content

```
┌─────────────────────────┐
│ [Image]                 │
│ Name          [Type]    │
│ Price: £50-80           │
│ ★★★★☆ (234 reviews)    │
│ [View Details →]        │
└─────────────────────────┘
```

---

## Design System

**Typography:**
- Headings: Bold, uppercase for section titles
- Body: Clean sans-serif, good line height for readability
- Mobile: 16px minimum body text

**Colors (per-site theming):**
- Primary: Deep teal/slate (#1e3a4c) - Wales default
- Accent: Vibrant orange (#f97316)
- Success: Green (#22c55e)
- Warning: Amber (#f59e0b)
- Background: White and light gray (#f8fafc)

**Components:**
- Cards: Rounded corners (8-12px), subtle shadow on hover
- Buttons: Rounded, clear hierarchy (primary orange, secondary outline)
- Badges: Small, pill-shaped, color-coded by type
- Icons: Consistent style (Lucide or similar)

**Spacing:**
- Mobile: 16px horizontal padding
- Desktop: Max-width container (1200px) with generous margins
- Section spacing: 48-64px vertical

**Interactions:**
- Subtle hover states on cards
- Smooth scroll behavior
- Bottom sheets for mobile filters/modals
- Skeleton loading states

---

## 1. Homepage

**Stitch Prompt:**

```
Create a mobile-first homepage for a Wales adventure tourism website called "Adventure Wales".

HERO SECTION:
- Full-screen hero image with dark gradient overlay (mountain/coast scene)
- Large bold headline: "Your Welsh Adventure Starts Here"
- Subheadline: "Plan unforgettable outdoor experiences across Wales"
- Two CTA buttons side by side: "Explore Regions" (primary orange) and "Browse Itineraries" (outline white)
- On mobile: stack buttons vertically

QUICK SEARCH BAR:
- Floating card overlapping bottom of hero
- Three dropdown selectors in a row: "Where" (regions), "What" (activity types), "When" (months)
- Orange "Search" button
- On mobile: stack selectors vertically

FEATURED REGIONS SECTION:
- Section title: "Explore Wales"
- 2x3 grid of region cards (2 columns on mobile, 3 on desktop)
- Each card: background image, region name overlay, activity count badge
- Regions: Snowdonia, Pembrokeshire, Brecon Beacons, Anglesey, Gower, Llŷn Peninsula
- Cards have subtle hover zoom effect

FEATURED ITINERARIES SECTION:
- Section title: "Popular Itineraries"
- Horizontal scroll carousel on mobile
- 3-column grid on desktop
- Each card shows: hero image, duration badge (e.g., "3 Days"), title, region tag, brief description, price indicator
- "View All Itineraries" link at bottom

ACTIVITY TYPES SECTION:
- Section title: "Find Your Adventure"
- Icon grid: 8 activity types in 2x4 grid (4x2 on desktop)
- Each item: circular icon, activity name below
- Activities: Hiking, Coasteering, Mountain Biking, Surfing, Climbing, Kayaking, Caving, Zip Lines

UPCOMING EVENTS SECTION:
- Section title: "Events & Races"
- List of 3-4 upcoming events
- Each row: date badge (month/day stacked), event name, location, event type tag
- "View All Events" link

NEWSLETTER SIGNUP:
- Full-width teal background section
- Headline: "Get Trip Inspiration"
- Email input + "Subscribe" button inline
- Privacy note small text below

FOOTER:
- Logo and tagline
- 4 columns: Regions, Activities, Plan Your Trip, About
- Social media icons
- Copyright and legal links

Style: Clean, modern, outdoorsy. Use plenty of whitespace. Images should feel authentic and adventurous, not stock-photo generic. Typography should be bold and confident.
```

---

## 2. Region Hub Page (e.g., /snowdonia)

**Stitch Prompt:**

```
Create a mobile-first region hub page for "Snowdonia" on an adventure tourism website.

HERO SECTION:
- Full-width hero image (Snowdonia mountains)
- Dark gradient overlay from bottom
- Large headline: "Snowdonia"
- Subheadline: "Wales' adventure capital - mountains, zip lines, and wild swimming"
- Breadcrumb above headline: Home > Snowdonia
- Photo credit small text bottom right

QUICK STATS BAR:
- Horizontal scrollable on mobile, full-width on desktop
- 4-5 stat pills: "78 Activities", "12 Operators", "24 Places to Stay", "15 Events"
- Each pill is tappable/clickable

TAB NAVIGATION:
- Sticky tabs below hero on scroll
- Tabs: Overview, Things to Do, Itineraries, Where to Stay, Events, Getting There
- Active tab has orange underline
- Horizontal scroll on mobile if needed

OVERVIEW TAB CONTENT:

Introduction:
- 2-3 paragraph region description
- Pull quote or highlight box with key fact

Top Activities Grid:
- Section title: "Top Things to Do in Snowdonia"
- 2-column grid of activity cards
- Each card: small image, activity name, operator name, price range, duration, difficulty badge
- "View All Activities" button

Featured Itineraries:
- Section title: "Suggested Itineraries"
- 2-3 itinerary cards in horizontal scroll on mobile
- Each card: image, duration badge, title, short description

Interactive Map:
- Section title: "Explore the Area"
- Embedded map showing pins for activities, accommodation, locations
- Filter toggles above map: Activities, Stays, Attractions
- Map takes ~60% of viewport height

Where to Stay Preview:
- Section title: "Where to Stay"
- 3 accommodation cards: image, name, type badge (Hostel/Hotel/Camping), price range, adventure features tags
- "View All Accommodation" link

Practical Info Accordion:
- Section title: "Plan Your Visit"
- Accordion sections: Best Time to Visit, Getting There, Weather, Essential Gear
- Each section expandable with icon

LOCAL OPERATORS SIDEBAR (desktop only):
- "Book with Local Experts" heading
- 3-4 operator cards with logo, name, rating, specialties
- "View All Operators" link

BOTTOM CTA:
- Full-width orange background
- "Ready to plan your Snowdonia adventure?"
- "Start Planning" button

Style: Content-rich but scannable. Use cards and grids to organize information. Make it easy to drill down into specific activities or itineraries.
```

---

## 3. Activity Type Page (e.g., /snowdonia/things-to-do/coasteering)

**Stitch Prompt:**

```
Create a mobile-first activity listing page for "Coasteering in Snowdonia" on an adventure tourism website.

HEADER:
- Breadcrumb: Home > Snowdonia > Things to Do > Coasteering
- Page title: "Coasteering in Snowdonia"
- Subtitle: "Cliff jumping, sea swimming, and coastal exploration"
- Activity stats row: "8 Experiences", "4 Operators", "From £50"

FILTER BAR:
- Sticky on scroll
- Horizontal filter chips: Difficulty (All, Beginner, Intermediate, Advanced), Price Range, Duration
- Sort dropdown: "Recommended", "Price: Low-High", "Rating"
- On mobile: "Filters" button opens bottom sheet

ACTIVITY CARDS LIST:
- Vertical list of activity cards
- Each card contains:
  - Left: Square image (activity photo)
  - Right content:
    - Activity name (bold)
    - Operator name with verified badge
    - Location with pin icon
    - Duration and difficulty badges inline
    - Price: "From £55 per person"
    - Star rating with review count
    - "Book Now" button (orange, small)
- On desktop: cards can be 2-column grid

FEATURED OPERATOR CALLOUT:
- After 3rd card, insert highlighted box
- "Featured Operator" badge
- Operator logo, name, description
- "View Profile" and "Book Direct" buttons
- Subtle orange border to distinguish

ACTIVITY DESCRIPTION SECTION:
- Section title: "About Coasteering"
- 2-3 paragraphs explaining the activity
- "What to Expect" bullet list
- "What's Included" bullet list
- "Requirements" (age, fitness, etc.)

BEST SPOTS MAP:
- Section title: "Where to Go Coasteering"
- Map with pins for coasteering locations
- Location list below map with name, description, best for (beginners/advanced)

FAQ ACCORDION:
- Section title: "Frequently Asked Questions"
- 5-6 common questions about coasteering
- Expandable accordion format
- Questions like: "Do I need experience?", "What should I wear?", "Is it safe?"

RELATED ACTIVITIES:
- Section title: "You Might Also Like"
- Horizontal scroll of 3-4 related activity cards (Sea Kayaking, Surfing, Wild Swimming)

Style: Easy to scan and compare options. Cards should be tappable to expand or navigate. Filters should be intuitive and not overwhelming.
```

---

## 4. Single Itinerary Page (e.g., /snowdonia/itineraries/3-day-adventure-weekend)

**Stitch Prompt:**

```
Create a mobile-first itinerary detail page for "3-Day Snowdonia Adventure Weekend" on an adventure tourism website.

HERO SECTION:
- Full-width hero image (action shot from the itinerary)
- Dark gradient overlay
- Duration badge top left: "3 Days"
- Headline: "Snowdonia Adventure Weekend"
- Tagline: "Zip lines, mountain hiking, and gorge walking"
- Key info row: Region tag, Difficulty badge, Best Season, Group size
- Price indicator: "From £350 per person"
- Two CTAs: "Save Itinerary" (heart icon, outline) and "Enquire Now" (orange solid)

ITINERARY OVERVIEW CARD:
- Floating card below hero
- 3-column layout (stack on mobile):
  - Activities: "6 experiences"
  - Accommodation: "2 nights"
  - Meals: "Not included"
- "What's Included" expandable section

DAY-BY-DAY BREAKDOWN:
- Vertical timeline layout
- Each day is a section:

  Day header: "Day 1 - Arrival & Zip World"

  Timeline of activities:
  - Time: "10:00 AM"
  - Activity card: Image, name, duration, operator
  - Description: 2-3 sentences
  - "Book This" button (small, outline)

  Between activities: travel time indicator ("15 min drive")

  End of day: Accommodation card
  - Property image, name, type, location
  - "View Options" link

  Evening suggestion: "Dinner recommendation: [Restaurant name]"

- Repeat for Day 2, Day 3

INTERACTIVE MAP:
- Section title: "Your Route"
- Map showing all stops connected by route line
- Day selector tabs above map (Day 1, Day 2, Day 3, All)
- Pins numbered in order

PRICING BREAKDOWN:
- Section title: "Estimated Costs"
- Table format:
  - Activities: £180
  - Accommodation: £120
  - Transport: £50
  - Food (estimate): £60
  - Total: £350-410
- Note: "Prices are estimates. Book directly with operators for exact pricing."

CUSTOMIZATION CTA:
- Highlighted box
- "Want to customize this itinerary?"
- "Our trip planner can help you adjust activities, dates, and accommodation"
- "Start Planning" button

SIMILAR ITINERARIES:
- Section title: "More Snowdonia Itineraries"
- 3 cards in horizontal scroll
- Different durations/themes

SHARE & SAVE:
- Sticky bottom bar on mobile
- "Share" button (icon)
- "Save" button (heart icon)
- "Enquire" button (primary, orange)

Style: Visual and inspiring. The day-by-day format should feel like flipping through a travel journal. Use timeline/journey visual metaphors.
```

---

## 5. Single Activity/Experience Page (e.g., /directory/zip-world-velocity)

**Stitch Prompt:**

```
Create a mobile-first activity detail page for "Velocity 2 - World's Fastest Zip Line" by Zip World.

HERO SECTION:
- Image carousel (swipeable, 4-5 images)
- Dots indicator for carousel position
- Back button top left
- Share and Save icons top right
- Floating info card at bottom of hero:
  - Operator logo + name
  - Activity name: "Velocity 2"
  - Rating: 4.8 stars (2,340 reviews)
  - Price: "From £89"

QUICK INFO BAR:
- Horizontal scroll pills
- Duration: "2-3 hours"
- Difficulty: "Moderate"
- Min Age: "10+"
- Season: "Mar-Oct"
- Location: "Penrhyn Quarry, Bethesda"

BOOK NOW SECTION:
- Sticky card (bottom on mobile, sidebar on desktop)
- Price: "£89 - £109 per person"
- Date picker
- Guest counter (+/-)
- "Check Availability" button (orange)
- "Usually books out 2 weeks ahead" urgency text

DESCRIPTION TAB:
- Tab navigation: Overview, What's Included, Reviews, Location
- Overview content:
  - 3-4 paragraph description
  - Key highlights bullet list with checkmarks
  - "Read More" expandable if long

WHAT'S INCLUDED:
- Two-column list with icons:
  - Included (green checks): Safety briefing, All equipment, Instructors, Photos
  - Not included (grey x): Transport, Food, Accommodation

REQUIREMENTS:
- Warning/info box style
- "Before You Book" heading
- Requirements list: Min/max weight, age, fitness level, what to wear

OPERATOR INFO:
- Section title: "About Zip World"
- Operator card: Logo, name, bio snippet
- Trust signals: "Established 2013", "500,000+ customers", "TripAdvisor Excellent"
- "View All Zip World Experiences" link

REVIEWS SECTION:
- Section title: "Reviews"
- Overall rating large display: 4.8/5 with star visualization
- Rating breakdown bars (5 star, 4 star, etc.)
- Filter tabs: "All", "Families", "Solo", "Groups"
- Review cards:
  - Reviewer name, date, rating stars
  - Review text (truncated with "Read more")
  - Helpful button
- "Load More Reviews" button

LOCATION & GETTING THERE:
- Map showing pin location
- Address with copy button
- "Get Directions" button (opens maps app)
- Parking info
- Public transport info
- Nearest train station with distance

SIMILAR EXPERIENCES:
- Section title: "More Adventures Nearby"
- Horizontal scroll of 3-4 cards from same region or operator

FAQ:
- 4-5 questions specific to this activity
- Accordion format

BOTTOM BOOKING BAR (mobile):
- Fixed at bottom
- Price display
- "Book Now" button full width

Style: Trust-building and conversion-focused. Make booking frictionless. Reviews and social proof prominent. Clear pricing and availability.
```

---

## 6. Business Directory Page (e.g., /directory/operators)

**Stitch Prompt:**

```
Create a mobile-first business directory page for adventure operators in Wales.

HEADER:
- Page title: "Adventure Operators"
- Subtitle: "Find and book with trusted local providers"
- Search bar: "Search operators..." with search icon

FILTER SECTION:
- Horizontal scroll filter chips on mobile
- Filters:
  - Region: All, Snowdonia, Pembrokeshire, Brecon Beacons, etc.
  - Activity Type: All, Coasteering, Hiking, MTB, etc.
  - Rating: 4+ stars, 4.5+ stars
- "Clear Filters" link
- Results count: "Showing 36 operators"

SORT OPTIONS:
- Dropdown: "Sort by: Recommended"
- Options: Recommended, Rating, Name A-Z, Most Reviews

FEATURED OPERATORS SECTION:
- Section title: "Featured Partners" with small "Partner" badge
- 2-3 premium operator cards with larger images
- Each card: Large image, logo, name, tagline, rating, activity tags, "Featured" badge
- Subtle highlight border (orange)

OPERATOR LISTING:
- Card list format
- Each operator card:
  - Left: Square logo/image
  - Right:
    - Operator name (bold) with verified badge if claimed
    - Location with pin icon
    - Activity type tags (max 3, "+2 more" if overflow)
    - Rating: stars + review count
    - Price range indicator: £, ££, or £££
    - Brief USP text (one line)
  - Right edge: Chevron arrow
- Cards are tappable to navigate to operator page

ALPHABET QUICK NAV (optional):
- Sticky alphabet strip on right edge
- Jump to operators starting with letter

CLAIM CTA SECTION:
- After every 10 listings, insert CTA box
- "Own a business in Wales?"
- "Claim your free listing and reach thousands of adventure travelers"
- "Claim Your Listing" button

PAGINATION:
- "Load More" button at bottom
- Or infinite scroll with loading indicator

EMPTY STATE:
- If no results: "No operators found"
- "Try adjusting your filters or search terms"
- "Browse all operators" link

FOOTER CTA:
- "Can't find what you're looking for?"
- "Suggest an operator" link

Style: Directory should feel comprehensive but not overwhelming. Easy to scan, filter, and find. Trust signals (ratings, verified badges) prominent.
```

---

## 7. Operator Landing Page (Primary) (e.g., /directory/tyf-adventure)

**Stitch Prompt:**

```
Create a mobile-first operator profile page for "TYF Adventure" - a premium adventure provider.

HERO SECTION:
- Cover image (action shot from their activities)
- Operator logo (circular, overlapping bottom of cover)
- Business name: "TYF Adventure"
- Tagline: "Pioneered coasteering since 1986"
- Location: "St Davids, Pembrokeshire"
- Trust badges row: "B Corp Certified", "35+ Years", "TripAdvisor Excellent"
- Rating: 5.0 stars (2,000+ reviews)
- CTA buttons: "View Experiences" (primary), "Contact" (outline)

QUICK INFO CARDS:
- Horizontal scroll row of info cards:
  - Card 1: "Activities" with count and icons
  - Card 2: "Price Range" (££)
  - Card 3: "Group Size" (1-20)
  - Card 4: "Regions" (Pembrokeshire)

TAB NAVIGATION:
- Tabs: Experiences, About, Reviews, Location, Contact
- Sticky on scroll

EXPERIENCES TAB:
- Section title: "Book an Experience"
- Filter chips: All, Coasteering, Kayaking, Surfing, Climbing
- Activity cards grid (2 column on mobile):
  - Activity image
  - Activity name
  - Duration + Difficulty badges
  - Price: "From £60"
  - "Book" button
- "View All 12 Experiences" if more than 6

ABOUT TAB:
- "About TYF Adventure" heading
- 3-4 paragraph company description
- "Our Story" section with founding date
- "What Makes Us Different" bullet points
- Team photo or group action shot
- Certifications/accreditations logos

REVIEWS TAB:
- Rating summary: Large 5.0 display
- "2,000+ verified reviews"
- Source badges: TripAdvisor, Google
- Review highlights (AI-generated summary of common praise)
- Individual review cards with platform icon
- "See All Reviews on TripAdvisor" external link

LOCATION TAB:
- Map with pin
- Address card with copy button
- "Get Directions" button
- Meeting point info
- Parking details
- What3Words location (if applicable)

CONTACT TAB:
- Contact form: Name, Email, Message, Submit
- Or direct contact info:
  - Phone (tap to call)
  - Email (tap to email)
  - Website (external link)
- Social media links
- Operating hours

SPECIAL OFFERS (if claimed/premium):
- Section title: "Current Offers"
- Offer cards:
  - Offer title
  - Discount/deal description
  - Valid until date
  - "Book with Offer" button

RELATED OPERATORS:
- Section title: "Similar Operators in Pembrokeshire"
- 3 cards in horizontal scroll

BOTTOM STICKY BAR:
- "Book with TYF Adventure"
- "View Experiences" button

Style: Professional but adventurous. Build trust through reviews, certifications, and years of experience. Make booking easy and prominent.
```

---

## 8. Accommodation Listing Page (e.g., /snowdonia/where-to-stay)

**Stitch Prompt:**

```
Create a mobile-first accommodation listing page for "Where to Stay in Snowdonia".

HEADER:
- Breadcrumb: Home > Snowdonia > Where to Stay
- Page title: "Where to Stay in Snowdonia"
- Subtitle: "Adventure-friendly accommodation from hostels to hotels"
- Results count: "24 properties"

FILTER BAR:
- Sticky filters
- Filter chips:
  - Type: All, Hostels, Hotels, B&Bs, Camping, Bunkhouses
  - Price: Budget (£), Mid-Range (££), Premium (£££)
  - Features: Bike Storage, Drying Room, Dog Friendly, Self-Catering
- "Filters" button on mobile opens bottom sheet with all options
- Sort: "Recommended", "Price: Low-High", "Rating"

MAP VIEW TOGGLE:
- Toggle button: "List" | "Map"
- Map view shows all properties as pins
- Tapping pin shows preview card

ACCOMMODATION CARDS:
- Vertical list of property cards
- Each card:
  - Image (landscape, left side on desktop / top on mobile)
  - Property name
  - Type badge: "Hostel", "B&B", etc.
  - Location with distance to key spot: "10 min from Llanberis Path"
  - Star rating + review count
  - Price: "From £25/night"
  - Adventure features tags: 🚴 Bike Storage, 👕 Drying Room (icons + text, max 3)
  - "View Details" button or whole card tappable
- On desktop: 2-column grid

FEATURED PROPERTY:
- Highlighted card after first 3 results
- "Adventure Pick" badge
- Larger image
- Callout: "Popular with hikers - 5 min from Pen-y-Pass"

ADVENTURE FEATURES EXPLAINER:
- Collapsible section
- "What do adventure features mean?"
- List explaining: Drying Room, Bike Storage, Gear Wash, etc.

BOOKING PARTNERS:
- Note at bottom: "Book via our partners"
- Booking.com and Airbnb logos
- "We earn a small commission at no extra cost to you"

NEARBY REGIONS:
- "Also consider staying in:"
- Chips linking to: Betws-y-Coed, Llanberis, Beddgelert

Style: Practical and functional. Easy to filter by adventure-relevant features. Trust signals important. Clear pricing.
```

---

## 9. Events Calendar Page (e.g., /events or /snowdonia/events)

**Stitch Prompt:**

```
Create a mobile-first events calendar page for adventure events in Wales.

HEADER:
- Page title: "Events & Races"
- Subtitle: "Races, festivals, and adventure events across Wales"
- Current month/year display with prev/next arrows

VIEW TOGGLE:
- Toggle: "List" | "Calendar"
- Calendar view shows month grid with event dots
- List view is default on mobile

FILTER BAR:
- Filter chips:
  - Region: All, Snowdonia, Pembrokeshire, etc.
  - Type: All, Running, Triathlon, Cycling, MTB, Festival, Walking
  - Month: Dropdown or horizontal scroll of months
- "This Weekend" quick filter chip
- "Clear" link

FEATURED EVENT:
- Large hero card at top
- Event image
- Date badge (prominent)
- Event name
- Location
- "Featured" badge
- Short description
- "Learn More" button

EVENTS LIST:
- Grouped by month
- Month header: "February 2026"
- Event cards:
  - Left: Date block (day number large, month small, stacked)
  - Right:
    - Event name (bold)
    - Event type tag (Running, MTB, etc.)
    - Location with pin icon
    - Registration cost range
    - "Selling Fast" badge if applicable
  - Cards tappable to expand or navigate

EXPANDED EVENT CARD (or detail modal):
- Full description
- Distances/categories available
- Registration link (external)
- Location map
- "Add to Calendar" button
- Share button

CALENDAR VIEW:
- Month grid layout
- Days with events have colored dots
- Tapping day shows events in bottom sheet or side panel
- Color coding by event type

SUBMIT EVENT CTA:
- "Running an event in Wales?"
- "Submit your event for free"
- Link to submission form

NO EVENTS STATE:
- If filtered to no results: "No events found"
- "Try a different month or region"

NEWSLETTER SIGNUP:
- "Never miss an event"
- Email signup for event alerts

Style: Clean calendar interface. Easy to browse by date or filter by type. Make registration links prominent.
```

---

## 10. FAQ / Answer Engine Page (e.g., /answers/best-time-to-visit-snowdonia)

**Stitch Prompt:**

```
Create a mobile-first FAQ answer page optimized for search engines (Answer Engine Optimization).

HEADER:
- Breadcrumb: Home > Answers > Snowdonia
- Question as H1: "What is the Best Time to Visit Snowdonia?"
- Author/source line: "Updated January 2026 • 5 min read"
- Share buttons (small, right aligned)

QUICK ANSWER BOX:
- Highlighted box at top (light teal background)
- "Quick Answer" label
- 2-3 sentence direct answer to the question
- This is what Google might pull for featured snippets

TABLE OF CONTENTS:
- Sticky sidebar on desktop
- Collapsible on mobile
- Links to sections within the page

MAIN CONTENT:
- Well-structured article format
- H2 sections:
  - "Month-by-Month Breakdown"
  - "Best Time for [Activity]" (Hiking, Climbing, etc.)
  - "Weather Considerations"
  - "Avoiding Crowds"
  - "Our Recommendation"

- Use:
  - Bullet lists for scanability
  - Comparison tables (e.g., month vs. weather vs. crowds)
  - Callout boxes for tips
  - Relevant images with captions

MONTHLY BREAKDOWN TABLE:
- Responsive table
- Columns: Month, Weather, Crowds, Best For, Rating
- Rating as colored indicator (green/amber/red)

RELATED ITINERARIES:
- Section: "Plan Your Visit"
- 2-3 itinerary cards relevant to the topic
- "View All Snowdonia Itineraries" link

RELATED QUESTIONS:
- Section: "People Also Ask"
- Accordion of 4-5 related questions
- Each expands to show brief answer + "Read More" link
- Questions like:
  - "How many days do you need in Snowdonia?"
  - "Is Snowdonia good for beginners?"
  - "What should I pack for Snowdonia?"

SOURCES/REFERENCES:
- Small text section at bottom
- Links to official sources (Met Office, Visit Wales, etc.)

FEEDBACK:
- "Was this helpful?" Yes/No buttons
- "Suggest an improvement" link

BOTTOM CTA:
- "Ready to plan your trip?"
- "Browse Snowdonia Activities" button

SCHEMA MARKUP NOTE:
- (For developer) Page should include FAQ schema, Article schema, Breadcrumb schema

Style: Authoritative and trustworthy. Easy to scan with clear headings. Optimized for both users and search engines. Answer the question quickly, then provide depth.
```

---

## 11. Trip Planner Page (e.g., /plan)

**Stitch Prompt:**

```
Create a mobile-first interactive trip planner page for building custom Wales adventures.

HEADER:
- Page title: "Plan Your Adventure"
- Subtitle: "Build your perfect Wales itinerary"

STEP INDICATOR:
- Progress bar or step dots
- Steps: 1. Where, 2. When, 3. What, 4. Review
- Current step highlighted

STEP 1 - WHERE:
- "Where do you want to go?"
- Region selection grid (2x3)
- Each region: image card with name
- Multi-select allowed
- "Anywhere" option
- "Next" button at bottom

STEP 2 - WHEN:
- "When are you visiting?"
- Calendar date range picker
- Or quick options: "This Weekend", "Next Month", "Flexible"
- Duration selector: "How many days?" (1-7+ slider or buttons)
- "Next" button

STEP 3 - WHAT:
- "What do you want to do?"
- Activity type selection grid
- Icons with labels: Hiking, Coasteering, MTB, etc.
- Multi-select
- Intensity preference: "Relaxed", "Active", "Extreme" toggle
- Budget indicator: £ / ££ / £££ selector
- "Generate Itinerary" button

LOADING STATE:
- "Creating your perfect trip..."
- Animated illustration or progress bar
- Fun facts about Wales while loading

STEP 4 - REVIEW:
- "Your Custom Itinerary"
- Generated itinerary displayed in day-by-day format (similar to itinerary detail page)
- Each activity card has:
  - Drag handle for reordering
  - "Swap" button to see alternatives
  - "Remove" button (X)
- "Add Activity" button between days
- Running cost total at bottom

CUSTOMIZATION PANEL:
- Slide-out or modal
- Swap activity: shows alternatives
- Add activity: browse/search activities for that day/region
- Adjust accommodation

SAVE & SHARE:
- "Save Itinerary" - requires email/account
- "Share Itinerary" - generates shareable link
- "Download PDF" - export option
- "Send to Email" - email the itinerary

BOOKING CTA:
- "Ready to book?"
- Summary of bookable activities with "Book Now" buttons
- Or "Enquire about this trip" for package enquiry

EMPTY/ERROR STATES:
- If no activities match: "We couldn't find activities for your criteria"
- Suggestions to broaden filters
- "Talk to an expert" fallback

Style: Wizard-style, step-by-step flow. Friendly and engaging. Make the generation feel magical. Easy to customize results. Conversion-focused at the end.
```

---

## 12. Claim Your Listing Page (e.g., /directory/claim)

**Stitch Prompt:**

```
Create a mobile-first "Claim Your Listing" page for business owners.

HERO SECTION:
- Headline: "Claim Your Free Business Listing"
- Subheadline: "Reach thousands of adventure travelers planning trips to Wales"
- Hero image: Happy business owner or adventure activity

VALUE PROPOSITION:
- Section: "Why Claim Your Listing?"
- 3-4 benefit cards with icons:
  - "Get Found" - Appear in search results and itineraries
  - "Build Trust" - Display verified badge and respond to questions
  - "Drive Bookings" - Add booking links and special offers
  - "Free Forever" - Basic listing is always free

HOW IT WORKS:
- 3-step visual process:
  1. "Find Your Business" - Search icon
  2. "Verify Ownership" - Checkmark icon
  3. "Update Your Profile" - Edit icon
- Simple illustrations for each step

SEARCH YOUR BUSINESS:
- Search bar: "Search for your business..."
- Auto-complete dropdown showing matching businesses
- "Can't find your business? Add it manually" link

CLAIM FORM (after selecting business):
- Business name (pre-filled, read-only)
- Your name
- Your role/position
- Email address
- Phone number
- Verification method: "We'll send a code to verify"
- "Submit Claim" button

UPGRADE OPTIONS:
- Section: "Want More Visibility?"
- Comparison table:

  | Feature | Free | Premium |
  |---------|------|---------|
  | Basic listing | ✓ | ✓ |
  | Verified badge | ✓ | ✓ |
  | Photos | 3 | Unlimited |
  | Booking link | ✗ | ✓ |
  | Featured placement | ✗ | ✓ |
  | Appear in itineraries | ✗ | ✓ |
  | Analytics | ✗ | ✓ |
  | Special offers | ✗ | ✓ |

- "Go Premium" button with price: "£29/month"
- "Start Free" button

TESTIMONIALS:
- Section: "Trusted by Local Operators"
- 2-3 quotes from claimed businesses
- Operator name, business, photo

FAQ:
- "Common Questions"
- Accordion:
  - "Is claiming really free?"
  - "How long does verification take?"
  - "Can I remove my listing?"
  - "What's the difference between free and premium?"

CONTACT:
- "Questions? We're here to help"
- Email and phone contact
- "Schedule a call" option

Style: Professional and trustworthy. Clear value proposition. Low friction to start (free tier). Upsell premium naturally without being pushy.
```

---

## Design System Notes for All Pages

**Typography:**
- Headings: Bold, uppercase for section titles
- Body: Clean sans-serif, good line height for readability
- Mobile: 16px minimum body text

**Colors:**
- Primary: Deep teal/slate (#1e3a4c)
- Accent: Vibrant orange (#f97316)
- Success: Green (#22c55e)
- Warning: Amber (#f59e0b)
- Background: White and light gray (#f8fafc)

**Components:**
- Cards: Rounded corners (8-12px), subtle shadow on hover
- Buttons: Rounded, clear hierarchy (primary orange, secondary outline)
- Badges: Small, pill-shaped, color-coded by type
- Icons: Consistent style (Lucide or similar)

**Spacing:**
- Mobile: 16px horizontal padding
- Desktop: Max-width container (1200px) with generous margins
- Section spacing: 48-64px vertical

**Interactions:**
- Subtle hover states on cards
- Smooth scroll behavior
- Bottom sheets for mobile filters/modals
- Skeleton loading states

---

## Jules Project Specification

Use this spec to instruct Google Jules to build the project foundation.

---

### Jules Prompt

```
Create a Next.js 15 multi-tenant adventure tourism platform with the following specifications:

PROJECT SETUP:
- Next.js 15 with App Router
- TypeScript strict mode
- Tailwind CSS with custom theme config
- Drizzle ORM with Postgres (use @vercel/postgres)
- pnpm as package manager

MULTI-TENANT ARCHITECTURE:
- Sites are identified by domain/hostname
- Create middleware that extracts site_id from hostname and adds to request context
- All database queries must filter by site_id
- Support custom domains: adventurewales.com, adventurewestcountry.com, etc.

DATABASE SCHEMA (Drizzle):

Create these tables in src/db/schema.ts:

sites:
- id: serial primary key
- domain: varchar(255) unique not null
- name: varchar(255) not null
- tagline: text
- logo_url: varchar(500)
- primary_color: varchar(7) default '#1e3a4c'
- accent_color: varchar(7) default '#f97316'
- created_at: timestamp default now()
- updated_at: timestamp

regions:
- id: serial primary key
- site_id: integer references sites(id) not null
- name: varchar(255) not null
- slug: varchar(255) not null
- description: text
- hero_image: varchar(500)
- hero_credit: varchar(255)
- lat: decimal(10,7)
- lng: decimal(10,7)
- status: varchar(20) default 'published' (draft|review|published|archived)
- completeness_score: integer default 0 (0-100 calculated)
- created_at: timestamp default now()
- updated_at: timestamp
- unique constraint on (site_id, slug)

activity_types:
- id: serial primary key
- site_id: integer references sites(id) not null
- name: varchar(100) not null
- slug: varchar(100) not null
- icon: varchar(50)
- description: text
- unique constraint on (site_id, slug)

operators:
- id: serial primary key
- site_id: integer references sites(id) not null
- name: varchar(255) not null
- slug: varchar(255) not null
- type: varchar(20) not null check (type in ('primary', 'secondary'))
- category: varchar(50) not null (activity_provider|accommodation|food_drink|gear_rental|transport)
- website: varchar(500)
- email: varchar(255)
- phone: varchar(50)
- address: text
- lat: decimal(10,7)
- lng: decimal(10,7)
- description: text
- tagline: varchar(255)
- logo_url: varchar(500)
- cover_image: varchar(500)
- google_rating: decimal(2,1)
- review_count: integer default 0
- tripadvisor_url: varchar(500)
- price_range: varchar(10)
- unique_selling_point: text
- claim_status: varchar(20) default 'stub' check (claim_status in ('stub', 'claimed', 'premium'))
- claimed_by_email: varchar(255)
- claimed_at: timestamp
- trust_signals: jsonb (verified, yearsInBusiness, rating, reviewCount)
- service_types: text[] (guides, rental, accommodation, transfers, lessons, holidays, experiences)
- regions: text[] (region slugs this operator covers)
- activity_types: text[] (activity type slugs)
- created_at: timestamp default now()
- updated_at: timestamp
- unique constraint on (site_id, slug)

activities:
- id: serial primary key
- site_id: integer references sites(id) not null
- region_id: integer references regions(id) not null
- operator_id: integer references operators(id)
- activity_type_id: integer references activity_types(id)
- name: varchar(255) not null
- slug: varchar(255) not null
- description: text
- meeting_point: text
- lat: decimal(10,7)
- lng: decimal(10,7)
- price_from: decimal(10,2)
- price_to: decimal(10,2)
- duration: varchar(50)
- difficulty: varchar(20)
- min_age: integer
- season: varchar(100)
- booking_url: varchar(500)
- source_url: varchar(500)
- status: varchar(20) default 'published' (draft|review|published|archived)
- completeness_score: integer default 0 (0-100 calculated)
- created_at: timestamp default now()
- updated_at: timestamp
- unique constraint on (site_id, slug)

locations:
- id: serial primary key
- site_id: integer references sites(id) not null
- region_id: integer references regions(id) not null
- name: varchar(255) not null
- slug: varchar(255) not null
- description: text
- lat: decimal(10,7) not null
- lng: decimal(10,7) not null
- parking_info: text
- facilities: text
- access_notes: text
- best_time: varchar(100)
- crowd_level: varchar(50)
- created_at: timestamp default now()
- unique constraint on (site_id, slug)

accommodation:
- id: serial primary key
- site_id: integer references sites(id) not null
- region_id: integer references regions(id) not null
- name: varchar(255) not null
- slug: varchar(255) not null
- type: varchar(50) not null
- address: text
- lat: decimal(10,7)
- lng: decimal(10,7)
- website: varchar(500)
- price_from: decimal(10,2)
- price_to: decimal(10,2)
- adventure_features: text[]
- booking_url: varchar(500)
- airbnb_url: varchar(500)
- google_rating: decimal(2,1)
- description: text
- created_at: timestamp default now()
- unique constraint on (site_id, slug)

events:
- id: serial primary key
- site_id: integer references sites(id) not null
- region_id: integer references regions(id)
- name: varchar(255) not null
- slug: varchar(255) not null
- type: varchar(50) not null
- description: text
- date_start: date
- date_end: date
- month_typical: varchar(20)
- location: varchar(255)
- lat: decimal(10,7)
- lng: decimal(10,7)
- website: varchar(500)
- registration_cost: varchar(50)
- capacity: varchar(50)
- created_at: timestamp default now()
- unique constraint on (site_id, slug)

transport:
- id: serial primary key
- site_id: integer references sites(id) not null
- region_id: integer references regions(id)
- type: varchar(50) not null
- name: varchar(255) not null
- route: varchar(255)
- stops: text
- frequency: varchar(100)
- season: varchar(50)
- cost: varchar(50)
- website: varchar(500)
- lat: decimal(10,7)
- lng: decimal(10,7)
- notes: text
- created_at: timestamp default now()

itineraries:
- id: serial primary key
- site_id: integer references sites(id) not null
- region_id: integer references regions(id)
- title: varchar(255) not null
- slug: varchar(255) not null
- tagline: varchar(255)
- description: text
- duration_days: integer not null
- difficulty: varchar(20)
- best_season: varchar(100)
- hero_image: varchar(500)
- price_estimate_from: decimal(10,2)
- price_estimate_to: decimal(10,2)
- status: varchar(20) default 'draft' (draft|review|published|archived)
- completeness_score: integer default 0 (0-100 calculated)
- created_at: timestamp default now()
- updated_at: timestamp
- unique constraint on (site_id, slug)

itinerary_items:
- id: serial primary key
- itinerary_id: integer references itineraries(id) not null
- day_number: integer not null
- order_index: integer not null
- activity_id: integer references activities(id)
- accommodation_id: integer references accommodation(id)
- location_id: integer references locations(id)
- time_of_day: varchar(20)
- title: varchar(255)
- description: text
- duration: varchar(50)
- travel_time_to_next: varchar(50)

answers:
- id: serial primary key
- site_id: integer references sites(id) not null
- region_id: integer references regions(id)
- question: varchar(500) not null
- slug: varchar(255) not null
- quick_answer: text not null
- full_content: text not null
- related_questions: text[]
- status: varchar(20) default 'draft'
- created_at: timestamp default now()
- updated_at: timestamp
- unique constraint on (site_id, slug)

--- COMMERCIAL/MONETIZATION TABLES ---

operator_offers:
- id: serial primary key
- operator_id: integer references operators(id) not null
- title: varchar(255) not null
- discount: text
- valid_from: date
- valid_until: date
- status: varchar(20) default 'active'

advertisers:
- id: serial primary key
- site_id: integer references sites(id) not null
- name: varchar(255) not null
- contact_email: varchar(255)
- website: varchar(500)
- status: varchar(20) default 'active'
- created_at: timestamp default now()

ad_campaigns:
- id: serial primary key
- site_id: integer references sites(id) not null
- advertiser_id: integer references advertisers(id) not null
- name: varchar(255) not null
- status: varchar(20) default 'draft' (draft|active|paused|ended)
- start_date: date
- end_date: date
- budget: decimal(10,2)
- created_at: timestamp default now()
- updated_at: timestamp

ad_creatives:
- id: serial primary key
- campaign_id: integer references ad_campaigns(id) not null
- slot_type: varchar(50) not null (hero_banner|sidebar_mpu|in_content|footer_banner)
- image_url: varchar(500) not null
- link_url: varchar(500) not null
- alt_text: varchar(255)
- targeting_regions: text[]
- targeting_activities: text[]
- priority: integer default 0
- status: varchar(20) default 'active'

ad_slots:
- id: serial primary key
- site_id: integer references sites(id) not null
- page_type: varchar(50) not null (homepage|region|activity|itinerary|operator|answer)
- slot_name: varchar(50) not null
- enabled: boolean default true
- min_priority: varchar(20) default 'programmatic' (direct|affiliate|programmatic|none)
- fallback_creative_id: integer references ad_creatives(id)
- exclude_advertisers: text[]

page_ads:
- id: serial primary key
- site_id: integer references sites(id) not null
- page_type: varchar(50) not null
- page_slug: varchar(255)
- hero_banner: jsonb (creative_id, partner_slug, image, headline, cta, link)
- mpu_slots: jsonb[] (array of ad slot configs)
- link_list: jsonb[] (array of link configs)
- created_at: timestamp default now()
- updated_at: timestamp

page_sponsors:
- id: serial primary key
- site_id: integer references sites(id) not null
- page_type: varchar(50) not null
- page_slug: varchar(255)
- operator_id: integer references operators(id) not null
- display_name: varchar(255)
- tagline: varchar(255)
- cta_text: varchar(100)
- cta_url: varchar(500)
- exclude_other_ads: boolean default false
- created_at: timestamp default now()

service_slots:
- id: serial primary key
- site_id: integer references sites(id) not null
- scope_type: varchar(20) not null (global|activity_type|region|location)
- scope_slug: varchar(255) (null for global, else the slug)
- service_type: varchar(50) not null (transfers|accommodation|rental|lessons|guides|holidays|experiences)
- label: varchar(100) not null
- description: text
- href: varchar(500)
- operator_id: integer references operators(id)
- visible: boolean default true
- featured: boolean default false
- icon: varchar(50)
- notes: text
- expires_at: timestamp

--- ADMIN/CMS TABLES ---

admin_users:
- id: serial primary key
- email: varchar(255) unique not null
- name: varchar(255) not null
- role: varchar(20) not null (super|admin|editor|viewer)
- site_permissions: text[] (site_ids they can access, null = all)
- created_at: timestamp default now()
- last_login: timestamp

content_rules:
- id: serial primary key
- site_id: integer references sites(id) not null
- content_type: varchar(50) not null (region|activity|itinerary|operator)
- field_name: varchar(100) not null
- rule_type: varchar(20) not null (required|min_length|max_length|regex|custom)
- rule_value: text
- error_message: text

bulk_operations:
- id: serial primary key
- site_id: integer references sites(id) not null
- admin_user_id: integer references admin_users(id) not null
- operation_type: varchar(50) not null (status_change|field_update|delete|export)
- content_type: varchar(50) not null
- affected_ids: text[]
- changes: jsonb
- created_at: timestamp default now()

status_history:
- id: serial primary key
- content_type: varchar(50) not null
- content_id: integer not null
- old_status: varchar(20)
- new_status: varchar(20) not null
- changed_by: integer references admin_users(id)
- reason: text
- created_at: timestamp default now()

ROUTING STRUCTURE:
Create App Router pages for:

PUBLIC ROUTES:
- / (homepage)
- /[region] (region hub)
- /[region]/things-to-do (activities list)
- /[region]/things-to-do/[activity-type] (filtered activities)
- /[region]/itineraries (itineraries list)
- /[region]/itineraries/[slug] (single itinerary)
- /[region]/where-to-stay (accommodation list)
- /[region]/events (events list)
- /[region]/getting-there (transport info)
- /itineraries (all itineraries)
- /things-to-do (all activities)
- /events (all events)
- /answers (FAQ hub)
- /answers/[slug] (single answer)
- /directory (operator directory)
- /directory/[slug] (operator page)
- /directory/claim (claim listing page)
- /plan (trip planner)

ADMIN ROUTES (all under /admin):
- /admin/dashboard (overview stats, alerts, recent activity)
- /admin/content/regions (CRUD + map view + bulk edit)
- /admin/content/activities (CRUD + map view + bulk edit)
- /admin/content/itineraries (builder UI + bulk edit)
- /admin/content/operators (CRUD + claim queue + bulk edit)
- /admin/content/accommodation (CRUD + map view + bulk edit)
- /admin/content/events (CRUD + calendar view + bulk edit)
- /admin/content/locations (CRUD + map view + bulk edit)
- /admin/content/answers (CRUD + bulk edit)
- /admin/content/bulk-ops (batch operations center)
- /admin/commercial/advertisers (advertiser accounts)
- /admin/commercial/campaigns (campaign management)
- /admin/commercial/creatives (creative assets)
- /admin/commercial/slots (slot configuration)
- /admin/commercial/sponsors (sponsored content setup)
- /admin/commercial/service-slots (service grid config)
- /admin/commercial/claims (partner claim requests)
- /admin/sites/[site]/settings (domain, theme, branding)
- /admin/sites/[site]/users (site-specific admins)
- /admin/settings/users (global admin users)
- /admin/settings/rules (content validation rules)
- /admin/settings/system (platform config)

MIDDLEWARE:
Create src/middleware.ts that:
1. Extracts hostname from request
2. Looks up site_id from sites table (cache this)
3. Adds site_id to request headers or cookies for server components to access
4. Returns 404 if domain not found

CONTEXT/HELPERS:
Create src/lib/site-context.ts with:
- getSiteFromRequest(request): Promise<Site>
- getCurrentSite(): Promise<Site> (for server components using headers)

Create src/lib/db.ts with:
- Database connection using @vercel/postgres and Drizzle
- Helper functions that automatically filter by site_id

SEED DATA:
Create src/db/seed.ts that:
- Creates a "wales" site with domain "adventurewales.com" and "localhost:3000"
- Creates regions: Snowdonia, Pembrokeshire, Brecon Beacons, Anglesey, Gower, Llŷn Peninsula, Mid Wales
- Creates activity types: Hiking, Coasteering, Mountain Biking, Surfing, Climbing, Kayaking, Caving, Zip Lines, etc.

ENVIRONMENT VARIABLES:
- POSTGRES_URL (Vercel Postgres connection string)
- NEXT_PUBLIC_SITE_DOMAIN (for local development)

STYLING:
- Configure Tailwind with custom colors from site theme
- Use CSS variables for site-specific theming
- Mobile-first responsive design

MAPS INTEGRATION:
- Install react-leaflet and leaflet packages
- Create a reusable MapView component in src/components/ui/MapView.tsx
- Use OpenStreetMap tiles (free, no API key required)
- Support for different pin types (color-coded by content type)
- Lazy load maps to improve initial page load

ADDITIONAL DEPENDENCIES:
- react-leaflet, leaflet (maps)
- @radix-ui/react-* (UI primitives)
- lucide-react (icons)
- date-fns (date formatting)
- zod (validation)

Create placeholder pages with basic layouts showing:
- Header with site logo/name
- Navigation
- Main content area with "Coming soon" or sample content
- Footer

DO NOT create full UI yet - just the foundation, routing, database schema, and multi-tenant middleware.
```

---

## Tech Stack

**Frontend:**
- Next.js 15 App Router
- Tailwind CSS
- Radix UI / shadcn components
- Leaflet for maps

**Backend:**
- Vercel Postgres (Neon under the hood)
- Drizzle ORM
- Upstash Vector (RAG for content agents)

**Content Pipeline:**
- Gemini 2.0 Flash (content generation)
- Perplexity API (web research, fact-checking)
- Python scripts for agent orchestration

**Hosting:**
- Vercel (with custom domains per site)

---

## Operator Tiers

| Aspect | Primary Operators | Secondary Operators |
|--------|-------------------|---------------------|
| Examples | Zip World, TYF, BikePark Wales | Pubs, restaurants, gear shops, B&Bs |
| Landing page | Yes (full, integrated) | Yes (directory-style) |
| Appears in itineraries | Yes | As "nearby" suggestions only |
| Appears in activity pages | Yes | No |
| Featured placements | Yes (premium tier) | No |
| Claimable | Yes | Yes |
| Premium upgrade | Yes (£29/mo) | Basic claim only (free) |

---

## CSV Data Import Scripts

After Jules creates the foundation, use these scripts to import your seed data.

### Import Script Structure

Create `scripts/import-wales-data.ts`:

```typescript
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { db } from '../src/db';
import { sites, regions, operators, activities, locations, accommodation, events, transport, activityTypes } from '../src/db/schema';

const WALES_SITE_ID = 1; // Created by seed script

// Region mapping from CSV to database
const REGION_MAP: Record<string, string> = {
  'Snowdonia': 'snowdonia',
  'Pembrokeshire': 'pembrokeshire',
  'Brecon Beacons': 'brecon-beacons',
  'Anglesey': 'anglesey',
  'Gower': 'gower',
  'Llŷn Peninsula': 'llyn-peninsula',
  'Mid Wales': 'mid-wales',
  'North Wales': 'north-wales',
  'South Wales': 'south-wales',
};

// Activity type mapping
const ACTIVITY_TYPE_MAP: Record<string, string> = {
  'Zip Lining': 'zip-lines',
  'Hiking': 'hiking',
  'Hiking/Scrambling': 'hiking',
  'Climbing': 'climbing',
  'Mountain Biking': 'mountain-biking',
  'Kayaking': 'kayaking',
  'Sea Kayaking': 'kayaking',
  'Coasteering': 'coasteering',
  'Surfing': 'surfing',
  'Caving': 'caving',
  'Caving/Potholing': 'caving',
  'Canyoning': 'canyoning',
  'Gorge Scrambling': 'gorge-walking',
  'Gorge Walking': 'gorge-walking',
  'Rafting': 'rafting',
  'SUP': 'paddleboarding',
  'Paddle Boarding': 'paddleboarding',
  // ... add more as needed
};

async function importOperators() {
  const csv = readFileSync('./data/Wales database - Operators.csv', 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    // Determine if primary or secondary based on activities offered
    const isPrimary = row['Activities Offered']?.includes('Coasteering') ||
                      row['Activities Offered']?.includes('Zip') ||
                      row['Activities Offered']?.includes('Climbing') ||
                      row['Activities Offered']?.includes('Kayaking');

    await db.insert(operators).values({
      site_id: WALES_SITE_ID,
      name: row['Business Name'],
      slug: slugify(row['Business Name']),
      type: isPrimary ? 'primary' : 'secondary',
      category: isPrimary ? 'activity_provider' : 'service',
      website: row['Website'],
      email: row['Contact Email'],
      phone: row['Phone'],
      address: row['Physical Address'],
      description: row['Unique Selling Point'],
      google_rating: parseFloat(row['Google Rating']?.split('/')[0]) || null,
      tripadvisor_url: row['TripAdvisor URL'],
      price_range: row['Price Range'],
      claim_status: 'stub',
    });
  }
}

async function importActivities() {
  const csv = readFileSync('./data/Wales database - Activities.csv', 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    const regionSlug = REGION_MAP[row['Region']];
    const region = await db.query.regions.findFirst({
      where: (r, { and, eq }) => and(eq(r.site_id, WALES_SITE_ID), eq(r.slug, regionSlug))
    });

    const operator = await db.query.operators.findFirst({
      where: (o, { and, eq }) => and(eq(o.site_id, WALES_SITE_ID), eq(o.name, row['Operator']))
    });

    const activityTypeSlug = ACTIVITY_TYPE_MAP[row['Type']] || slugify(row['Type']);
    const activityType = await db.query.activityTypes.findFirst({
      where: (a, { and, eq }) => and(eq(a.site_id, WALES_SITE_ID), eq(a.slug, activityTypeSlug))
    });

    // Parse price range
    const priceMatch = row['Price Range (£)']?.match(/(\d+)/g);
    const priceFrom = priceMatch?.[0] ? parseFloat(priceMatch[0]) : null;
    const priceTo = priceMatch?.[1] ? parseFloat(priceMatch[1]) : priceFrom;

    await db.insert(activities).values({
      site_id: WALES_SITE_ID,
      region_id: region?.id,
      operator_id: operator?.id,
      activity_type_id: activityType?.id,
      name: row['Activity Name'],
      slug: slugify(row['Activity Name']),
      meeting_point: row['Location/Meeting Point'],
      price_from: priceFrom,
      price_to: priceTo,
      duration: row['Duration'],
      difficulty: row['Difficulty'],
      min_age: parseInt(row['Min Age']) || null,
      season: row['Season'],
      booking_url: row['Booking URL'],
      source_url: row['Source URL'],
    });
  }
}

async function importLocations() {
  const csv = readFileSync('./data/Wales database - Locations.csv', 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    const regionSlug = REGION_MAP[row['Region']];
    const region = await db.query.regions.findFirst({
      where: (r, { and, eq }) => and(eq(r.site_id, WALES_SITE_ID), eq(r.slug, regionSlug))
    });

    // Parse GPS coordinates
    const coords = row['GPS Coordinates']?.split(',').map((c: string) => parseFloat(c.trim()));

    await db.insert(locations).values({
      site_id: WALES_SITE_ID,
      region_id: region?.id,
      name: row['Location Name'],
      slug: slugify(row['Location Name']),
      lat: coords?.[0],
      lng: coords?.[1],
      parking_info: row['Parking Info'],
      facilities: row['Facilities'],
      access_notes: row['Access Notes'],
      best_time: row['Best Time to Visit'],
      crowd_level: row['Crowd Level'],
    });
  }
}

async function importAccommodation() {
  const csv = readFileSync('./data/Wales database - Accommodation.csv', 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    const regionSlug = REGION_MAP[row['Region']];
    const region = await db.query.regions.findFirst({
      where: (r, { and, eq }) => and(eq(r.site_id, WALES_SITE_ID), eq(r.slug, regionSlug))
    });

    // Parse price range
    const priceMatch = row['Price/Night (£)']?.match(/(\d+)/g);

    // Parse adventure features from text
    const features = row['Adventure Features']?.split(',').map((f: string) => f.trim()) || [];

    await db.insert(accommodation).values({
      site_id: WALES_SITE_ID,
      region_id: region?.id,
      name: row['Property Name'],
      slug: slugify(row['Property Name']),
      type: row['Type'],
      address: row['Location'],
      website: row['Website'],
      price_from: priceMatch?.[0] ? parseFloat(priceMatch[0]) : null,
      price_to: priceMatch?.[1] ? parseFloat(priceMatch[1]) : null,
      adventure_features: features,
      booking_url: row['Booking.com URL'],
      airbnb_url: row['Airbnb URL'],
      google_rating: parseFloat(row['Google Rating']?.split('/')[0]) || null,
    });
  }
}

async function importEvents() {
  const csv = readFileSync('./data/Wales database - Events.csv', 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    const regionSlug = REGION_MAP[row['Region']];
    const region = await db.query.regions.findFirst({
      where: (r, { and, eq }) => and(eq(r.site_id, WALES_SITE_ID), eq(r.slug, regionSlug))
    });

    await db.insert(events).values({
      site_id: WALES_SITE_ID,
      region_id: region?.id,
      name: row['Event Name'],
      slug: slugify(row['Event Name']),
      type: row['Type'],
      description: row['Description'],
      month_typical: row['Date(s)/Month'],
      location: row['Location'],
      website: row['Website'],
      registration_cost: row['Registration Cost (£)'],
      capacity: row['Participant Capacity'],
    });
  }
}

async function importTransport() {
  const csv = readFileSync('./data/Wales database - Transport.csv', 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    await db.insert(transport).values({
      site_id: WALES_SITE_ID,
      type: row['Service Type'],
      name: row['Name/Route'],
      route: row['Region Covered'],
      stops: row['Stops/Locations'],
      frequency: row['Frequency'],
      season: row['Season'],
      cost: row['Cost (£)'],
      website: row['Website'],
      notes: row['Notes'],
    });
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Importing Wales data...');

  console.log('Importing operators...');
  await importOperators();

  console.log('Importing activities...');
  await importActivities();

  console.log('Importing locations...');
  await importLocations();

  console.log('Importing accommodation...');
  await importAccommodation();

  console.log('Importing events...');
  await importEvents();

  console.log('Importing transport...');
  await importTransport();

  console.log('Done!');
}

main().catch(console.error);
```

### Run Import

```bash
# Copy CSV files to project
mkdir -p data
cp ~/Downloads/Wales\ database\ -\ *.csv ./data/

# Run import
pnpm tsx scripts/import-wales-data.ts
```

---

## Geocoding Missing Coordinates

Many records need lat/lng. Create a geocoding script:

```typescript
// scripts/geocode-missing.ts
import { db } from '../src/db';
import { operators, accommodation, events } from '../src/db/schema';
import { eq, isNull, and } from 'drizzle-orm';

const GOOGLE_GEOCODE_API = 'https://maps.googleapis.com/maps/api/geocode/json';

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const response = await fetch(
    `${GOOGLE_GEOCODE_API}?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();

  if (data.results?.[0]?.geometry?.location) {
    return {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng,
    };
  }
  return null;
}

async function geocodeOperators() {
  const missingCoords = await db.query.operators.findMany({
    where: isNull(operators.lat)
  });

  for (const op of missingCoords) {
    if (op.address) {
      console.log(`Geocoding: ${op.name}`);
      const coords = await geocode(op.address);
      if (coords) {
        await db.update(operators)
          .set({ lat: coords.lat, lng: coords.lng })
          .where(eq(operators.id, op.id));
      }
      // Rate limit
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

// Similar functions for accommodation, events, etc.
```

---

## Next Steps

1. Generate initial designs in Google Stitch using these prompts
2. Review and refine mobile layouts
3. Set up Next.js project with multi-tenant routing
4. Design and implement Postgres schema with Drizzle
5. Build shared component library
6. Implement site-specific theming
7. Create content agents (research, writing, itinerary generation)
8. Import seed data (Wales CSVs)
9. Launch Adventure Wales
10. Clone content structure for Adventure West Country

