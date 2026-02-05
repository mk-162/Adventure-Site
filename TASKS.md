# Adventure Wales — Master Task List
**Last updated:** 2026-02-05
**Live site:** https://adventure-site-lyart.vercel.app
**Repo:** mk-162/Adventure-Site

---

## 📊 Current Stats
| Content | Count | Quality |
|---------|-------|---------|
| Regions | 12 | ✅ All published |
| Operators | 61+ | ✅ Coords verified, maps live |
| Activities | 154 | ✅ 23 activity types |
| Itineraries | 54 (520 stops) | ✅ Full planner UX |
| Accommodation | 70 | ✅ In DB |
| Events | 46 | ✅ In DB |
| Answers/FAQ | 145+ | ✅ 10 new FAQ pages added |
| Journal posts | 133+ | ✅ 5 new articles added |
| Advertisers | 27 | ✅ Seeded |
| Active campaigns | 6 | ✅ Demo content |
| Operator offers | 8 | ✅ Demo content |
| Activity types | 23 | ✅ 5 new (Horse Riding, Fishing, Wildlife, Paintball, Beaches) |

**SNAGS progress:** 150/171 fixed (88%) — remaining 21 need MK input, content, or API keys

---

## ✅ DONE (Overnight Session — 2026-02-05/06)
**150 snags fixed in one session. Zero TypeScript errors.**

### Major Features Shipped
- [x] User account page (`/account`) with saved items
- [x] TopTip widget with 14 Welsh-specific activity tips
- [x] Real Leaflet maps on all operator pages (replacing placeholder)
- [x] Itinerary fact sheet, contact/book buttons, share button
- [x] Trip Notes (localStorage), Things to Book checklist, Skip Stop toggle
- [x] Custom stop form ("add your own stop" to itinerary days)
- [x] PDF print, social share, quick nav links
- [x] DealCode component (operator deal codes for email signup)
- [x] Postcode-based coordinate verification (postcodes.io — 101 accurate, 49 corrected)
- [x] Advertise page full rebuild (price-led hero, sticky bars, comparison table, FAQ)
- [x] 5 new activity types: Horse Riding, Fishing, Wildlife, Paintball, Beaches
- [x] 5 new journal articles + 10 new FAQ/answer pages
- [x] 10 existing guide/answer pages enriched with Welsh detail
- [x] Transport data expanded for all 9 regions
- [x] Content gap analysis written to `content/content-gap-analysis.md`
- [x] Google Places API integrated for reviews
- [x] CSS Turbopack fix (escaped-colon selectors → attribute selectors)
- [x] Dropdown dedup fix (slug-based, was showing 36 types instead of 23)
- [x] Map day tabs repositioned (was clashing with Leaflet zoom buttons)

### Content Strategy
- [x] Mega Page Brief (`docs/MEGA-PAGE-BRIEF.md`) — high-volume landing pages
- [x] Pillar Content Plan (`docs/PILLAR-CONTENT-PLAN.md`) — 4-layer content pyramid
- [x] MTB South Wales showcase page built (2,500+ word editorial, real Unsplash images)
- [x] Commercial operator tiers: Free → Enhanced £9.99/mo → Premium £29.99/mo

## ✅ DONE (Session — 2026-02-04)
- [x] 9 missing admin pages (create/edit for operators, regions, activities, accommodation, events, answers + commercial)
- [x] Commercial demo content seeded (campaigns, creatives, ad slots, offers, page ads)
- [x] Booking platform integration (schema, UI, admin partner mapping page)
- [x] 62 non-Wales images replaced with genuine Welsh photos
- [x] Homepage hero images fixed (was Arizona/Beijing/Bolivia → now Snowdon/Pembrokeshire/Snowdonia)

## ✅ DONE (Earlier Sessions)
- [x] Basecamp concept (accommodation picker, travel time recalculation)
- [x] Search widget (WHERE/WHAT/WHEN with region icons, season picker)
- [x] Verified operator badges (claimed/premium across all cards)
- [x] Enquire All Vendors (one-click enquiry on itineraries)
- [x] 54 itineraries imported (520 stops)
- [x] 128 journal articles imported
- [x] 10 critical fixes (mock data, duplicate nav, filters, sorting)
- [x] Weather integration (Met Office, climate charts, activity season guide)
- [x] 509+ static pages building clean
- [x] Vercel deployment live
- [x] Adventure research skill created
- [x] Tier 1 (8 operators) + Tier 2 (27 operators) researched

---

## 🔴 REMAINING 21 SNAGS — Need MK Input

These are the items code can't solve. They need content, business decisions, or API keys.

