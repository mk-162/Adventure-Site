# Jules Round 2 - Infrastructure & Admin

## Overview

Pages are done. Now we need:
1. Maps integration
2. Commercial/ad system
3. Admin dashboard
4. API routes
5. Utilities & polish

---

## Phase 1: Maps (5 tasks)

### 1.1 MapView Component
```
Create reusable map component at src/components/ui/MapView.tsx using react-leaflet + OpenStreetMap tiles.

Props:
- markers: Array<{lat, lng, type, title, image?, link?, price?}>
- center: [lat, lng]
- zoom: number
- height: string (default "400px")
- interactive: boolean
- onMarkerClick?: (marker) => void

Pin colors by type:
- activity: blue
- accommodation: green  
- operator: orange
- event: red
- location: purple
- transport: black

Popup on click shows: image, title, type badge, price if available, "View Details" link.

Install: npm install react-leaflet leaflet @types/leaflet
```

### 1.2 Region Map Integration
```
Add interactive map to region hub page src/app/[region]/page.tsx.

- Add MapView below hero section
- Show all activities, accommodation, operators, events in region
- Toggle button: "List | Map" to switch views
- Map takes ~50% viewport height on mobile, sidebar on desktop
- Clicking pin opens popup, clicking "View Details" navigates to detail page
```

### 1.3 Itinerary Route Map
```
Add route map to itinerary detail page src/app/itineraries/[slug]/page.tsx.

- Show numbered pins for each day's activities
- Connect pins with route line (polyline)
- Day 1 = pin "1", Day 2 = pin "2", etc.
- Clicking pin shows that day's activities
- Different colors for activities vs accommodation stops
```

### 1.4 Activity Listing Map
```
Add map view to activity listing pages src/app/[region]/things-to-do/page.tsx and [activity-type]/page.tsx.

- Toggle "List | Map" view
- Show all activities matching current filters
- Sync: hovering card highlights pin, clicking pin scrolls to card
- Mobile: map above list, collapsible
- Desktop: map sidebar (40% width)
```

### 1.5 Operator/Accommodation Maps
```
Add location maps to:
- src/app/directory/[slug]/page.tsx (operator profile)
- src/app/accommodation/[slug]/page.tsx

Single pin showing business location.
Include "Get Directions" link (opens Google Maps).
Show nearby activities as secondary pins.
```

---

## Phase 2: Commercial System (6 tasks)

### 2.1 Ad Slot Component
```
Create ad slot component at src/components/commercial/AdSlot.tsx.

Props:
- slotName: string (hero_banner, sidebar_mpu, etc.)
- pageType: string
- pageSlug?: string
- fallback?: ReactNode

Fetches from /api/ads/slot endpoint.
Renders image with link, tracks impressions.
Shows fallback if no ad available.
Handles responsive sizes.
```

### 2.2 Sponsored Badge Component
```
Create sponsor badge component at src/components/commercial/SponsorBadge.tsx.

For itineraries and featured content.
Shows: "Sponsored by [Operator]" with logo.
Links to operator profile.
Subtle styling that doesn't feel like an ad.
```

### 2.3 Service Slots Component
```
Create service slots grid at src/components/commercial/ServiceSlots.tsx.

Shows partner services: Transfers, Accommodation, Rental, Lessons, Guides.
Each slot: icon, label, partner name, "Book →" link.
Cascading config lookup: location → region → activity → global.
Used on activity detail, region pages, itineraries.
```

### 2.4 Operator Claim CTA Component
```
Create claim CTA component at src/components/commercial/ClaimCTA.tsx.

For stub operator listings.
Shows: blurred image overlay, "Is this your business?", "Claim Free Listing" button.
Links to /directory/claim?business=[slug].
Premium upsell messaging.
```

### 2.5 Newsletter Signup Component
```
Create newsletter component at src/components/commercial/Newsletter.tsx.

Email input + submit button.
Optional sponsor badge slot.
Stores to database (create subscribers table).
Success/error states.
GDPR checkbox.
```

