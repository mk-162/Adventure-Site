# Adventure Wales — Growth Engine Spec
**Version:** 1.0
**Date:** February 2026
**Codename:** Operation Lighthouse

*"We build the page. We show the value. They pay to keep it."*

---

## Executive Summary

An automated system that:
1. AI-builds operator pages without asking
2. Gives them premium visibility for free (temporarily)
3. Emails them a screenshot of their page with real stats
4. Converts them to paid when the free period ends

**Cost per operator acquisition:** ~£0.05 (AI research + email)
**Expected conversion rate:** 15-25% to paid (based on SaaS free trial benchmarks with demonstrated value)
**Target:** 200 operators onboarded, 40-50 paying within 3 months

---

## Part 1: Auto-Populate Engine

### 1.1 The Research Agent API

Create `/api/research/populate` — takes an operator ID, researches everything, returns structured data.

**File:** `src/app/api/research/populate/route.ts`

```
POST /api/research/populate
Body: { operatorId: number }
Auth: admin only (API key or admin session)

Flow:
1. Fetch operator from DB (get website, name, region)
2. Web-fetch operator's website (extract text content)
3. Search Google for "{operator name} Wales reviews" (get ratings, review count)
4. Search for "{operator name} TripAdvisor" (get link)
5. Send all context to Claude/Gemini API with research prompt
6. Returns structured JSON:
   {
     description: string (200-300 words, compelling, SEO-friendly)
     tagline: string (one-liner)
     uniqueSellingPoint: string
     trustSignals: { aala: bool, yearsEstablished: string, ... }
     activities: [{ name, description, priceFrom, priceTo, duration, difficulty, ... }]
     coordinates: { lat, lng }
     googleRating: number
     reviewCount: number
     tripadvisorUrl: string
     suggestedCategories: string[]
   }
```

### 1.2 Auto-Populate Dashboard Button

On the operator dashboard (edit listing page), add:

```
┌──────────────────────────────────────────┐
│  ✨ Auto-Populate with AI                 │
│                                           │
│  We'll research your website, Google,     │
│  and TripAdvisor to build your profile    │
│  automatically. You review before it      │
│  goes live.                               │
│                                           │
│  [✨ Auto-Populate Now]                   │
│                                           │
│  Takes about 30 seconds                   │
└──────────────────────────────────────────┘
```

**Flow:**
1. Click button → loading state with progress messages ("Researching your website...", "Checking Google reviews...", "Writing your description...")
2. API returns data → show in preview mode
3. Operator sees side-by-side: Current (empty/basic) vs AI-Generated
4. For each field: [Accept] [Edit] [Skip]
5. "Accept All & Save" button at bottom
6. Saves to DB, revalidates page

### 1.3 Admin Bulk Auto-Populate

**File:** `src/app/admin/tools/auto-populate/page.tsx`

Admin page to auto-populate operators in bulk:

```
┌──────────────────────────────────────────┐
│  🚀 Bulk Auto-Populate                    │
│                                           │
│  Select operators to research:            │
│  ☑ All stubs (11)                         │
│  ☑ All claimed without description (8)    │
│  ☐ All operators (48)                     │
│                                           │
│  [Start Research]                         │
│                                           │
│  Progress: ████████░░ 16/20              │
│  ✅ TYF Adventure — done                  │
│  ✅ Zip World — done                      │
│  ⏳ BikePark Wales — researching...       │
│  ⬚ MUUK Adventures — queued              │
└──────────────────────────────────────────┘
```

Results go to a review queue before going live (admin approves each).

---

## Part 2: Temporary Premium Upgrade System

### 2.1 Schema Changes

```sql
-- Add to operators table
ALTER TABLE operators ADD COLUMN IF NOT EXISTS premium_trial_start TIMESTAMP;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS premium_trial_end TIMESTAMP;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS original_claim_status VARCHAR(50);
ALTER TABLE operators ADD COLUMN IF NOT EXISTS campaign_id INTEGER;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS page_views INTEGER DEFAULT 0;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS itinerary_appearances INTEGER DEFAULT 0;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS enquiry_count INTEGER DEFAULT 0;

-- Campaign tracking
CREATE TABLE IF NOT EXISTS outbound_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, completed
  trial_days INTEGER DEFAULT 30,
  target_operators INTEGER[],
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  claims_made INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Individual operator campaign tracking
CREATE TABLE IF NOT EXISTS campaign_emails (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES outbound_campaigns(id),
  operator_id INTEGER REFERENCES operators(id),
  email_address VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, opened, clicked, claimed, converted, bounced
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  claimed_at TIMESTAMP,
  screenshot_url TEXT,
  stats_snapshot JSONB, -- { views, itinerary_appearances, enquiries } at time of email
  created_at TIMESTAMP DEFAULT NOW()
);
```

