# Editor Workflow

Day-to-day guide for editors and content managers running Adventure Wales. Covers what the admin tools do, where to find them, and the routine moderation flows.

## 1. Logging in

- Admin login lives at **`/admin/login`**.
- It's gated by a JWT cookie issued by the admin auth route — the public marketing site does not see admin status.
- After login you land on `/admin` which lists the available consoles.

> Production hardening: the admin layout has no top nav linking back to the public site by design. A "Go to site" button in the top-right corner returns you when you're done.

## 2. The admin consoles at a glance

| Console | Path | What it's for |
|---|---|---|
| Content — Operators | `/admin/content/operators` | Create stubs, edit existing operators, attach images, set claim status. |
| Content — Activities | `/admin/content/activities` | Manage activity listings under each region / activity type. |
| Content — Accommodation | `/admin/content/accommodation` | Manage accommodation stubs and verified listings. |
| Content — Regions | `/admin/content/regions` | Edit hero text, top experiences, transport / getting-there content. |
| Content — Events | `/admin/content/events` | Add and curate events that appear in the calendar. |
| Content — Answers | `/admin/content/answers` | FAQ-style answer pages (the `/answers/*` routes). |
| Content — Guide pages | `/admin/content/guide-pages` | Long-form editorial guides and pillar pages. |
| Commercial — Claims | `/admin/commercial/claims` | Approve/reject operator claim submissions. |
| Commercial — Partners | `/admin/commercial/partners` | Premium partner management. |
| Commercial — Advertisers | `/admin/commercial/advertisers` | Advertise-here lead pipeline. |
| Commercial — Campaigns | `/admin/commercial/campaigns` | Marketing campaign / promo tracking. |
| Commercial — Accounts | `/admin/commercial/accounts` | Billing accounts for paid operators. |
| Campaigns | `/admin/campaigns` | High-level homepage campaigns / featured slots. |
| Billing | `/admin/billing` | Stripe subscription & invoice overview. |

## 3. Routine flows

### 3a. Approving a claim

1. An operator submits the claim form via `/directory/claim` → `/claim/<slug>`.
2. They get a magic link email; clicking it auto-verifies the claim (status → `claimed`, operator gets a session).
3. Manual review is only required if email-verification fails or a stale claim is sitting open. Go to **`/admin/commercial/claims`**:
   - You'll see name, email, role, IP, submitted-at, plus the matched operator.
   - Use **Send magic link** to re-trigger the email if they say they didn't receive it.
   - Use **Approve** to manually push `claimStatus → claimed`.
   - Use **Reject** with a short reason — the claimant gets notified by email.
4. Once approved, the operator can log in at `/auth/login` using the same email and see their dashboard at `/dashboard`.

### 3b. Adding a new operator stub

1. Go to `/admin/content/operators` → **New**.
2. At minimum, supply: name, slug, region, type, short description, primary image (hero).
3. Save with `claimStatus = stub`. The listing is now publicly browsable with a "Claim this listing" banner.
4. If you know the owner already, send them the `/claim/<slug>` URL — they'll be walked through verification.

### 3c. Replacing a missing or low-quality image

- Always prefer Openverse / Unsplash (royalty-free) over scraped imagery.
- Use the `generate-images` skill from a Claude session: it walks through Openverse → Unsplash → `/public/images/...` and updates the right DB row.
- Hero images go on the entity record (operator / accommodation / region / event). Galleries live in the entity's `imageGallery` field where present.
- Avoid AI-generated photographs for events or operators — those need real attribution.

### 3d. Publishing a new event

1. `/admin/content/events` → **New event**.
2. Fill: name, region, location (with lat/lng if possible — drives the map + "where to stay" widget), start/end date, ticket URL, image with source attribution.
3. The event appears immediately on `/events` and `/calendar`, and rolls into "This Weekend" + nearby-region widgets.
4. Audit `Register Now` URLs occasionally — broken external links degrade trust fast.

### 3e. Editorial QA before going live

For any page touching production content:

- [ ] Metadata + OG tags present (`generateMetadata` is wired for most templates).
- [ ] Hero image present, sourced legally, alt text describes the scene.
- [ ] Internal cross-links (region → activities → operators → itineraries) all resolve — no 404s.
- [ ] Lighthouse mobile score > 85 on the new page.
- [ ] Keyboard + screen-reader pass on any forms or filters.
- [ ] Search/filter query params preserved so the URL is shareable.

## 4. Operator self-service (for context)

Once an operator has claimed:

- **`/dashboard`** — overview.
- **`/dashboard/listing`** — edit description, services, images, hours.
- **`/dashboard/activities`** — manage their own listed activities.
- **`/dashboard/events`** — premium operators only; create their own promoted events.
- **`/dashboard/enquiries`** — inbound messages from the public site.
- **`/dashboard/billing`** — Stripe subscription self-service.

Anything an operator does here is scoped to **their own** record; the admin consoles are the only place where cross-operator edits, claim approvals, and commercial campaigns live.

## 5. Commercial widgets & affiliate revenue

- **Booking.com**: `BOOKING_AFFILIATE_ID` env var is the single point of monetisation. Set it once in Vercel → every "Search on Booking.com" link site-wide (region pages, accommodation detail, where-to-stay sections) carries the affiliate tag automatically via `src/lib/booking.ts`.
- **Advertise-here slots**: unsold ad slots auto-render the "Advertise Here" widget. To assign a paid advertiser, use `/admin/commercial/advertisers` and tag them against a region/activity slot.
- **Premium operators**: surface with a gold border + premium badge. Promote a claimed operator to premium via `/admin/commercial/partners` → set tier.

## 6. Useful background

- All admin routes are server components with Drizzle queries; mutations go through `actions.ts` server actions in each folder.
- `/admin/commercial/claims/actions.ts` contains the approve/reject/send-magic-link logic. Read it if a claim does something unexpected.
- Magic links are stored in the `magic_links` table with a 48h expiry and a single-use flag. Re-sending a link issues a fresh token, the old one still works until expiry.
- Weather is pulled live from Open-Meteo (free, no key) with 30-minute in-memory cache; falls back to neutral mock data if the upstream is down so widgets never break.

## 7. When something goes wrong

- **An operator can't log in** → check that `claimStatus = claimed` on their operator row and that `magic_links` shows their email. If yes, re-send the link from the claims console.
- **A claim form is rejecting them as duplicate** → there's an existing `pending` claim on that operator. Approve or reject the existing one first.
- **Weather widget shows mock data** → Open-Meteo upstream may be rate-limiting; the route logs the upstream error to Vercel function logs. Wait 30 minutes for cache to clear or redeploy.
- **A page is missing an image** → either populate the entity's hero image field, or rely on the activity-type / region fallback chain in `src/lib/image-utils`.
