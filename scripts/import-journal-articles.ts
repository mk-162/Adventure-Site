#!/usr/bin/env tsx
import "dotenv/config";
import { sql } from "@vercel/postgres";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

interface JournalArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  heroImage: string | null;
  author: string;
  regionSlug?: string;
  activityTypeSlug?: string;
  tags: string[];
  readTimeMinutes: number;
}

// Map category values to the enum
function mapCategory(category: string): string {
  const validCategories = [
    "guide",
    "gear",
    "safety",
    "seasonal",
    "news",
    "trip-report",
    "spotlight",
  ];

  const normalized = category.toLowerCase();
  if (validCategories.includes(normalized)) {
    return normalized;
  }

  // Fallback to guide
  console.log(`  ⚠️  Unknown category "${category}", defaulting to "guide"`);
  return "guide";
}

// Look up region ID by slug
async function getRegionId(
  regionSlug: string | undefined,
  siteId: number
): Promise<number | null> {
  if (!regionSlug) return null;

  try {
    const result = await sql`
      SELECT id FROM regions 
      WHERE site_id = ${siteId} 
      AND slug = ${regionSlug}
      LIMIT 1
    `;
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error(`  ⚠️  Error looking up region "${regionSlug}":`, error);
    return null;
  }
}

// Look up activity type ID by slug
async function getActivityTypeId(
  activityTypeSlug: string | undefined,
  siteId: number
): Promise<number | null> {
  if (!activityTypeSlug) return null;

  try {
    const result = await sql`
      SELECT id FROM activity_types 
      WHERE site_id = ${siteId} 
      AND slug = ${activityTypeSlug}
      LIMIT 1
    `;
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error(
      `  ⚠️  Error looking up activity type "${activityTypeSlug}":`,
      error
    );
    return null;
  }
}

// Get or create tag by name
async function getOrCreateTag(
  tagName: string,
  siteId: number
): Promise<number | null> {
  const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  try {
    // First try to find existing tag
    let result = await sql`
      SELECT id FROM tags 
      WHERE site_id = ${siteId} 
      AND slug = ${slug}
      LIMIT 1
    `;

    if (result.rows[0]) {
      return result.rows[0].id;
    }

    // Create new tag with default type 'feature'
    result = await sql`
      INSERT INTO tags (site_id, name, slug, type, created_at)
      VALUES (${siteId}, ${tagName}, ${slug}, 'feature', NOW())
      RETURNING id
    `;

    return result.rows[0]?.id || null;
  } catch (error) {
    console.error(`  ⚠️  Error creating tag "${tagName}":`, error);
    return null;
  }
}

// Link tag to post
async function linkTagToPost(postId: number, tagId: number): Promise<void> {
  try {
    await sql`
      INSERT INTO post_tags (post_id, tag_id, created_at)
      VALUES (${postId}, ${tagId}, NOW())
      ON CONFLICT DO NOTHING
    `;
  } catch (error) {
    console.error(`  ⚠️  Error linking tag to post:`, error);
  }
}

