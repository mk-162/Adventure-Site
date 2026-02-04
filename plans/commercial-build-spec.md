# Adventure Wales — Commercial Features Build Spec

**Purpose:** What we need to build to monetise the platform.
**Based on:** `commercial-offerings-plan.md`
**Priority:** Phase 1 first → ship → learn → iterate.

---

## Phase 1: Listing Tiers + Payments (Weeks 1-3)

The foundation. Operators upgrade from free to paid. Revenue starts flowing.

### 1.1 Stripe Integration

**What:** Payment processing for listing upgrades, one-off purchases, subscriptions.

**Build:**
- [ ] Install `stripe` + `@stripe/stripe-js` packages
- [ ] Create `src/lib/stripe.ts` — server-side Stripe client
- [ ] ENV vars: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- [ ] Create Stripe Products + Prices for each tier:
  - Claimed: £49/mo or £490/yr
  - Premium: £149/mo or £1,490/yr
  - Premium Plus: £299/mo or £2,990/yr

**API routes:**
- [ ] `POST /api/billing/create-checkout` — creates Stripe Checkout session for upgrade
- [ ] `POST /api/billing/webhook` — handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] `GET /api/billing/portal` — redirects to Stripe Customer Portal (manage/cancel subscription)

### 1.2 Schema Changes

```sql
-- New table: operator subscriptions
CREATE TABLE operator_subscriptions (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES operators(id) NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL, -- 'claimed' | 'premium' | 'premium_plus'
  billing_cycle VARCHAR(20) NOT NULL, -- 'monthly' | 'annual'
  status VARCHAR(50) NOT NULL, -- 'active' | 'past_due' | 'cancelled' | 'trialing'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- New table: operator analytics (for value demonstration)
CREATE TABLE operator_analytics (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES operators(id) NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  enquiries INTEGER DEFAULT 0,
  bookings INTEGER DEFAULT 0,
  UNIQUE(operator_id, date)
);
```

### 1.3 Operator Dashboard (Claim + Upgrade Flow)

**Pages to build:**

`/dashboard` — Operator-facing portal (separate from admin)
- [ ] `/dashboard/login` — magic link auth (email-based, no passwords)
- [ ] `/dashboard` — Overview: views, enquiries, current plan, upgrade CTA
- [ ] `/dashboard/profile` — Edit their listing (description, photos, contact, services)
- [ ] `/dashboard/analytics` — Views, clicks, enquiries over time (chart)
- [ ] `/dashboard/billing` — Current plan, upgrade/downgrade, payment history, Stripe Portal link
- [ ] `/dashboard/enquiries` — Incoming leads/enquiries list

**Upgrade flow (the money page):**
1. Operator lands on `/dashboard/billing`
2. Sees current tier (stub) vs what they get at each tier (comparison table)
3. Clicks "Upgrade to Premium" → Stripe Checkout
4. Webhook fires → `operator.claimStatus` updates to `premium`
5. Dashboard refreshes with new features unlocked

### 1.4 Tier Feature Enforcement

**What changes per tier in the frontend:**

| Feature | Stub (free) | Claimed (£49) | Premium (£149) | Premium Plus (£299) |
|---------|-------------|---------------|----------------|---------------------|
| Basic listing | ✅ | ✅ | ✅ | ✅ |
| Logo + photos | ❌ | 5 photos | Unlimited + video | Unlimited + video |
| Description length | 100 chars | 500 words | Unlimited | Unlimited |
| Contact details shown | ❌ link only | ✅ | ✅ | ✅ |
| "Claim this listing" CTA | ✅ shown | ❌ hidden | ❌ hidden | ❌ hidden |
| Verified badge | ❌ | ✅ green | ✅ gold | ✅ gold + "Official" |
| Itinerary placement | ❌ | ❌ | ✅ eligible | ✅ priority |
| Search ranking boost | None | +1 | +3 | +5 (top of category) |
| Analytics dashboard | ❌ | Basic (views) | Full (views, clicks, enquiries) | Full + competitor benchmark |
| Enquiry forwarding | ❌ | ❌ | ✅ | ✅ |
| Booking widget | ❌ | ❌ | ❌ | ✅ |
| Sponsored article | ❌ | ❌ | 1/year | 2/year |

**Build:**
- [ ] `src/lib/tier-features.ts` — feature flag map per tier
- [ ] Update `OperatorCard` component — render differently per tier
- [ ] Update operator profile page — gate features behind tier checks
- [ ] "Claim this listing" CTA on stub profiles → links to `/dashboard/login`

### 1.5 Claim This Listing Flow

**For unclaimed stubs (the 11 new entries + future additions):**

