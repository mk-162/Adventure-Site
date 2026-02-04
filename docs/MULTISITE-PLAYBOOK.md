# Multi-Site Platform Playbook

## How It Works

This is a **single codebase, single database, multi-tenant** adventure tourism platform. One Next.js app serves multiple sites (Adventure Wales, Adventure West Country, Adventure Scotland, etc.) differentiated by domain.

### Architecture

```
┌─────────────────────────────────────────────┐
│              Single Next.js App              │
│         (Vercel, one deployment)             │
├──────────┬──────────┬───────────────────────┤
│ Wales    │ West     │ Scotland              │
│ .co.uk   │ Country  │ .co.uk               │
│          │ .co.uk   │                       │
├──────────┴──────────┴───────────────────────┤
│            Shared Components                 │
│     (cards, maps, filters, auth, etc.)       │
├─────────────────────────────────────────────┤
│          Single Neon Postgres DB             │
│     (all data scoped by site_id)             │
└─────────────────────────────────────────────┘
```

### Database: `sites` Table

Every content table has a `site_id` foreign key. The `sites` table is the root:

```
sites
├── id: 1
├── domain: adventurewales.co.uk
├── name: Adventure Wales
├── tagline: "Your Welsh Adventure Starts Here"
├── primaryColor: #1e3a4c
├── accentColor: #f97316
└── logoUrl: /images/sites/wales/logo.svg
```

### Request Flow

```
User hits adventurewales.co.uk
  → Vercel routes to the app
  → Middleware extracts hostname → looks up site_id
  → site_id injected into request context
  → All queries filter by site_id
  → Theme/branding pulled from sites table
  → Page renders with site-specific content + branding
```

---

## Current State (What Exists)

### ✅ What's Already Multi-Site Ready
- **Database schema**: Every table has `siteId` field
- **`sites` table**: Has domain, name, colours, logo
- **`getSiteByDomain()`**: Query function exists in `src/lib/queries.ts`
- **Relations**: All Drizzle relations connect through `siteId`
- **Seed script**: Creates initial site record

### ❌ What's NOT Multi-Site Ready Yet
- **Queries don't filter by siteId**: Most queries in `src/lib/queries.ts` ignore `siteId` entirely (e.g. `getAllRegions()` returns all regions from all sites)
- **No middleware site detection**: Current middleware only handles admin auth, not site routing
- **Hardcoded brand**: "Adventure Wales" is hardcoded in ~15 files (header, footer, hero, SEO, emails)
- **Hardcoded colours**: `#1e3a4c` and `#f97316` appear in 118 files as inline Tailwind classes
- **No theming system**: No CSS variables or dynamic theme injection
- **No site context provider**: No way for components to access current site data
- **Static content is Wales-specific**: Safety pages, guides, answers, journal posts are all Wales content
- **Images**: All in `/public/images/` with no site namespacing
- **SEO**: Metadata hardcoded to "Adventure Wales"
- **Email templates**: Hardcoded "Adventure Wales" in `src/lib/email.ts`

---

## Steps to Make It Fully Multi-Site

### Phase 1: Foundation (Do Before Launching Site 2)

#### 1.1 Site Context System
**Effort: Medium | Priority: Critical**

Create `src/lib/site-context.ts`:
```typescript
// Server-side: get site from request headers (set by middleware)
export async function getCurrentSite(): Promise<Site> {
  const headersList = headers();
  const siteId = headersList.get('x-site-id');
  // ... fetch from DB with cache
}

// Client-side: React context provider
export const SiteContext = createContext<Site | null>(null);
export function useSite() { return useContext(SiteContext); }
```

Update middleware to:
1. Extract hostname from request
2. Look up site by domain (with in-memory cache)
3. Set `x-site-id` header on the request
4. 404 if domain not found

#### 1.2 Fix All Queries to Filter by siteId
**Effort: Medium | Priority: Critical**

Every query in `src/lib/queries.ts` needs siteId filtering. Currently ~40 query functions, most ignore it.

Pattern:
```typescript
// BEFORE
export async function getAllRegions() {
  return db.select().from(regions).where(eq(regions.status, "published"));
}

// AFTER
export async function getAllRegions(siteId: number) {
  return db.select().from(regions).where(
    and(eq(regions.siteId, siteId), eq(regions.status, "published"))
  );
}
```

Every page component then gets `siteId` from context and passes it to queries.

#### 1.3 Theming System
**Effort: Large | Priority: Critical**

Replace 118 files of hardcoded colours with CSS variables:

1. Add to root layout:
```css
:root {
  --color-primary: #1e3a4c;
  --color-accent: #f97316;
}
```

2. Inject from site data:
```typescript
// In layout.tsx
const site = await getCurrentSite();
<style>{`:root { --color-primary: ${site.primaryColor}; --color-accent: ${site.accentColor}; }`}</style>
```

