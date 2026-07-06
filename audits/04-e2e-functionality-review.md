# End-to-End Functionality Review — 2026-07-06

Branch: `goal/launch-content-overhaul` · Scope: every public journey, API route, admin surface, and B2B flow, ahead of the 8-region launch.

**Method:** production build + live crawl of 1,037 URLs following every internal link, API smoke tests against the running server, and five parallel deep code reviews (public content, consumer auth, operator/B2B/billing, admin CMS security, infra/SEO). All findings below were verified against current source with file:line evidence.

## Verdict

The site is **much healthier than the May audit** — every headline security finding from then is genuinely fixed (fail-closed admin gate, scrypt per-user passwords, Zod validation on all mutating APIs, authenticated uploads, MCP behind a timing-safe bearer key, CSP/HSTS headers, real CI with tests). Typecheck clean, 61/61 tests pass, build green, **zero 5xx errors** under crawl.

But it is **not launch-ready**: one config line kills every activity detail page sitewide, the crawl found **201 broken links** on reachable pages, two high-severity security holes exist in the B2B surface, and several "features" in the launched UI are dead ends or mocks.

---

## P0 — Launch blockers

| # | Finding | Evidence |
|---|---------|----------|
| 1 | **Blanket redirect kills all activity detail pages.** `/activities/:slug` → `/:slug` (308, permanent) shadows `src/app/activities/[slug]/page.tsx` entirely. Every activity card on region/combo/search/event/itinerary pages redirects into the `[region]` catch-all and 404s. Confirmed live by crawl (146 such redirects → 404 targets). | `next.config.ts:107-116` |
| 2 | **Listing takeover via claim auto-approve.** `/api/auth/verify` auto-approves any claim once *any* email link is clicked — no domain match against `operator.website`. Anyone can claim any unclaimed business, edit its public listing, and become billing contact. The admin claims-review queue and `pending_approval` UI branch already exist but are bypassed. | `src/app/api/auth/verify/route.ts:96-118` |
| 3 | **Open redirect.** `/api/track/click?url=…` redirects to any ≤2048-char string; nothing legitimate uses the route (outreach sender was never built). Phishing vector; also 500s on garbage URLs. | `src/app/api/track/click/route.ts:47` |
| 4 | **Public API leaks billing/admin data.** `/api/operators` returns full rows: `stripeCustomerId`, `stripeSubscriptionId`, `billingEmail`, `billingNotes`, `billingCustomAmount`, `adminNotes`, `claimedByEmail`, `verifiedByEmail`. Confirmed live. `/api/search` operators query also lacks the publish filter. | `src/app/api/operators/route.ts`; `src/app/api/search/route.ts:75-98` |
| 5 | **Homepage bypasses the operator publish gate.** "Trusted Partners" queries claim/trial status only — no `status='published'` — so unpublished operators can render homepage cards linking to 404 profiles. | `src/app/page.tsx:51-56` |
| 6 | **Search and events filters are no-ops.** Next 16 `searchParams` promise is never awaited on `/search` and `/events` — every filter/pagination param reads `undefined`. (Journal does it correctly — copy that pattern.) | `src/app/search/page.tsx:360-367`; `src/app/events/page.tsx:11-18` |
| 7 | **Homepage SearchBar navigates users into 404s.** Region/activity options come from all published DB combos, not `LAUNCH_COMBOS`; activity-only search links `/${type}` for types with no hub route. | `src/components/home/search-bar.tsx:85,91`; `src/app/page.tsx:20-38` |
| 8 | **Consumer auth is launch-visible and broken at the edges.** Magic-link email CTA is invisible (CSS `var(--…)` in email HTML); "Continue with Google" ships unconfigured → raw JSON error; `/account` sign-out is a dead GET link (405) and its saved-item links all 404 (`/itineraries/activities/…`). *Alternative: feature-flag off header Sign In + FavouriteButton for launch.* | `src/app/api/user/login/route.ts:55,62`; `src/lib/email.ts:25,32`; `src/app/login/page.tsx:142-153`; `src/app/account/page.tsx:24-32,78-80` |
| 9 | **Prod env vars unset → silent breakage.** `NEXT_PUBLIC_APP_URL` unguarded: emails contain `undefined/auth/verify?…`, Stripe success/cancel URLs invalid. `NEXT_PUBLIC_SITE_URL` unset → OG URLs resolve to `*.vercel.app`. `.env.example` ships them empty/contradictory (`NEXT_PUBLIC_SITE_DOMAIN=adventurewales.com` vs hard-coded `.co.uk`). | `src/lib/email.ts:16`; `src/app/api/billing/checkout/route.ts:49-50`; `src/app/layout.tsx:15` |
| 10 | **Homepage regions grid is arbitrary.** Query takes `limit(6)` with no `orderBy` *before* filtering to launch regions — shows a random subset, never all 8. | `src/app/page.tsx:48,63` |

