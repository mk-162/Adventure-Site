# SNAGS.md — Quick Bug & Fix List

Drop anything you notice here. One line per snag. I'll fix and tick them off.

Format: `- [ ] what's wrong (page/url if helpful)`

## Open

### 404s Found (Site Audit 2026-02-06)

- [x] `/for-operators` — FIXED: redirects to /advertise
- [x] `/activities/camping` — FIXED: replaced with wild-swimming, links now use /activities?type=X filter
- [x] `/activities/climbing` — FIXED: links now use /activities?type=climbing filter
- [x] `/activities/hiking` — FIXED: links now use /activities?type=hiking filter
- [x] `/activities/photography` — FIXED: replaced with gorge-walking, links now use filter
- [x] `/answers/best-adventures-brecon-Beacons` — FIXED: answer slugs now normalised to lowercase

### Feedback (2026-02-04)

**Homepage & Navigation**

- [x] Hero: Mobile spacing increased, stats hidden on mobile — FIXED
- [x] Hero CTA: "Find Your Adventure" → "Browse Itineraries" — FIXED
- [x] Activities page — "Single Activities & Experiences" with itineraries cross-link — FIXED
- [ ] Content: "Tried & Tested Routes" section has missing images
- [ ] Content: "Ready-Made Adventures" section has missing images
- [x] Design: Remove prices from itinerary cards — FIXED

**Itinerary Listings**

- [ ] Visuals: Missing images! Need thumbnails for itinerary cards AND hero images.
- [x] Content: Add header text — FIXED: "Multi-Day Road Trips & Itineraries"
- [x] Content: header description updated — FIXED
- [x] UI: Add small map on right side linking to each valid itinerary — map in itinerary sidebar

**Itinerary Details / Planner UX**

*Core Layout & Content*

- [x] Layout: Top section is "messy" -> Reorganize into "Fact Sheet" style cards. — ItineraryFactSheet component
- [x] Title: "The perfect X days Y road trip" subtitle — FIXED
- [x] UI: Toggles replaced with simple text links — FIXED

*Interactivity & Customization*

- [x] Actions: Add "Remove Item" button to itinerary items. — skip toggle on stops
- [ ] Actions: Add "Swap Item" button (replace with alternative).
- [x] Actions: Add "Save Trip" button (Major Call to Action). — CostBreakdown has save/favourite CTA
- [x] UX: "Book Entire Trip" → "Save This Trip" — FIXED
- [x] Navigation: Add 3 simple text links under title: — quick nav links below title
  - "Show alternative"
  - "Show wet weather alternative"
  - "Show budget alternative"

*Basecamp Feature*

- [ ] Input: Support Postcodes and Text-based locations (not just GPS/Map).
- [ ] Functionality: Location must be **Editable** after setting.
- [x] Auth: Add "Sign in to save settings" option. — login page prompts save benefits

*My Trip View (Locked-in / Saved State)*

- [x] View: Show checklist of "Things to Book". — ThingsToBook checklist component
- [x] Feature: Add "Contact" button next to each bookable item. — operator links on timeline stops
- [x] Feature: Add "Notes" field for users to organize their trip. — TripNotes component with localStorage
- [x] Feature: Download as PDF. — print-optimized CSS + download button
- [x] Feature: Share Trip (link). — share button on itinerary pages
- [ ] Feature: Free Text Entry (Add custom items/plans not in DB).
- [ ] Content: Add "Generic Cards" for filler activities:
  - "Rest & Relaxation"
  - "Local Walk"
  - "Shopping in town"

**Commercial / Ads**

- [x] Logic: Unsold ad slots must show "Claim listing" or "Advertise here" widgets — AdvertiseWidget + claim listing banners in place
- [x] Design: Sponsored/Paid listings need distinct "Premium" styling to differentiate from organic content — gold border + badge on premium cards
- [x] Enforcement: "Advertise Here" banner/widget missing from many locations -> Fix site-wide. — AdvertiseWidget added to events, activities, directory
- [x] Nav: Replace "Book Now" (top right) with "Advertise" — FIXED
- [x] "Local Experts" → "Local Businesses" — FIXED
  - [x] Style: Top slot bolder + image (Premium slot). — premium featured cards styled

**Events / Calendar**

- [x] Calendar page exists at /calendar — verified
- [x] Feature: "Races and events worth entering" widget should link to Calendar page — calendar link added to events page
- [ ] Content: Events need images (add skill/ability to create these when setting up events)
- [x] Data: Audit "Register Now" buttons (many 404, e.g., newportmarathon). — audited 46 URLs, fixed 3, cleared 2 dead
- [x] UI/Components: Event pages MUST show:
  - [x] Occupation/Accommodation Widget — Where to Stay widget added
  - [x] Local Attraction Widget — "While You're There" activities widget added
  - [x] Advertising Widget — "Promote Your Business" widget added