### 2.6 Ads API Route
```
Create API route at src/app/api/ads/slot/route.ts.

GET /api/ads/slot?name=hero_banner&pageType=region&pageSlug=snowdonia

Returns: { creative: { imageUrl, linkUrl, altText }, sponsor?: { name, logo } }

Priority waterfall:
1. Direct campaign targeting this slot
2. Premium operator (for operator_spotlight)
3. Fallback creative
4. null (show nothing)
```

---

## Phase 3: Admin Dashboard (8 tasks)

### 3.1 Admin Layout & Auth
```
Create admin layout at src/app/admin/layout.tsx.

- Sidebar navigation (collapsible on mobile)
- Header with user menu
- Breadcrumbs
- Basic auth check (redirect to /admin/login if not authenticated)
- Dark theme option

Navigation:
- Dashboard
- Content (regions, activities, itineraries, operators, accommodation, events, locations, answers)
- Commercial (advertisers, campaigns, slots, claims)
- Settings
```

### 3.2 Admin Dashboard Page
```
Create dashboard at src/app/admin/page.tsx.

Stats cards:
- Total content by type
- Average completeness score
- Items needing attention (low completeness)
- Recent activity log

Quick actions:
- Add new content buttons
- View claim requests
- Content needing review

Charts (simple):
- Content by status (draft/review/published)
- Content by region
```

### 3.3 Content List Component
```
Create reusable content list at src/components/admin/ContentList.tsx.

Props:
- contentType: string
- columns: ColumnDef[]
- filters: FilterDef[]
- bulkActions: ActionDef[]

Features:
- Sortable columns
- Filter dropdowns
- Search box
- Pagination
- Bulk select checkboxes
- Status badges (color coded)
- Completeness score bar
- Quick actions (edit, view, delete)
- Toggle: Table | Map view
```

### 3.4 Content Form Component
```
Create reusable content form at src/components/admin/ContentForm.tsx.

Props:
- contentType: string
- schema: FormSchema
- initialData?: Record
- onSubmit: (data) => Promise

Features:
- Auto-generated fields from schema
- Rich text editor for descriptions
- Image upload with preview
- Map picker for coordinates
- Related content selectors
- Validation with error messages
- Save draft / Publish buttons
- Completeness indicator
```

### 3.5 Regions Admin CRUD
```
Create regions admin at src/app/admin/content/regions/page.tsx and [id]/page.tsx.

List view:
- Table with: name, status, completeness, activity count, last updated
- Filter by status
- Bulk status change

Edit view:
- All region fields
- Hero image upload
- Map picker for center coordinates
- Link to activities in region
- Preview button
```

### 3.6 Activities Admin CRUD
```
Create activities admin at src/app/admin/content/activities/page.tsx and [id]/page.tsx.

List view:
- Table with: name, region, operator, type, status, completeness
- Filter by region, type, status, operator
- Bulk assign operator/region

Edit view:
- All activity fields
- Operator selector
- Region selector
- Activity type selector
- Map picker for meeting point
- Image gallery management
```

### 3.7 Operators Admin CRUD
```
Create operators admin at src/app/admin/content/operators/page.tsx and [id]/page.tsx.

List view:
- Table with: name, type, claim status, tier, regions, rating
- Filter by type, claim status, tier
- Bulk actions

Edit view:
- All operator fields
- Logo + cover image upload
- Map picker for location
- Service types multi-select
- Regions multi-select
- Trust signals JSON editor
- Claim status management
```

### 3.8 Claims Queue
```
Create claims admin at src/app/admin/commercial/claims/page.tsx.

List of pending operator claims.
Each shows: operator name, claimant email, date, verification status.
Actions: Approve, Reject, Request More Info.
Approval flow: verify business → update claim_status → send email.
```

---

## Phase 4: API Routes (5 tasks)

### 4.1 Content CRUD API
```
Create API routes at src/app/api/admin/[contentType]/route.ts.

Supports: regions, activities, itineraries, operators, accommodation, events, locations, answers.

GET - List with filters, pagination, search
POST - Create new
PATCH - Update existing
DELETE - Soft delete (set status=archived)

Include completeness score calculation on save.
```