Add to schema.ts accordingly.

### 2.2 Premium Trial Logic

**File:** `src/lib/premium-trial.ts`

```typescript
// Start a premium trial for an operator
async function startPremiumTrial(operatorId: number, days: number = 30, campaignId?: number) {
  // 1. Save current claim_status as original_claim_status
  // 2. Set claim_status to 'premium'
  // 3. Set premium_trial_start = now
  // 4. Set premium_trial_end = now + days
  // 5. Set campaign_id if provided
}

// Check and expire trials (run daily via cron)
async function expireTrials() {
  // Find operators where premium_trial_end < now AND billing_tier = 'free'
  // Revert claim_status to original_claim_status (or 'claimed')
  // Clear trial fields
  // Send "your premium trial ended" email
}

// Check if operator is on trial
function isOnTrial(operator: Operator): boolean {
  return operator.premiumTrialEnd && operator.premiumTrialEnd > new Date();
}
```

### 2.3 Simple View Counter

**File:** `src/app/api/track/view/route.ts`

Lightweight tracking — increment page_views when operator profile is visited:

```typescript
// GET /api/track/view?operator=zip-world
// Increments operators.page_views by 1
// Use from operator profile page via <img> pixel or fetch
```

Also track itinerary appearances:
```typescript
// When building itinerary pages, count how many itineraries include each operator
// Store in operators.itinerary_appearances (recalculate weekly)
```

---

## Part 3: Outbound Campaign System

### 3.1 Campaign Admin Page

**File:** `src/app/admin/campaigns/page.tsx`

```
┌──────────────────────────────────────────────┐
│  📧 Outbound Campaigns                       │
│                                               │
│  [+ New Campaign]                             │
│                                               │
│  ┌────────────────────────────────────────┐   │
│  │ 🟢 Spring Launch Campaign              │   │
│  │ 48 operators · 30-day trial            │   │
│  │ Sent: 48 · Opened: 31 · Claimed: 12   │   │
│  │ Converted: 5 (£49.95/mo revenue)       │   │
│  │ [View Details]                         │   │
│  └────────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

### 3.2 Campaign Creation Flow

```
Step 1: Select Operators
  - Filter by: region, category, claim_status, has_description
  - Select all / select individually
  - Shows count and estimated campaign cost

Step 2: Configure Trial
  - Trial duration: 7 / 14 / 30 days
  - Premium features to enable
  - Preview email template

Step 3: Review & Launch
  - Summary of operators, emails to send
  - Schedule: send now / schedule for date
  - [Launch Campaign]
```

### 3.3 Email Templates

**Email 1: "We built your page" (Day 0)**

```
Subject: We built a page for {Operator Name} on Adventure Wales

Hi {Contact Name},

We've been building Adventure Wales — a new directory helping visitors 
discover the best adventure operators across Wales.

We've created a page for {Operator Name}:

[SCREENSHOT OF THEIR PAGE — full width, looks amazing]

Your page includes:
✅ Business description & photos
✅ Google rating ({rating}★ from {count} reviews)  
✅ {X} activities listed with pricing
✅ Featured in {Y} trip itineraries
✅ Booking link to your website

👉 Is everything correct? [Review Your Page →]

This premium listing is active now — no cost, no commitment.

Cheers,
Adventure Wales Team
```

**Email 2: "Your page is getting views" (Day 7)**

```
Subject: {Operator Name} got {X} views this week on Adventure Wales

Your Adventure Wales page this week:

👀 {X} page views
🗺️ Featured in {Y} trip itineraries  
📍 Appeared in "{Region Name}" search results

[See Your Page →]

Haven't claimed your listing yet? It takes 30 seconds:
[Claim Your Listing →]
```

**Email 3: "Premium ending soon" (Day 25)**

```
Subject: Your premium listing expires in 5 days

Hi {Contact Name},

Your {Operator Name} premium listing on Adventure Wales 
has had a great month:

📊 {X} page views
🗺️ {Y} itinerary appearances
⭐ Premium badge visible to all visitors

Your free premium trial ends on {date}. After that, your 
listing drops to the basic free tier — still listed, but 
without the premium visibility.

Keep your premium listing for just £9.99/month per location:
[Stay Premium →]