### 🖼️ Missing Images (10) — Need Real Photos or AI Generation
- [ ] **Event images** — events need hero images (consider sourcing from operators/Unsplash)
- [ ] **Premium partner images** — partner pages need quality photos
- [ ] **Article hero images** — guides homepage articles need images
- [ ] **Journal hero images** — some journal posts still missing
- [ ] **Guide images** — make guides "rich" with images + formatting
- [ ] **Journal-to-itinerary/operator links** — look boring without images
- [ ] **Operator detail main image** — some are low resolution
- [ ] **Region hero images** — 11 seeded regions still missing `hero_image` in seed data
- [ ] **Calendar/Events page hero** — missing entirely
- [ ] **Advertise page screen grabs** — need screenshots of listing types + "How It Works" walkthrough
> *Note: 20 event + 102 article hero images were generated with Gemini but MK wants to review — prefers real photos*

### 🔌 External Integrations (2) — Need API Keys & Business Decisions
- [ ] **TripAdvisor API** — fetch star ratings, display TripAdvisor logo on operator pages
- [ ] **Amazon Associates** — "Essential Gear" product grid on guide pages

### 📦 Content/Data Expansion (3) — Scope Decisions
- [ ] **Expand activity types** — add Stag/Hen dos, Sightseeing, Attractions as categories
- [ ] **"Top Experiences" scope** — include Attractions, Walks, Sightseeing, Beaches (not just businesses)
- [ ] **Generic filler cards** — "Rest & Relaxation", "Local Walk", "Shopping in town" for itineraries

### ⚙️ Process Items (3) — Strategy Work
- [ ] **Deep Research Skill** — create AI skill for region-specific tips/content generation
- [ ] **Content Gap Analysis** — spreadsheet of all empty content stubs → feed into content engine
- [ ] **YouTube auto-fetch** — onboarding should auto-fetch best videos from operator's YouTube feed

### 🎨 Visuals (2) — Need Live Site
- [ ] **Advertise page screen grabs** — screenshots showing listing types for each column
- [ ] **"How It Works" screen grab** — showing how to claim a listing

### 💰 Feature (1) — UX Decision
- [ ] **Quantity selector** — multi-site pricing on advertise page (number of sites +/- price)

---

## 🟡 HIGH PRIORITY — Next Phase

### Booking & Revenue
> 📄 See: [`plans/commercial-build-spec.md`](plans/commercial-build-spec.md) — Phase 2 (Booking Integration) & Phase 4 (Affiliate Revenue)

- [ ] **Map operators to booking platforms** — check which are on Beyonk, set booking_platform + partner refs
- [ ] **Beyonk partnership** — Email hello@beyonk.com to become distribution partner
- [ ] **Price comparison schema** — `booking_sources` table (activity_id, platform, price, url, last_checked)
- [ ] **Price comparison UI** — widget on activity pages showing prices across platforms
- [ ] **Affiliate links** — wire up GetYourGuide, Viator, Booking.com affiliate tracking URLs

### Commercial Model
> 📄 See: [`plans/commercial-offerings-plan.md`](plans/commercial-offerings-plan.md) — full 9 revenue streams, pricing benchmarks, projections

- [ ] **WhatsApp onboarding agent** — AI-powered operator signup flow on Railway
- [ ] **Stripe/payment integration** — for operator subscriptions

---

## 🟢 MEDIUM PRIORITY

### Content & SEO
- [ ] **Journal performance** — client-side fetch for 133+ posts is slow. Move to server-side
- [ ] **Pillar content pages** — build out the 4-layer content pyramid (see `docs/PILLAR-CONTENT-PLAN.md`)
- [ ] **Mega pages** — implement first two: "Zip Lining in Wales" and "Climbing Snowdon" (see `docs/MEGA-PAGE-BRIEF.md`)

### Site Features
> 📄 See: [`plans/commercial-build-spec.md`](plans/commercial-build-spec.md) — Phase 3 (Lead Gen), Phase 6 (Operator Analytics), Phase 7 (Itinerary Sponsorship)

- [ ] **Operator Dashboard (B2B)** — leads overview, enquiry management, analytics → *Build spec Phase 6*
- [ ] **Vibe Filter** — mood-based search (Adrenaline / Chill / Family / Romantic)
- [x] **PDF Export** — downloadable itineraries ✅ Done (print-optimized CSS + download button)
- [ ] **Drag & Drop Itinerary Editor** — reorder stops, travel time warnings
- [ ] **Lead Generation** — enquiry routing, lead scoring, operator notifications → *Build spec Phase 3*
- [ ] **Itinerary Sponsorship** — operators pay for featured placement in itineraries → *Build spec Phase 7*

### Design & Polish
- [ ] **Ad slots rendering** — verify demo ads show on answer/guide pages → *Build spec Phase 5*
- [ ] **Newsletter integration** — connect to email service (Mailchimp/Resend/etc)
- [ ] **Mobile responsiveness audit** — check all pages on mobile
- [ ] **9 manual coordinate lookups** — remote mountain locations need manual lat/lng (The Pilot House Cafe, Tafarn y Garreg, Storey Arms Cafe, etc.)

---

## 🟢 FUTURE / NICE TO HAVE

### Growth
> 📄 See: [`plans/commercial-offerings-plan.md`](plans/commercial-offerings-plan.md) — §5 Implementation Priority, §6 Revenue Projections, §8 KPIs

