# SNAGS.md — Quick Bug & Fix List

Drop anything you notice here. One line per snag. I'll fix and tick them off.

Format: `- [ ] what's wrong (page/url if helpful)`

## Open

### 404s Found (Site Audit 2026-02-06)

- [ ] `/for-operators` — 404! This is the operator sales page, was working before. Likely fell out of the Vercel build
- [ ] `/activities/camping` — 404, linked from homepage but no activity with that slug exists in DB
- [ ] `/activities/climbing` — 404, linked from homepage but no activity with that slug exists in DB
- [ ] `/activities/hiking` — 404, linked from homepage but no activity with that slug exists in DB
- [ ] `/activities/photography` — 404, linked from homepage but no activity with that slug exists in DB
- [ ] `/answers/best-adventures-brecon-Beacons` — 404 due to capital B in "Beacons" (case sensitivity)

### Feedback (2026-02-04)

**Homepage & Navigation**

- [ ] Hero: Buttons and quantity figures overlap/hide behind search box on mobile/small screens
- [ ] Nav: "Find Your Adventure" link text -> "Perfect Welsh Itineraries"
- [ ] Nav: "Activities" page needs clearer signposting for users wanting single experiences (vs multi-day itineraries)
- [ ] Content: "Tried & Tested Routes" section has missing images
- [ ] Content: "Ready-Made Adventures" section has missing images
- [ ] Design: Remove prices from "Tried & Tested Routes" and "Ready-Made Adventures" (make it look less like we are selling something)

**Itinerary Listings**

- [ ] Content: Add header text explaining these are "multi-day road trips and itineraries"
- [ ] Content: "We've reviewed the best, and bring you fantastic plans that are editable and shareable."
- [ ] UI: Add small map on right side linking to each valid itinerary

**Itinerary Details**

- [ ] Share: Add "Send to a friend" button (WhatsApp, Email, etc) with pre-populated link
- [ ] Sidebar: Show relevant activities widget (right-hand side)
- [ ] Title: Under Tour Itinerary, add text "The perfect <x> days <location> road trip"
- [ ] UI: Remove "Standard weather" and "budget friendly" toggles
- [ ] UI: Add 3 simple text links under title:
  - "Show alternative"
  - "Show wet weather alternative"
  - "Show budget alternative"
- [ ] Data: Database update needed to support these alternative itinerary variations

**Basecamp Feature**

- [ ] Input: Allow users to input Postcode or Location
- [ ] Auth: Add "Sign in to save settings" option

**Commercial / Ads**

- [ ] Logic: Unsold ad slots must show "Claim listing" or "Advertise here" widgets
- [ ] Design: Sponsored/Paid listings need distinct "Premium" styling to differentiate from organic content

**Events / Calendar**

- [ ] Feature: "Calendar" page missing? If so, build one.
- [ ] Feature: "Races and events worth entering" widget should link to Calendar page
- [ ] Content: Events need images (add skill/ability to create these when setting up events)

**Email / Newsletter**

- [ ] Design: Homepage email field (bottom) is clear/invisible
- [ ] Feature: Email capture must save to database (Postgres/Vercel) -> Add to to-do list

**Legal / Footer**

- [ ] Functionality: Cookie settings link doesn't work -> Remove it if no logic exists
- [ ] Functionality: Cookie settings link doesn't work -> Remove it if no logic exists
- [ ] Content: Update copyright date to 2025 (or current year) on Cookies page

**Directory / Operators**

- [ ] Design: Premium verified partner flags are "ridiculously massive"
- [ ] Content: Premium partners need images
- [ ] Feature: Partners should show locations (add map with drop pins)
- [ ] Interaction: Clicking a map pin should show a mini link/popup
- [ ] Integration: Fetch star ratings from TripAdvisor API and display TripAdvisor logo

- [ ] Interaction: Clicking a map pin should show a mini link/popup
- [ ] Integration: Fetch star ratings from TripAdvisor API and display TripAdvisor logo

**Directory / Operator Detail (e.g., /directory/plas-y-brenin)**