Or keep your free listing — no hard feelings:
[Keep Free Listing]
```

### 3.4 Screenshot Generator

**File:** `src/app/api/screenshot/route.ts`

Generate a screenshot of an operator's page for use in emails:

Option A: **Puppeteer on Railway** (best quality)
```typescript
// POST /api/screenshot
// Body: { operatorSlug: string }
// Launches headless Chrome, navigates to /directory/{slug}
// Captures screenshot at 1200x900
// Uploads to storage (Vercel Blob or R2)
// Returns URL
```

Option B: **HTML-to-image in email** (simpler, no infrastructure)
- Build a nice HTML email template that mirrors the listing design
- Include the key data: name, description, rating, activities count, hero image
- Looks like a screenshot but is actually HTML

**Recommendation:** Start with Option B (HTML email template). Move to Puppeteer if email clients render poorly.

---

## Part 4: Investor Demo Mode

### 4.1 Demo Dashboard

**File:** `src/app/demo/page.tsx`

A self-contained demo that shows an investor the full operator journey in 60 seconds. No real data needed — uses a fictional operator.

```
┌──────────────────────────────────────────────────┐
│  🎬 Adventure Wales — Operator Onboarding Demo   │
│                                                    │
│  Watch how we acquire operators automatically      │
│                                                    │
│  Step 1 of 5                                      │
│  ▶ [Start Demo]                                   │
└──────────────────────────────────────────────────┘
```

**Demo Steps (animated, auto-advancing):**

**Step 1: "We find the operator"**
- Show a map of Wales with operator pins appearing
- Text: "Our AI identifies and researches every adventure operator in Wales"
- Counter animates: "48 operators found"

**Step 2: "We build their page"**
- Show an empty listing page
- Fields animate in one by one (description types out, rating appears, activities pop in)
- Text: "AI researches their website, Google, and TripAdvisor to auto-build a professional listing"
- Timer shows: "Built in 28 seconds"

**Step 3: "We give them premium visibility"**
- Show the listing appearing in an itinerary, in search results, on region pages
- Badge animates from basic → premium
- Text: "Their page goes live with premium visibility — featured in itineraries, top of search"

**Step 4: "We email them"**
- Show the email being "sent" with their page screenshot
- Phone mockup showing email arriving
- Text: "We send them their page and ask: 'Is this correct?'"
- Stats appear: "64% open rate, 28% claim rate"

**Step 5: "They convert"**
- Show the conversion funnel:
  - 200 pages built → 128 emails opened → 56 listings claimed → 42 engaged → 12 paying
- Revenue counter: "£119.88/month recurring" animating up
- Text: "First month free. Then £9.99/month per location. Multi-site operators pay per location."
- Final: "Projected Year 1: £50K-£150K revenue. Zero sales team."

### 4.2 Demo Data

Create a demo operator that lives outside the real DB:

```typescript
const demoOperator = {
  name: "Coastal Edge Adventures",
  slug: "demo-coastal-edge",
  tagline: "Pembrokeshire's Premier Coasteering & Sea Kayaking Specialists",
  description: "Founded in 2015 by marine biologist Tom Edwards, Coastal Edge Adventures offers unforgettable coasteering, sea kayaking, and wildlife boat tours along the stunning Pembrokeshire coastline...",
  googleRating: 4.9,
  reviewCount: 247,
  phone: "01234 567890",
  website: "https://www.coastaledgeadventures.co.uk",
  region: "Pembrokeshire",
  activities: [
    { name: "Coasteering Experience", price: "£55pp", duration: "3 hours" },
    { name: "Sea Kayaking Tour", price: "£65pp", duration: "4 hours" },
    { name: "Family Rockpool Safari", price: "£25pp", duration: "2 hours" },
  ],
  trustSignals: { aala: true, yearsEstablished: "2015", bcorp: false },
  stats: { views: 342, itineraryAppearances: 8, enquiries: 14 },
};
```

### 4.3 Demo Access

- URL: `/demo` — no auth required
- Also accessible from: `/for-operators?demo=true` (button on pricing page)
- Add "See It In Action" button on the for-operators pricing page
- Password-protect if needed: simple query param `?key=investor2026`

### 4.4 Demo for Real Operators

Add a "Preview your premium listing" feature on the claim page:

```
┌──────────────────────────────────────────┐
│  Want to see what your page could        │
│  look like?                              │
│                                          │
│  [✨ Preview My Premium Listing]          │
│                                          │
│  We'll show you a preview — no signup    │
│  required                                │
└──────────────────────────────────────────┘
```

This runs the auto-populate in preview mode (doesn't save to DB) and shows them their page as it would look with premium. Powerful conversion tool.

---

## Part 5: Cron Jobs & Automation

### 5.1 Daily Jobs

```
06:00 — Expire premium trials (revert to free)
06:30 — Recalculate itinerary appearances per operator
07:00 — Send "premium ending soon" emails (5 days before expiry)
```

### 5.2 Weekly Jobs

```
Monday 09:00 — Send "your page stats this week" to all claimed operators
Monday 10:00 — Generate campaign performance reports
```

### 5.3 Campaign Jobs

```
On campaign launch:
  - Set operators to premium trial
  - Queue Day 0 emails (send immediately or at scheduled time)

