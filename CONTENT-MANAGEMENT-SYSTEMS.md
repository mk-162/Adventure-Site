# Adventure Wales: Content Management System Design

**Goal:** Systematic approach to manage every type of site content — from creation to publication to maintenance.

---

## Content Type Taxonomy

### Database Tables (27)
From `src/db/schema.ts`:
- Core: sites, regions, activity_types
- Activities: activities, activity_regions, activity_tags
- Operators: operators, operator_claims, operator_sessions, operator_offers, operator_interest
- Accommodation: accommodation, accommodation_tags
- Content: posts, guide_pages, answers, itineraries, events
- Supporting: locations, transport, comments, tags
- Monetization: advertisers, ad_campaigns, ad_creatives, ad_slots, page_sponsors
- Admin: admin_users, users, magic_links, bulk_operations, status_history
- Analytics: page_views, user_favourites, event_saves, newsletter_subscribers
- Outreach: outreach_campaigns, outreach_recipients, service_slots

### File-Based Content (263 files)
From `content/` folder:
- answers: 147
- categories: 15
- itineraries: 15
- guides: 11
- regions: 11
- safety: 9
- spots: 24 (across 7 activity folders)
- accommodation: 3
- food: 2
- transport: 2
- pages: 2
- operators: 7
- mtb: 7
- images: 4
- events: 1
- competitor-audits: 1

---

## Content Management Strategy

### Principle: Hybrid System

**Database = Dynamic, High-Volume, User-Generated**
- Operators (claims, listings, sessions)
- User content (favourites, comments, saves)
- Analytics & tracking
- Advertising/monetization
- Admin operations

**Files = Static, Editorial, SEO-Focused**
- Long-form articles (guides, answers, posts)
- Curated itineraries
- Region/activity mega pages
- Safety guides
- Spot profiles (until they need interactivity)

---

## System 1: Activity Mega Pages

**Type:** File-based (Markdown)  
**Location:** `content/activities/[slug].md`  
**Count Target:** 10 core activities

### Structure
```yaml
---
slug: coasteering
title: Coasteering in Wales
description: "Discover the best coasteering spots..."
hero_image: /images/activities/coasteering-hero.jpg
hero_credit: "John Doe on Unsplash"
meta_title: "Coasteering Wales: Best Spots, Operators & Prices (2026)"
meta_description: "Complete guide to coasteering in Wales..."
schema_type: Article
status: published
last_updated: 2026-05-09
---

# Coasteering in Wales

[Ultimate France-style mega page content]

## Best Coasteering Spots in Wales

### Pembrokeshire Coast
#### Blue Lagoon, Abereiddy
- **Type:** Sea cliff jumping
- **Difficulty:** Intermediate
- **Best conditions:** Low tide, calm seas
...

[Pull spots from content/spots/coasteering/*.csv]
[Pull operators from operators table]
```

### Management Workflow
1. **Creation:** AI generation via `mega-page-builder` skill
2. **Data Sources:** 
   - Spot data from CSV files
   - Operator data from database
   - Dynamic queries at build time
3. **Updates:** 
   - Markdown edited manually or via AI
   - Rebuilds when spots/operators change
4. **Publishing:** Git commit → Deploy

### Tools
- Generator: `mega-page-builder` skill
- Editor: VS Code / Cursor
- Preview: Local Next.js dev server
- Deploy: Git push → Vercel

---

## System 2: Region Pages

**Type:** File-based (Markdown)  
**Location:** `content/regions/[slug].md`  
**Count Target:** 11 regions

### Structure
```yaml
---
slug: snowdonia
name: Snowdonia
hero_image: /images/regions/snowdonia.jpg
lat: 53.0685
lng: -3.9214
status: published
completeness_score: 85
last_updated: 2026-05-09
---

# Adventures in Snowdonia

## Top Activities
[Query activities table filtered by region]

## Getting There
[Transport content]

## Weather & Seasons
[Climate data]

## Local Knowledge
[Editorial content]

## Where to Stay
[Query accommodation table]

## Where to Eat
[Query food/operators table]
```

### Management Workflow
1. **Creation:** AI research via `aw-deep-research` + `aw-content-writer`
2. **Data Sources:**
   - Activities from database
   - Accommodation from database/CSV
   - Transport from `content/transport/[region].md`
3. **Updates:**
   - Editorial content: Manual/AI editing
   - Data: Automatic refresh on build
4. **Quality Tracking:** `completeness_score` field

### Tools
- Generator: `aw-deep-research` + `aw-content-writer`
- Quality Check: Automated score based on filled fields
- Updates: Quarterly content refresh

