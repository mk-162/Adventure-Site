# Adventure Wales — Development Plan

## Phase A: Investor Demo Polish ✅ COMPLETE
- [x] Basecamp concept — accommodation picker with personalised travel times
- [x] Search widget upgrade — polished WHERE/WHAT/WHEN with results page
- [x] Verified operator badges — shield badges across cards, profiles, timelines
- [x] "Enquire All Vendors" button — CTA + form on itinerary pages
- [x] 54 itineraries imported — 520 stops loaded from JSON
- [x] Stitch design audit — all high-priority elements implemented

---

## Phase B1: Claim Your Listing MVP 🔨 NEXT

Self-service claim flow — operators find their listing and claim it. No payments, no AI, no dashboard.
**Full spec:** `plans/claim-listing-mvp.md`

- [ ] **Claim form** on `/directory/claim` — business name, contact, email, operator selector, message
- [ ] **API route** `POST /api/claims` — validate, store, update operator record
- [ ] **Schema migration** — `operator_claims` table for audit trail
- [ ] **"Claim this listing" CTA** on stub operator profiles → links to claim form pre-filled
- [ ] **Admin claims queue upgrade** — show claim details, one-click domain verify, approve/reject with emails
- [ ] **Confirmation emails** — to claimant on submit, congratulations on approval, rejection with reason

**Estimated effort:** ~6 hours
**Validates:** Do operators actually want to engage? If yes, unlock Phase C (payments, dashboard).

---

## Phase B2: Partnerships & Integrations

### Booking.com Affiliate Integration ⭐ HIGH PRIORITY
Accommodation is the biggest revenue opportunity. Integrate Booking.com affiliate API to:
- **Affiliate links on accommodation pages** — deep link to Booking.com with our affiliate tag
- **Live availability & pricing** — show real-time rates from Booking.com API
- **Accommodation search widget** — "Check availability" button on every accommodation card
- **Itinerary integration** — basecamp picker shows live Booking.com prices
- **Revenue model:** Commission per booking (typically 25-40% of Booking.com's commission)

**Technical:**
- Booking.com Affiliate Partner Programme API
- Alternative/complementary: Airbnb affiliate, Hostelworld, Pitchup (camping)
- Store affiliate IDs per accommodation in DB
- Add `bookingComId` field to accommodation table

### Weather Feed Integration ⭐ HIGH PRIORITY
Real-time and forecast weather is essential for adventure planning:
- **Weather widget on region pages** — current conditions + 5-day forecast
- **Weather on itinerary pages** — show forecast for trip dates
- **Wet weather alternative triggers** — auto-suggest wet weather alternatives when rain forecast
- **Activity suitability indicators** — "Great conditions for coasteering today!" or "⚠️ High winds — check with operator"
- **Seasonal planning** — historical weather data for "best time to visit" sections

**Technical:**
- OpenWeatherMap API (free tier: 1,000 calls/day) or Met Office DataPoint (free, UK-specific)
- Cache weather data (refresh every 30-60 min)
- Map regions to weather station coordinates
- Create `src/components/weather/WeatherWidget.tsx`
- Create `src/components/weather/ActivityWeatherAlert.tsx`

### Operator Dashboard (3 screens)
The B2B side — operators manage their listings:
- **Leads Overview** — KPIs (new leads, conversion rate, revenue), recent enquiries
- **Lead Detail + Chat** — customer profile, trip context, messaging thread
- **Analytics** — impressions chart, conversion funnel, lead sources, top activities

### Drag & Drop Itinerary Editor
Edit mode for itineraries:
- Drag handles to reorder stops
- "Find Nearby Lunch" smart suggestions
- Proximity warnings ("High Travel Time" alerts)
- Locked basecamp points

### "Vibe" Filter
Mood-based search: Adrenaline / Chill / Family / Romantic — maps to tag system with friendlier UX.

---

## Phase C: Revenue & Growth

### C1. Enquire All Vendors — Email Integration
Wire up the existing "Enquire All Vendors" form to actually send emails:
- Email to each operator on the itinerary
- Templated email with trip details, dates, group size
- CC to user with confirmation
- Track in operator dashboard

### C2. Operator Claiming & Payments
- Operator self-service claiming flow
- Stripe integration for premium listings
- Tiered pricing: Free (stub) → Claimed (free) → Premium (paid)
- Premium features: featured placement, analytics, direct messaging

### C3. PDF Export
Downloadable PDF itineraries with:
- Day-by-day timeline
- Map snapshots
- Cost breakdown
- Packing list
- Emergency contacts

### C4. Community Itineraries
User-created trips:
- Fork existing itineraries
- Custom stop additions
- Share publicly or privately
- Rating/review system

---

## Phase D: Content & SEO

### D1. Content Pipeline
- 100+ journal articles (brief exists)
- FAQ/answer engine expansion
- Seasonal content calendar
- User-generated reviews

### D2. Local Markets / Discovery Feed
- Discovery Feed = Journal (exists)
- Local Markets = new concept (artisan food, craft shops, farm shops near activities)
- Community events integration

---

## Technical Debt & Infrastructure

- [ ] Image optimisation pipeline (currently placeholder images)
- [ ] Caching layer for DB queries
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Plausible or PostHog)
- [ ] Staging environment
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] Accessibility audit

