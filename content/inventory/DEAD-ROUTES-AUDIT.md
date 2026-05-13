# Dead Routes & Empty-Page Audit

> Static audit of `src/app/` routes against the CSV content under `content/`
> and the markdown content directories. Generated 2026-05-14. This is a
> static check — it does not query the live DB. Wherever this report says
> "if the DB is empty" it means run `psql $DATABASE_URL -c "select count(*) from <table>"`
> to confirm.

## Summary

- **Dynamic routes using `generateStaticParams`**: 12
- **Routes that depend on DB rows (would 404 if DB empty)**: 9
- **Routes that depend on markdown files (would 404 if files removed)**: 3
- **Top-level activity mega-pages (one per activity slug)**: 20
- **Activity types likely present in CSV / DB**: ~6
- **Activity mega-pages with no backing data**: ~14 (sailing, kitesurfing, skydiving, fishing, kayaking, paragliding, horse-riding, windsurfing, bouldering, etc.)
- **Static/legal pages (no content backing required)**: ~15

## Dynamic routes with `generateStaticParams`

| Route | Source | Source count | Risk |
| --- | --- | ---: | --- |
| `/activities/[slug]` | `activities` table (`getAllActivitySlugs`) | CSV: 78 | **High** if DB unseeded — page calls `getActivityBySlug` → `notFound()`. |
| `/accommodation/[slug]` | `accommodation` table | CSV: 149 | High if DB unseeded. CSV is unified now; no live importer is wired up. |
| `/events/[slug]` | `events` table | CSV: 60 | High if DB unseeded. |
| `/itineraries/[slug]` | `itineraries` table | content/itineraries: 15 .md files | Medium. Has live importer (`npm run db:import-itineraries`), but route relies on DB rows being present. |
| `/tags/[slug]` | `tags` table | None — derived | Medium. No CSV source. Tags are seeded by `scripts/archive/seed-tags.ts`. If the table is empty, every `/tags/*` page 404s. |
| `/directory/[slug]` | `operators` table (top 100 only) | CSV: 138 | High. `generateStaticParams` limits to 100; operators 101–138 are dynamic-only and will be slow first-hit. |
| `/answers/[slug]` | `content/answers/*.md` (filesystem) | 147 .md files | **Low**. Read at build time, no DB dependency. |
| `/safety/[slug]` | `content/safety/*.md` | 9 .md files | Low. |
| `/guides/[slug]` | `content/guides/*.md` (+ extras) | 11 .md files | Low. |
| `/activities/type/[type]` | `activityTypeInfo` constant in the page file | static set | Low. Pure code, no DB. |
| `/[region]/stay` | `regions` table (`getAllRegions`) | content/regions: 11 .md | High if regions table empty. |
| `/[region]/[subpage]` | `regions × activity_types` join in DB | regions ×activity_types | High. If either table is empty the cross-product is empty. |

## Top-level "mega" pages (one per activity)

These pages have no `generateStaticParams` — they're single static routes
that call `getActivityTypeBySlug(<hard-coded slug>)`. If the row doesn't
exist in `activity_types`, the page still renders (the activity grid just
shows empty), so they don't 404 — but they're hollow.

| Slug / page | `activity_types` row expected | CSV evidence | Likely status |
| --- | --- | --- | --- |
| `mountain-biking` | yes | `mtb/centres.csv`, `operators` activities include MTB | Probably OK |
| `coasteering` | yes | `spots/coasteering`, `operators` coasteering | Probably OK |
| `surfing` | yes | `spots/surfing`, `operators` surf | Probably OK |
| `hiking` | yes | `spots/hiking` | Probably OK |
| `climbing` / `rock-climbing` / `bouldering` | yes | `spots/climbing/crags.csv`, `operators` climbing | Probably OK |
| `wild-swimming` | yes | `spots/wild-swimming`, `spots/swimming` | Probably OK |
| `caving` | maybe | No spots CSV for caving | **Likely empty grid** |
| `gorge-walking` | maybe | No spots CSV | **Likely empty grid** |
| `kayaking` / `canoeing` / `paddleboarding` | maybe | `operators` kayak | Operator list only, no spots |
| `sailing` / `windsurfing` / `kitesurfing` | unlikely | No CSV | **Hollow** |
| `paragliding` / `skydiving` | unlikely | No CSV | **Hollow** |
| `horse-riding` / `fishing` | unlikely | No CSV | **Hollow** |
| `stag-hen` | static config | n/a | Marketing page; no activity grid required |

There are ~14 mega-pages with no spots data behind them today. They render
without errors but the on-page activity grid will be empty — bad for SEO
and user trust.

## Pages with empty / missing content backing

These are static pages whose backing content directory is empty or whose
CSV source has zero usable rows:

- **`content/food/pubs.csv`** has 54 rows under the `Pub Name` header
  schema — no live route reads it, so the data is effectively orphaned.
- **`content/images/*.csv`** (1,215 rows) is read by no app route; image
  metadata sits in CSVs only and is never imported.
- **`content/info/{webcams,wildlife}.csv`** (86 rows) — no consumer route.
- **`content/commercial-partners.csv`** (27 rows) — no consumer route.
- **`content/mtb/{routes,trails}.csv`** (37 rows) — `/mountain-biking`
  reads from the `activities` table, not from these CSVs. Currently
  orphaned.

## Static-only pages (low risk)

These are content-free pages — legal, marketing, account UI. No backing data
required, no 404 risk from missing content.

`/about`, `/advertise`, `/book`, `/calendar`, `/careers`, `/contact`,
`/cookies`, `/destinations`, `/help`, `/journal`, `/login`, `/my-adventures`,
`/partners`, `/press`, `/privacy`, `/regions`, `/safety`, `/search`,
`/stag-hen`, `/tags`, `/terms`, `/trip-planner`, `/account`, `/admin/*`.

## Routes that depend on DB but have no `generateStaticParams`

These render dynamically for every request — slow first-hit, and will 404
if the slug isn't in the DB:

- `/locations/[slug]` — calls `getLocationBySlug`. 63 CSV rows in
  `locations.csv` plus ~280 spots in `content/spots/`. If nothing's
  imported, every URL 404s.
- `/journal/[slug]` — calls `getPostBySlug`. No CSV source; depends on
  whatever `scripts/insert-new-articles.ts` has loaded.
- `/claim/[slug]` — operator-claim flow.
- `/[region]/tips` — region-based.

## Risk-ranked action list

1. **Wire up `npm run db:import`** — the script is missing
   (`scripts/import-content.ts` doesn't exist; an archived copy is in
   `scripts/archive/`). Until this is fixed, none of the 7 CSV-backed
   tables (accommodation, activities, events, locations, operators,
   transport, answers) can be refreshed.
2. **Decide what to do with the 14 hollow activity mega-pages**. Either
   add spots/operators CSVs for them or remove the pages.
3. **Add `generateStaticParams` to `/locations/[slug]`** — today every
   request is dynamic.
4. **Raise the `/directory/[slug]` limit from 100 to ≥138** so all
   operators are statically generated.
5. **Decide the home of orphan CSVs** (`food/pubs.csv`, `images/*.csv`,
   `info/*.csv`, `commercial-partners.csv`, `mtb/routes.csv`,
   `mtb/trails.csv`) — either give them a route or delete them.
