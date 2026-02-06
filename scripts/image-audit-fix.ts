/**
 * Image Audit & Fix Script
 * 
 * This script audits activity images and identifies mismatches.
 * Run with: npx tsx scripts/image-audit-fix.ts
 * 
 * Workflow:
 * 1. Fetch all activities with their current images
 * 2. For each, check if image matches activity type
 * 3. Flag mismatches for manual review or auto-fix
 */

import { db } from "../src/db";
import { activities, activityTypes, regions, operators } from "../src/db/schema";
import { eq, isNotNull, sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// Image validation rules - what should each activity type look like?
const IMAGE_EXPECTATIONS: Record<string, {
  mustContain: string[];  // Keywords that should be in a valid image
  mustNotContain: string[];  // Keywords that indicate wrong image
  validBackgrounds: string[];  // Acceptable landscape types
}> = {
  "mountain-biking": {
    mustContain: ["bike", "trail", "forest", "mountain"],
    mustNotContain: ["desert", "beach", "snow ski", "usa", "american"],
    validBackgrounds: ["forest", "mountain", "trail", "dirt", "green hills"],
  },
  "coasteering": {
    mustContain: ["cliff", "sea", "rocks", "coast", "water"],
    mustNotContain: ["desert", "mountain peak", "snow"],
    validBackgrounds: ["coastline", "cliffs", "sea", "rocks"],
  },
  "white-water-rafting": {
    mustContain: ["river", "rapids", "water", "raft", "boat"],
    mustNotContain: ["grass field", "mountain only", "desert"],
    validBackgrounds: ["river", "rapids", "gorge", "white water"],
  },
  "hiking": {
    mustContain: ["mountain", "trail", "path", "hills", "walking"],
    mustNotContain: ["desert usa", "grand canyon", "american"],
    validBackgrounds: ["mountain", "moorland", "green hills", "coast path"],
  },
  "caving": {
    mustContain: ["cave", "underground", "dark", "rock"],
    mustNotContain: ["outdoor sunny", "beach", "mountain top"],
    validBackgrounds: ["cave interior", "rock formations", "underground"],
  },
  "surfing": {
    mustContain: ["wave", "surf", "beach", "ocean"],
    mustNotContain: ["tropical palm", "hawaii", "california"],
    validBackgrounds: ["beach", "waves", "coastline"],
  },
  "kayaking": {
    mustContain: ["kayak", "paddle", "water", "river", "sea"],
    mustNotContain: ["desert", "mountain top"],
    validBackgrounds: ["river", "sea", "lake", "estuary"],
  },
  "climbing": {
    mustContain: ["rock", "cliff", "climb", "rope"],
    mustNotContain: ["desert rock usa", "red rock"],
    validBackgrounds: ["rock face", "cliff", "crag", "indoor wall"],
  },
};

// Check what local images exist
function getLocalImages(): Set<string> {
  const imagesDir = path.join(process.cwd(), "public/images/activities");
  if (!fs.existsSync(imagesDir)) return new Set();
  
  const files = fs.readdirSync(imagesDir);
  return new Set(files.filter(f => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp")));
}

// Main audit function
async function auditImages() {
  console.log("🔍 Starting image audit...\n");
  
  const localImages = getLocalImages();
  console.log(`📁 Found ${localImages.size} local activity images\n`);
  
  // Get all activities with their types
  const results = await db
    .select({
      activity: activities,
      activityType: activityTypes,
      region: regions,
      operator: operators,
    })
    .from(activities)
    .leftJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .leftJoin(regions, eq(activities.regionId, regions.id))
    .leftJoin(operators, eq(activities.operatorId, operators.id))
    .where(eq(activities.status, "published"));

  console.log(`📊 Auditing ${results.length} published activities\n`);
  
  const issues: Array<{
    activityId: number;
    activityName: string;
    activitySlug: string;
    activityType: string | null;
    region: string | null;
    currentImage: string | null;
    issue: string;
    suggestion: string;
  }> = [];

  for (const row of results) {
    const { activity, activityType, region } = row;
    const typeSlug = activityType?.slug;
    
    // Check 1: Activity has no hero image
    if (!activity.heroImage) {
      // Check if there's a fallback available
      const fallbackExists = typeSlug && localImages.has(`${typeSlug}-hero.jpg`);
      
      if (!fallbackExists) {
        issues.push({
          activityId: activity.id,
          activityName: activity.name,
          activitySlug: activity.slug,
          activityType: typeSlug || null,
          region: region?.name || null,
          currentImage: null,
          issue: "NO_IMAGE",
          suggestion: typeSlug 
            ? `Source image for "${typeSlug}" activity in ${region?.name || 'Wales'}`
            : "Determine activity type first, then source image",
        });
      }
    }
    
    // Check 2: Image is external URL (might be wrong stock photo)
    if (activity.heroImage && activity.heroImage.startsWith("http")) {
      // Flag external images for manual review
      issues.push({
        activityId: activity.id,
        activityName: activity.name,
        activitySlug: activity.slug,
        activityType: typeSlug || null,
        region: region?.name || null,
        currentImage: activity.heroImage,
        issue: "EXTERNAL_URL",
        suggestion: "Review external image - may be generic stock photo. Consider sourcing Welsh-specific image.",
      });
    }
  }
  
  // Summary
  console.log("=" .repeat(60));
  console.log("📋 AUDIT SUMMARY");
  console.log("=" .repeat(60));
  console.log(`Total activities: ${results.length}`);
  console.log(`Issues found: ${issues.length}`);
  console.log(`  - No image: ${issues.filter(i => i.issue === "NO_IMAGE").length}`);
  console.log(`  - External URL (needs review): ${issues.filter(i => i.issue === "EXTERNAL_URL").length}`);
  console.log();
  
  // Output issues as JSON for processing
  const outputPath = path.join(process.cwd(), "scripts/image-issues.json");
  fs.writeFileSync(outputPath, JSON.stringify(issues, null, 2));
  console.log(`📄 Issues written to: ${outputPath}`);
  
  // Group by activity type for easier fixing
  const byType: Record<string, typeof issues> = {};
  for (const issue of issues) {
    const key = issue.activityType || "unknown";
    if (!byType[key]) byType[key] = [];
    byType[key].push(issue);
  }
  
  console.log("\n📊 Issues by activity type:");
  for (const [type, typeIssues] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${type}: ${typeIssues.length}`);
  }
  
  return issues;
}

// Run audit
auditImages().catch(console.error);