---

## Agent Assignments

| Agent | Role | Status |
|-------|------|--------|
| **Sudo** (Claude/Clawdbot) | Architecture, features, integrations, orchestration | Active |
| **Jules** (Google) | Page builds, component tasks, infrastructure | Needs task assignment |

### Jules Task Queue
Jules works from `JULES.md` / `JULES_ROUND2.md` specs. Needs tasks pushed via GitHub.

**Ready for Jules:**
1. Weather widget component + region integration
2. Operator dashboard screens (from Stitch designs)
3. PDF export functionality
4. Vibe filter UI

---

## 🔮 Future Ideas (Post-MVP Claim Flow)

Ideas discussed for the platform. Not prioritised yet — revisit once the claim MVP proves demand.

### Operator Self-Service
- **Magic link email verification** — send PIN/link to business domain email as proof of ownership (like Google Business Profile)
- **Operator self-edit** — claimed operators can update their own description, photos, services, contact details without admin
- **Operator dashboard** — leads overview, analytics, billing management, enquiry inbox
- **Multi-location claiming** — operators like Zip World with multiple sites across Wales, per-location management
- **Profile completeness score** — gamify profile completion: "Your listing is 60% complete — add photos to reach 100%"

### Verification & Trust
- **Automated domain verification** — auto-match submitted email domain to operator website domain
- **AALA register check** — cross-reference against Adventure Activities Licensing Authority register
- **Companies House lookup** — verify business registration
- **Insurance certificate upload** — operators upload proof of insurance for enhanced trust badge
- **Google/TripAdvisor rating sync** — auto-pull latest ratings to display on listings
- **Video call verification** — for edge cases where domain/email verification isn't possible

### Payments & Monetisation
- **Stripe subscription integration** — monthly/annual billing for premium tiers
- **Tiered pricing enforcement** — Free (stub) → Claimed (free) → Verified (£9.99/mo) → Premium (£29.99/mo)
- **Feature gating per tier** — photos, description length, contact details, search boost, analytics
- **Sponsored itinerary stops** — operators pay for featured placement in trip itineraries
- **Ad slot system** — activate the existing `ad_slots` / `ad_campaigns` schema
- **Affiliate revenue** — Booking.com, Amazon Associates (gear articles), Cotswold Outdoor

### Lead Generation
- **Enquiry forwarding** — visitor enquiries routed to operator email with full trip context
- **Lead tracking** — operator dashboard shows new leads, conversion rates, sources
- **Enquiry form per operator** — on profile pages, not just itinerary-level
- **Weekly digest emails** — "Your listing got X views this week, Y enquiries"
- **Lead scoring** — highlight high-intent enquiries (dates selected, group size specified)

### Analytics & Insights
- **View/click tracking** — profile views, website clicks, phone reveals, booking clicks
- **Competitor benchmarking** — "You're getting 40% fewer views than similar operators in your region"
- **Seasonal trends** — show operators when their peak demand periods are
- **ROI calculator** — "Premium listing pays for itself with just 2 bookings/month"

### Content & Community
- **Operator-submitted journal articles** — sponsored content tagged and disclosed
- **Community itineraries** — users fork/create their own trips
- **User reviews** — visitor ratings on operators and activities
- **Seasonal content calendar** — automated publishing schedule
- **Local markets / discovery feed** — artisan food, craft shops, farm shops near activities

### Technical Foundations
- **Email system** — Resend or Postmark for transactional emails (magic links, notifications, digests)
- **File uploads** — Vercel Blob or Cloudinary for operator photos/logos
- **Caching layer** — Redis or in-memory cache for DB queries
- **Error monitoring** — Sentry for production error tracking
- **Web analytics** — Plausible or PostHog for visitor analytics
- **CI/CD pipeline** — automated testing and deployment
- **Accessibility audit** — WCAG compliance pass
- **PDF export** — downloadable itineraries with maps, costs, packing lists

### AI-Powered (Later)
- **AI itinerary builder** — "Plan me a weekend in Snowdonia" → generates custom itinerary
- **Smart operator matching** — AI suggests which operators fit a visitor's preferences
- **Automated listing enrichment** — AI scrapes operator websites to fill in missing listing data
- **Chatbot trip planner** — conversational interface for trip planning
- **Activity weather intelligence** — AI-powered "should I go today?" recommendations based on forecast + activity type

---

*Last updated: 2026-02-06*
