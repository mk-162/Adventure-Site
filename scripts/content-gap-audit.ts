/**
 * Content Gap Audit
 * 
 * Scans the database and file system to find all empty content stubs,
 * thin pages, missing images, and content that needs enrichment.
 * 
 * Outputs a machine-readable JSON + human-readable markdown report.
 * 
 * Usage: npx tsx scripts/content-gap-audit.ts
 */

import { neon } from "@neondatabase/serverless";
import { writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL or POSTGRES_URL not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

interface GapItem {
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  page: string;
  slug: string;
  issue: string;
  fix: string;
  autoFixable: boolean;
}

async function audit(): Promise<GapItem[]> {
  const gaps: GapItem[] = [];

  console.log("🔍 Starting content gap audit...\n");

  // 1. Activity types with no activities
  console.log("1️⃣ Checking activity types...");
  const emptyTypes = await sql`
    SELECT at.name, at.slug, COUNT(a.id) as activity_count
    FROM activity_types at
    LEFT JOIN activities a ON a.activity_type_id = at.id
    GROUP BY at.id, at.name, at.slug
    HAVING COUNT(a.id) = 0
  `;
  for (const t of emptyTypes) {
    gaps.push({
      category: "Activity Types",
      severity: "high",
      page: `/activities?type=${t.slug}`,
      slug: t.slug,
      issue: `Activity type "${t.name}" has 0 activities`,
      fix: "Seed activities for this type or remove type",
      autoFixable: true,
    });
  }
  console.log(`   Found ${emptyTypes.length} empty activity types`);

  // 2. Activities with thin descriptions
  console.log("2️⃣ Checking activity descriptions...");
  const thinActivities = await sql`
    SELECT name, slug, COALESCE(LENGTH(description), 0) as desc_length
    FROM activities
    WHERE description IS NULL OR LENGTH(description) < 100
    ORDER BY desc_length ASC
  `;
  for (const a of thinActivities) {
    gaps.push({
      category: "Activities",
      severity: a.desc_length === 0 ? "critical" : "medium",
      page: `/activities/${a.slug}`,
      slug: a.slug,
      issue: `Activity "${a.name}" has ${a.desc_length} char description (min 100)`,
      fix: "Generate or write a proper description",
      autoFixable: true,
    });
  }
  console.log(`   Found ${thinActivities.length} thin activity descriptions`);

  // 3. Operators with missing data
  console.log("3️⃣ Checking operator data quality...");
  const operatorGaps = await sql`
    SELECT name, slug,
      description IS NULL OR LENGTH(description) < 50 as missing_desc,
      cover_image IS NULL as missing_image,
      logo_url IS NULL as missing_logo,
      lat IS NULL OR lng IS NULL as missing_coords,
      website IS NULL as missing_website,
      phone IS NULL as missing_phone,
      email IS NULL as missing_email,
      google_rating IS NULL as missing_rating
    FROM operators
    ORDER BY name
  `;
  for (const op of operatorGaps) {
    const issues: string[] = [];
    if (op.missing_desc) issues.push("no description");
    if (op.missing_image) issues.push("no cover image");
    if (op.missing_logo) issues.push("no logo");
    if (op.missing_coords) issues.push("no coordinates");
    if (op.missing_website) issues.push("no website");
    if (op.missing_phone) issues.push("no phone");
    if (op.missing_email) issues.push("no email");
    if (op.missing_rating) issues.push("no Google rating");

    if (issues.length > 0) {
      gaps.push({
        category: "Operators",
        severity: issues.length >= 4 ? "critical" : issues.length >= 2 ? "high" : "medium",
        page: `/directory/${op.slug}`,
        slug: op.slug,
        issue: `Operator "${op.name}" missing: ${issues.join(", ")}`,
        fix: `Fill ${issues.length} missing fields`,
        autoFixable: issues.includes("no Google rating") || issues.includes("no coordinates"),
      });
    }
  }
  const criticalOps = gaps.filter(g => g.category === "Operators" && g.severity === "critical").length;
  console.log(`   Found ${gaps.filter(g => g.category === "Operators").length} operators with gaps (${criticalOps} critical)`);

  // 4. Regions with missing hero images
  console.log("4️⃣ Checking region hero images...");
  const regionGaps = await sql`
    SELECT name, slug,
      hero_image IS NULL as missing_hero,
      description IS NULL OR LENGTH(description) < 100 as thin_desc
    FROM regions
    ORDER BY name
  `;
  for (const r of regionGaps) {
    if (r.missing_hero) {
      gaps.push({
        category: "Regions",
        severity: "high",
        page: `/${r.slug}`,
        slug: r.slug,
        issue: `Region "${r.name}" missing hero image`,
        fix: "Source a quality Welsh landscape photo",
        autoFixable: false,
      });
    }
    if (r.thin_desc) {
      gaps.push({
        category: "Regions",
        severity: "medium",
        page: `/${r.slug}`,
        slug: r.slug,
        issue: `Region "${r.name}" has thin description`,
        fix: "Write 200+ word region overview",
        autoFixable: true,
      });
    }
  }

  // 5. Events with missing images
  console.log("5️⃣ Checking events...");
  const eventGaps = await sql`
    SELECT name, slug,
      hero_image IS NULL as missing_image,
      description IS NULL OR LENGTH(description) < 50 as thin_desc,
      ticket_url IS NULL as missing_ticket
    FROM events
    ORDER BY name
  `;
  for (const e of eventGaps) {
    if (e.missing_image) {
      gaps.push({
        category: "Events",
        severity: "medium",
        page: `/events/${e.slug}`,
        slug: e.slug,
        issue: `Event "${e.name}" missing image`,
        fix: "Source event image from operator or generate",
        autoFixable: false,
      });
    }
    if (e.thin_desc) {
      gaps.push({
        category: "Events",
        severity: "low",
        page: `/events/${e.slug}`,
        slug: e.slug,
        issue: `Event "${e.name}" has thin description`,
        fix: "Write proper event description",
        autoFixable: true,
      });
    }
  }

  // 6. Journal posts with missing images
  console.log("6️⃣ Checking journal posts...");
  const journalGaps = await sql`
    SELECT title, slug,
      hero_image IS NULL as missing_hero,
      COALESCE(LENGTH(content), 0) as content_length
    FROM posts
    WHERE status = 'published'
    ORDER BY title
  `;
  for (const j of journalGaps) {
    if (j.missing_hero) {
      gaps.push({
        category: "Journal",
        severity: "medium",
        page: `/journal/${j.slug}`,
        slug: j.slug,
        issue: `Journal "${j.title}" missing hero image`,
        fix: "Source or generate article hero image",
        autoFixable: false,
      });
    }
    if (j.content_length < 300) {
      gaps.push({
        category: "Journal",
        severity: "high",
        page: `/journal/${j.slug}`,
        slug: j.slug,
        issue: `Journal "${j.title}" has only ${j.content_length} chars content`,
        fix: "Write or generate proper article content (min 800 words)",
        autoFixable: true,
      });
    }
  }

  // 7. Combo pages — check enrichment data files
  console.log("7️⃣ Checking combo page enrichment...");
  const comboDir = join(process.cwd(), "data", "combo-pages");
  const regions = await sql`SELECT slug FROM regions`;
  const activityTypes = await sql`SELECT slug FROM activity_types`;

  let comboTotal = 0;
  let comboEnriched = 0;

  for (const region of regions) {
    for (const at of activityTypes) {
      comboTotal++;
      const comboFile = join(comboDir, `${region.slug}--${at.slug}.json`);
      if (!existsSync(comboFile)) {
        gaps.push({
          category: "Combo Pages",
          severity: "low",
          page: `/${region.slug}/things-to-do/${at.slug}`,
          slug: `${region.slug}--${at.slug}`,
          issue: `Combo page has no enrichment data file`,
          fix: "Run deep research skill to generate combo content",
          autoFixable: true,
        });
      } else {
        comboEnriched++;
      }
    }
  }
  console.log(`   ${comboEnriched}/${comboTotal} combo pages have enrichment data`);

  // 8. Guide pages with missing content
  console.log("8️⃣ Checking guide pages...");
  const guideGaps = await sql`
    SELECT title, slug, url_path,
      COALESCE(LENGTH(introduction), 0) as intro_length,
      hero_image IS NULL as missing_hero,
      content_status
    FROM guide_pages
    ORDER BY title
  `;
  for (const g of guideGaps) {
    if (g.intro_length < 200) {
      gaps.push({
        category: "Guides",
        severity: "high",
        page: g.url_path || `/guides/${g.slug}`,
        slug: g.slug,
        issue: `Guide "${g.title}" has only ${g.intro_length} char intro (content_status: ${g.content_status})`,
        fix: "Write or generate guide content",
        autoFixable: true,
      });
    }
    if (g.missing_hero) {
      gaps.push({
        category: "Guides",
        severity: "medium",
        page: g.url_path || `/guides/${g.slug}`,
        slug: g.slug,
        issue: `Guide "${g.title}" missing hero image`,
        fix: "Source guide hero image",
        autoFixable: false,
      });
    }
  }

  // 9. Answer/FAQ pages with thin content
  console.log("9️⃣ Checking answer pages...");
  const answerGaps = await sql`
    SELECT question, slug,
      COALESCE(LENGTH(full_content), 0) as content_length
    FROM answers
    WHERE status = 'published'
    ORDER BY question
  `;
  for (const a of answerGaps) {
    if (a.content_length < 200) {
      gaps.push({
        category: "Answers",
        severity: "medium",
        page: `/answers/${a.slug}`,
        slug: a.slug,
        issue: `Answer "${a.question}" has only ${a.content_length} chars`,
        fix: "Expand answer with useful detail",
        autoFixable: true,
      });
    }
  }

  // 10. Itineraries with missing data
  console.log("🔟 Checking itineraries...");
  const itinGaps = await sql`
    SELECT i.title, i.slug,
      i.hero_image IS NULL as missing_hero,
      COALESCE(LENGTH(i.description), 0) as desc_length,
      COUNT(s.id) as stop_count
    FROM itineraries i
    LEFT JOIN itinerary_stops s ON s.itinerary_id = i.id
    GROUP BY i.id, i.title, i.slug, i.hero_image, i.description
    ORDER BY i.title
  `;
  for (const it of itinGaps) {
    if (it.missing_hero) {
      gaps.push({
        category: "Itineraries",
        severity: "medium",
        page: `/itineraries/${it.slug}`,
        slug: it.slug,
        issue: `Itinerary "${it.title}" missing hero image`,
        fix: "Source itinerary hero image",
        autoFixable: false,
      });
    }
    if (it.stop_count < 3) {
      gaps.push({
        category: "Itineraries",
        severity: "high",
        page: `/itineraries/${it.slug}`,
        slug: it.slug,
        issue: `Itinerary "${it.title}" has only ${it.stop_count} stops`,
        fix: "Add more stops to make itinerary useful",
        autoFixable: true,
      });
    }
  }

  return gaps;
}

async function main() {
  const gaps = await audit();

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Stats
  const stats = {
    total: gaps.length,
    critical: gaps.filter(g => g.severity === "critical").length,
    high: gaps.filter(g => g.severity === "high").length,
    medium: gaps.filter(g => g.severity === "medium").length,
    low: gaps.filter(g => g.severity === "low").length,
    autoFixable: gaps.filter(g => g.autoFixable).length,
    byCategory: {} as Record<string, number>,
  };
  for (const g of gaps) {
    stats.byCategory[g.category] = (stats.byCategory[g.category] || 0) + 1;
  }

  // Write JSON
  const jsonOutput = { generatedAt: new Date().toISOString(), stats, gaps };
  writeFileSync("content/content-gap-audit.json", JSON.stringify(jsonOutput, null, 2));
  console.log("\n📄 Written: content/content-gap-audit.json");

  // Write Markdown
  let md = `# Content Gap Audit Report\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;
  md += `## Summary\n\n`;
  md += `| Severity | Count |\n|----------|-------|\n`;
  md += `| 🔴 Critical | ${stats.critical} |\n`;
  md += `| 🟠 High | ${stats.high} |\n`;
  md += `| 🟡 Medium | ${stats.medium} |\n`;
  md += `| 🟢 Low | ${stats.low} |\n`;
  md += `| **Total** | **${stats.total}** |\n`;
  md += `| Auto-fixable | ${stats.autoFixable} |\n\n`;
  md += `## By Category\n\n`;
  md += `| Category | Gaps |\n|----------|------|\n`;
  for (const [cat, count] of Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])) {
    md += `| ${cat} | ${count} |\n`;
  }
  md += `\n`;

  // Group by category
  const byCategory: Record<string, GapItem[]> = {};
  for (const g of gaps) {
    if (!byCategory[g.category]) byCategory[g.category] = [];
    byCategory[g.category].push(g);
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    md += `## ${cat}\n\n`;
    const sevEmoji = { critical: "🔴", high: "🟠", medium: "🟡", low: "🟢" };
    for (const item of items) {
      md += `- ${sevEmoji[item.severity]} **${item.issue}**\n`;
      md += `  - Page: \`${item.page}\`\n`;
      md += `  - Fix: ${item.fix}${item.autoFixable ? " *(auto-fixable)*" : ""}\n`;
    }
    md += `\n`;
  }

  writeFileSync("content/content-gap-audit.md", md);
  console.log("📄 Written: content/content-gap-audit.md");

  // Print summary
  console.log(`\n📊 Content Gap Audit Complete`);
  console.log(`   🔴 Critical: ${stats.critical}`);
  console.log(`   🟠 High: ${stats.high}`);
  console.log(`   🟡 Medium: ${stats.medium}`);
  console.log(`   🟢 Low: ${stats.low}`);
  console.log(`   Total: ${stats.total} gaps found`);
  console.log(`   Auto-fixable: ${stats.autoFixable}`);
}

main().catch(console.error);