---

## System 3: Spot Profiles

**Type:** Hybrid (CSV → Database → Markdown for featured)  
**Location:** 
- CSV: `content/spots/[activity]/*.csv`
- Featured MD: `content/spots/[activity]/[slug].md`

### Tiers

**Tier 1 (A-grade, Score 8-10):** Full markdown profiles
- Rich content, photos, operator links
- Featured in "Best Of" lists
- Own URL: `/spots/[activity]/[slug]`

**Tier 2 (B-grade, Score 5-7):** CSV data only
- Rendered as spot cards on activity pages
- Listed on region pages
- No dedicated URL

**Tier 3 (C-grade, Score 1-4):** CSV data, search only
- Minimal visibility
- Not featured
- Filterable in advanced search

### CSV Schema
```csv
slug,name,region,activity,lat,lng,difficulty,tier,score,description,best_conditions,parking,facilities,nearest_town,image_url,attribution
```

### Markdown Schema (Tier 1 only)
```yaml
---
slug: rhossili-bay
name: Rhossili Bay
region: gower
activity: surfing
tier: 1
score: 9
lat: 51.5845
lng: -4.2934
hero_image: /images/spots/surfing/rhossili-bay.jpg
status: published
---

# Rhossili Bay Surf Spot

## Quick Facts
- **Wave type:** Beach break
- **Best conditions:** SW swell, E wind
...

[Rich content]
```

### Management Workflow

**For CSV (Bulk):**
1. Research via `adventure-research` skill
2. Populate CSV with spot data
3. Score using DATA-QUALITY.md rubric
4. Commit CSV → Auto-imports to database on build

**For Markdown (Featured):**
1. Identify top 50 spots (tier=1, score>=8)
2. Generate rich content via `aw-content-writer`
3. Source hero images via `aw-image-sourcer`
4. Publish markdown file

**Quality Control:**
- CSV validation script checks schema
- Scoring audit quarterly
- Promote/demote based on performance

### Tools
- Bulk research: `adventure-research` skill
- CSV editor: VS Code with CSV extension
- Markdown generator: `aw-content-writer`
- Scoring: Manual (eventually ML)

---

## System 4: Operator Profiles

**Type:** Database-first with admin portal  
**Table:** `operators`  
**Claim System:** `operator_claims`, `operator_interest`

### Listing Tiers

**Stub (Free):**
- Basic info (name, contact, website)
- Appears in directory
- No operator dashboard access

**Claimed (Free):**
- Operator controls listing
- Add logo, images, description
- Manage sessions/availability
- View analytics

**Enhanced (£9.99/mo):**
- Full profile customization
- Booking integration
- Appear in itineraries
- Priority in search

**Premium (£29.99/mo):**
- Featured placement
- Lead notifications
- Priority in "Best Of" pages
- Custom CTA buttons

### Database Schema
```typescript
{
  id: serial,
  name: varchar,
  slug: varchar,
  description: text,
  logo_url: text,
  hero_image: text,
  website: text,
  email: varchar,
  phone: varchar,
  claim_status: enum, // stub | claimed | premium
  tier: enum, // free | enhanced | premium
  accreditations: jsonb,
  reviews_avg: decimal,
  reviews_count: integer,
  region_id: integer,
  activity_types: integer[], // array of activity_type_ids
  booking_platform: enum,
  booking_url: text,
  status: enum, // draft | published | archived
}
```

### Management Workflow

**1. Stub Creation (Research Phase):**
- AI research via `adventure-research` skill
- Create stub with public data
- Status: `stub`, claim_status: `stub`

**2. Claim Process:**
- Operator fills form at `/directory/claim`
- Submits to `operator_interest` table
- Admin reviews → sends magic link
- Operator completes profile
- claim_status: `claimed`

**3. Upgrade Process:**
- Operator sees upgrade prompt in dashboard
- Selects Enhanced or Premium
- Payment via Stripe
- tier field updated
- Features unlocked

**4. Content Management:**
- Operators manage via `/dashboard/operator/[id]`
- Admins manage via `/admin/operators`
- Bulk operations via `bulk_operations` table

### Tools
- Research: `adventure-research` skill
- Admin Portal: `/admin` (Next.js)
- Operator Portal: `/dashboard/operator` (Next.js)
- Bulk Import: CSV → Database script
- Quality Check: Completeness score

---

## System 5: Itineraries

**Type:** File-based (JSON + Markdown)  
**Location:** 
- Stubs: `data/itineraries/[slug].json`
- Rich content: `content/itineraries/[slug].md`

### Two-Phase System