## P1 — Link integrity (the 201 crawl 404s) & gate leaks

Crawl: 1,037 URLs → 690 OK, 201 broken, 0 errors. Clusters, each one fix:

1. **Operator profiles** emit unslugified, ungated combo links (`/Snowdonia/Zip Lining`, `/pembrokeshire/Sea Kayaking`) — "Explore by activity" builds `/${region}/${activityType}` from raw names with no `isLaunchCombo` filter. `src/app/directory/[slug]/page.tsx:965-986`
2. **`/[region]/stay` and `/[region]/tips` are not launch-gated** — live+indexable for all ~12 regions, breadcrumbs link 404 region pages. `src/app/[region]/stay/page.tsx:132-137,153-174`; `tips/page.tsx:36-47,112-121`
3. **Activity hub pages** (~25 static: /kayaking, /fishing, /sailing…) and `StandardActivityHub` "Where to Go" cards link unlaunched combos (`/pembrokeshire/kayaking`, `/north-wales/hiking`). `src/components/activity-hub/StandardActivityHub.tsx:157,217`
4. **Guides + answers markdown** contains legacy 3-segment `/{region}/things-to-do/{activity}` URLs (~25+) and unlaunched region links; **answers pages render literal un-parsed markdown link syntax** into hrefs (`/answers/[title](/answers/slug)` — dozens live). Answers frontmatter `region: general|north-wales|wye-valley|carmarthenshire` renders 404 breadcrumb/pill/CTA links (86/147 files). `src/app/answers/[slug]/page.tsx:310-670`
5. **Event pages** link `/stay/${slug}` — route doesn't exist (should be `/accommodation/…`); events aren't region-gated. `src/app/events/[slug]/page.tsx:405,434`
6. **`/activities` curated arrays** link 9 nonexistent hubs (/archery, /canyoning, /zip-lining, /white-water-rafting, /quad-biking, /foraging…) and 3 unlaunched combos. `src/app/activities/page.tsx:70-111` — known pre-existing, still live
7. **`/stag-hen`** links 5 unlaunched `/${region}/stag-hen` combos + `/paintball`. `src/app/stag-hen/page.tsx:37-50,141,168`
8. **Skydiving/hub pages link unpublished operators** (`/directory/skydive-swansea`); **itinerary stops** join operators without the publish filter → "Contact/Book" CTAs to 404 profiles. `src/lib/queries/itineraries.ts:107`
9. **Wrong content:** region-page "Local Businesses" shows the same alphabetical 3 operators on every region + fabricates `5.0 (100 reviews)` fallbacks (`src/app/[region]/page.tsx:475,935`); `/accommodation` and `/events` listings hardcoded Snowdonia-only after the 8-region expansion; `/journal?page=-1` → 500 (negative SQL offset).

## P1 — Security/abuse hardening (before real traffic)