// Main import function
async function importJournalArticles() {
  console.log("🚀 Starting journal article import...\n");

  let importedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  let totalTagsLinked = 0;

  // Get site ID (assuming first/only site)
  const siteResult = await sql`SELECT id FROM sites LIMIT 1`;
  const siteId = siteResult.rows[0]?.id;

  if (!siteId) {
    console.error("❌ No site found! Please seed the database first.");
    process.exit(1);
  }

  console.log(`📍 Using site ID: ${siteId}\n`);

  // Check current posts count
  const currentPostsResult = await sql`
    SELECT COUNT(*) as count FROM posts WHERE site_id = ${siteId}
  `;
  const currentPostsCount = parseInt(currentPostsResult.rows[0].count);
  console.log(`📊 Current posts in DB: ${currentPostsCount}\n`);

  // Read all JSON files from data/journal/
  const journalDir = join(process.cwd(), "data/journal");
  const jsonFiles = readdirSync(journalDir).filter((f) => f.endsWith(".json"));

  console.log(`📁 Found ${jsonFiles.length} JSON files to import\n`);

  for (const file of jsonFiles) {
    const filePath = join(journalDir, file);

    try {
      const content = readFileSync(filePath, "utf-8");
      const article: JournalArticle = JSON.parse(content);

      // Look up regionId and activityTypeId
      const regionId = await getRegionId(article.regionSlug, siteId);
      const activityTypeId = await getActivityTypeId(
        article.activityTypeSlug,
        siteId
      );

      // Warn if lookups failed
      if (article.regionSlug && !regionId) {
        console.log(
          `  ⚠️  Region "${article.regionSlug}" not found for article "${article.slug}"`
        );
      }
      if (article.activityTypeSlug && !activityTypeId) {
        console.log(
          `  ⚠️  Activity type "${article.activityTypeSlug}" not found for article "${article.slug}"`
        );
      }

      // Map category
      const category = mapCategory(article.category);

      // Check if post exists
      const existingPost = await sql`
        SELECT id FROM posts 
        WHERE site_id = ${siteId} AND slug = ${article.slug}
        LIMIT 1
      `;

      let postId: number;
      let wasInserted: boolean;

      if (existingPost.rows.length > 0) {
        // Update existing post
        postId = existingPost.rows[0].id;
        wasInserted = false;

        await sql`
          UPDATE posts SET
            title = ${article.title},
            excerpt = ${article.excerpt},
            content = ${article.content},
            category = ${category},
            hero_image = ${article.heroImage},
            author = ${article.author},
            read_time_minutes = ${article.readTimeMinutes},
            region_id = ${regionId},
            activity_type_id = ${activityTypeId},
            status = 'published',
            updated_at = NOW()
          WHERE id = ${postId}
        `;
      } else {
        // Insert new post
        const result = await sql`
          INSERT INTO posts (
            site_id, slug, title, excerpt, content, category,
            hero_image, author, read_time_minutes,
            region_id, activity_type_id,
            status, published_at, created_at, updated_at
          ) VALUES (
            ${siteId}, ${article.slug}, ${article.title}, ${article.excerpt},
            ${article.content}, ${category}, ${article.heroImage},
            ${article.author}, ${article.readTimeMinutes},
            ${regionId}, ${activityTypeId},
            'published', NOW(), NOW(), NOW()
          )
          RETURNING id
        `;

        postId = result.rows[0].id;
        wasInserted = true;
      }

      if (wasInserted) {
        importedCount++;
      } else {
        updatedCount++;
      }

      // Handle tags
      let tagsLinked = 0;

      // First, remove existing tags for this post to avoid duplicates
      await sql`
        DELETE FROM post_tags WHERE post_id = ${postId}
      `;

      for (const tagName of article.tags) {
        const tagId = await getOrCreateTag(tagName, siteId);
        if (tagId) {
          await linkTagToPost(postId, tagId);
          tagsLinked++;
          totalTagsLinked++;
        }
      }

      console.log(
        `  ✅ ${article.title} (${article.readTimeMinutes} min read, ${tagsLinked} tags) ${wasInserted ? "[NEW]" : "[UPDATED]"}`
      );
    } catch (error) {
      console.error(`  ❌ Failed to import ${file}:`, error);
      errorCount++;
    }
  }

  // Final count
  const finalPostsResult = await sql`
    SELECT COUNT(*) as count FROM posts WHERE site_id = ${siteId}
  `;
  const finalPostsCount = parseInt(finalPostsResult.rows[0].count);

  console.log("\n✨ Import complete!");
  console.log(`📊 Summary:`);
  console.log(`   - Articles processed: ${jsonFiles.length}`);
  console.log(`   - New articles imported: ${importedCount}`);
  console.log(`   - Articles updated: ${updatedCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`   - Total tags linked: ${totalTagsLinked}`);
  console.log(`   - Posts in DB before: ${currentPostsCount}`);
  console.log(`   - Posts in DB after: ${finalPostsCount}`);
  console.log();
}

// Run the import
importJournalArticles()
  .then(() => {
    console.log("✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Import failed:", error);
    process.exit(1);
  });