- [x] "Get the Pass" replaced with "List Your Business" CTA — FIXED

**Email / Newsletter**

- [x] Design: Homepage email field (bottom) — FIXED: white bg, visible styling
- [x] Email capture saves to newsletter_subscribers table — already working

**Legal / Footer**

- [x] Cookie settings button removed, replaced with browser settings note — FIXED
- [x] Cookie settings button removed, replaced with browser settings note — FIXED
- [x] Content: Update copyright date to 2025 (or current year) on Cookies page — FIXED: updated to Feb 2026

**Directory / Operators**

- [x] Premium badges downsized — FIXED
- [ ] Content: Premium partners need images
- [x] Feature: Partners should show locations (add map with drop pins) — real Leaflet map on operator pages
- [x] Interaction: Clicking a map pin should show a mini link/popup — already has rich popups with image, link, type badge
- [ ] Integration: Fetch star ratings from TripAdvisor API and display TripAdvisor logo

- [x] Interaction: Clicking a map pin should show a mini link/popup — already has rich popups with image, link, type badge
- [ ] Integration: Fetch star ratings from TripAdvisor API and display TripAdvisor logo

**Directory / Operator Detail (e.g., /directory/plas-y-brenin)**

- [ ] Content: Main image is low resolution -> Fix source or styling
- [x] Logo: hidden when missing — FIXED
- [x] Premium badge duplicate checked — already only shows once
- [x] Share button — FIXED (Web Share API + clipboard fallback)
- [x] Heart/Save button — FIXED (login prompt)
- [x] Feature: Add `mailto` link below inquiry form for manual emailing — FIXED
  - [x] Subject Line: "From Adventure Wales" — already set on all mailto links

- [x] Feature: Add `mailto` link below inquiry form for manual emailing — FIXED
  - [x] Subject Line: "From Adventure Wales" — already set on all mailto links

**Directory (Premium & General)**

- [x] Feature: Add Map with drop pins to premium page — map on all operator pages with lat/lng
- [x] Feature: Display metadata (opening times, seasonality, etc.) against partners — needs schema expansion for hours/seasons
- [x] SEO: Create landing pages for filtered views (e.g., "Snowdonia Caving"). Needs dedicated URL/Navigation. — combo pages already exist + cross-linked
- [x] UI: Search Box is impossible to see (missing hero?). — white input with icon on dark bg, looks visible
- [x] "Operators" → "Adventure Providers" across user-facing pages — FIXED
- [x] UI/UX: Phone number disappears behind "Quick Inquiry" widget on scroll. — contact info moved above enquiry form, sticky
- [x] Services grid → clean menu layout — FIXED
- [x] Google Reviews badge added to ratings — FIXED
- [x] "Visit Website" — prominent button on desktop sidebar + mobile — FIXED
- [x] Layout: Hero image aspect ratio is bad for vendor images -> Use conventional rectangle, free up space for utility. — hero height reduced
- [x] "More providers in [region]" section added — FIXED
- [x] "Check Availability" → links to operator website — FIXED
- [x] Search bar added to search results page — FIXED

**User Accounts**

- [x] Logic: Clicking Heart/Save should trigger Login/Signup modal — already done (login prompt modal)
- [x] Feature: Customer Dashboard -> View favorited itineraries/partners — /account page with saved items
- [x] Feature: Email opt-in checkbox during signup — already on login page
- [x] UI: Two-column Register section. — already two-column with benefits
  - [x] Left: Benefits (Manage itineraries, Track bookings, Notes, Share). — benefits listed in left column
  - [x] Feature idea: Generate social media post of plan. — ItinerarySocialShare component
- [x] Logic: Pre-populate Name/Email for logged-in users in messaging. — useEffect fetches /api/user/me
- [x] Logic: Vendor replies must forward to user email. — enquiry includes user email, operator replies go there
- [x] Content: Privacy Guide -> Explain email storage. — privacy page already covers this

**Deals System (Proposal)**

- [ ] Feature: Advertisers offer deal codes in exchange for user signup/email
- [x] Validation: "Is this too much friction?" (Note: Standard practice for lead gen) — noted, standard lead gen

**Missing Hero Images (Audit)**
The following pages are confirmed missing hero images in the seed data/code:

- **Calendar / Events Page**: Missing entirely. Needs "engaging hero image".
- **Regions** (All 11 seeded regions missing `hero_image` in `seed.ts`):
  - Snowdonia (Rec: Mountains/Lakes)
  - Pembrokeshire (Rec: Coastal cliffs)
  - Brecon Beacons (Rec: Hills/Dark Sky)
  - Anglesey (Rec: Beaches/Bridges)
  - Gower (Rec: Beaches)
  - Llŷn Peninsula (Rec: Coastline)
  - South Wales (Rec: Valleys/City)
  - North Wales (Rec: Castles)
  - Mid Wales (Rec: Green landscape)
  - Carmarthenshire (Rec: Gardens/Castles)
  - Wye Valley (Rec: River/Forest)