- **`updateListing` (operator dashboard) has zero validation** — operator-controlled `website` rendered as raw `href` on public profiles (`javascript:` URI risk); `formData.get()` nulls can wipe fields. `src/app/dashboard/listing/actions.ts`
- **`/api/admin/bulk` bypasses the operator status guardrail** (unvalidated `status_change`, hard `db.delete()` vs soft-archive elsewhere, no `adminUserId` in audit log). `src/app/api/admin/bulk/route.ts:44-51,107-108`
- **No rate limiting** on `/api/user/login` (unlimited emails + user-row creation), `/api/newsletter`, `/api/subscribe`, `/api/track-view` (2 DB round-trips per anonymous POST). Existing limiter is per-instance memory — ineffective on Vercel; move to Upstash/DB.
- **Admin roles never enforced** — viewer-role JWT can bulk-delete and drive Stripe actions; single auth layer (proxy matcher only, incl. `impersonateOperator`). MCP search tools return draft operators to key holders.
- **Numeric param 500s**: `parseInt` NaN → Postgres error in `/api/alternatives`, `/api/itineraries`, `/api/operators`, `/api/posts`.
- **`event_saves` unique constraint silently ignored by drizzle** (object-literal-in-array syntax) — race-prone duplicate saves. `src/db/schema.ts:279`

## P2 — Admin CMS is not usable end-to-end