**Phase 1: JSON Stubs (Programmatic)**
- Generated via `generate-itineraries` skill
- Structured data: timeline, stops, costs
- No rich narrative

**Phase 2: Editorial Enhancement (Manual/AI)**
- Convert best-performing stubs to markdown
- Add narrative, local tips, insider knowledge
- Hero images, photo galleries

### JSON Schema
```json
{
  "slug": "snowdonia-adventure-weekend",
  "title": "Snowdonia Adventure Weekend",
  "region": "snowdonia",
  "duration_days": 2,
  "difficulty": "intermediate",
  "price_standard": 350,
  "price_budget": 220,
  "activities": ["hiking", "zip-lining", "climbing"],
  "days": [
    {
      "day": 1,
      "title": "Summit Snowdon",
      "stops": [
        {
          "time": "09:00",
          "type": "activity",
          "name": "Snowdon Pyg Track",
          "location": "Pen-y-Pass",
          "lat": 53.085,
          "lng": -4.029,
          "duration_mins": 360,
          "cost": 0,
          "notes": "Park early or use Sherpa bus",
          "wet_alternative": {
            "name": "Bounce Below",
            "location": "Blaenau Ffestiniog",
            "cost": 45
          }
        }
      ]
    }
  ],
  "know_before_you_go": [...],
  "packing_list": [...]
}
```

### Markdown Schema (Editorial)
```yaml
---
slug: snowdonia-adventure-weekend
title: Snowdonia Adventure Weekend
hero_image: /images/itineraries/snowdonia-weekend.jpg
duration_days: 2
difficulty: intermediate
price_from: 220
activities: [hiking, zip-lining, climbing]
region: snowdonia
status: published
featured: true
---

# Snowdonia Adventure Weekend

[Compelling intro with local knowledge]

## Day 1: Conquer Snowdon

[Rich narrative of the day]

### Morning: Summit Push
[Story-driven description]

[Include structured data from JSON]

## Where to Stay
[Query accommodation table]

## What to Pack
[Editorial packing advice]
```

### Management Workflow

**JSON Generation:**
1. Run `python scripts/generate-itineraries.py --type all`
2. 55 structured itineraries created
3. Deployed to `/itineraries` listing page

**Editorial Enhancement:**
1. Monitor analytics → identify top 10 performers
2. Generate markdown via AI (`aw-content-writer`)
3. Source hero images (`aw-image-sourcer`)
4. Publish to `/itineraries/[slug]`

**Maintenance:**
- JSON: Regenerate annually (prices, availability)
- Markdown: Update seasonally, monitor accuracy

### Tools
- Generator: `generate-itineraries` skill (Python + Gemini)
- Editor: AI (`aw-content-writer`) or manual
- Images: `aw-image-sourcer`
- Analytics: Track views, bookings per itinerary

---

## System 6: FAQs / Answer Engine

**Type:** File-based (Markdown) with structured schema  
**Location:** `content/answers/[slug].md`  
**Count Target:** 105+ (55 region + 50 activity + ongoing)

### Schema
```yaml
---
slug: best-adventures-snowdonia
question: "What are the best adventures in Snowdonia?"
region: snowdonia
activity: null
category: region-guide
status: published
featured_snippet: "Snowdonia's top adventures include..."
last_updated: 2026-05-09
---

# What are the best adventures in Snowdonia?

## Quick Answer
[2-3 sentences optimized for featured snippet]

## Detailed Sections
[Rich content with specific names, prices, tips]

## Practical Tips
- Tip 1
- Tip 2

## Related Questions
- [How long should I spend in Snowdonia?](/answers/snowdonia-duration)
- [Is Snowdonia good for families?](/answers/snowdonia-families)
```

### Management Workflow

**Bulk Generation:**
1. Run `python scripts/generate-faqs.py --type all`
2. AI researches via web search
3. Calls Gemini API to write content
4. Outputs 105 markdown files

**Quality Control:**
- Manual review of featured snippets
- Check for factual accuracy
- Ensure internal linking works
- Update quarterly

**SEO Optimization:**
- Target question-based keywords
- Optimize for featured snippets
- Internal link to relevant pages
- Schema markup (FAQPage)

### Tools
- Generator: `generate-faqs` skill (Python + Gemini + web search)
- Editor: Manual review/polish
- SEO: Monitor rankings, update winners

---

## System 7: Events

**Type:** Database-first with editorial enhancement  
**Table:** `events`  
**Content:** `content/events/[slug].md` (for featured)

### Event Types
- Races (trail running, cycling)
- Festivals (food, music, adventure)
- Competitions (climbing, surfing)
- Seasonal activities (puffin season, aurora)
- Workshops/courses