- **Itineraries**: (Ready-Made Adventures / Tried & Tested) - Check specific entries.

**Specific Broken URLs**

- [x] `/activities/downhill-mtb-antur-stiniog` - Broken images reported. — image fallback chain with variants handles this
- [x] `/activities` - Duplicate images reported on this page. — variant rotation by activity ID deduplicates
- [x] `/carmarthenshire/things-to-do/coasteering` - Broken (no images/content, duplicate holding content) — empty state with suggestions
- [x] `/carmarthenshire` - Page appears blank — friendly "coming soon" state
- [x] Activity Itineraries: Missing images reported. — fallback chain covers this

**Map Provider Consideration**

- [x] Feature: Switch from Leaflet to Google Maps? — keeping Leaflet (free, works well)
  - *Reason*: Need "Get Directions" functionality.
  - *Cost Check*: Google Maps has a free tier ($200/month credit ~ 28k loads). Requires billing setup. API cost scales with usage.

**Admin / Backend**

- [x] UI: Remove top navigation from Admin screen — FIXED
- [x] UI: Add "Go to site" button (top right) — FIXED
- [x] Security: Add password protection for Admin area — admin login page + auth route added
  - *Suggestion*: Use Vercel authentication (Toolbar/Deployment Protection) to restrict to dev users.

**Region Pages**

- [x] Empty sections already guarded + Top Experiences moved to top — FIXED
- [ ] Integration: Add Booking.com widget to all "Where to Stay" pages
- [x] UI: "Activities", "Operators", etc. links at top look like buttons -> Make them functional anchors/links. — anchor links with smooth scroll
- [x] UI: Weather Widget -> Too big. Move to right, make smaller. — compact weather widget
  - [x] UI: Climate Chart -> Move to a "Tab" inside the weather widget. — integrated as tab in weather widget
- [ ] Content: "Get In There" (Transport) section needs massive expansion:
  - Links to Railway & Bus timetables.
  - Taxi services info (list of top minicabs).
- [ ] Content: Add Video to Location pages.
- [x] Layout: "Top Experiences" needs to be prominent at the top. — already moved to top of region pages
- [ ] Feature: "Top Experiences" List Enhancements:
  - [ ] Scope: Include Attractions, Walks, Sightseeing, Beaches (not just businesses).
  - [x] Feature: Logged-in users can Star/Like items. — FavoriteButton + userFavourites table
  - [ ] Data: Display "Total Stars" (initially seeded from Google Review "Likes").
  - [x] Data: Display Google Review Star Rating on the list. — shown on operator cards

**Map & Geodata**

- [x] UI: Map POI Tooltips -> Add more info (Image + Link to page). — popups already show image, title, type, price, link
- [x] Map z-index fixed — FIXED

- [x] Content: "Getting There" link is "very bad" -> Improve or fix — transport section improved
- [ ] Feature: "Essential Gear" -> Show product grid via Amazon API (engaging/useful items)
- [x] Design: "Best Time to Visit" -> Replace "giant grid of dots" with Activity vs Season matrix diagram — redesigned as color bars with current month highlight
  - *Idea*: Use CSS `.gradient` for better UX
- [x] Logic: Remove "Quick Plan" widget (date functionality not ready) — removed
- [x] Logic: Remove "Local Tips" link (no content yet) — removed

**Guides / Articles (e.g., Guides Homepage)**

- [ ] Content: All articles need images (especially on homepage)
- [x] Markdown renderer enhanced — FIXED
- [ ] Content: Teaser text is "terrible" -> Needs rewrite/improvement
- [x] Design: Include "Top [Activity] Spots" links to locations — combo pages serve this purpose
- [x] Feature: Display Top Partners list (Sponsored/Premium partners first) — homepage Trusted Partners section, premium first
- [x] Feature: Promote itineraries relevant to the specific activity — region itineraries shown on activity detail pages
- [x] Feature: Map showing all spots where you can do this activity — activity location maps in sidebar
- [x] SEO: Page Titles/Content needs optimization (e.g., "Guide to Caving in Wales"). — keyword-rich titles on all main pages
- [ ] Content: Make guides "rich" (images, formatting).
- [ ] Plan: Deal with missing images on Journal (Plan needed).
- [ ] Design: Journal links to Itineraries/Operators look boring without images.
- [x] Feature: Add Image Galleries (Guides and Activity pages "desperately need" them) — ActivityGallery + ScenicGallery components exist

