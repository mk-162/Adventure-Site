# Adventure Wales — Master Task List
**Last updated:** 2026-02-04
**Live site:** https://adventure-site-lyart.vercel.app
**Repo:** mk-162/Adventure-Site

---

## 📊 Current Stats
| Content | Count | Quality |
|---------|-------|---------|
| Regions | 12 | ✅ All published |
| Operators | 46 (8 premium) | ⚠️ 0 logos, 0 coords, 11 have descriptions |
| Activities | 45 | ✅ All have booking URLs |
| Itineraries | 54 (520 stops) | ✅ Solid |
| Accommodation | 70 | ✅ In DB |
| Events | 46 | ✅ In DB |
| Answers/FAQ | 135 | ✅ Good |
| Journal posts | 128 | ⚠️ Some missing hero images |
| Advertisers | 27 | ✅ Seeded |
| Active campaigns | 6 | ✅ Demo content |
| Operator offers | 8 | ✅ Demo content |
| Booking platform mapped | 0 | 🔴 None mapped yet |

**Researched (not yet imported):** 35 operators + 128 activities in `data/research/` (tier 1 + tier 2)

---

## ✅ DONE (This Session — 2026-02-04)
- [x] 9 missing admin pages (create/edit for operators, regions, activities, accommodation, events, answers + commercial)
- [x] Commercial demo content seeded (campaigns, creatives, ad slots, offers, page ads)
- [x] Booking platform integration (schema, UI, admin partner mapping page)
- [x] 62 non-Wales images replaced with genuine Welsh photos
- [x] Homepage hero images fixed (was Arizona/Beijing/Bolivia → now Snowdon/Pembrokeshire/Snowdonia)

## ✅ DONE (Previous Session)
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

## 🔴 HIGH PRIORITY — Do Next

### Data Quality (Operators)
- [ ] **Import tier 1+2 research into DB** — 35 operators with GPS coords, ratings, descriptions, trust signals sitting in `data/research/`. Need script to update existing operator records + create activities
- [ ] **Operator logos** — 0/46 have logos. Scrape from websites or generate placeholders
- [ ] **Operator coordinates** — 0/46 have lat/lng. Research data has coords, need import
- [ ] **Operator descriptions** — only 11/46 have descriptions >50 chars. Research data has full descriptions

### Booking & Revenue
> 📄 See: [`plans/commercial-build-spec.md`](plans/commercial-build-spec.md) — Phase 2 (Booking Integration) & Phase 4 (Affiliate Revenue)
> 📄 See: [`plans/INTEGRATION_GUIDE.txt`](plans/INTEGRATION_GUIDE.txt) — step-by-step partner integration
> 📄 See: [`plans/QUICK_REFERENCE_CARD.txt`](plans/QUICK_REFERENCE_CARD.txt) — partner signup links & commission rates

- [ ] **Map operators to booking platforms** — 0/46 mapped. Check which are on Beyonk, set booking_platform + partner refs
- [ ] **Beyonk partnership** — Email hello@beyonk.com to become distribution partner
- [ ] **Price comparison schema** — `booking_sources` table (activity_id, platform, price, url, last_checked)
- [ ] **Price comparison UI** — widget on activity pages showing prices across platforms
- [ ] **Affiliate links** — wire up GetYourGuide, Viator, Booking.com affiliate tracking URLs

### Commercial Model
> 📄 See: [`plans/commercial-offerings-plan.md`](plans/commercial-offerings-plan.md) — full 9 revenue streams, pricing benchmarks, projections
> 📄 See: [`plans/commercial-build-spec.md`](plans/commercial-build-spec.md) — Phase 1 (Listing Tiers + Payments)

- [ ] **WhatsApp onboarding agent** — AI-powered operator signup flow on Railway
- [ ] **Pricing tiers** — Free (stub listing) / £9.99 (verified) / £29.99 (premium)
- [ ] **"Verified by Adventure Wales"** badge system — criteria-based (AALA, ratings, reviews)
- [ ] **Stripe/payment integration** — for operator subscriptions

---

## 🟡 MEDIUM PRIORITY

### Content & SEO
- [ ] **Journal hero images** — some articles still missing. Run update-journal-images script
- [ ] **Journal performance** — client-side fetch for 128 posts is slow. Move to server-side
- [ ] **Operator pages enrichment** — add service details, individual activity listings from research data
- [ ] **Activity pages** — import 128 researched activities (currently only 45 in DB)

### Site Features
> 📄 See: [`plans/commercial-build-spec.md`](plans/commercial-build-spec.md) — Phase 3 (Lead Gen), Phase 6 (Operator Analytics), Phase 7 (Itinerary Sponsorship)

- [ ] **Operator Dashboard (B2B)** — leads overview, enquiry management, analytics → *Build spec Phase 6*
- [ ] **Vibe Filter** — mood-based search (Adrenaline / Chill / Family / Romantic)
- [ ] **PDF Export** — downloadable itineraries with maps and costs
- [ ] **Drag & Drop Itinerary Editor** — reorder stops, travel time warnings
- [ ] **Lead Generation** — enquiry routing, lead scoring, operator notifications → *Build spec Phase 3*
- [ ] **Itinerary Sponsorship** — operators pay for featured placement in itineraries → *Build spec Phase 7*

### Design & Polish
- [ ] **Ad slots rendering** — verify demo ads show on answer/guide pages → *Build spec Phase 5*
- [ ] **SponsorBadge usage** — not used on any pages yet, wire into operator profiles
- [ ] **Newsletter integration** — connect to email service (Mailchimp/Resend/etc)
- [ ] **Mobile responsiveness audit** — check all pages on mobile

---

## 🟢 FUTURE / NICE TO HAVE

### Growth
> 📄 See: [`plans/commercial-offerings-plan.md`](plans/commercial-offerings-plan.md) — §5 Implementation Priority, §6 Revenue Projections, §8 KPIs

- [ ] **Multi-tenant architecture** — support Adventure Scotland, Adventure England etc
- [ ] **User accounts** — save favourite itineraries, bookmarks
- [ ] **Review system** — build own reviews (reduce reliance on Google/TripAdvisor)
- [ ] **Price alerts** — "email me when this drops below £X" (lead gen)
- [ ] **SEO landing pages** — "cheapest coasteering Pembrokeshire" etc

### Integrations
> 📄 See: [`plans/INTEGRATION_GUIDE.txt`](plans/INTEGRATION_GUIDE.txt) — Phase 1-3 partner integration steps
> 📄 See: [`plans/QUICK_REFERENCE_CARD.txt`](plans/QUICK_REFERENCE_CARD.txt) — all partner signup links
> 📄 See: [`plans/ready_to_integrate_partners.csv`](plans/ready_to_integrate_partners.csv) — partner data

- [ ] **Booking.com affiliate** — accommodation widget with live availability → *Integration Guide Phase 1*
- [ ] **GetYourGuide Partner API** — 300K experiences, 7-8% commission → *Quick Ref Tier 1*
- [ ] **Viator affiliate** — backup to GYG, ~8% commission → *Quick Ref Tier 1*
- [ ] **Rezdy Channel Manager** — secondary booking platform integration
- [ ] **Amazon Associates** — gear affiliate links on guides
- [ ] **TripAdvisor links** — link to reviews (don't embed due to T&C restrictions)

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