### Database Schema
```typescript
{
  id: serial,
  name: varchar,
  slug: varchar,
  description: text,
  start_date: date,
  end_date: date,
  location: varchar,
  region_id: integer,
  activity_types: integer[],
  organizer: varchar,
  website: text,
  registration_url: text,
  price_from: decimal,
  hero_image: text,
  status: enum, // draft | published | archived
  featured: boolean,
  recurring: boolean,
  recurrence_pattern: text, // "annual", "monthly"
}
```

### Management Workflow

**Research & Population:**
1. AI research via `aw-event-enhancer`
2. Populate database with verified event data
3. Set featured=true for major events

**Editorial Enhancement:**
1. Major events get markdown files
2. Include why it's special, insider tips
3. Link to relevant operators, accommodation

**Maintenance:**
- Quarterly: Check dates, update registrations
- Archive past events
- Clone recurring events annually

### Tools
- Research: `aw-event-enhancer` skill
- Admin: `/admin/events` portal
- CSV Import: Bulk event upload
- Calendar: Public `/events` page

---

## System 8: Guides / Editorial Content

**Type:** File-based (Markdown)  
**Location:** `content/guides/[slug].md`  
**Current Count:** 11

### Content Types
- How-to guides ("How to prepare for your first coasteering session")
- Seasonal guides ("Best adventures in Wales by season")
- Buyer's guides ("What to pack for wild camping in Wales")
- Local knowledge ("Hidden gems in Pembrokeshire")

### Schema
```yaml
---
slug: first-coasteering-session
title: "Preparing for Your First Coasteering Session"
description: "Everything you need to know before..."
hero_image: /images/guides/coasteering-prep.jpg
category: how-to
activity: coasteering
region: null
author: Adventure Wales Team
published_date: 2026-05-09
status: published
---

# Preparing for Your First Coasteering Session

[Long-form editorial content]
```

### Management Workflow

**Creation:**
1. Identify content gaps (from search console, user questions)
2. Generate via `aw-content-writer`
3. Manual polish for voice/accuracy
4. Source images

**Maintenance:**
- Review biannually
- Update outdated info (prices, regulations)
- Improve underperformers

### Tools
- Generator: `aw-content-writer`
- Editor: Manual in VS Code
- SEO: Monitor traffic, update winners

---

## System 9: Transport Guides

**Type:** File-based (Markdown)  
**Location:** `content/transport/[region].md`  
**Count Target:** 11 (one per region)

### Schema
```yaml
---
region: snowdonia
slug: snowdonia-transport
title: "Getting to Snowdonia"
last_updated: 2026-05-09
---

# Getting to Snowdonia

## By Car
[Parking, routes, EV charging]

## By Train
[Stations, connections, bike transport]

## By Bus
[Sherpa buses, local services]

## Car-Free Options
[Multi-day trips without a car]

## Group Transport
[Minibus hire, shuttles]
```

### Management Workflow

**Creation:**
1. AI research via `aw-deep-research`
2. Verify with transport authorities
3. Include practical costs, times

**Updates:**
- Quarterly: Check bus/train schedules
- Annually: Update prices

---

## System 10: Safety Guides

**Type:** File-based (Markdown)  
**Location:** `content/safety/[topic].md`  
**Current Count:** 9

### Topics
- Mountain safety
- Water safety
- Coasteering safety
- Weather awareness
- Cycling safety
- Beach safety
- Fishing safety
- Horse riding safety
- General adventure safety

### Schema
```yaml
---
slug: mountain-safety
title: "Mountain Safety in Wales"
activity: hiking
status: published
---

# Mountain Safety in Wales

## Essential Knowledge
[Weather, navigation, equipment]

## Emergency Procedures
[Mountain rescue, contacts]

## Common Mistakes
[Honest warnings]
```

### Management Workflow
- Review annually (regulations, emergency contacts)
- Cross-link to relevant activities

---

## System 11: Accommodation

**Type:** Hybrid (CSV → Database, featured get markdown)  
**Table:** `accommodation`  
**CSV:** `content/accommodation/*.csv`

### Management (Similar to Operators)
- CSV for bulk data
- Database for dynamic queries
- Markdown for featured properties
- Affiliate links to Booking.com

---

## System 12: Food & Drink

**Type:** Database via operators table  
**Category:** `food_drink` in operator_category

### Types
- Pubs (adventure-friendly)
- Cafes (cyclist stops)
- Restaurants
- Farm shops
- Mobile food trucks

---

## Content Lifecycle Management

### Status Flow
```
draft → review → published → archived
```

