# Goal 1: Content Audit & Organization

## Objective
Consolidate, deduplicate, and organize ALL content in the `content/` directory. Build a complete inventory of everything vs what's imported to DB.

## Steps

### Step 1: Deduplicate content files
- `content/mtb/` vs `content/spots/mtb/` duplicate centres.csv, trails.csv, routes.csv
- `content/accommodation.csv` duplicates from 3 sub-files
- `content/operators.csv` vs 7 sub-files
- Merge, keep one authoritative version, delete the other

### Step 2: Build MASTER-INVENTORY.csv
Create `content/inventory/MASTER-INVENTORY.csv`:
- Programmatically read ALL CSVs in content/
- Columns: id,type,name,slug,region,source_file,data_completeness,status,notes
- id = hash of type+slug, data_completeness = non-empty columns / total
- Every row = one content item

### Step 3: Import Gap Report
Create `content/inventory/IMPORT-GAP-REPORT.md`:
- Cross-reference schema tables (src/db/schema.ts) vs CSV counts
- Show what's in DB vs CSV-only
- Flag schema mismatches

### Step 4: 404/Dead Route Audit
Create `content/inventory/DEAD-ROUTES-AUDIT.md`:
- Scan src/app/ for routes with generateStaticParams
- Flag pages backed by empty tables or missing content
- Static-only pages risk assessment

### Step 5: Restructure content
Clean directory structure:
```
content/
  inventory/          ← NEW
    MASTER-INVENTORY.csv
    IMPORT-GAP-REPORT.md
    DEAD-ROUTES-AUDIT.md
  activities.csv
  operators.csv
  locations.csv
  accommodation.csv    ← merged
  transport/
    buses.csv
    trains.csv
  mtb/                 ← ONE copy
    centres.csv
    trails.csv
    routes.csv
  events.csv
  food/
    cafes.csv
    pubs.csv
  info/
  images/
  spots/               ← no mtb dir
```

## Success Criteria
- All duplicates eliminated
- MASTER-INVENTORY.csv exists with all ~2,900+ items
- Import gap and 404 audits complete
- Content directory clean and organized
- NO changes to src/ files
- PR branch: goal/content-audit
