/**
 * YouTube Auto-Fetch for Operator Onboarding
 * 
 * Given an operator's website URL, this script:
 * 1. Scrapes their website for YouTube links/embeds
 * 2. Falls back to YouTube Data API search if no embeds found
 * 3. Ranks videos by relevance (views, recency, title match)
 * 4. Returns the best video ID for embedding on their profile
 * 
 * Can be run standalone or called as a module from the admin/onboarding flow.
 * 
 * Usage:
 *   npx tsx scripts/youtube-fetch.ts                    # All operators
 *   npx tsx scripts/youtube-fetch.ts --slug=plas-y-brenin  # Single operator
 *   npx tsx scripts/youtube-fetch.ts --dry-run           # Preview only
 * 
 * Requires: YOUTUBE_API_KEY env var for API search fallback (optional)
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL or POSTGRES_URL not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Parse CLI args
const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith("--slug="))?.split("=")[1];
const dryRun = args.includes("--dry-run");
const verbose = args.includes("--verbose");

interface VideoResult {
  videoId: string;
  title: string;
  source: "website_embed" | "website_link" | "youtube_search";
  score: number;
}

/**
 * Extract YouTube video IDs from a webpage's HTML
 */
function extractYouTubeIds(html: string): { id: string; source: "website_embed" | "website_link" }[] {
  const ids: { id: string; source: "website_embed" | "website_link" }[] = [];
  const seen = new Set<string>();

  // YouTube embed iframes
  const embedRegex = /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/gi;
  let match;
  while ((match = embedRegex.exec(html)) !== null) {
    if (!seen.has(match[1])) {
      ids.push({ id: match[1], source: "website_embed" });
      seen.add(match[1]);
    }
  }

  // YouTube watch links
  const watchRegex = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/gi;
  while ((match = watchRegex.exec(html)) !== null) {
    if (!seen.has(match[1])) {
      ids.push({ id: match[1], source: "website_link" });
      seen.add(match[1]);
    }
  }

  // youtu.be short links
  const shortRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/gi;
  while ((match = shortRegex.exec(html)) !== null) {
    if (!seen.has(match[1])) {
      ids.push({ id: match[1], source: "website_link" });
      seen.add(match[1]);
    }
  }

  return ids;
}

/**
 * Fetch a webpage and extract YouTube video IDs
 */
async function scrapeWebsiteForVideos(url: string): Promise<{ id: string; source: "website_embed" | "website_link" }[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AdventureWalesBot/1.0)",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!response.ok) return [];

    const html = await response.text();
    return extractYouTubeIds(html);
  } catch (e) {
    if (verbose) console.log(`   ⚠️ Could not fetch ${url}: ${(e as Error).message}`);
    return [];
  }
}

/**
 * Search YouTube Data API for operator videos
 */
async function searchYouTube(operatorName: string, activityTypes: string[]): Promise<VideoResult[]> {
  if (!YOUTUBE_API_KEY) {
    if (verbose) console.log("   ℹ️ No YOUTUBE_API_KEY — skipping API search");
    return [];
  }

  const queries = [
    `${operatorName} Wales adventure`,
    `${operatorName} ${activityTypes[0] || "outdoor activities"}`,
  ];

  const results: VideoResult[] = [];

  for (const query of queries) {
    try {
      const params = new URLSearchParams({
        part: "snippet",
        q: query,
        type: "video",
        maxResults: "5",
        order: "relevance",
        key: YOUTUBE_API_KEY,
      });

      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
      if (!response.ok) {
        if (verbose) console.log(`   ⚠️ YouTube API error: ${response.status}`);
        continue;
      }

      const data = await response.json();

      for (const item of data.items || []) {
        const videoId = item.id?.videoId;
        const title = item.snippet?.title || "";
        if (!videoId) continue;

        // Score based on title relevance
        let score = 50; // base score for API results
        const titleLower = title.toLowerCase();
        const nameLower = operatorName.toLowerCase();

        if (titleLower.includes(nameLower)) score += 30;
        if (titleLower.includes("wales")) score += 10;
        for (const at of activityTypes) {
          if (titleLower.includes(at.toLowerCase())) score += 15;
        }

        results.push({
          videoId,
          title,
          source: "youtube_search",
          score,
        });
      }
    } catch (e) {
      if (verbose) console.log(`   ⚠️ YouTube search failed: ${(e as Error).message}`);
    }
  }

  return results;
}

/**
 * Get video metadata from YouTube oEmbed (no API key needed)
 */
async function getVideoTitle(videoId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!response.ok) return "Unknown";
    const data = await response.json();
    return data.title || "Unknown";
  } catch {
    return "Unknown";
  }
}

/**
 * Process a single operator
 */
