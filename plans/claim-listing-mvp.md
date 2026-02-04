# Claim Your Listing — MVP Plan

**Goal:** Let operators claim their listing through a self-service flow on the site. No AI, no payments, no dashboard yet. Just: find your business → submit a claim → admin approves → listing upgrades to "claimed" with verified badge.

**Why MVP first:** Validates demand before building Stripe, dashboards, or operator portals. If nobody claims, we don't need the rest. If they do, we have a pipeline to convert.

---

## What Exists Today

| Component | Status |
|-----------|--------|
| `claim_status` enum on operators | ✅ `stub` / `claimed` / `premium` |
| `claimed_by_email` + `claimed_at` fields | ✅ In schema |
| `/directory/claim` page | ✅ Static page with mailto CTA |
| Admin claims queue `/admin/commercial/claims` | ✅ Approve/reject server actions |
| Verified badge component | ✅ Shows green (claimed) / gold (premium) |
| `/for-operators` sales page | ✅ Register interest form |
| `operator_interest` table + API | ✅ Stores interest submissions |

**Gap:** No self-service claim form. Current flow is "email us" — zero automation.

---

## MVP Scope (Build This)

### 1. Claim Form on `/directory/claim`

Replace the mailto CTA with a proper form:

**Fields:**
- Business name (text, required)
- Your name (text, required)
- Email address (email, required — ideally business domain email)
- Phone number (text, optional)
- Website (url, optional — for cross-referencing)
- Which listing are you claiming? (dropdown/search of all `stub` operators, or "My business isn't listed yet")
- Brief message / proof of ownership (textarea, optional — e.g. "I'm the owner, here's our registration number")

**On submit:**
- Store in DB (new `operator_claims` table or reuse `operator_interest` with a `type` field)
- Set `claimed_by_email` + `claimed_at` on the matched operator (if they selected one)
- Send confirmation email to claimant ("We've received your claim, we'll review within 48 hours")
- Send notification to admin (email or just show in claims queue)
- Show success screen with next steps

### 2. "Claim This Listing" CTA on Stub Operator Profiles

On every `/directory/[slug]` page where `claimStatus === "stub"`:

- Show a prominent banner: **"Is this your business? Claim it for free"**
- Links to `/directory/claim?operator={slug}` (pre-selects the operator in the form)
- Styled to stand out but not overpower the listing content
- Hidden when `claimStatus` is `claimed` or `premium`

### 3. Upgrade Admin Claims Queue

The existing `/admin/commercial/claims` page works but needs:

- Show the claim form data (name, email, phone, message, website)
- One-click verify button: cross-reference the submitted email domain with the operator's website domain
- "Email claimant" button (already exists, keep it)
- Approve → sets `claimStatus = 'claimed'`, sends "Congratulations" email to operator
- Reject → clears claim data, sends "Sorry" email with reason

### 4. Post-Claim Confirmation Email

When admin approves:
- Email to operator: "Your listing on Adventure Wales is now verified! Here's what's changed..."
- Include link to their listing
- Upsell: "Want to stand out more? Upgrade to Premium for featured placement" (link to `/for-operators`)

### 5. API Route

`POST /api/claims` — handles form submission:
- Validate required fields
- Check operator exists (if selected)
- Check no duplicate active claim on same operator
- Store claim
- Update operator record
- Return success

---

## Schema Change

```sql
-- Option A: Lean — just use existing fields on operators table
-- No new table needed. The operator_interest table + operators.claimedByEmail is enough.

-- Option B: Proper claims table (recommended for audit trail)
CREATE TABLE operator_claims (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES operators(id),  -- NULL if "not listed yet"
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website TEXT,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',  -- pending | approved | rejected
  reviewed_at TIMESTAMP,
  reviewed_by INTEGER REFERENCES admin_users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Recommendation:** Option B. Gives us an audit trail, supports "not listed" claims, and doesn't overload the operators table with claim lifecycle data.

---

## User Flow

```
Operator visits /directory/[slug] (their business, status: stub)
  → Sees "Is this your business? Claim it free" banner
  → Clicks → lands on /directory/claim?operator=their-slug
  → Form pre-filled with operator name
  → Fills in their details, submits
  → Success screen: "Thanks! We'll review within 48 hours"
  → Email confirmation sent

Admin visits /admin/commercial/claims
  → Sees new pending claim
  → Cross-references email domain with operator website
  → Clicks Approve
  → Operator status → 'claimed', verified badge appears
  → Operator gets congratulations email with upsell CTA
```

---

## What This Unlocks

Once claims are flowing, we can layer on:
1. **Operator self-edit** — let claimed operators update their own listing (description, photos, services)
2. **Stripe payments** — upgrade from claimed → premium
3. **Operator dashboard** — analytics, leads, billing
4. **Email verification** — send a magic link to the business domain email as proof
5. **Automated verification** — check domain match, AALA register, Companies House

---

## Estimated Effort

| Task | Effort |
|------|--------|
| Claim form component + page | ~2 hours |
| API route + validation | ~1 hour |
| Schema migration (claims table) | ~30 min |
| "Claim this" CTA on stub profiles | ~30 min |
| Admin queue upgrade | ~1 hour |
| Confirmation/approval emails | ~1 hour |
| **Total** | **~6 hours** |

---

## Not in MVP (Future)

See the Future Ideas section in the todo list. Everything below is logged there:
- Magic link email verification
- Operator self-edit dashboard
- Stripe subscription payments
- Analytics dashboard for operators
- Automated domain/AALA verification
- Multi-location claiming
- Competitor benchmarking
- Booking widget integration
- Lead/enquiry forwarding