### Workflows

**Creation:**
1. Identify need (SEO gap, user request)
2. Generate via appropriate AI skill
3. Manual QA
4. Publish

**Maintenance:**
- **Quarterly:** Update prices, availability, contacts
- **Biannually:** Content refresh, rewrite underperformers
- **Annually:** Strategic review, archive stale content

**Quality Metrics:**
- Completeness score (% of fields filled)
- Traffic (views, conversions)
- Engagement (time on page, bounce rate)
- Accuracy (user reports, verification)

---

## Admin Portal Structure

### `/admin` Routes

**Content Management:**
- `/admin/operators` — Manage operator listings
- `/admin/activities` — Activities CRUD
- `/admin/accommodation` — Accommodation CRUD
- `/admin/events` — Events calendar
- `/admin/itineraries` — Itinerary management
- `/admin/faqs` — FAQ/answer management
- `/admin/pages` — Static page editor

**Data Operations:**
- `/admin/import` — CSV bulk import
- `/admin/export` — Data exports
- `/admin/bulk` — Bulk edit operations
- `/admin/quality` — Quality scoring dashboard

**Analytics:**
- `/admin/analytics` — Traffic, conversions
- `/admin/seo` — Rankings, search console
- `/admin/reports` — Custom reports

**Settings:**
- `/admin/users` — Admin user management
- `/admin/settings` — Site settings
- `/admin/integrations` — API keys, webhooks

---

## File Structure Standards

### Naming Conventions
- **Slugs:** lowercase, hyphens, no special chars
- **Images:** `[type]-[subject]-[uuid].jpg`
- **CSV:** `[region]-[activity].csv`
- **Markdown:** `[slug].md`

### Frontmatter Requirements
All markdown files must have:
- `slug` (unique)
- `title`
- `status` (draft | review | published | archived)
- `last_updated` (YYYY-MM-DD)

Optional but recommended:
- `hero_image`
- `hero_credit`
- `meta_title`
- `meta_description`

---

## Automation Opportunities

### Current Scripts
1. `scripts/generate-itineraries.py` — JSON itinerary stubs
2. `scripts/generate-faqs.py` — FAQ content with research
3. `scripts/fetch_openverse_images.py` — CC image sourcing
4. `scripts/fetch_unsplash_images.py` — Quality image sourcing

### Future Scripts
1. **CSV Validator:** Check spot CSV schemas, flag issues
2. **Completeness Scorer:** Calculate scores for operators/regions
3. **Content Refresher:** Flag content >6 months old
4. **Link Checker:** Find broken internal/external links
5. **Image Optimizer:** Compress, resize, webp conversion
6. **SEO Auditor:** Check metadata, schema, internal linking
7. **Data Sync:** Sync CSV → Database for spots
8. **Sitemap Generator:** Dynamic sitemap.xml with priorities
9. **Analytics Reporter:** Weekly content performance reports

---

## Quality Standards

### All Content Must:
1. Pass "Would someone bookmark this?" test
2. Include specific, actionable information
3. Be honest about downsides/challenges
4. Reference real places, prices, operators
5. Include local knowledge ("only locals know")
6. Have verified data (sources tracked)

### Scoring Rubric (from DATA-QUALITY.md)
- **8-10 (Tier A):** Destination-worthy, full content
- **5-7 (Tier B):** Solid, listed content
- **1-4 (Tier C):** Basic, search-only

---

## Next Steps

### Immediate (Week 1):
1. ✅ Run itinerary generation
2. ✅ Run FAQ generation
3. 🔄 Build 10 activity mega pages
4. 🔄 Audit current content (Jules running)

### Short-term (Weeks 2-4):
5. Write 11 region pages
6. Create 50 Tier 1 spot profiles
7. Build admin portal MVP
8. Implement CSV validation

### Medium-term (Months 2-3):
9. Operator claim system
10. Analytics dashboard
11. Content refresh automation
12. SEO monitoring

---

## Success Metrics

### Content Coverage
- [ ] 10 activity mega pages published
- [ ] 11 region pages published
- [ ] 105+ FAQs published
- [ ] 55 itinerary stubs live
- [ ] 50 Tier 1 spot profiles
- [ ] 50 operator profiles (10+ claimed)

### Quality
- [ ] All content passes quality bar
- [ ] <5% broken links
- [ ] All images have attribution
- [ ] All metadata complete

### Business
- [ ] 10+ operator claims
- [ ] 100+ itinerary enquiries
- [ ] 50+ affiliate conversions
- [ ] Page 1 for 5 target keywords

---

**Last Updated:** 2026-05-09