- [ ] Content: Main image is low resolution -> Fix source or styling
- [ ] Design: Logo: If missing, hide container entirely (don't show "square with letter")
- [ ] Layout: "Premium Partner" badge/text appears twice -> remove duplicate
- [ ] Functionality: Share button doesn't work
- [ ] Functionality: Heart/Save button doesn't work
- [ ] Feature: Add `mailto` link below inquiry form for manual emailing
  - [ ] Subject Line: "From Adventure Wales"

- [ ] Feature: Add `mailto` link below inquiry form for manual emailing
  - [ ] Subject Line: "From Adventure Wales"

**Directory (Premium & General)**

- [ ] Feature: Add Map with drop pins to premium page
- [ ] Feature: Display metadata (opening times, seasonality, etc.) against partners

**User Accounts**

- [ ] Logic: Clicking Heart/Save should trigger Login/Signup modal
- [ ] Feature: Customer Dashboard -> View favorited itineraries/partners
- [ ] Feature: Email opt-in checkbox during signup

**Deals System (Proposal)**

- [ ] Feature: Advertisers offer deal codes in exchange for user signup/email
- [ ] Validation: "Is this too much friction?" (Note: Standard practice for lead gen)

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

- [ ] `/activities/downhill-mtb-antur-stiniog` - Broken images reported.
- [ ] `/activities` - Duplicate images reported on this page.
- [ ] `/carmarthenshire/things-to-do/coasteering` - Broken (no images/content, duplicate holding content)
- [ ] `/carmarthenshire` - Page appears blank

**Map Provider Consideration**

- [ ] Feature: Switch from Leaflet to Google Maps?
  - *Reason*: Need "Get Directions" functionality.
  - *Cost Check*: Google Maps has a free tier ($200/month credit ~ 28k loads). Requires billing setup. API cost scales with usage.

**Admin / Backend**

- [ ] UI: Remove top navigation from Admin screen
- [ ] UI: Add "Go to site" button (top right)
- [ ] Security: Add password protection for Admin area
  - *Suggestion*: Use Vercel authentication (Toolbar/Deployment Protection) to restrict to dev users.

**Region Pages**

- [ ] Logic: Hide "Top Activities", "Experiences", "Where to Stay" links/sections if empty (don't show empty containers)
- [ ] Integration: Add Booking.com widget to all "Where to Stay" pages

**Plan Your Visit / Utilities**

- [ ] Content: "Getting There" link is "very bad" -> Improve or fix
- [ ] Feature: "Essential Gear" -> Show product grid via Amazon API (engaging/useful items)
- [ ] Design: "Best Time to Visit" -> Replace "giant grid of dots" with Activity vs Season matrix diagram
  - *Idea*: Use CSS `.gradient` for better UX
- [ ] Logic: Remove "Quick Plan" widget (date functionality not ready)
- [ ] Logic: Remove "Local Tips" link (no content yet)

**Guides / Articles (e.g., Guides Homepage)**

- [ ] Content: All articles need images (especially on homepage)
- [ ] Bug: Markdown syntax is visible in text (needs proper rendering)
- [ ] Content: Teaser text is "terrible" -> Needs rewrite/improvement
- [ ] Design: Include "Top [Activity] Spots" links to locations
- [ ] Feature: Display Top Partners list (Sponsored/Premium partners first)
- [ ] Feature: Promote itineraries relevant to the specific activity
- [ ] Feature: Map showing all spots where you can do this activity
- [ ] Feature: Add Image Galleries (Guides and Activity pages "desperately need" them)

**Directory / Partners**

- [ ] Feature: Add Image Gallery to Partner pages
- [ ] Feature: Add Video section to Partner pages
- [ ] Automation: Onboarding should auto-fetch best videos from client's YouTube feed

**Editorial / Content Quality**

- [ ] Content: General editorial is "boring" -> Needs improvement
- [ ] Feature: "Top Tip" widget (splash in relevant places)
- [ ] Content: "Packer Jumper" is not effective -> Improve or replace
- [ ] Process: Create a "Deep Research Skill" for AI agents to generate genuinely useful, region-specific tips/skills

**Content Gaps (e.g., Carmarthenshire)**

- [ ] Process: Create "Content Gap Analysis" Action Plan
  - *Goal*: Generate a spreadsheet of all empty content stubs
  - *Purpose*: Feed into content generation engine

**Activities / "What You Do In Wales"**

- [ ] UI: Top activity buttons list is too short -> Add "More" button at the end
- [ ] Feature: "More" button should link to new "All Activities" page (listing *every* activity)
- [ ] Content: Expand activity scope to include Stag/Hen dos, Paintballing, Sightseeing

**Advertise Page (formerly /for-operators)**

- [ ] URL: Change `/for-operators` to `/advertise`
- [ ] Content: Hero text -> "Grow your travel business in Wales directory." (Remove "adventure" focus)
- [ ] Logic: "Already listed?" link -> Open popup with instructions ("Find attraction, use Claim button") instead of jumping to page
- [ ] Design: Stats Counter -> Remove "Operators" count. Show Activities, Itineraries, Regions.
- [ ] Layout: Move Price to bottom, Sales benefits to top.
- [ ] Design: Rename "Verified Listing" to "Enhanced".
- [ ] Visuals: Add screen grabs of listing types for each column.
- [ ] Content: Remove "VerifyTrustBad" references (doesn't exist).
- [ ] Content: Show Prices as "+VAT".
- [ ] Feature: Add Quantity Selector for number of sites (Scale price +/-).
- [ ] Visuals: "How It Works" -> Add screen grab showing how to claim.
- [ ] Nav: Add menu for other options (Email, Channel Sponsorship, etc.)

*Recommendation*: Use Unsplash or `generate_image` to source these.

### Broken Link Audit Findings (2026-02-04)

*Source: `temp/Broken link report.md` (Xenu Link Sleuth)*

**Internal 404s (Missing Content)**

- [ ] **Answers**: Multiple cross-links broken (e.g., `are-there-accessible-beaches-in-pembrokeshire`, `age-restrictions-for-caving`, `best-time-carmarthenshire`).
- [ ] **Locations**: `/locations/betws-y-coed` linked from multiple journals is missing.
- [ ] **Tips**: `/region/tips` pages (e.g., Mid Wales, Pembrokeshire) are missing.
- [ ] **Journal**: `activity-pembrokeshire` linked from TYF profile is missing.

**External Link Failures (Critical Operator Checks)**

- [ ] **DNS/Host Errors**: The following domains failed to resolve (Operators gone?):
  - `aberadventures.co.uk`
  - `broadhavencamping.co.uk`
  - `llangennithsurf.co.uk`
  - `oneplanetadventure.co.uk`
  - `funsportonline.co.uk`
  - `llynadventures.co.uk`
- [ ] **SSL/Connectivity Errors**: `adventurewales.co.uk` returning error 12157 (Check SSL/TLS).
- [ ] **Bot Blocking (Verify Manually)**: TripAdvisor (403) and Google Maps (Timeout) links likely work for humans but blocked the crawler. Needs manual spot check.

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
