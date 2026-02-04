# Jules Task: Magic Link Auth + Stripe Billing + Operator Dashboard

## Overview
Build passwordless magic link authentication (via Resend), Stripe Checkout + Customer Portal integration, and an operator dashboard. No third-party auth library — just magic links with JWT cookies.

**Repo:** mk-162/Adventure-Site
**Stack:** Next.js 16, TypeScript, Tailwind, Drizzle ORM, Vercel Postgres
**Brand colours:** Primary #1e3a4c, Accent #f97316

---

## Part 1: Magic Link Auth

### 1.1 Install Dependencies
```bash
npm install resend jsonwebtoken
npm install -D @types/jsonwebtoken
```

### 1.2 Environment Variables
Add to `.env` (these will need real values):
```
RESEND_API_KEY=re_xxxxxxxxxxxx
JWT_SECRET=generate-a-random-64-char-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1.3 Database Schema Changes

Add to `src/db/schema.ts`:
```typescript
export const magicLinks = pgTable("magic_links", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  operatorId: integer("operator_id").references(() => operators.id),
  purpose: varchar("purpose", { length: 50 }).default("login").notNull(), // 'login' | 'claim'
  used: boolean("used").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const operatorSessions = pgTable("operator_sessions", {
  id: serial("id").primaryKey(),
  operatorId: integer("operator_id").references(() => operators.id).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 100 }),
  lastLoginAt: timestamp("last_login_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const operatorClaims = pgTable("operator_claims", {
  id: serial("id").primaryKey(),
  operatorId: integer("operator_id").references(() => operators.id).notNull(),
  claimantName: varchar("claimant_name", { length: 255 }).notNull(),
  claimantEmail: varchar("claimant_email", { length: 255 }).notNull(),
  claimantRole: varchar("claimant_role", { length: 100 }),
  verificationMethod: varchar("verification_method", { length: 50 }), // 'domain_match', 'email_match', 'manual'
  status: varchar("claim_status", { length: 50 }).default("pending").notNull(), // 'pending', 'verified', 'rejected', 'expired'
  rejectionReason: text("rejection_reason"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
  expiresAt: timestamp("expires_at"),
});
```

Also add to the operators table:
```typescript
// Add these fields to the existing operators table definition
stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
billingTier: varchar("billing_tier", { length: 50 }).default("free"), // 'free', 'verified', 'premium'
billingEmail: varchar("billing_email", { length: 255 }),
verifiedAt: timestamp("verified_at"),
verifiedByEmail: varchar("verified_by_email", { length: 255 }),
```

Run the migrations as ALTER TABLE statements:
```sql
-- Magic links table
CREATE TABLE IF NOT EXISTS magic_links (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  operator_id INTEGER REFERENCES operators(id),
  purpose VARCHAR(50) DEFAULT 'login' NOT NULL,
  used BOOLEAN DEFAULT false NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Operator sessions
CREATE TABLE IF NOT EXISTS operator_sessions (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES operators(id) NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(100),
  last_login_at TIMESTAMP DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Operator claims
CREATE TABLE IF NOT EXISTS operator_claims (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES operators(id) NOT NULL,
  claimant_name VARCHAR(255) NOT NULL,
  claimant_email VARCHAR(255) NOT NULL,
  claimant_role VARCHAR(100),
  verification_method VARCHAR(50),
  claim_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  rejection_reason TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  verified_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- Add billing fields to operators
ALTER TABLE operators ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE operators ADD COLUMN IF NOT EXISTS billing_tier VARCHAR(50) DEFAULT 'free';
ALTER TABLE operators ADD COLUMN IF NOT EXISTS billing_email VARCHAR(255);
ALTER TABLE operators ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS verified_by_email VARCHAR(255);
```

### 1.4 Auth Library: `src/lib/auth.ts`
```typescript
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/db";
import { operators, operatorSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "aw_operator_session";

interface OperatorToken {
  operatorId: number;
  email: string;
  name: string;
}

export function createToken(payload: OperatorToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): OperatorToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as OperatorToken;
  } catch {
    return null;
  }
}

export async function getOperatorSession(): Promise<OperatorToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setOperatorSession(payload: OperatorToken) {
  const cookieStore = await cookies();
  const token = createToken(payload);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
}

export async function clearOperatorSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
```

### 1.5 Email Library: `src/lib/email.ts`
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLink({
  to,
  operatorName,
  token,
  purpose,
}: {
  to: string;
  operatorName: string;
  token: string;
  purpose: "login" | "claim";
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const url = `${baseUrl}/auth/verify?token=${token}`;

  const subject = purpose === "claim"
    ? `Verify your Adventure Wales listing — ${operatorName}`
    : `Sign in to Adventure Wales — ${operatorName}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e3a4c; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0;">Adventure Wales</h1>
      </div>
      <div style="padding: 32px; background: #f9fafb;">
        <h2 style="color: #1e3a4c;">${purpose === "claim" ? "Verify Your Listing" : "Sign In"}</h2>
        <p>Hi! Click the button below to ${purpose === "claim" ? "verify and manage" : "access"} the <strong>${operatorName}</strong> listing on Adventure Wales.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            ${purpose === "claim" ? "Verify My Listing →" : "Sign In →"}
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link expires in 48 hours. If you didn't request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "Adventure Wales <noreply@adventurewales.co.uk>",
    to,
    subject,
    html,
  });
}
```

### 1.6 Domain Verification: `src/lib/verification.ts`
```typescript
export function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace("www.", "");
  } catch {
    return null;
  }
}