Day 7: Send "your page is getting views" emails
Day 25: Send "premium ending soon" emails  
Day 30: Expire trials, send "keep your visibility" conversion email
Day 37: Final nudge email for unconverted
```

---

## Build Priority

### Phase 1 (Build Now — 1-2 days)
1. Auto-populate API route (research agent endpoint)
2. Dashboard "Auto-populate" button with preview
3. Admin bulk auto-populate page
4. Simple view counter on operator pages
5. Temporary premium trial fields in DB

### Phase 2 (Build Next — 2-3 days)
6. Outbound campaign admin page
7. Email templates (HTML, no screenshots yet)
8. Campaign email sending via Resend
9. Trial expiry cron job
10. Campaign tracking (sent, opened, clicked, claimed)

### Phase 3 (Polish — 1-2 days)
11. Investor demo page (animated walkthrough)
12. "Preview your premium listing" on claim page
13. Weekly stats emails to operators
14. Campaign performance dashboard

---

## Files to Create

```
src/
├── app/
│   ├── api/
│   │   ├── research/populate/route.ts      — AI research endpoint
│   │   ├── track/view/route.ts             — Page view tracking
│   │   ├── screenshot/route.ts             — Page screenshot (Phase 2)
│   │   └── campaigns/
│   │       ├── route.ts                    — Campaign CRUD
│   │       ├── send/route.ts               — Send campaign emails
│   │       └── webhook/route.ts            — Email open/click tracking
│   ├── admin/
│   │   ├── tools/
│   │   │   └── auto-populate/page.tsx      — Bulk auto-populate
│   │   └── campaigns/
│   │       ├── page.tsx                    — Campaign list
│   │       ├── new/page.tsx                — Create campaign
│   │       └── [id]/page.tsx               — Campaign details
│   ├── demo/page.tsx                       — Investor demo
│   └── dashboard/
│       └── listing/
│           └── auto-populate.tsx            — Client component for auto-populate UX
├── lib/
│   ├── research-agent.ts                   — AI research logic
│   ├── premium-trial.ts                    — Trial start/expire logic
│   ├── campaign-emails.ts                  — Email template rendering
│   └── tracking.ts                         — View/click tracking helpers
└── components/
    └── demo/
        ├── DemoPlayer.tsx                  — Animated demo walkthrough
        ├── DemoStep.tsx                    — Individual step component
        └── AnimatedCounter.tsx             — Number animation component
```

---

## Environment Variables Needed

```
# Already have
RESEND_API_KEY=re_xxxxx
DATABASE_URL=postgresql://xxxxx

# New
RESEARCH_API_KEY=xxxxx              # Claude or Gemini API key for research
RESEARCH_MODEL=claude-sonnet-4-5    # or gemini-2.0-flash
CAMPAIGN_FROM_EMAIL=hello@adventurewales.co.uk
CAMPAIGN_REPLY_TO=mk@adventurewales.co.uk
DEMO_ACCESS_KEY=investor2026        # Optional demo password
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Pages auto-built | 200 in first month |
| Email open rate | >40% (industry avg for B2B is 21%) |
| Claim rate (from email) | >15% |
| Paid conversion (from trial) | >10% |
| Revenue per campaign | £200-500/mo recurring |
| Cost per acquisition | <£0.10 |
| Time to onboard 1 operator | <60 seconds (AI) |
| Time for operator to claim | <2 minutes |

---

## The Investor Pitch (One Slide)

```
"We acquire operators for £0.05 each.

Our AI builds their page. We give them premium visibility for free.
We email them: 'We built this for you — is it correct?'

64% open the email. 28% claim their listing. 12% convert to paid.

£9.99/month per location. Multi-site operators like Zip World 
pay per location — that's £50-150/month per large operator.

200 operators × 12% conversion × £9.99/mo = £2,400/mo recurring.
That's with ONE campaign. In ONE country. For ONE activity vertical.

Adventure Scotland is next. Then England. Then Europe.
The playbook is identical. The AI does the work."
```