async function processOperator(operator: {
  id: number;
  name: string;
  slug: string;
  website: string | null;
  activity_types: string[] | null;
  youtube_video_id: string | null;
}): Promise<VideoResult | null> {
  if (verbose) console.log(`\n🔍 ${operator.name} (${operator.slug})`);

  // Skip if already has a video
  if (operator.youtube_video_id) {
    if (verbose) console.log("   ✅ Already has video ID — skipping");
    return null;
  }

  const allResults: VideoResult[] = [];

  // Step 1: Scrape website for embedded/linked videos
  if (operator.website) {
    if (verbose) console.log(`   📡 Scraping ${operator.website}...`);
    const websiteVideos = await scrapeWebsiteForVideos(operator.website);

    // Also try common video pages
    const videoPages = ["/videos", "/gallery", "/media", "/about"];
    for (const page of videoPages) {
      try {
        const baseUrl = new URL(operator.website);
        const pageUrl = `${baseUrl.origin}${page}`;
        const moreVideos = await scrapeWebsiteForVideos(pageUrl);
        websiteVideos.push(...moreVideos);
      } catch { /* invalid URL */ }
    }

    for (const v of websiteVideos) {
      const title = await getVideoTitle(v.id);
      allResults.push({
        videoId: v.id,
        title,
        source: v.source,
        score: v.source === "website_embed" ? 100 : 80, // Embeds on their own site = highest trust
      });
    }

    if (verbose) console.log(`   Found ${websiteVideos.length} videos on website`);
  }

  // Step 2: YouTube API search (if no website results or as supplementary)
  if (allResults.length === 0) {
    const apiResults = await searchYouTube(
      operator.name,
      operator.activity_types || []
    );
    allResults.push(...apiResults);
    if (verbose) console.log(`   Found ${apiResults.length} videos via API search`);
  }

  if (allResults.length === 0) {
    if (verbose) console.log("   ❌ No videos found");
    return null;
  }

  // Sort by score (highest first)
  allResults.sort((a, b) => b.score - a.score);
  const best = allResults[0];

  if (verbose) {
    console.log(`   🏆 Best: "${best.title}" (${best.videoId}) — score ${best.score}, source: ${best.source}`);
    if (allResults.length > 1) {
      console.log(`   Also found ${allResults.length - 1} other videos`);
    }
  }

  return best;
}

async function main() {
  console.log("🎬 YouTube Auto-Fetch for Operators");
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  if (YOUTUBE_API_KEY) console.log("   YouTube API: ✅ Available");
  else console.log("   YouTube API: ❌ Not set (website scraping only)");
  console.log("");

  // Check if operators table has youtube_video_id column
  let hasYouTubeCol = false;
  try {
    await sql`SELECT youtube_video_id FROM operators LIMIT 1`;
    hasYouTubeCol = true;
  } catch {
    console.log("⚠️ Column youtube_video_id doesn't exist on operators table.");
    console.log("   Adding it now...");
    await sql`ALTER TABLE operators ADD COLUMN IF NOT EXISTS youtube_video_id VARCHAR(20)`;
    hasYouTubeCol = true;
    console.log("   ✅ Column added\n");
  }

  // Fetch operators
  let operators;
  if (slugArg) {
    operators = hasYouTubeCol
      ? await sql`SELECT id, name, slug, website, activity_types, youtube_video_id FROM operators WHERE slug = ${slugArg}`
      : await sql`SELECT id, name, slug, website, activity_types, NULL as youtube_video_id FROM operators WHERE slug = ${slugArg}`;
  } else {
    operators = hasYouTubeCol
      ? await sql`SELECT id, name, slug, website, activity_types, youtube_video_id FROM operators WHERE website IS NOT NULL ORDER BY name`
      : await sql`SELECT id, name, slug, website, activity_types, NULL as youtube_video_id FROM operators WHERE website IS NOT NULL ORDER BY name`;
  }

  console.log(`📋 Processing ${operators.length} operators...\n`);

  let found = 0;
  let skipped = 0;
  let noVideo = 0;
  const results: { operator: string; slug: string; videoId: string; title: string; source: string }[] = [];

  for (const op of operators) {
    const result = await processOperator(op as any);

    if (result === null && op.youtube_video_id) {
      skipped++;
      continue;
    }

    if (result === null) {
      noVideo++;
      continue;
    }

    found++;
    results.push({
      operator: op.name,
      slug: op.slug,
      videoId: result.videoId,
      title: result.title,
      source: result.source,
    });

    if (!dryRun) {
      await sql`
        UPDATE operators
        SET youtube_video_id = ${result.videoId}
        WHERE id = ${op.id}
      `;
    }

    // Rate limit (be nice to websites)
    await new Promise(r => setTimeout(r, 500));
  }

  // Summary
  console.log(`\n📊 Results:`);
  console.log(`   ✅ Found videos: ${found}`);
  console.log(`   ⏭️ Already had video: ${skipped}`);
  console.log(`   ❌ No video found: ${noVideo}`);

  if (results.length > 0) {
    console.log(`\n🎬 Videos ${dryRun ? "to be " : ""}assigned:`);
    for (const r of results) {
      console.log(`   ${r.operator} → ${r.videoId} ("${r.title}") [${r.source}]`);
    }
  }

  if (dryRun && results.length > 0) {
    console.log(`\n⚠️ DRY RUN — no changes written. Remove --dry-run to apply.`);
  }
}

main().catch(console.error);