export function emailMatchesDomain(email: string, websiteUrl: string): boolean {
  const emailDomain = email.split("@")[1]?.toLowerCase();
  const siteDomain = extractDomain(websiteUrl);
  if (!emailDomain || !siteDomain) return false;
  return emailDomain === siteDomain;
}

export function isGenericEmail(email: string): boolean {
  const generic = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "protonmail.com", "live.com", "btinternet.com", "sky.com", "virginmedia.com"];
  const domain = email.split("@")[1]?.toLowerCase();
  return generic.includes(domain || "");
}
```

### 1.7 API Routes

**`src/app/api/auth/claim/route.ts`** — Submit a claim
- POST: accepts { operatorSlug, name, email, role }
- Checks rate limits (3 per email per 24h, 5 per IP per 24h)
- Checks if operator already has a pending claim
- Determines verification method (domain_match, email_match, or manual)
- Creates magic_links record with crypto.randomUUID() token, expires 48h
- Creates operator_claims record
- Sends magic link email via Resend
- If manual review needed, also sends notification email to admin

**`src/app/api/auth/verify/route.ts`** — Verify magic link
- GET: accepts ?token=xxx
- Looks up magic_links record
- Checks not expired, not used
- Marks link as used
- Creates/updates operator_sessions
- Updates operator claim_status
- Sets JWT cookie via setOperatorSession()
- Redirects to /dashboard

**`src/app/api/auth/login/route.ts`** — Existing operator login
- POST: accepts { email }
- Looks up operator by email (verified_by_email or billing_email)
- Creates magic link, sends email
- Returns success

**`src/app/api/auth/logout/route.ts`** — Logout
- POST: clears cookie, redirects to /

### 1.8 Pages

**`src/app/claim/[slug]/page.tsx`** — Claim form (SERVER component)
- Fetches operator by slug
- Shows operator name, current listing info
- Form: name, email, job title, submit button
- Shows "Already claimed" if operator is already verified
- After submit: success message "Check your email for a verification link"
- Style: clean, branded, matches site design

**`src/app/auth/verify/page.tsx`** — Magic link landing
- Reads token from URL
- Calls verify API
- Shows success/error message
- Redirects to dashboard on success

**`src/app/auth/login/page.tsx`** — Operator login
- Simple email input
- "Send me a sign-in link"
- For returning operators

---

## Part 2: Stripe Billing

### 2.1 Install Dependencies
```bash
npm install stripe
```

### 2.2 Environment Variables
```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
STRIPE_VERIFIED_PRICE_ID=price_xxxxxxxxxxxx
STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxx
```

### 2.3 Stripe Client: `src/lib/stripe.ts`
```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});
```

### 2.4 API Routes

**`src/app/api/billing/checkout/route.ts`** — Create checkout session
```typescript
// POST: accepts { operatorId, priceId }
// Requires auth (getOperatorSession)
// Creates or retrieves Stripe customer (store stripe_customer_id on operator)
// Creates Stripe Checkout session with:
//   - mode: "subscription"
//   - customer: stripeCustomerId
//   - line_items: [{ price: priceId, quantity: 1 }]
//   - success_url: /dashboard?upgraded=true
//   - cancel_url: /dashboard/upgrade
//   - metadata: { operatorId }
// Returns { url: session.url }
```

**`src/app/api/billing/portal/route.ts`** — Customer portal redirect
```typescript
// POST: requires auth
// Creates Stripe billing portal session
// Returns { url: session.url }
// Operator can manage subscription, view invoices, update card, cancel
```

**`src/app/api/webhooks/stripe/route.ts`** — Stripe webhooks
```typescript
// POST: handles Stripe webhook events
// Verify signature with STRIPE_WEBHOOK_SECRET
// Handle events:
//   - checkout.session.completed → update operator billing_tier, stripe_customer_id
//   - customer.subscription.updated → update billing_tier based on price_id
//   - customer.subscription.deleted → set billing_tier back to 'free'
//   - invoice.payment_failed → (optional) email notification
// Map price IDs to tiers:
//   - STRIPE_VERIFIED_PRICE_ID → 'verified'
//   - STRIPE_PREMIUM_PRICE_ID → 'premium'
```

---

## Part 3: Operator Dashboard

### 3.1 Dashboard Layout: `src/app/dashboard/layout.tsx`
- Server component
- Calls getOperatorSession() — if no session, redirect to /auth/login
- Fetches operator data from DB
- Sidebar navigation:
  - Overview (dashboard home)
  - My Listing (edit profile)
  - Activities (view/edit)
  - Enquiries (view received enquiries)
  - Billing (upgrade, manage subscription)
- Header: operator name, tier badge, logout button
- Style: clean, professional. White background, sidebar #1e3a4c, accent #f97316

### 3.2 Dashboard Home: `src/app/dashboard/page.tsx`
- Welcome message with operator name
- Quick stats cards:
  - Current tier (with upgrade CTA if free)
  - Number of activities listed
  - Number of enquiries received
  - Listing views (placeholder for now — "Coming soon")
- Recent enquiries list (last 5)
- Listing completeness score (what % of fields are filled)

### 3.3 Edit Listing: `src/app/dashboard/listing/page.tsx`
- Form to edit operator fields:
  - Description, tagline
  - Phone, email, website
  - Address
  - Cover image URL, logo URL
  - Price range
  - Unique selling point
- Server action to update operator record
- Only updates fields for the authenticated operator (security!)
- Success toast/message after save
- Show preview of how their listing looks

### 3.4 Activities: `src/app/dashboard/activities/page.tsx`
- Table of activities belonging to this operator
- Show: name, price, duration, difficulty, status
- Link to each activity's public page
- (Phase 2: add/edit activities — for now, read-only with "Contact us to update" message)

### 3.5 Enquiries: `src/app/dashboard/enquiries/page.tsx`
- List of enquiries received through the site
- Show: date, enquirer name/email, message, which itinerary/activity it came from
- (Requires checking what enquiry data is stored — look at the Enquire All Vendors feature)

### 3.6 Billing/Upgrade: `src/app/dashboard/billing/page.tsx`
- Current tier display with features comparison:
  - **Free:** Basic listing, name + contact
  - **Verified (£9.99/mo):** Full profile, booking links, verified badge, itinerary inclusion
  - **Premium (£29.99/mo):** Everything + featured placement, priority in search, lead notifications
- Upgrade buttons → call /api/billing/checkout
- If already on paid plan: "Manage Billing" button → call /api/billing/portal
- Show current subscription status (active, past_due, etc)

### 3.7 Add Login Link to Site Header
- Add "Operator Login" link to site header/footer
- Link to /auth/login

### 3.8 Add "Claim This Business" to Operator Profile Pages
- On `/directory/[slug]` pages, if operator is NOT verified, show a CTA:
  - "Is this your business? Claim this listing →"
  - Links to /claim/[slug]
- If operator IS verified, don't show the claim CTA

---

## Part 4: Admin Enhancements

### 4.1 Update Claims Admin: `src/app/admin/commercial/claims/page.tsx`
- This page may already exist — enhance it
- Show all operator_claims with: operator name, claimant name, email, verification method, status, date
- Approve button → updates claim status to 'verified', updates operator verified_at + verified_by_email, sends confirmation email
- Reject button → opens modal for rejection reason, sends rejection email
- Filter by status (pending, verified, rejected)

---

## Security Requirements

1. All dashboard routes must check getOperatorSession() — redirect to login if not authenticated
2. All mutations must verify the operator ID in the session matches the operator being edited
3. Stripe webhook must verify the webhook signature
4. Magic links expire after 48 hours
5. Magic links can only be used once
6. Rate limit claim submissions (check by email and by IP)
7. Rate limit login attempts (max 5 per email per hour)
8. Use httpOnly, secure, sameSite cookies for JWT

---

## DB Connection for Migrations

Run ALTER TABLE / CREATE TABLE commands using:
```bash
source .env && POSTGRES_URL="$DATABASE_URL" node -e "const { sql } = require('@vercel/postgres'); sql.query('YOUR SQL HERE').then(r => { console.log(JSON.stringify(r.rows)); process.exit(0); }).catch(e => { console.error(e.message); process.exit(1); });"
```

---

## After Building

1. Run `npm run build` — must pass clean
2. List all new files created
3. List any env vars needed with placeholder values
4. Note any existing files modified
5. The Stripe price IDs and keys will need to be set up manually — just use placeholder env var names
