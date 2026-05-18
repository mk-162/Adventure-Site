# Jules Brief: Snowdonia / Eryri Content Completeness Audit v2

## Goal
Audit the existing Snowdonia content so the site feels complete, locally-informed, and trustworthy.

This is not a writing task yet. This is a research and audit task.

You must identify where our current Snowdonia coverage misses the things the region is most famous for, under-covers important spots, or feels incomplete compared with what a serious visitor would expect.

## Primary files to audit
1. `content/regions/snowdonia.md`
2. `data/combo-pages/snowdonia--hiking.json`
3. `data/combo-pages/snowdonia--mountain-biking.json`
4. `data/combo-pages/snowdonia--climbing.json`
5. `data/combo-pages/snowdonia--caving.json`
6. `data/combo-pages/snowdonia--gorge-walking.json`
7. `data/combo-pages/snowdonia--zip-lining.json`
8. `data/combo-pages/snowdonia--wild-swimming.json`
9. `data/combo-pages/snowdonia--trail-running.json`

## Secondary context files
Use these to understand what we already have and what may be missing:
- `data/best-lists/snowdonia--best-walks.json`
- `data/best-lists/snowdonia--best-hikes.json`
- `data/best-lists/snowdonia--best-scrambles.json`
- `data/best-lists/snowdonia--best-mountain-bike-trails.json`
- `content/spots/hiking/snowdonia.csv`
- `content/spots/mtb/centres.csv`
- `content/spots/mtb/routes.csv`
- `content/spots/beaches/snowdonia-coast.csv`
- `content/operators/mtb.csv`
- `content/operators/climbing.csv`
- `content/operators/walking.csv`
- `content/mtb/centres/coed-y-brenin.md`
- `content/answers/best-adventures-snowdonia.md`
- `content/answers/getting-to-snowdonia-without-car.md`
- `content/answers/photography-spots-snowdonia.md`
- `content/itineraries/snowdonia-adventure-weekend.md`

## Live page mapping
Use these URL patterns when thinking about the visitor experience:
- Region page: `/snowdonia`
- Activity pages: `/snowdonia/hiking`, `/snowdonia/mountain-biking`, `/snowdonia/climbing`, `/snowdonia/caving`, `/snowdonia/gorge-walking`, `/snowdonia/zip-lining`, `/snowdonia/wild-swimming`, `/snowdonia/trail-running`

## What to assess
For each page, assess:
1. Does it lead with what Snowdonia is most famous for?
2. Does it include the important named places a real visitor would expect?
3. Does it feel complete or does it feel like obvious pieces are missing?
4. Does it over-focus on generic guidance and under-focus on the specific places that matter?
5. Are there important nearby/adjacent places wrongly omitted because of region boundary confusion?
6. Are there image-risk notes we should capture because the place has a very distinctive look?

## Specific quality bar
Examples of the exact problem we are trying to catch:
- A region page exists but misses what the region is genuinely best known for.
- A mountain biking page covers only 8 of the 15 most important spots.
- A page mentions a famous area but does not include the specific named trails, mountains, crags, centres, or launch points visitors search for.
- Images could easily be wrong because the visual character of the location is distinctive.

## Research method
Use layered research:
1. First inspect the repo files listed above.
2. Then cross-check against strong external references: official park/tourism sources, specialist publications, and consensus sources.
3. Look for famous named places, classic routes, iconic operators, major omissions, and local-intelligence gaps.
4. Prefer concrete named gaps over vague criticism.

## Output file
Update this CSV only:
`content/inventory/coverage-findings.csv`

## CSV schema - DO NOT CHANGE HEADERS
The CSV already exists with this header row:
`Page Type,Page Title / Slug,Region,Activity,Current Coverage Score (1-5),Famous Things Missing,Top Missing Spots/Locations,Research Status,Priority,Notes,Last Updated`

Append rows using exactly those columns.
Do not replace the header row.
Do not invent a new schema.

## Row format guidance
- `Page Type`: `region`, `activity-region`, `best-list`, `itinerary`, etc.
- `Page Title / Slug`: e.g. `snowdonia`, `snowdonia/mountain-biking`
- `Region`: `snowdonia`
- `Activity`: leave blank for region page, otherwise use slug like `mountain-biking`
- `Current Coverage Score (1-5)`: integer only
- `Famous Things Missing`: concise summary of what a visitor would expect but is under-covered
- `Top Missing Spots/Locations`: comma-separated list of the most important named missing places
- `Research Status`: use `researched`
- `Priority`: use `P1` if the gap hurts completeness badly, otherwise `P2`
- `Notes`: one concise but specific explanation
- `Last Updated`: today in `YYYY-MM-DD`

## Minimum expected coverage for Snowdonia pages
Use this as a floor, not a ceiling:
- Region page should clearly surface Snowdon/Yr Wyddfa, Tryfan/Glyderau/Carneddau, slate landscape, Betws-y-Coed/Llanberis/Beddgelert, and the big adventure draws.
- Hiking page should not feel complete if it misses major named routes/ranges hikers expect.
- Mountain biking page should not feel complete if it under-covers Coed y Brenin, Antur Stiniog, Penmachno, Marin/Gwydir, and other classic Snowdonia riding.
- Climbing page should clearly reflect the area’s best-known crags and mountain trad identity.
- Zip-lining page should reflect the real dominance of Zip World / slate quarry identity.
- Wild swimming page should separate mountain lakes, waterfalls, and coastal options clearly.

## Important constraint
Do not rewrite the content files in this session.
Only research, audit, and update the CSV with high-quality findings.

## Definition of done
Done = the CSV contains a solid Snowdonia audit with concrete named gaps and realistic coverage scores, not vague editorial comments.