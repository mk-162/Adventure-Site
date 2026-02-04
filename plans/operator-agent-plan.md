# Adventure Wales — Operator Agent Plan
**Version:** 1.0
**Date:** February 2026

---

## Overview

An AI agent that serves as the single point of contact for all operator interactions — verification, onboarding, support, and upselling. The agent operates across email, WhatsApp, and voice.

---

## Auth Decision: Clerk vs Auth.js vs Custom

### Clerk
- **Free:** 10,000 MAU (more than enough for years)
- **Pros:** Magic links, email/phone verification, org management, pre-built UI components, session management, webhook events, Next.js middleware — all out of the box
- **Pros:** Operator "organizations" map perfectly to Clerk orgs (multiple people per business)
- **Cons:** Vendor lock-in, pricing gets steep at scale ($0.02/MAU after free tier)
- **Verdict:** ✅ **Best fit.** You're not building an auth system, you're building a business. Clerk handles the boring stuff so the agent can focus on the interesting stuff.

### Auth.js (NextAuth)
- **Free:** Open source, no per-user costs
- **Pros:** Full control, email magic links via provider, no vendor lock-in
- **Cons:** More code to write, no built-in phone verification, no org management, session handling is manual, edge cases are your problem
- **Verdict:** Good if you want to own everything. More work for same result.

### Custom
- **Verdict:** ❌ Don't. You'd spend weeks building what Clerk gives you in an afternoon.

### Recommendation: **Clerk**
At your stage, 10K free MAU is effectively unlimited. You'll have maybe 50-100 operator accounts in year 1. Clerk's org model lets multiple people from the same operator access the dashboard. If you ever outgrow it, migrating auth is a known problem with known solutions.

---

## Architecture

```
                    ┌─────────────────────┐
                    │   Adventure Wales    │
                    │     Next.js App      │
                    │  (Vercel + Clerk)    │
                    └────────┬────────────┘
                             │
                    ┌────────▼────────────┐
                    │   Operator Agent     │
                    │    (Railway)         │
                    │                      │
                    │  ┌──────────────┐    │
                    │  │ Agent Brain  │    │
                    │  │ (Claude API) │    │
                    │  └──────┬───────┘    │
                    │         │            │
                    │  ┌──────▼───────┐    │
                    │  │  Channels    │    │
                    │  │              │    │
                    │  │ • Email      │    │
                    │  │   (Resend)   │    │
                    │  │              │    │
                    │  │ • WhatsApp   │    │
                    │  │   (Cloud API)│    │
                    │  │              │    │
                    │  │ • Voice      │    │
                    │  │   (Bland AI) │    │
                    │  └──────────────┘    │
                    └────────┬────────────┘
                             │
                    ┌────────▼────────────┐
                    │   Neon Postgres      │
                    │   (shared DB)        │
                    └─────────────────────┘
```

---

## Costs (Monthly at Launch)

| Service | Free Tier | Paid (est. Year 1) |
|---------|-----------|-------------------|
| Clerk | 10K MAU free | £0 |
| Resend | 3,000 emails/mo free | £0 |
| Bland AI | Pay per call | ~£20/mo (200 calls × £0.09/min × 1 min avg) |
| WhatsApp Cloud API | 1,000 conversations/mo free | £0 |
| Railway | $5/mo hobby | £5/mo |
| Claude API | Pay per token | ~£30/mo |
| **Total** | | **~£55/mo** |

---

## Phase 1: Email Verification + Operator Auth (BUILD NOW)

### 1.1 Clerk Setup
- Install `@clerk/nextjs`
- Configure Clerk with email magic link auth
- Create "operator" user role
- Clerk org = operator business (multiple staff per org)

### 1.2 Claim Flow
```
Operator visits /directory/[slug] → clicks "Claim This Business"
  → /claim/[slug] page
  → Enters: name, email, job title
  → System checks:
     1. Email domain matches operator website domain? → Auto-send magic link
     2. Email is in DB as operator contact email? → Auto-send magic link
     3. Neither? → "Manual review" queue + email to admin
  → Operator clicks magic link → Clerk account created
  → Operator linked to their listing (operator_id in Clerk metadata)
  → Claim status updated: stub/claimed → pending_verification → verified
```

