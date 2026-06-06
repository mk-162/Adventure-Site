# Adventure Wales Goal 1: Content Audit & Organization

## Project Context

Repo: ~/projects/Adventure-Site (Next.js 16, Drizzle ORM, PostgreSQL Neon)
You are on branch `feat/content-audit` — create it from main.

## Goal

Consolidate, deduplicate, and organize ALL content. Produce a complete inventory of everything that exists and everything missing.

## Tasks

### 1. Deduplicate Content Files

Scan `content/` for duplicate files:
- Compare `content/mtb/` vs `content/spots/mtb/` (centres.csv, trails.csv, routes.csv exist in both). Keep ONE authoritative version, delete the other.
- Check `content/accommodation.csv` vs sub-files (`hostels.csv`, `campsites.csv`, `glamping.csv`) — merge into single master.
- Check `content/operators.csv` vs `content/operators/*.csv` — consolidate.
- Check `content/activities.csv` vs any sub-files.
- Check `content/events.csv` vs `content/events/races.csv`.

### 2. Build MASTER-INVENTORY.csv

Create `content/inventory/MASTER-INVENTORY.csv` programmatically from ALL CSV files.

Columns: `id,type,name,slug,region,source_file,columns_count,columns_filled,data_completeness,status,notes`

- `id`: hash of (type + slug)
- `type`: activity, operator, accommodation, event, transport, spot, food, info, image, partner, location
- `data_completeness`: (non-empty columns / total columns) * 100, as integer
- `status`: "csv" for now (means exists only as CSV, not imported)
- Process every CSV in `content/` recursively

### 3. Generate IMPORT-GAP-REPORT.md

Create `content/inventory/IMPORT-GAP-REPORT.md`:
- List every DB table from `src/db/schema.ts` / `drizzle/schema.ts`
- For each table: column names, required fields
- Compare with corresponding CSV columns
- Flag mismatches (CSV missing DB columns, CSV has extra columns)
- Summary: "X of ~2,900 content items are imported to DB, Y are CSV-only"

### 4. Generate 404-AUDIT.md

Create `content/inventory/404-AUDIT.md`:
- Scan `src/app/` for all route files
- For each route with `generateStaticParams`, check if it queries from DB
- For routes backed by activities, operators, etc — check if the DB tables exist in schema
- Flag routes that would 404 because:
  - Table doesn't exist in DB schema
  - No import script exists to populate the table
  - Import script exists but is broken/archived
- Include all static fallback pages (e.g., /bouldering, /canoeing, /caving, /climbing, /coasteering, /hiking, /mtb, etc.)

### 5. Restructure Content Directory

```
content/
  inventory/                    ← NEW
    MASTER-INVENTORY.csv
    IMPORT-GAP-REPORT.md
    404-AUDIT.md
    CONTENT-STATUS-README.md    ← explain the system
  activities.csv
  operators.csv
  locations.csv
  commercial-partners.csv
  accommodation.csv             ← merged master
  transport/
    buses.csv
    trains.csv
  mtb/                          ← ONE authoritative copy
    centres.csv
    trails.csv
    routes.csv
  events.csv
  food/
    cafes.csv
    pubs.csv
  info/
    webcams.csv
    wildlife.csv
  images/                       ← Keep all regional CSVs
  spots/                        ← Activity-specific spots
    hiking/
    surfing/
    beaches/
    climbing/
    swimming/
    wild-swimming/
    coasteering/
```

Delete: duplicate mtb/ dirs, any empty CSVs, scripts/archive/ import artifacts that reference old paths.

### 6. Write CONTENT-STATUS-README.md

In `content/inventory/CONTENT-STATUS-README.md`, document:
- How the content pipeline works (CSV → validate → import → DB → live)
- What each content type contains and its current status
- What's needed next to get content live (import scripts, DB seeding, etc.)
- How agents should add content to this system

## Rules
- Do NOT modify any `src/` files
- Do NOT modify DB schema
- Content reorganization only
- All changes must be committed logically grouped
- Push branch and create PR titled "goal-1: content audit and organization"