### 4.2 Bulk Operations API
```
Create API route at src/app/api/admin/bulk/route.ts.

POST /api/admin/bulk
Body: { contentType, operation, ids, data }

Operations:
- status_change: { newStatus }
- field_update: { field, value }
- assign_operator: { operatorId }
- assign_region: { regionId }
- delete: {}

Logs to bulk_operations table.
Returns { success: number, failed: number, errors: [] }
```

### 4.3 Image Upload API
```
Create API route at src/app/api/upload/route.ts.

POST multipart/form-data with image file.
Validates: file type (jpg, png, webp), max size (5MB).
Uploads to /public/images/[contentType]/ or cloud storage.
Returns { url, width, height }.

Optional: auto-resize to max 1920px width.
```

### 4.4 Search API
```
Create API route at src/app/api/search/route.ts.

GET /api/search?q=coasteering&type=activities,operators

Full-text search across content types.
Returns grouped results: { activities: [], operators: [], regions: [] }
Used for:
- Site search bar
- Admin search
- Trip planner autocomplete
```

### 4.5 Newsletter Subscribe API
```
Create API route at src/app/api/subscribe/route.ts.

POST { email, source }

Validates email format.
Checks for duplicates.
Stores to subscribers table.
Optional: webhook to email service (Mailchimp, etc.)
Returns { success: true }
```

---

## Phase 5: Polish & Utilities (4 tasks)

### 5.1 Breadcrumbs Component
```
Create breadcrumbs at src/components/ui/Breadcrumbs.tsx.

Auto-generates from URL path.
Schema.org BreadcrumbList markup for SEO.
Truncates long titles on mobile.
Styled to match site theme.
```

### 5.2 SEO Metadata Utilities
```
Create SEO utilities at src/lib/seo.ts.

Functions:
- generateMetadata(contentType, data) → Next.js Metadata object
- generateJsonLd(contentType, data) → Schema.org JSON-LD
- generateSitemap() → sitemap.xml entries

Schema types:
- TouristAttraction (activities)
- LodgingBusiness (accommodation)
- LocalBusiness (operators)
- Event (events)
- FAQPage (answers)
- ItemList (listings)
```

### 5.3 Skeleton Loading Components
```
Create skeleton loaders at src/components/ui/Skeleton.tsx.

Variants:
- SkeletonCard (activity/accommodation cards)
- SkeletonList (table rows)
- SkeletonText (paragraphs)
- SkeletonImage (hero images)
- SkeletonMap (map placeholder)

Pulse animation, matches card dimensions.
```

### 5.4 Error & Empty States
```
Create state components at src/components/ui/States.tsx.

Components:
- EmptyState: icon, title, description, action button
- ErrorState: error message, retry button
- NotFound: 404 with navigation suggestions
- Loading: full-page spinner

Used consistently across all pages.
```

---

## Dependency Order

```
Phase 1 (Maps) → Can run in parallel
Phase 2 (Commercial) → Needs Phase 1.1 (MapView)
Phase 3 (Admin) → Needs Phase 4.1-4.3 (APIs)
Phase 4 (APIs) → Can run in parallel
Phase 5 (Polish) → Can run anytime
```

## Recommended Batches

**Batch A (parallel):**
- 1.1 MapView Component
- 4.1 Content CRUD API
- 4.4 Search API
- 5.1 Breadcrumbs
- 5.3 Skeleton Loading

**Batch B (after A):**
- 1.2 Region Map
- 1.3 Itinerary Route Map
- 1.4 Activity Listing Map
- 2.1 Ad Slot Component
- 3.1 Admin Layout

**Batch C (after B):**
- 1.5 Operator/Accommodation Maps
- 2.2-2.6 Commercial components
- 3.2 Admin Dashboard
- 3.3 Content List Component
- 4.2 Bulk Operations API

**Batch D (after C):**
- 3.4-3.8 Admin CRUD pages
- 4.3 Image Upload API
- 4.5 Newsletter API
- 5.2 SEO Utilities
- 5.4 Error States