3. Global find-and-replace in Tailwind classes:
   - `bg-[#1e3a4c]` → `bg-[var(--color-primary)]`
   - `text-[#1e3a4c]` → `text-[var(--color-primary)]`
   - `bg-[#f97316]` → `bg-[var(--color-accent)]`
   - etc.

Or better: define custom Tailwind colours that use CSS vars:
```javascript
// tailwind.config.ts
colors: {
  brand: {
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
  }
}
```
Then: `bg-brand-primary`, `text-brand-accent` etc.

#### 1.4 Dynamic Brand Names
**Effort: Small | Priority: Critical**

Replace hardcoded "Adventure Wales" with `site.name` from context:

Files to update:
- `src/components/layout/header.tsx` — logo text
- `src/components/layout/footer.tsx` — copyright, description
- `src/components/home/hero-section.tsx` — headline
- `src/components/seo/JsonLd.tsx` — schema markup
- `src/lib/email.ts` — email templates
- `src/app/layout.tsx` — metadata
- `src/app/login/page.tsx` — branding
- Cookie banner, about page, contact page, etc.

#### 1.5 Image Namespacing
**Effort: Small | Priority: Medium**

Structure: `/public/images/sites/{site-slug}/...`
- `/public/images/sites/wales/regions/...`
- `/public/images/sites/west-country/regions/...`

Or use a CDN/Cloudinary with folder-per-site.

---

### Phase 2: Content Pipeline for New Sites

This is the big one — how you actually populate a new site with content.

---

## Launching a New Site: Complete Playbook

### Overview

Launching a new site (e.g. "Adventure West Country") involves 8 stages over approximately 2-4 weeks, largely automated with AI agents.

```
Stage 1: Research & Planning          (2-3 days)
Stage 2: Database Setup               (1 hour)
Stage 3: Region & Activity Research   (3-5 days, automated)
Stage 4: Operator Discovery           (3-5 days, automated)
Stage 5: Content Generation           (3-5 days, automated)
Stage 6: Image Sourcing               (2-3 days, automated)
Stage 7: Review & QA                  (2-3 days, manual)
Stage 8: Go Live                      (1 day)
```

---

### Stage 1: Research & Planning

**Goal**: Define the site's scope, regions, and activity types.

**Steps:**

1. **Define the geographic area**
   - Which counties/areas does it cover?
   - What are the natural sub-regions?
   - What's the domain? (e.g. adventurewestcountry.co.uk)

2. **Research regions** (AI-assisted)
   - Use web search to identify the main adventure regions
   - For each region: name, description, key features, lat/lng centre
   - Target: 8-15 regions per site
   - **Skill used**: Web search + manual curation

3. **Research activity types** (AI-assisted)
   - What outdoor activities are popular in this area?
   - Reuse existing activity types where possible (hiking, surfing, etc.)
   - Add area-specific ones (e.g. "tin mining tours" for Cornwall)
   - Target: 15-25 activity types per site
   - **Skill used**: Web search

4. **Competitor analysis**
   - What other adventure/tourism sites cover this area?
   - What do they do well? What's missing?
   - **Skill used**: Web search + web fetch

5. **Create site brief document**
   - `docs/sites/{site-slug}/SITE-BRIEF.md`
   - Regions list, activity types, target audience, brand positioning
   - Domain, colours, tagline

**Output**: Site brief document with regions, activities, and brand identity.

---

### Stage 2: Database Setup

**Goal**: Create the site record and seed base data.

**Steps:**

1. **Create site record**
   ```sql
   INSERT INTO sites (domain, name, tagline, primary_color, accent_color)
   VALUES ('adventurewestcountry.co.uk', 'Adventure West Country', 
           'Your West Country Adventure Starts Here', '#2d5016', '#e65100');
   ```

2. **Seed regions**
   ```sql
   INSERT INTO regions (site_id, name, slug, description, lat, lng, status)
   VALUES 
     (2, 'North Devon', 'north-devon', '...', 51.1, -4.0, 'draft'),
     (2, 'Cornwall Coast', 'cornwall-coast', '...', 50.3, -5.0, 'draft'),
     -- etc.
   ```

3. **Seed activity types** (reuse IDs from shared types where possible)
   ```sql
   INSERT INTO activity_types (site_id, name, slug, icon)
   VALUES 
     (2, 'Surfing', 'surfing', 'waves'),
     (2, 'Coasteering', 'coasteering', 'waves'),
     -- etc.
   ```

4. **Configure Vercel domain**
   - Add custom domain in Vercel dashboard
   - Point DNS
   - SSL auto-provisions

**Output**: Site exists in DB with regions and activity types, domain configured.

---