1. Operator visits their listing page → sees "Is this your business? Claim it free"
2. Clicks → enters email → receives magic link
3. Logs in → lands on `/dashboard/profile` pre-populated with stub data
4. Fills in details → listing upgrades to "claimed" (free tier)
5. Sees upgrade CTA: "Get 5x more enquiries — upgrade to Premium"

---

## Phase 2: Booking Integration (Weeks 4-6)

### 2.1 Booking Widget Embed

**What:** Operators connect their existing booking system. We display availability + "Book Now" on their listing.

**Supported systems (start with these):**
- FareHarbor — embed widget via JS snippet
- Beyonk — embed widget via iframe/JS
- Bookwhen — embed widget via iframe

**Build:**
- [ ] Add to operator schema: `booking_system` (varchar), `booking_widget_code` (text), `booking_affiliate_id` (varchar)
- [ ] Operator dashboard: "Connect Booking System" page — paste widget code or enter booking URL
- [ ] Operator profile page: render booking widget in dedicated section (Premium Plus only)
- [ ] For non-widget operators: "Check Availability" button → deep link to their booking page with tracking UTM

### 2.2 Booking.com Affiliate

**What:** Deep link accommodation listings to Booking.com with affiliate ID.

**Build:**
- [ ] Sign up at booking.com/affiliate-program → get `aid` (affiliate ID)
- [ ] Add `booking_com_url` field to accommodation table (or auto-generate from name/location)
- [ ] On accommodation pages: "Book on Booking.com" button → `https://www.booking.com/hotel/gb/{slug}.html?aid={AID}&label=adventurewales`
- [ ] Track clicks via UTM parameters
- [ ] Revenue shows in Booking.com Partner Centre (no webhook needed)

### 2.3 Commission Tracking (Future — Phase 2b)

**For when we build our own booking flow:**
- [ ] Schema: `bookings` table (operator_id, customer_email, amount, commission, status, booked_at)
- [ ] Dashboard: operator sees bookings + commission owed to AW
- [ ] Monthly invoicing or auto-deduct from Stripe

*Not needed for launch. Start with affiliate links + widget embeds.*

---

## Phase 3: Lead Generation (Weeks 7-8)

### 3.1 Enquiry System Upgrade

**What exists:** `EnquireAllVendors` component on itinerary pages.
**What's needed:** Per-operator enquiry forms + tracking + dashboard.

