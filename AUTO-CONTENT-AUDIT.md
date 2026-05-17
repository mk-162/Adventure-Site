# Adventure Wales Content Pipeline — Claude Code Goals

## Project Context

This is mk-162/Adventure-Site, a Next.js 16 site for "Adventure Wales" — an honest guide to Welsh outdoor adventures. The site is deployed to Vercel. It uses PostgreSQL (Neon) via Drizzle ORM.

**Current state:**
- ~2,900 content items exist as CSVs in `content/` directory
- Only activities and operators are partially imported to DB
- Accommodation, events, transport, food, MTB spots, image references, info — all CSV-only
- Content is organized across 7 regions: Snowdonia, Pembrokeshire, Brecon Beacons, Anglesey, Mid Wales, Llŷn Peninsula, Gower
- 20 activity types: coasteering (12), surfing (9), MTB (7), SUP (6), etc.
- Site has ~1,693 static pages generated on build

**Architecture:**
- Pages: `src/app/activities/[slug]/page.tsx` (dynamic from DB)
- Combo pages: `src/app/[region]/[subpage]/page.tsx` (region + activity type combos)
- Static route pages exist for every activity type (e.g., `/bouldering`, `/canoeing`)
- DB schema: `src/db/schema.ts` or `drizzle/schema.ts` (tables: activities, operators, activityTypes, regions, locations, accommodation, events, transport, food, etc.)
- Import scripts archived in `scripts/archive/` (one-shot, no validation)

**Quality bar:**
- `npm run build` must pass (typecheck + lint + production build)
- No 404 pages for routes that render with no content
- No duplicate content files (e.g., mtb/centres.csv exists in both `content/mtb/` and `content/spots/mtb/`)
- CSV content must match DB schema columns

## Goal 1: Content Inventory & Organization (Agent 1)

Consolidate all CSVs, eliminate duplicates, create the master inventory, and restructure the content directory.

### Tasks:

1. **Deduplicate content files:**
   - `content/mtb/` duplicates: centres.csv, trails.csv, routes.csv exist in both `content/mtb/` and `content/spots/mtb/` — compare, merge, keep one authoritative version
   - `content/accommodation.csv` duplicates entries from sub-files (hostels, campsites, glamping) — merge into one master file, delete sub-files if duplicates
   - Check `content/operators.csv` vs sub-files (`content/operators/surf.csv`, `coasteering.csv`, etc.) — consolidate into one or keep sub-organization consistently

2. **Create `content/inventory/MASTER-INVENTORY.csv`:**
   - Consolidate ALL content items from EVERY CSV into ONE master file
   - Columns: `id,region,content_type,name,slug,status,source_file,data_completeness,seo_quality,import_status,created_at,notes`
   - `id` = unique UUID or hash of (region + content_type + slug)
   - `content_type` = one of: activity, operator, accommodation, event, transport, spot, food, info, image, partner
   - `status` = researched (raw data), drafted, reviewed, imported, published, needs-update
   - `source_file` = which CSV it came from
   - `data_completeness` = percentage of columns filled (0-100)
   - Generate this programmatically from all CSVs

3. **Create `content/inventory/IMPORT-GAP-REPORT.md`:**
   - Compare DB schema tables to CSV content
   - List every table in the schema and how many rows each has
   - Cross-reference with CSV counts
   - Show import status per content category
   - Identify missing content (DB rows with no CSV source, CSV items not imported)

4. **Create `content/inventory/404-AUDIT.md`:**
   - List all pages in the app route hierarchy
   - For each page, check if it's backed by DB content or is static-only
   - Flag pages that would 404 or render as empty/thin
   - Include: activities (all slugs in DB), operators (all slugs in DB), regions (all defined), combo pages, static routes
   - Cross-reference with DB data to find route→content mismatches

5. **Restructure content directory:**
   ```
   content/
     inventory/                    # NEW: Master index and reports
       MASTER-INVENTORY.csv
       IMPORT-GAP-REPORT.md
       404-AUDIT.md
       CONTENT-QUALITY-RULES.md     # NEW: Editorial guidelines
     activities/                    # Keep existing master CSV
       operators.csv                # Keep existing (consolidated)
       locations.csv                # Keep existing
       transport/                   # Keep existing
         buses.csv
         trains.csv
       accommodation/               # Merged master
       events/                      # Merged master
       mtb/                         # ONE authoritative copy
         centres.csv
         trails.csv
         routes.csv
       spots/                       # Keep existing (remove duplicate mtb)
       food/                        # Keep existing (cafes + pubs)
       info/                        # Keep existing
     plans/                         # NEW: Future expansion plans
   ```

### Deliverables:
- [ ] Deduplicated content directory
- [ ] MASTER-INVENTORY.csv with all ~2,900 items
- [ ] IMPORT-GAP-REPORT.md
- [ ] 404-AUDIT.md
- [ ] Content directory restructured and cleaned
- [ ] All changes committed
- [ ] NO changes to src/ files (content-only work)
