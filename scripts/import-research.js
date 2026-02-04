#!/usr/bin/env node
/**
 * Import tier1 and tier2 research data into Adventure Wales DB.
 * Updates operators and creates new activities.
 */

const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

// Activity type slug aliases (research slug -> DB slug)
const ACTIVITY_TYPE_ALIASES = {
  'mtb': 'mountain-biking',
  'mountain-bike': 'mountain-biking',
  'paddleboarding': 'sup',
  'stand-up-paddleboarding': 'sup',
  'rock-climbing': 'climbing',
  'walking': 'hiking',
  'trekking': 'hiking',
  'hill-walking': 'hiking',
  'white-water-rafting': 'kayaking',
  'rafting': 'kayaking',
  'canoe': 'kayaking',
  'canoeing': 'kayaking',
  'abseiling': 'climbing',
  'sailing': 'sea-kayaking',
  'windsurfing': 'surfing',
  'kitesurfing': 'surfing',
  'bodyboarding': 'surfing',
  'horse-riding': null, // no match
  'paragliding': null,
  'archery': null,
  'bushcraft': null,
  'adventure-park': null,
  'mine-exploration': 'caving',
};

async function main() {
  const stats = {
    operatorsUpdated: 0,
    operatorsSkipped: 0,
    operatorErrors: [],
    activitiesCreated: 0,
    activitiesSkipped: 0,
    activityErrors: [],
    missingRegions: new Set(),
    missingActivityTypes: new Set(),
    descriptionUpdates: 0,
  };

  // Load research data
  const tier1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/research/tier1-1.json'), 'utf8'));
  const tier2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/research/tier2-1.json'), 'utf8'));

  const allOperators = [...tier1.operators, ...tier2.operators];
  const allActivities = [...(tier1.activities || []), ...(tier2.activities || [])];

  console.log(`Loaded ${tier1.operators.length} tier1 operators, ${tier2.operators.length} tier2 operators`);
  console.log(`Loaded ${(tier1.activities || []).length} tier1 activities, ${(tier2.activities || []).length} tier2 activities`);
  console.log(`Total: ${allOperators.length} operators, ${allActivities.length} activities\n`);

  // Load lookup tables
  const regionsResult = await sql.query('SELECT id, slug FROM regions ORDER BY id');
  const regionMap = {};
  for (const r of regionsResult.rows) {
    regionMap[r.slug] = r.id;
  }
  console.log(`Regions in DB: ${Object.keys(regionMap).join(', ')}`);

  // Use the higher IDs (19-36) since existing activities reference those
  const actTypesResult = await sql.query('SELECT id, slug FROM activity_types WHERE id >= 19 ORDER BY id');
  const actTypeMap = {};
  for (const r of actTypesResult.rows) {
    actTypeMap[r.slug] = r.id;
  }
  console.log(`Activity types in DB (id>=19): ${Object.keys(actTypeMap).join(', ')}\n`);

  // Load existing operators
  const existingOps = await sql.query('SELECT id, slug, description FROM operators WHERE site_id = 1');
  const operatorMap = {};
  for (const op of existingOps.rows) {
    operatorMap[op.slug] = { id: op.id, description: op.description };
  }
  console.log(`Existing operators: ${existingOps.rows.length}\n`);

  // Load existing activities (by slug)
  const existingActs = await sql.query('SELECT slug FROM activities WHERE site_id = 1');
  const existingActivitySlugs = new Set(existingActs.rows.map(a => a.slug));
  console.log(`Existing activities: ${existingActs.rows.length}\n`);

  // ========== 1. Update Operators ==========
  console.log('=== UPDATING OPERATORS ===\n');

  for (const op of allOperators) {
    const existing = operatorMap[op.slug];
    if (!existing) {
      console.log(`  SKIP: Operator "${op.slug}" not found in DB`);
      stats.operatorsSkipped++;
      continue;
    }

    // Check if description should be updated
    const shouldUpdateDesc = !existing.description || existing.description.length < 50;
    const descValue = shouldUpdateDesc ? op.description : undefined;

    try {
      if (shouldUpdateDesc && op.description) {
        stats.descriptionUpdates++;
        await sql.query(
          `UPDATE operators SET
            lat = $1, lng = $2, description = $3, tagline = $4,
            google_rating = $5, review_count = $6, tripadvisor_url = $7,
            price_range = $8, unique_selling_point = $9,
            trust_signals = $10, service_types = $11,
            regions = $12, activity_types = $13,
            updated_at = NOW()
          WHERE slug = $14 AND site_id = 1`,
          [
            op.lat, op.lng, op.description, op.tagline,
            op.googleRating, op.reviewCount, op.tripadvisorUrl,
            op.priceRange, op.uniqueSellingPoint,
            JSON.stringify(op.trustSignals || {}),
            op.serviceTypes || [],
            op.regions || [],
            op.activityTypes || [],
            op.slug
          ]
        );
      } else {
        await sql.query(
          `UPDATE operators SET
            lat = $1, lng = $2, tagline = $3,
            google_rating = $4, review_count = $5, tripadvisor_url = $6,
            price_range = $7, unique_selling_point = $8,
            trust_signals = $9, service_types = $10,
            regions = $11, activity_types = $12,
            updated_at = NOW()
          WHERE slug = $13 AND site_id = 1`,
          [
            op.lat, op.lng, op.tagline,
            op.googleRating, op.reviewCount, op.tripadvisorUrl,
            op.priceRange, op.uniqueSellingPoint,
            JSON.stringify(op.trustSignals || {}),
            op.serviceTypes || [],
            op.regions || [],
            op.activityTypes || [],
            op.slug
          ]
        );
      }
      stats.operatorsUpdated++;
      console.log(`  ✓ Updated: ${op.slug}${shouldUpdateDesc ? ' (+ description)' : ''}`);
    } catch (err) {
      stats.operatorErrors.push({ slug: op.slug, error: err.message });
      console.log(`  ✗ ERROR updating ${op.slug}: ${err.message}`);
    }
  }

  // ========== 2. Import Activities ==========
  console.log('\n=== IMPORTING ACTIVITIES ===\n');

  // Helper to resolve activity type slug
  function resolveActivityTypeId(slug) {
    if (!slug) return null;
    if (actTypeMap[slug]) return actTypeMap[slug];
    // Try alias
    const alias = ACTIVITY_TYPE_ALIASES[slug];
    if (alias && actTypeMap[alias]) return actTypeMap[alias];
    return null;
  }

  for (const act of allActivities) {
    // Skip if already exists
    if (existingActivitySlugs.has(act.slug)) {
      stats.activitiesSkipped++;
      console.log(`  SKIP (exists): ${act.slug}`);
      continue;
    }

    // Look up operator
    const opEntry = operatorMap[act.operatorSlug];
    if (!opEntry) {
      stats.activityErrors.push({ slug: act.slug, error: `Operator "${act.operatorSlug}" not found` });
      console.log(`  ✗ ERROR: Operator "${act.operatorSlug}" not found for activity "${act.slug}"`);
      continue;
    }

    // Look up region
    let regionId = null;
    if (act.region) {
      regionId = regionMap[act.region] || null;
      if (!regionId) {
        stats.missingRegions.add(act.region);
        console.log(`  ⚠ Region "${act.region}" not found, setting NULL`);
      }
    }

    // Look up activity type
    let activityTypeId = null;
    if (act.activityType) {
      activityTypeId = resolveActivityTypeId(act.activityType);
      if (!activityTypeId) {
        stats.missingActivityTypes.add(act.activityType);
        console.log(`  ⚠ Activity type "${act.activityType}" not found, setting NULL`);
      }
    }

    try {
      await sql.query(
        `INSERT INTO activities (
          site_id, operator_id, region_id, activity_type_id,
          name, slug, description,
          price_from, price_to, duration, difficulty,
          min_age, season, booking_url, status,
          created_at, updated_at
        ) VALUES (
          1, $1, $2, $3,
          $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, 'published',
          NOW(), NOW()
        )`,
        [
          opEntry.id, regionId, activityTypeId,
          act.name, act.slug, act.description,
          act.priceFrom || null, act.priceTo || null,
          act.duration || null, act.difficulty || null,
          act.minAge || null, act.season || null,
          act.bookingUrl || null
        ]
      );
      stats.activitiesCreated++;
      existingActivitySlugs.add(act.slug); // prevent duplicates within same run
      console.log(`  ✓ Created: ${act.slug}`);
    } catch (err) {
      stats.activityErrors.push({ slug: act.slug, error: err.message });
      console.log(`  ✗ ERROR creating ${act.slug}: ${err.message}`);
    }
  }

  // ========== 3. Verification ==========
  console.log('\n=== VERIFICATION ===\n');

  const coordCount = await sql.query('SELECT COUNT(*) as c FROM operators WHERE site_id = 1 AND lat IS NOT NULL AND lng IS NOT NULL');
  const descCount = await sql.query("SELECT COUNT(*) as c FROM operators WHERE site_id = 1 AND description IS NOT NULL AND LENGTH(description) > 50");
  const totalActivities = await sql.query('SELECT COUNT(*) as c FROM activities WHERE site_id = 1');
  const totalOperators = await sql.query('SELECT COUNT(*) as c FROM operators WHERE site_id = 1');

  console.log('--- Summary ---');
  console.log(`Operators updated: ${stats.operatorsUpdated}`);
  console.log(`Operators skipped (not in DB): ${stats.operatorsSkipped}`);
  console.log(`Operator errors: ${stats.operatorErrors.length}`);
  if (stats.operatorErrors.length > 0) {
    for (const e of stats.operatorErrors) console.log(`  - ${e.slug}: ${e.error}`);
  }
  console.log(`Description updates: ${stats.descriptionUpdates}`);
  console.log();
  console.log(`Activities created: ${stats.activitiesCreated}`);
  console.log(`Activities skipped (already existed): ${stats.activitiesSkipped}`);
  console.log(`Activity errors: ${stats.activityErrors.length}`);
  if (stats.activityErrors.length > 0) {
    for (const e of stats.activityErrors) console.log(`  - ${e.slug}: ${e.error}`);
  }
  console.log();
  console.log(`Missing regions: ${stats.missingRegions.size > 0 ? [...stats.missingRegions].join(', ') : 'none'}`);
  console.log(`Missing activity types: ${stats.missingActivityTypes.size > 0 ? [...stats.missingActivityTypes].join(', ') : 'none'}`);
  console.log();
  console.log(`Total operators in DB: ${totalOperators.rows[0].c}`);
  console.log(`Operators with lat/lng: ${coordCount.rows[0].c}`);
  console.log(`Operators with description > 50 chars: ${descCount.rows[0].c}`);
  console.log(`Total activities in DB: ${totalActivities.rows[0].c}`);

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