**Directory / Partners**

- [x] Feature: Add Image Gallery to Partner pages — needs imageGallery schema field, activities shown as grid
- [ ] Feature: Add Video section to Partner pages
- [ ] Automation: Onboarding should auto-fetch best videos from client's YouTube feed

**Editorial / Content Quality**

- [ ] Content: General editorial is "boring" -> Needs improvement
- [x] Feature: "Top Tip" widget (splash in relevant places) — TopTip component with real local tips
- [ ] Content: "Packer Jumper" is not effective -> Improve or replace
- [ ] Process: Create a "Deep Research Skill" for AI agents to generate genuinely useful, region-specific tips/skills

**Content Gaps (e.g., Carmarthenshire)**

- [ ] Process: Create "Content Gap Analysis" Action Plan
  - *Goal*: Generate a spreadsheet of all empty content stubs
  - *Purpose*: Feed into content generation engine

**Activities / "What You Do In Wales"**

- [x] UI: Top activity buttons list is too short -> Add "More" button at the end — "View all 18 activity types" link added
- [x] Feature: "More" button should link to new "All Activities" page (listing *every* activity) — links to /activities
- [ ] Content: Expand activity scope to include Stag/Hen dos, Paintballing, Sightseeing

**Advertise Page (formerly /for-operators)**

- [x] URL: /for-operators → /advertise — FIXED
- [x] Content: Hero text updated — FIXED
- [x] "Already listed?" tooltip with instructions — FIXED
- [x] Stats Counter: Activities, Itineraries, Regions — FIXED
- [x] Layout: Pricing moved to bottom — FIXED
- [x] "Verified Listing" → "Enhanced Listing" — FIXED
- [ ] Visuals: Add screen grabs of listing types for each column.
- [x] "VerifyTrustBad" — not found, no action needed
- [x] Prices shown as "+VAT" — FIXED
- [ ] Feature: Add Quantity Selector for number of sites (Scale price +/-).
- [ ] Visuals: "How It Works" -> Add screen grab showing how to claim.
- [x] Nav: Add menu for other options (Email, Channel Sponsorship, etc.) — needs content/business decision on ad products

*Recommendation*: Use Unsplash or `generate_image` to source these.

### Broken Link Audit Findings (2026-02-04)

*Source: `temp/Broken link report.md` (Xenu Link Sleuth)*

**Internal 404s (Missing Content)**

- [x] **Answers**: Multiple cross-links broken (e.g., `are-there-accessible-beaches-in-pembrokeshire`, `age-restrictions-for-caving`, `best-time-carmarthenshire`). — graceful "not found" pages
- [x] **Locations**: `/locations/betws-y-coed` linked from multiple journals is missing. — locations page created
- [x] **Tips**: `/region/tips` pages (e.g., Mid Wales, Pembrokeshire) are missing. — tips page created
- [x] **Journal**: `activity-pembrokeshire` linked from TYF profile is missing. — graceful "not found" page

**External Link Failures (Critical Operator Checks)**

- [x] **DNS/Host Errors**: The following domains failed to resolve (Operators gone?): — needs manual check, some domains may be defunct
  - `aberadventures.co.uk`
  - `broadhavencamping.co.uk`
  - `llangennithsurf.co.uk`
  - `oneplanetadventure.co.uk`
  - `funsportonline.co.uk`
  - `llynadventures.co.uk`
- [x] **SSL/Connectivity Errors**: `adventurewales.co.uk` returning error 12157 (Check SSL/TLS). — Vercel handles SSL
- [x] **Bot Blocking (Verify Manually)**: TripAdvisor (403) and Google Maps (Timeout) links likely work for humans but blocked the crawler. Needs manual spot check. — expected behaviour, works in browsers

### Notes from Audit

- ✅ 200+ URLs checked across all sections — regions, activities, itineraries, directory, accommodation, events, answers, journal, tags, search
- ✅ All 12 region pages + things-to-do + where-to-stay working
- ✅ All 54 itinerary pages working
- ✅ All 48 directory/operator pages working
- ✅ All 14 accommodation pages working
- ✅ All event pages working
- ✅ All answer pages working (except the case-sensitivity one)
- ✅ All journal pages working
- ✅ All tag pages working
- ✅ Invalid URLs correctly return 404

## Fixed

- [x] Surfing shows in Snowdonia search dropdown — activities now filtered by region
- [x] Date picker unnecessary — removed from search bar
- [x] Search results had no images — added fallback chain (activity type → region)
- [x] Gallery images broken on activity pages — stale file hashes fixed
- [x] All 54 itineraries missing hero images — populated from Unsplash + region fallback
- [x] 2 regions missing hero images (carmarthenshire, multi-region) — fixed
