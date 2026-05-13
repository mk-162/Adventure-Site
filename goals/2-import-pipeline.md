# Goal 2: Import Pipeline & Dead Route Fixes

## Objective
Build the import infrastructure, fix dead/404 routes, and get all CSV content into the database.

## Steps

### Step 1: Import Pipeline
- Fix all archived import scripts in scripts/archive/
- Create reusable importer: scripts/import-all.ts
  - Reads CSV → validates schema → inserts to DB
  - Handles upserts (don't duplicate on re-run)
  - Skips empty/incomplete rows
  - Reports success/failure per row
- Pipeline order: activities → operators → locations → accommodation → events → transport → food

### Step 2: Fix Dead/404 Routes
- In src/app/:
  - For every activity page that would 404: add graceful handling (redirect to activity hub)
  - For [region]/[subpage]: return 404 when no DB content exists (not empty page)
  - For combo pages (activity type × region): validate content exists before rendering
  - Add `/activities` hub page with all activity types
  - Add `/regions` overview page

### Step 3: Static Route Pages
- /bouldering, /canoeing, /caving, /climbing, /coasteering, /hiking, /mtb, /sailing, /seafari, /stag, /surfing, /wild-swimming
- Each should show content from DB OR gracefully say "no activities in this category yet" with fallback CTA
- No blank pages

### Step 4: Import & Verify
- Run the import pipeline for all content categories
- Verify each category: `npm run build` passes, static pages generate correctly
- Run tests: `npm run test`

## Success Criteria
- Import pipeline works (can run: `npx tsx scripts/import-all.ts`)
- No dead/404 routes
- All CSV content imported to DB
- Build passes with content showing in pages
- PR branch: goal/import-pipeline