### Stage 3: Region & Activity Research

**Goal**: Discover all bookable activities and experiences per region.

**Steps:**

1. **For each region, run the adventure-research skill**
   - Search for: "{activity type} in {region}" for every combination
   - Discover operators, meeting points, prices, durations, difficulty levels
   - **Skill used**: `adventure-research` (existing skill in Clawdbot)
   - **Tools**: web_search, web_fetch

2. **Research pattern per region×activity combo:**
   ```
   Search: "coasteering {region name}"
   → Find operators offering it
   → For each operator:
     - Name, website, contact
     - Activities offered (names, prices, durations)
     - Meeting points, booking URLs
     - Google/TripAdvisor ratings
     - Session times, group sizes
   ```

3. **Store research in structured JSON**
   ```
   docs/sites/{site-slug}/research/{region}-{activity}.json
   ```

4. **Identify locations/spots**
   - Popular beaches, trails, climbing crags, rivers
   - Parking info, access, facilities
   - **Skill used**: web_search, Google Maps research

5. **Research accommodation**
   - Adventure-friendly stays per region
   - Hostels, bunkhouses, camping, B&Bs
   - Key features: bike storage, drying rooms, dog-friendly
   - Booking.com/Airbnb links
   - **Skill used**: web_search, web_fetch

6. **Research events**
   - Annual races, festivals, adventure events
   - EventBrite search for the area
   - Local running/cycling/triathlon clubs
   - **Skill used**: web_search, EventBrite API

**Output**: Structured research data for every region, ready for import.

---

### Stage 4: Operator Discovery

**Goal**: Build the full operator directory.

**Steps:**

1. **Primary operators** (activity providers)
   - From Stage 3 research — every operator discovered
   - Deep dive on each: full contact details, all activities, pricing
   - Google Business profile scraping for ratings, hours
   - **Skill used**: adventure-research, web_fetch

2. **Secondary operators** (support services)
   - Pubs/restaurants near adventure spots
   - Gear rental shops
   - Transport providers (bus, taxi, shuttle)
   - Camping/glamping sites
   - **Skill used**: web_search, Google Maps

3. **Verify and deduplicate**
   - Check for duplicate businesses
   - Verify websites are live
   - Confirm pricing is current
   - **Skill used**: web_fetch (check URLs return 200)

4. **Geocode all operators**
   - Get lat/lng for every operator address
   - **Skill used**: Google Geocoding API script

**Output**: Complete operator database with contact info, ratings, coordinates.

---

### Stage 5: Content Generation

**Goal**: Generate all written content for the site.

**Steps:**

1. **Region descriptions** (AI-generated, human-reviewed)
   - 300-500 word description per region
   - Key highlights, character, what makes it special
   - SEO-optimised with relevant keywords
   - **Skill used**: AI content generation (Claude/Gemini)

2. **Activity descriptions** (AI-generated from research data)
   - Unique description per activity listing
   - What to expect, requirements, tips
   - Honest difficulty assessment
   - **Skill used**: AI content generation

3. **Itinerary creation** (AI-generated)
   - 3-5 itineraries per region (multi-day road trips)
   - Day-by-day breakdown with activities, accommodation, food
   - Cost estimates, best season, difficulty
   - Target: 30-50 itineraries per site
   - **Skill used**: AI content generation with research data as input

4. **FAQ/Answers pages** (AI-generated)
   - "Best time to visit {region}"
   - "Best {activity} in {region}"
   - "How to get to {region}"
   - Target: 50-100 answer pages per site
   - **Skill used**: AI content generation, web research for facts

5. **Guide pages** (AI-generated)
   - Gear guides, safety guides, beginner guides
   - Region-specific guides
   - Activity-specific how-tos
   - Target: 20-30 guides per site
   - **Skill used**: AI content generation

6. **Journal/blog posts** (AI-generated)
   - "10 Best {Activities} in {Region}"
   - Seasonal guides, hidden gems, local tips
   - Target: 20-40 posts per site
   - **Skill used**: AI content generation

**Output**: All written content generated and stored in DB/content files.

---

### Stage 6: Image Sourcing

**Goal**: Source hero images, activity photos, and region imagery.

**Steps:**

1. **Tourism board assets** (free, high quality)
   - Visit {Region} press/media libraries
   - National Park press offices
   - Council tourism departments
   - **Skill used**: web_search for media libraries, web_fetch to browse

2. **Unsplash/Pexels** (free, good quality)
   - Search by region name, activity type
   - Download and attribute
   - **Skill used**: Unsplash API or web search

3. **Flickr Creative Commons** (free, excellent for UK outdoors)
   - Search by location, activity
   - Check licence (CC-BY, CC-BY-SA)
   - **Skill used**: Flickr API