### 1.3 Verification Email (via Resend)
```
Subject: Verify your Adventure Wales listing - {Operator Name}

Hi {Name},

Someone has requested to manage the {Operator Name} listing on Adventure Wales.

If this was you, click below to verify and set up your dashboard:

[Verify My Listing →]

This link expires in 48 hours.

If you didn't request this, you can safely ignore this email or
reply to let us know.

Adventure Wales
```

### 1.4 Operator Dashboard (Basic)
Once verified, operator sees `/dashboard`:
- **My Listing** — edit description, tagline, photos, contact details
- **My Activities** — view/edit activities linked to their operator
- **Enquiries** — view enquiries received (from the Enquire All Vendors feature)
- **Upgrade** — see current tier, upgrade options

### 1.5 Admin Claims Queue
`/admin/commercial/claims` (already exists) — enhanced:
- Shows pending claims with: name, email, operator, domain match status
- Approve / Reject buttons with reason field
- Email automatically sent on approve/reject

### 1.6 DB Changes
```sql
-- Claims table
CREATE TABLE operator_claims (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES operators(id) NOT NULL,
  claimant_name VARCHAR(255) NOT NULL,
  claimant_email VARCHAR(255) NOT NULL,
  claimant_role VARCHAR(100),
  clerk_user_id VARCHAR(255),
  verification_method VARCHAR(50), -- 'domain_match', 'email_match', 'manual'
  status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected, expired
  rejection_reason TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- Link operators to Clerk users
ALTER TABLE operators ADD COLUMN IF NOT EXISTS clerk_org_id VARCHAR(255);
ALTER TABLE operators ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255);
```

### 1.7 Anti-Gaming
- Rate limit: max 3 claims per email per 24h
- Rate limit: max 5 claims per IP per 24h
- One active claim per operator at a time
- Claims expire after 48h if unverified
- Admin notified on every claim via email
- Audit log: every attempt stored with IP + timestamp

---

## Phase 2: WhatsApp Onboarding (Week 2-3)

- WhatsApp Business Cloud API on Railway
- Operator clicks WhatsApp link → starts chat with agent
- Agent collects business details, photos
- Agent creates/updates listing in DB
- Agent sends verification link in chat
- Post-verification: ongoing support channel

---

## Phase 3: Voice Verification (Week 4)

- Bland AI integration for outbound calls
- Agent calls the operator's advertised phone number
- Script: "Hi, this is Adventure Wales. We've received a request to manage your listing. Can I confirm you'd like to proceed?"
- On confirmation: send SMS with verification code
- Fallback: leave voicemail with callback number
- Cost: ~£0.09/min, most calls under 2 minutes

---

## Phase 4: Proactive Agent (Month 2+)

- Re-engagement: contact operators with stale listings
- Upselling: notify operators when they hit view milestones
- Review requests: prompt operators to ask customers for reviews
- Seasonal: suggest seasonal offers/pricing updates
- All automated, all through the agent

---

## Security Considerations

- Clerk handles session tokens, CSRF, password-less auth
- All operator endpoints scoped to their org (middleware check)
- Admin endpoints behind Clerk admin role
- Rate limiting on all claim/verification endpoints
- Webhook signature verification on Clerk events
- IP logging on all claim attempts
- GDPR: operator data exportable, deletable on request

---

## Files to Create

```
src/
├── app/
│   ├── claim/[slug]/page.tsx          — Claim form
│   ├── dashboard/                      — Operator dashboard
│   │   ├── layout.tsx                 — Auth-gated layout
│   │   ├── page.tsx                   — Dashboard home
│   │   ├── listing/page.tsx           — Edit listing
│   │   ├── activities/page.tsx        — Manage activities
│   │   └── enquiries/page.tsx         — View enquiries
│   └── api/
│       ├── claims/route.ts            — Submit/manage claims
│       ├── claims/verify/route.ts     — Verification endpoint
│       └── webhooks/clerk/route.ts    — Clerk webhook handler
├── lib/
│   ├── clerk.ts                       — Clerk helpers
│   ├── email.ts                       — Resend email functions
│   └── verification.ts               — Domain matching logic
└── middleware.ts                       — Clerk auth middleware
```