**Build:**
- [ ] Schema: `enquiries` table:
  ```sql
  CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    operator_id INTEGER REFERENCES operators(id),
    itinerary_id INTEGER REFERENCES itineraries(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    party_size INTEGER,
    preferred_date DATE,
    activity_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new', -- new | read | replied | converted
    source VARCHAR(100), -- 'profile' | 'itinerary' | 'search'
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] `POST /api/enquiries` — submit enquiry, email to operator, store in DB
- [ ] Operator dashboard `/dashboard/enquiries` — list, filter, mark as read/replied/converted
- [ ] Enquiry form on every operator profile page (Premium+)
- [ ] Enquiry form on itinerary pages → sends to relevant operators
- [ ] Email notifications to operators (with rate limiting)

### 3.2 Lead Analytics

- [ ] Dashboard shows: leads this month, conversion rate, lead sources
- [ ] Compare to previous month
- [ ] "You got X enquiries this month — upgrade to Premium for direct contact details"

---

## Phase 4: Affiliate Revenue (Weeks 3-4, parallel)

### 4.1 Amazon Associates (Gear Articles)

**What:** Add affiliate links to the 19 gear journal articles.

**Build:**
- [ ] Sign up for Amazon Associates UK
- [ ] Create `src/components/affiliate/AmazonProductCard.tsx` — product name, image, price, affiliate link
- [ ] Add product recommendations to gear articles (hiking boots, wetsuits, camping gear etc.)
- [ ] Track clicks (UTM or Amazon's built-in tracking)

### 4.2 Outdoor Brand Affiliates

Sign up for:
- [ ] Cotswold Outdoor (6% commission)
- [ ] Go Outdoors
- [ ] Alpkit
- [ ] Decathlon

---

## Phase 5: Advertising (Weeks 9-10)

### 5.1 Ad Slot Activation

**What exists:** `ad_slots`, `ad_campaigns`, `ad_creatives`, `page_ads` tables already in schema.

**Build:**
- [ ] `src/components/ads/AdSlot.tsx` — renders ad creative in designated slot
- [ ] Admin page: `/admin/commercial/ads` — manage campaigns, upload creatives, set dates
- [ ] Slots to activate:
  - Homepage hero banner
  - Category page sidebar
  - Journal article in-content
  - Itinerary sidebar
  - Search results top
- [ ] Impression + click tracking (update `ad_campaigns` stats)
- [ ] Fallback: if no paid ad, show house ads (promote premium listings, newsletter signup)

### 5.2 Sponsored Content Tagging

- [ ] Add `is_sponsored` boolean + `sponsor_id` (references operators) to `posts` table
- [ ] Journal articles: show "Sponsored by [Operator]" badge
- [ ] Admin: flag articles as sponsored when creating
- [ ] Disclosure compliance (ASA rules)

---

## Phase 6: Operator Analytics (Weeks 6-8, parallel)

### 6.1 View/Click Tracking

**Build:**
- [ ] Middleware or API route: log page views per operator profile
- [ ] Track: profile views, website clicks, phone reveals, enquiry form opens
- [ ] Aggregate daily into `operator_analytics` table
- [ ] Privacy-safe: no personal data stored, just counts

### 6.2 Analytics Dashboard

- [ ] `/dashboard/analytics` — line charts (views, clicks, enquiries over time)
- [ ] Comparison: this month vs last month
- [ ] "Your listing was viewed X times this week" weekly email digest
- [ ] Upsell trigger: "Premium listings get 5x more visibility — upgrade now"

---

## Phase 7: Itinerary Sponsorship (Weeks 10-12)

### 7.1 Sponsored Stops

**Build:**
- [ ] Add to `itinerary_stops` or new table: `is_sponsored` boolean, `sponsor_operator_id`
- [ ] Itinerary page: sponsored stops get highlighted treatment ("Recommended by Adventure Wales")
- [ ] Admin: assign sponsors to itinerary stops
- [ ] Track impressions + clicks on sponsored stops

### 7.2 Operator ↔ Itinerary Matching

- [ ] Admin tool: "Which itineraries could feature this operator?"
- [ ] Auto-suggest based on region + activity type overlap
- [ ] Sales tool: "You'd be perfect for 5 itineraries — upgrade to Premium"

---

## Summary: Build Priority

| Priority | Feature | Revenue Impact | Effort | Dependencies |
|----------|---------|---------------|--------|--------------|
| 🔴 P0 | Stripe integration + checkout | Enables all paid features | Medium | None |
| 🔴 P0 | Operator dashboard (login, profile, billing) | Core platform | High | Stripe |
| 🔴 P0 | Tier feature enforcement | Differentiates free vs paid | Medium | Dashboard |
| 🟠 P1 | Claim this listing flow | Converts stubs to users | Medium | Dashboard |
| 🟠 P1 | Booking.com affiliate links | Quick revenue | Low | Affiliate signup |
| 🟠 P1 | Amazon Associates in gear articles | Quick revenue | Low | Affiliate signup |
| 🟡 P2 | Enquiry system + forwarding | Lead gen revenue | Medium | Dashboard |
| 🟡 P2 | View/click tracking + analytics | Proves value to operators | Medium | None |
| 🟡 P2 | Booking widget embed | Booking commission | Medium | Operator onboarding |
| 🟢 P3 | Ad slot activation | Ad revenue | Medium | Advertiser sales |
| 🟢 P3 | Sponsored content tagging | Content revenue | Low | Editorial process |
| 🟢 P3 | Itinerary sponsorship | Placement revenue | Medium | Operator relationships |

---

## Tech Decisions

| Decision | Recommendation | Why |
|----------|---------------|-----|
| Payments | **Stripe** (Checkout + Customer Portal + Webhooks) | Industry standard, handles subscriptions, invoicing, tax |
| Auth (operators) | **Magic link email** (no passwords) | Simple for non-tech operators, secure, low friction |
| Analytics | **Custom** (own DB) + Vercel Analytics | Full control, can show to operators, no third-party dependency |
| Email | **Resend** or **Postmark** | Transactional emails (magic links, enquiry notifications, digests) |
| Charts | **Recharts** or **Chart.js** | Dashboard analytics visualisation |
| File uploads | **Vercel Blob** or **Cloudinary** | Operator photos/logos |

---

## Database Migrations Needed

```
1. operator_subscriptions (new table)
2. operator_analytics (new table)
3. enquiries (new table)
4. operators: add booking_system, booking_widget_code, booking_affiliate_id
5. posts: add is_sponsored, sponsor_operator_id
6. itinerary_stops: add is_sponsored, sponsor_operator_id
7. New enum: subscription_plan ('claimed', 'premium', 'premium_plus')
8. New enum: billing_cycle ('monthly', 'annual')
```

---

## What NOT to Build Yet

- ❌ Own booking engine (use operator's existing systems)
- ❌ Payment splitting to operators (just track, invoice manually)
- ❌ Mobile app (web-first, responsive)
- ❌ Data/insights products (need scale first)
- ❌ Review system (build trust with operators before asking for reviews)
- ❌ Marketplace checkout (too complex, start with affiliate + widgets)