4. **AI-generated images** (gap-filling)
   - For any activity/region combo where no good photo exists
   - **Skill used**: nano-banana-pro (image generation skill)

5. **Process and optimise**
   - Resize to standard widths (640, 1024, 1280)
   - Convert to WebP
   - Generate attribution records
   - Store in `/public/images/sites/{site-slug}/`

**Output**: Full image library with attributions.

---

### Stage 7: Review & QA

**Goal**: Human review of all generated content before going live.

**Steps:**

1. **Content review**
   - Read through region descriptions — accurate? Engaging?
   - Check activity details — prices correct? Links work?
   - Review itineraries — logical routes? Realistic timings?
   - Check operator info — up to date? Not missing anyone major?

2. **Technical QA**
   - Build passes clean
   - All pages load
   - No broken links (internal or external)
   - Images display correctly
   - SEO metadata present on every page
   - Mobile responsive check

3. **Data completeness**
   - Run completeness scoring
   - Flag items below 70% completeness
   - Fill gaps or mark as draft

4. **Legal check**
   - Image attributions correct
   - No copyrighted content
   - Privacy/terms pages updated for new domain
   - Cookie policy covers new domain

**Output**: Reviewed, QA'd site ready for launch.

---

### Stage 8: Go Live

**Steps:**

1. **Vercel configuration**
   - Custom domain added and verified
   - Environment variables set (same DB, same keys)
   - Middleware routes new domain to correct site_id

2. **DNS configuration**
   - Point domain to Vercel
   - SSL certificate auto-provisions

3. **Flip status to published**
   ```sql
   UPDATE regions SET status = 'published' WHERE site_id = 2;
   UPDATE activities SET status = 'published' WHERE site_id = 2;
   -- etc.
   ```

4. **Submit to search engines**
   - Submit sitemap to Google Search Console
   - Submit to Bing Webmaster Tools

5. **Monitor**
   - Check analytics
   - Monitor error logs
   - Watch for 404s

**Output**: Live site, indexed, monitored.

---

## Content Volume Estimates Per Site

| Content Type | Target Count | Generation Method |
|---|---|---|
| Regions | 8-15 | Manual research + AI description |
| Activity Types | 15-25 | Reuse shared + site-specific |
| Activities | 100-300 | AI research + manual verify |
| Operators | 50-150 | AI discovery + manual verify |
| Itineraries | 30-50 | AI generated from activity data |
| Accommodation | 30-80 | AI research |
| Events | 20-50 | EventBrite + manual |
| Locations/Spots | 50-100 | AI research |
| Answer Pages | 50-100 | AI generated |
| Guide Pages | 20-30 | AI generated |
| Journal Posts | 20-40 | AI generated |
| **Total pages** | **~400-900** | |

---

## Skills & Tools Used Per Stage

| Stage | Clawdbot Skills | External Tools |
|---|---|---|
| Research | adventure-research, web_search, web_fetch | Google Maps, TripAdvisor |
| Operator Discovery | adventure-research, web_fetch | Google Business, Companies House |
| Content Generation | AI (Claude/Gemini), web_search | — |
| Image Sourcing | nano-banana-pro, web_search, web_fetch | Unsplash API, Flickr API |
| Data Import | exec (run scripts) | Node.js import scripts |
| QA | exec (build + link check) | Lighthouse, browser testing |

---

## Cost Estimates Per New Site

| Item | Estimated Cost |
|---|---|
| Domain registration | £10/year |
| Vercel hosting | £0 (shared deployment) |
| Database | £0 (shared Neon DB) |
| AI content generation | £20-50 (API calls) |
| Image sourcing | £0 (free sources) |
| Manual review time | 2-3 days human time |
| **Total** | **~£30-60 + time** |

---

## File Structure for Multi-Site Docs

```
docs/
├── MULTISITE-PLAYBOOK.md          ← this file
├── PLATFORM_DESIGN.md             ← original architecture spec
├── sites/
│   ├── wales/
│   │   ├── SITE-BRIEF.md
│   │   ├── research/              ← per-region research data
│   │   └── content/               ← generated content before import
│   ├── west-country/
│   │   ├── SITE-BRIEF.md
│   │   ├── research/
│   │   └── content/
│   └── scotland/
│       ├── SITE-BRIEF.md
│       ├── research/
│       └── content/
```

---

## Priority Actions Before Site 2

1. **Fix siteId filtering in all queries** — Critical, blocks everything
2. **Build site context system** (middleware + provider) — Critical
3. **Create theming system** (CSS variables) — Critical
4. **Replace hardcoded brand names** — Critical
5. **Namespace images by site** — Medium priority
6. **Update email templates to use site data** — Medium priority
7. **Update SEO/metadata to use site data** — Medium priority
8. **Test with a second site record in dev** — Validates everything works