- [ ] **Multi-tenant architecture** — support Adventure Scotland, Adventure England etc
- [x] **User accounts** — save favourite itineraries, bookmarks ✅ Done (`/account` page with saved items)
- [ ] **Review system** — build own reviews (reduce reliance on Google/TripAdvisor)
- [ ] **Price alerts** — "email me when this drops below £X" (lead gen)
- [ ] **SEO landing pages** — "cheapest coasteering Pembrokeshire" etc

### Integrations
> 📄 See: [`plans/INTEGRATION_GUIDE.txt`](plans/INTEGRATION_GUIDE.txt) — Phase 1-3 partner integration steps
> 📄 See: [`plans/QUICK_REFERENCE_CARD.txt`](plans/QUICK_REFERENCE_CARD.txt) — all partner signup links

- [ ] **Booking.com affiliate** — accommodation widget with live availability → *Integration Guide Phase 1*
- [ ] **GetYourGuide Partner API** — 300K experiences, 7-8% commission → *Quick Ref Tier 1*
- [ ] **Viator affiliate** — backup to GYG, ~8% commission → *Quick Ref Tier 1*
- [ ] **Rezdy Channel Manager** — secondary booking platform integration

### Ops & Infrastructure
- [ ] **CI/CD pipeline** — automated testing before deploy
- [ ] **Analytics** — Plausible or similar (privacy-friendly)
- [ ] **Error monitoring** — Sentry or similar
- [ ] **Image CDN** — optimise image delivery (currently local files)

---

---

## 📁 Planning Documents
| Document | Location | What's In It |
|----------|----------|-------------|
| **Commercial Offerings Plan** | [`plans/commercial-offerings-plan.md`](plans/commercial-offerings-plan.md) | 9 revenue streams, pricing benchmarks, competitor analysis, £50K-£500K projections |
| **Commercial Build Spec** | [`plans/commercial-build-spec.md`](plans/commercial-build-spec.md) | 7-phase technical build plan: Stripe, booking, leads, affiliates, ads, analytics, sponsorship |
| **Integration Guide** | [`plans/INTEGRATION_GUIDE.txt`](plans/INTEGRATION_GUIDE.txt) | Step-by-step partner integration (Booking.com, GYG, Viator, weather APIs) |
| **Quick Reference Card** | [`plans/QUICK_REFERENCE_CARD.txt`](plans/QUICK_REFERENCE_CARD.txt) | All partner signup links, commission rates, cookie durations |
| **Ready Partners CSV** | [`plans/ready_to_integrate_partners.csv`](plans/ready_to_integrate_partners.csv) | Partner data in structured format |
| **Overnight Plan** | [`OVERNIGHT_PLAN.md`](OVERNIGHT_PLAN.md) | Original phased build plan (mostly complete) |
| **Site Audit** | [`memory/adventure-wales-audit-2025-01-22.md`](memory/adventure-wales-audit-2025-01-22.md) | 66-item audit — many items now resolved |
| **Research Data** | [`data/research/tier1-1.json`](data/research/tier1-1.json), [`tier2-1.json`](data/research/tier2-1.json) | 35 operators, 128 activities fully researched |

---

## 🚀 GROWTH ENGINE (Operation Lighthouse)
> 📄 See: [`plans/growth-engine-spec.md`](plans/growth-engine-spec.md) — full spec

### Phase 1 (Build Now)
- [ ] Auto-populate API route (AI research endpoint)
- [ ] Dashboard "Auto-populate" button with preview
- [ ] Admin bulk auto-populate page
- [ ] Simple view counter on operator pages
- [ ] Temporary premium trial fields in DB

### Phase 2 (Campaigns)
- [ ] Outbound campaign admin page
- [ ] Email templates (HTML with page preview)
- [ ] Campaign email sending via Resend
- [ ] Trial expiry cron job
- [ ] Campaign tracking (sent, opened, clicked, claimed)

### Phase 3 (Demo & Polish)
- [ ] Investor demo page (animated walkthrough at /demo)
- [ ] "Preview your premium listing" on claim page
- [ ] Weekly stats emails to operators
- [ ] Campaign performance dashboard

---

## 💡 Ideas
- [ ] Reset

---

## 📝 Key Decisions Made
- **Beyonk > FareHarbor** for Welsh operator booking integration
- **"Verified by Adventure Wales"** not "Recommended" (advertising standards safe)
- **Price comparison model** — Skyscanner for Welsh adventures
- **WhatsApp for onboarding** — low friction, operators already on it
- **Railway for backend services** — WhatsApp agent, price scraping
- **No TripAdvisor Content API** — exclusivity clause too restrictive
- **Stripe for payments** (Lemon Squeezy considered but Stripe direct preferred)

---

## 🗓️ Suggested Sequence
1. Import research data → operators get coords, descriptions, ratings
2. Beyonk partnership email → start the conversation
3. Map operators to platforms → booking buttons go live
4. WhatsApp onboarding agent → automate operator acquisition
5. Price comparison → differentiation + SEO play
6. Operator dashboard → retention + upsell
