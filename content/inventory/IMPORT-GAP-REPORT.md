# Import Gap Report

> Cross-reference of CSV content under `content/` versus tables defined in
> `src/db/schema.ts`. Generated as part of the content audit on 2026-05-14.

## Headline

- **CSV content items inventoried**: 2,398 (see `MASTER-INVENTORY.csv`)
- **Schema tables defined**: 48
- **Tables backed by a CSV source**: 7 — accommodation, activities, events, locations, operators, transport, answers
- **CSV files with no destination table**: 6 — food, images, info, mtb subset, commercial-partners
- **Tables with no CSV source**: 41 — itineraries, posts, tags, ads/billing, auth, analytics, etc.
- **The wired-up importer is broken**: `package.json` declares `npm run db:import → scripts/import-content.ts`, but that file lives in `scripts/archive/` and the top-level path does not exist.

## CSV → Table mapping

| Group / file | Rows | Target table | Notes |
| --- | ---: | --- | --- |
| `accommodation.csv` | 149 | `accommodation` | Now unified — merged from former `accommodation/{campsites,glamping,hostels}.csv`. Schema mismatch: CSV has `lat/lon`, `facilities`, `dog_allowed`, `open_season`, `near_spots` that have no destination column. |
| `activities.csv` | 78 | `activities` | CSV uses `Activity Name`, `Operator`, `Min Age`, `Booking URL`. Table is normalized — needs FK lookup against `operators` and `regions`. |
| `commercial-partners.csv` | 27 | — | No matching table. Closest fit is `advertisers` (16 cols) but the affiliate schema is richer. Decision needed: feed `advertisers` or build a new table. |
| `events.csv` | 60 | `events` | Unified — `events/races.csv` was merged in. Schema has many enhancement fields (`heroImage`, `category`, `tags`, `isRecurring`, etc.) not present in the CSV. |
| `food/cafes.csv` (58) + `food/pubs.csv` (54) | 112 | — | No matching table. Could be modelled as `locations` rows with `type='cafe'/'pub'`, or get a dedicated `food_venues` table. |
| `images/{beaches-north,beaches-south,mountains,swimming}.csv` | 1,215 | — | No matching table. These are image-asset catalogues keyed by spot slug; they have no FK in `locations` or `accommodation`. Today they are not imported anywhere. |
| `info/webcams.csv` (55) + `info/wildlife.csv` (31) | 86 | — | No matching table. |
| `locations.csv` | 63 | `locations` | CSV column `GPS Coordinates` is a single string ("lat, lng") — table splits into `lat`/`lng` decimals. Several CSV columns (`Crowd Level`, `local_tip`) collapse onto `crowd_level`, no `local_tip` column exists. |
| `mtb/centres.csv` | 11 | `locations` (?) | No dedicated MTB table; centres conceptually fit `locations` with `type='trail-centre'`. CSV-specific fields (`uplift`, `trails_count`, `vertical_m`, `bike_wash`, `skills_area`) have no schema home. |
| `mtb/routes.csv` | 5 | — | No table. Would naturally be `activities` or a new `routes` table. |
| `mtb/trails.csv` | 32 | `locations` (?) | Same as centres — no dedicated table; would lose `grade`, `distance_km`, `ascent_m`, `time_min` on import. |
| `operators.csv` | 138 | `operators` | Now unified — merged from former `operators.csv` (marketing copy) + `operators/{climbing,coasteering,hire,kayak,mtb,surf,walking}.csv` (structured directory). Table expects far more columns (billing, claim, Stripe, trial fields) — most are blank on import. |
| `spots/beaches/*.csv` | 95 | `locations` (?) | Mapped to `locations` if treated as spot-of-interest. Region-specific files have varied schemas (`anglesey.csv` vs `pembrokeshire.csv` aren't column-identical). |
| `spots/climbing/crags.csv` | 12 | `locations` (?) | Same caveat — schema-specific fields (`grade_range`, `rock_type`, `tide_dependent`) lost. |
| `spots/coasteering/spots.csv` | 16 | `locations` (?) | Same. |
| `spots/hiking/{snowdonia,brecon,coastal}.csv` | 82 | `locations` (?) / `activities` (?) | Trails span both concepts — distance/ascent suggests `activities`, GPS suggests `locations`. |
| `spots/surfing/{gower,north-wales,pembrokeshire}.csv` | 33 | `locations` (?) | Schemas not column-identical across regions. |
| `spots/swimming/{lakes,rivers}.csv` + `spots/wild-swimming/spots.csv` | 47 | `locations` (?) | Wild-swimming and swimming/rivers carry identical headers — possible merge candidate (not done in this PR). |
| `transport/buses.csv` (71) + `transport/trains.csv` (66) | 137 | `transport` | The legacy `content/transport.csv` was merged into the per-mode files. Bus and train CSVs still have different headers; table has `lat`/`lng` only — buses CSV doesn't carry coordinates. |

## Schema tables with no CSV source

These tables in `src/db/schema.ts` have no inbound CSV in `content/` today.
Some are intentional (auth, billing, analytics); others suggest gaps.

| Table | Likely source | Status |
| --- | --- | --- |
| `sites` | Manual / seed | Single-row site config, expected. |
| `regions` | `content/regions/*.md` | 11 markdown files exist — there's no `regions.csv`, but the table is fed from the directory. |
| `activity_types` | Manual / seed | Taxonomy; expected to be seeded. |
| `tags`, `activity_tags`, `activity_regions`, `accommodation_tags`, `location_tags`, `itinerary_tags` | Derived | Tag/junction tables — no CSV expected. |
| `itineraries`, `itinerary_items`, `itinerary_stops` | `content/itineraries/*.md` | 15 markdown files. Imported via `npm run db:import-itineraries` (`scripts/import-json-itineraries.ts`). |
| `answers` | `content/answers/*.md` | 147 markdown files. Old archived importer handled this. |
| `guide_pages`, `guide_page_spots` | `content/guides/*.md` | 11 markdown files. No live importer. |
| `posts`, `post_tags` | `content/categories/*.md` (?) | 15 markdown files in `content/categories/`. Live importer via `npm run db:import-journal` — but the script references `scripts/insert-new-articles.ts`. |
| `event_saves`, `user_favourites`, `newsletter_subscribers`, `users` | User-generated | No CSV expected. |
| `operator_offers`, `operator_interest`, `magic_links`, `operator_sessions`, `operator_claims` | User-generated | No CSV expected. |
| `advertisers`, `advertiser_accounts`, `ad_campaigns`, `ad_creatives`, `ad_slots`, `page_ads`, `ad_impressions`, `page_sponsors`, `service_slots` | Manual / admin UI | Ads infra — possibly `commercial-partners.csv` is the missing seed. |
| `admin_users`, `content_rules`, `bulk_operations`, `status_history` | Admin / runtime | No CSV expected. |
| `page_views` | Runtime analytics | No CSV expected. |
| `outreach_campaigns`, `outreach_recipients` | CRM / admin UI | No CSV expected. |

## Schema mismatches worth flagging

Beyond per-row column drops, these are the structural mismatches you'd hit
if you re-wired an import today.

1. **`operators` is huge — 48 columns vs ~16 in the CSV.** Stripe/claim/trial
   fields all default sensibly, but `trustSignals` is JSONB and `serviceTypes`,
   `regions`, `activityTypes` are Postgres text arrays. The CSV pipe-delimits
   them (e.g. `Climbing|MTB`) — the importer needs to split.
2. **`locations.lat / lng` are `decimal`** with precision 10/scale 7. CSV
   `GPS Coordinates` is a single string ("52.804, -3.886") that has to be
   parsed.
3. **`accommodation.priceFrom / priceTo` are `decimal`.** CSV `Price/Night (£)`
   is a free-text range ("85-200", "Check website", "From 35"). The archived
   importer's `parsePrice` regex handles only `(\d+)(?:\s*-\s*(\d+))?` —
   strings like "From 35" or "varies" would parse silently to 35 / null.
4. **`events.dateStart / dateEnd` are `timestamp`.** CSV `Date(s)/Month` is
   prose ("June, annually", "First weekend of September"). Without a
   normalizer, nothing maps cleanly.
5. **`transport` has a single row per service.** Today's content lives in
   two files (`transport/buses.csv`, `transport/trains.csv`) with two
   different shapes. A union schema would be cleaner.
6. **Image catalogues are orphans.** 1,215 image rows in `content/images/`
   key off slugs that aren't FK-enforced anywhere. There's no `images` or
   `media_assets` table.

## What to fix next

1. Move `scripts/archive/import-content.ts` back to `scripts/import-content.ts`
   (or add a new importer) so `npm run db:import` works. Today it errors with
   `Cannot find module`.
2. Decide the home of `food/`, `info/`, `images/`, `commercial-partners.csv` —
   either add tables or fold them into existing ones (`locations`, `advertisers`,
   plus a new `media_assets`).
3. Pick one canonical schema for `transport`. Three shapes is two too many.
4. Pick a single regional-spot schema. The fact that `spots/beaches/gower.csv`
   and `spots/beaches/pembrokeshire.csv` differ column-wise means a single
   importer can't handle them without per-file logic.
5. Verify against the live DB — this report is a static cross-reference, not a
   row-count diff. Once a live importer exists, `MASTER-INVENTORY.csv` minus
   `SELECT count(*)` per table gives the true delta.