- **Edit pages 404 for 5 of 7 content types** (activities, regions, accommodation, answers, events — list pages link to detail routes that don't exist). Only operators + guide-pages have edit UIs.
- **No UI path to publish/unpublish an operator** — the launch's core workflow requires SQL or the (guardrail-bypassing) bulk API.
- **Operator rename regenerates the slug on every save** → public URL silently changes, old URL 404s. Make slug immutable/explicit.
- Delete buttons are no-op `<button>`s; guide-pages "Add" links 404; login form says "Email (optional)" but email is required; `content-ops/decisions` writes to local disk (lost on Vercel); no admin logout route.

## P2 — Monetization readiness (currently safely dark — keep it dark until fixed)

No `STRIPE_*` vars are configured, so billing 503s gracefully. Before enabling:
- **Price-ID env split**: admin billing sync uses `STRIPE_VERIFIED_PRICE_ID`, webhook + stripe.ts use `STRIPE_ENHANCED_PRICE_ID` — a sync with mismatched vars silently downgrades every subscriber to free. `src/app/api/admin/billing/route.ts:117` vs `src/app/api/webhooks/stripe/route.ts:68`
- Checkout accepts **any** `priceId` string — allowlist to `STRIPE_PRICES`.
- Stripe SDK 20.3.0 (clover) vs pinned `2024-12-18.acacia`; `current_period_end` read via `as any` breaks on clover payloads.
- **Trial feature is inert** — nothing ever writes `trialExpiresAt`; badges reference dead logic. Wire it or strip it.
- **Dashboard "Enquiries" is a hardcoded mock** promised in marketing copy; ad-campaign admin links to nonexistent pages so campaigns can never serve; `/api/ads/slot` premium spotlight lacks the publish filter.

## P3 — SEO/perf/hygiene

- Unlaunched all-Wales detail pages (activities, journal, answers, events, accommodation, tags, itineraries) are reachable + indexable with **no `noindex`** — only dropped from sitemap. Soft gate: decide and document, or add `robots: {index:false}`.
- **No OG images anywhere**; `robots.ts` disallows `/admin/*` but not `/admin` itself; rename lying `LAUNCH_SNOWDONIA_ONLY` flag.
- `[region]/page.tsx` — highest-traffic pages — no `generateStaticParams`/`revalidate`: dynamic SSR, ~6 DB queries per request.
- Journal/answers soft-404s return HTTP 200 for unknown slugs (infinite indexable URLs).
- CI builds on every branch against **production `DATABASE_URL`**; use a dev/branch Neon DB. `db-pw.txt` in repo root (gitignored, but move it).
- Dead UI to remove or wire: combo/stay filter+sort buttons, "Start Planning" no-op CTA, footer `href="#"` social icons, mobile heart/share placeholders, dashboard Events section (works, unlinked from nav).
- Combo JSON robustness: `ComboEnrichment` unguarded `introduction.split()`; `"null"` strings persist in 2 unlaunched Snowdonia combo JSONs; JSON-only combos (snowdonia/caving, gorge-walking) get no region-page tile because tiles count DB rows only.
- `.env.example` gaps: `BOOKING_AFFILIATE_ID` (monetization silently off), `UNSPLASH_KEY`; dead `MET_OFFICE_API_KEY`, dead CI `ADMIN_PASSWORD`.

---

# Working plan

**Phase 1 — Unblock the primary journey (P0, ~1–2 days)**
Delete the two `/activities` redirects; fix `searchParams` awaits on /search + /events; filter SearchBar options by `LAUNCH_COMBOS`; fix homepage regions query (filter before limit + orderBy) and Trusted Partners publish filter; column-allowlist `/api/operators` + publish-filter `/api/search`; kill the open redirect (delete both track routes); domain-match claim verification (route mismatches to the existing claims queue); fix magic-link email CSS + hide Google button + fix or redirect `/account` → `/my-adventures`; set `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_APP_URL` in Vercel prod + add boot assertions.
**Exit test:** re-run crawler → activity-detail journey works; API leak gone; `npm test` + build green.

**Phase 2 — Zero broken links (P1 links, ~2–3 days)**
Work the 9 clusters above: slugify+gate operator-profile chips; launch-gate `[region]/stay|tips` (+ generateStaticParams); gate hub-page region cards; sweep guides/answers markdown (legacy `things-to-do` URLs, broken markdown links, region frontmatter); fix `/stay/` → `/accommodation/`; replace dead `/activities` + `/stag-hen` curated links; publish-filter itinerary stops; region-filter Local Businesses + drop fabricated ratings; widen accommodation/events listings to `LAUNCH_REGIONS`; clamp page params.
**Exit test:** full crawl reports 0 bad URLs (add the crawler as a CI/pre-deploy script).

**Phase 3 — Abuse hardening (P1 security, ~1–2 days)**
Zod-validate `updateListing` (http/https-only URLs); fix `/api/admin/bulk` (status enum, soft-delete, adminUserId); rate-limit user-login/newsletter/subscribe/track-view; 400-on-NaN param validation across public GET APIs; fix `event_saves` unique constraint + migration; publish-filter MCP search tools; enforce admin roles on bulk/billing/impersonate.

**Phase 4 — Admin usability (P2, ~2–4 days, parallelizable with launch)**
Operator publish/unpublish control with confirmation; slug immutability; build or remove the 5 broken edit routes; wire or remove delete buttons; admin logout; login form label; move content-ops decisions to DB.

**Phase 5 — Monetization enablement (post-launch)**
Unify price-ID env vars; priceId allowlist; resolve Stripe API version pin + add webhook tests; wire trials or strip badges; hide Enquiries mock; build or remove campaign admin; publish-filter ads spotlight. Only then configure `STRIPE_*` in prod.

**Phase 6 — SEO/perf polish (post-launch, ongoing)**
`noindex` on unlaunched detail pages (or accept + document); OG images; ISR/`generateStaticParams` on region pages; real 404 status on journal/answers; Upstash rate limiting; CI on a dev DB; remove dead UI; `.env.example` cleanup.

**Suggested go-live gate:** Phases 1–3 complete, crawler at 0 broken links in CI, prod env vars verified, and a manual pass through: region → combo → activity detail → operator profile → enquiry/claim.

---

## Progress log

**2026-07-06 — Phase 1 COMPLETE** (uncommitted on `goal/launch-content-overhaul`):
1. ✅ Deleted both `/activities/*` wildcard redirects (`next.config.ts`); made `/activities/type/[type]` fall back to DB activity-type lookup and hid its "back to guide" link for types without hub pages.
2. ✅ `/api/operators` now returns a public projection (no Stripe/billing/admin columns) with clamped `limit`; `/api/search` operators query publish-filtered.
3. ✅ Deleted `/api/track/click` (open redirect) + `/api/track/open` and their orphaned schemas.
4. ✅ Awaited `searchParams` on `/search` and `/events` — filters/pagination now work (verified live).
5. ✅ Homepage SearchBar options now derive from `LAUNCH_COMBOS` (also fixes JSON-only combos missing from the map); activity types restricted to launch-bookable slugs.
6. ✅ Homepage regions query filters to `LAUNCH_REGIONS` in-query with ordering (all 8 show); Trusted Partners query requires `status='published'`.
7. ✅ Claim verification: instant approval only on email-domain ↔ website-domain match (`verificationMethod='domain_match'`); mismatches stay pending (`email_match`) for the `/admin/commercial/claims` queue; re-used claim links respect claim state (pending → pending_approval, rejected → 403).
8. ✅ Magic-link emails use literal hex colours; Google button gated behind `NEXT_PUBLIC_GOOGLE_LOGIN=1`; `/account` redirects to `/my-adventures` (working twin); user-login route 503s (prod) instead of silently succeeding without `RESEND_API_KEY`.
9. ✅ New `src/lib/app-url.ts` `getAppUrl()` (env → VERCEL_URL → localhost-dev → throw) applied to email links, Stripe checkout/portal URLs, Google OAuth; `/api/user/verify` redirects relative to the request. `.env.example` corrected (`.co.uk` domain, required-in-prod notes, `BOOKING_AFFILIATE_ID`, `NEXT_PUBLIC_GOOGLE_LOGIN`; dead `MET_OFFICE_API_KEY` removed).

**Verification:** typecheck clean · 61/61 tests · lint 0 errors · build green · live crawl: 831 pages OK (was 690), redirects 146→8, activity-detail journey works, operators API leak gone, search filters verified live. Remaining 242 broken links are the Phase 2 clusters (41 newly *visible* on now-reachable activity pages — not regressions).

**⚠️ Deploy prerequisite:** set `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_APP_URL` (`https://adventurewales.co.uk`) in the Vercel project env before go-live.

**2026-07-06 — Phase 2 COMPLETE: crawl reports 0 broken links** (916 URLs, 908 OK, 8 intentional redirects). Fixes: operator-profile activity chips (slugified + launch-gated), itinerary stop operators publish-filtered, event pages (`/stay/`→`/accommodation/`, region links gated), `[region]/stay|tips` launch-gated, region sidebar region-filtered + fabricated ratings removed, accommodation/events listings widened to 8 launch regions, `/activities` + `/stag-hen` curated arrays fixed (dead entries removed/repointed, verified against DB activity types), StandardActivityHub + 6 bespoke hubs' region cards gated (combo → region → unlinked), skydiving dropzone links render only for published operators, spot/trail/centre comparison tables gated, activity detail breadcrumb + combo cross-link gated, `/activities/type/[type]` falls back to DB type lookup. NEW `src/lib/content-links.ts` (`normalizeContentHref`) wired into all three content renderers (journal/guides/answers) — rewrites legacy `/activity/*`, `/operators`, `things-to-do` URLs and drops unlaunched-region links to plain text; 11 unit tests. 104 legacy links rewritten across 42 content files; related-questions slugify fixed. 72/72 tests, typecheck + lint clean. **Note:** a stale `.next` incremental cache served old renderer output after rebuild — `rm -rf .next` before verification builds. Crawler: `scratchpad/crawl.mjs` pattern (build + start + BFS crawl) — worth adding to CI as the go-live link gate. Next: Phase 3 (abuse hardening).
