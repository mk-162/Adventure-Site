# Adventure Wales — Development Plan

## Phase A: Investor Demo Polish ✅ COMPLETE
- [x] Basecamp concept — accommodation picker with personalised travel times
- [x] Search widget upgrade — polished WHERE/WHAT/WHEN with results page
- [x] Verified operator badges — shield badges across cards, profiles, timelines
- [x] "Enquire All Vendors" button — CTA + form on itinerary pages
- [x] 54 itineraries imported — 520 stops loaded from JSON
- [x] Stitch design audit — all high-priority elements implemented

---

## Phase B: Partnerships & Integrations 🔨 NEXT

### B1. Booking.com Affiliate Integration ⭐ HIGH PRIORITY
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

### B2. Weather Feed Integration ⭐ HIGH PRIORITY
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

### B3. Operator Dashboard (3 screens)
The B2B side — operators manage their listings:
- **Leads Overview** — KPIs (new leads, conversion rate, revenue), recent enquiries
- **Lead Detail + Chat** — customer profile, trip context, messaging thread
- **Analytics** — impressions chart, conversion funnel, lead sources, top activities

### B4. Drag & Drop Itinerary Editor
Edit mode for itineraries:
- Drag handles to reorder stops
- "Find Nearby Lunch" smart suggestions
- Proximity warnings ("High Travel Time" alerts)
- Locked basecamp points

### B5. "Vibe" Filter
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

*Last updated: 2026-02-04*
