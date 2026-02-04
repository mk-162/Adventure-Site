#!/usr/bin/env tsx
import { sql } from '@vercel/postgres';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'guide' | 'gear' | 'safety' | 'seasonal';
  heroImage: string | null;
  readTimeMinutes: number;
  activityTypeId: number | null;
}

// Helper: Extract title from markdown (first # heading)
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

// Helper: Extract excerpt from markdown (first paragraph after heading)
function extractExcerpt(content: string): string {
  // Remove frontmatter
  let cleaned = content.replace(/^---[\s\S]*?---\n/m, '');
  // Remove first heading
  cleaned = cleaned.replace(/^#\s+.+$/m, '');
  // Get first paragraph
  const paragraphs = cleaned.trim().split(/\n\n+/);
  const firstParagraph = paragraphs.find(p => p.trim().length > 0) || '';
  const excerpt = firstParagraph.replace(/\n/g, ' ').trim();
  return excerpt.substring(0, 200) + (excerpt.length > 200 ? '...' : '');
}

// Helper: Calculate read time (200 words per minute)
function calculateReadTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200));
}

// Helper: Map activity slug to hero image
function getActivityHeroImage(slug: string): string | null {
  const activityMap: Record<string, string> = {
    'coasteering': '/images/activities/coasteering-hero.jpg',
    'hiking': '/images/activities/hiking-hero.jpg',
    'mountain-biking': '/images/activities/mountain-biking-hero.jpg',
    'surfing': '/images/activities/surfing-hero.jpg',
    'caving': '/images/activities/caving-hero.jpg',
    'climbing': '/images/activities/climbing-hero.jpg',
    'kayaking': '/images/activities/kayaking-hero.jpg',
    'gorge-walking': '/images/activities/gorge-walking-hero.jpg',
    'wild-swimming': '/images/activities/wild-swimming-hero.jpg',
    'zip-lining': '/images/activities/zip-lining-hero.jpg',
  };
  return activityMap[slug] || null;
}

// Helper: Map gear/safety/seasonal to hero images
function getOtherHeroImage(slug: string, category: string): string | null {
  if (category === 'gear') {
    if (slug.includes('camping')) return '/images/misc/gear-camping-01-55639fd4.jpg';
    if (slug.includes('climbing')) return '/images/misc/gear-climbing-01-3447f9ac.jpg';
    if (slug.includes('hiking')) return '/images/misc/gear-hiking-01-918f1952.jpg';
    if (slug.includes('mtb') || slug.includes('mountain-biking')) return '/images/misc/gear-water-01-cdcf40ed.jpg';
    if (slug.includes('coasteering') || slug.includes('wild-swimming')) return '/images/misc/gear-water-01-cdcf40ed.jpg';
  }
  
  if (category === 'safety') {
    if (slug.includes('water') || slug.includes('coasteering') || slug.includes('cycling')) {
      return '/images/misc/safety-water-01-bda6864b.jpg';
    }
    return '/images/misc/safety-mountain-01-6ff29756.jpg';
  }
  
  if (category === 'seasonal') {
    if (slug.includes('autumn')) return '/images/misc/seasonal-autumn-01-b078c4e2.jpg';
    if (slug.includes('spring')) return '/images/misc/seasonal-spring-01-a092225c.jpg';
    if (slug.includes('summer')) return '/images/misc/seasonal-summer-01-77474fb8.jpg';
    if (slug.includes('winter')) return '/images/misc/seasonal-winter-01-f8a41743.jpg';
  }
  
  return null;
}

// Helper: Read markdown files from directory
function readMarkdownFiles(dir: string): Array<{ slug: string; content: string }> {
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  return files.map(file => ({
    slug: file.replace('.md', ''),
    content: readFileSync(join(dir, file), 'utf-8'),
  }));
}

// Helper: Get activity type ID from slug/content
async function getActivityTypeId(slug: string, content: string): Promise<number | null> {
  const activityMap: Record<string, string> = {
    'coasteering': 'coasteering',
    'hiking': 'hiking',
    'mountain-biking': 'mountain-biking',
    'surfing': 'surfing',
    'caving': 'caving',
    'climbing': 'climbing',
    'kayaking': 'kayaking',
    'gorge-walking': 'gorge-walking',
    'wild-swimming': 'wild-swimming',
    'zip-lining': 'zip-lining',
  };
  
  const activitySlug = activityMap[slug];
  if (!activitySlug) return null;
  
  try {
    const result = await sql`
      SELECT id FROM activity_types 
      WHERE slug = ${activitySlug}
      LIMIT 1
    `;
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error(`Error fetching activity type for ${activitySlug}:`, error);
    return null;
  }
}

// Helper: Extract tags from content
function extractTags(content: string, slug: string): {
  activities: string[];
  terrains: string[];
  difficulties: string[];
} {
  const lower = content.toLowerCase();
  
  const activities: string[] = [];
  const activityKeywords = [
    'coasteering', 'hiking', 'mountain biking', 'surfing', 'caving',
    'climbing', 'kayaking', 'gorge walking', 'wild swimming', 'zip lining'
  ];
  
  activityKeywords.forEach(keyword => {
    if (lower.includes(keyword.toLowerCase()) || slug.includes(keyword.replace(/ /g, '-'))) {
      activities.push(keyword);
    }
  });
  
  const terrains: string[] = [];
  const terrainKeywords = ['coastal', 'mountain', 'forest', 'river', 'beach', 'cliff', 'moorland'];
  
  terrainKeywords.forEach(keyword => {
    if (lower.includes(keyword)) {
      terrains.push(keyword);
    }
  });
  
  const difficulties: string[] = [];
  if (lower.includes('beginner') || lower.includes('easy')) difficulties.push('beginner');
  if (lower.includes('intermediate') || lower.includes('moderate')) difficulties.push('intermediate');
  if (lower.includes('advanced') || lower.includes('challenging') || lower.includes('difficult')) {
    difficulties.push('advanced');
  }
  
  return { activities, terrains, difficulties };
}

// Main import function
async function importPosts() {
  console.log('🚀 Starting post import...\n');
  
  let importedCount = 0;
  let taggedCount = 0;
  
  // Get site ID (assuming first/only site)
  const siteResult = await sql`SELECT id FROM sites LIMIT 1`;
  const siteId = siteResult.rows[0]?.id;
  
  if (!siteId) {
    console.error('❌ No site found! Please seed the database first.');
    process.exit(1);
  }
  
  console.log(`📍 Using site ID: ${siteId}\n`);
  
  // Import categories (guide)
  console.log('📚 Importing activity guides...');
  const categories = readMarkdownFiles(join(process.cwd(), 'content/categories'));
  
  for (const { slug, content } of categories) {
    const title = extractTitle(content);
    const excerpt = extractExcerpt(content);
    const readTimeMinutes = calculateReadTime(content);
    const heroImage = getActivityHeroImage(slug);
    const activityTypeId = await getActivityTypeId(slug, content);
    
    const postData: PostData = {
      slug,
      title,
      excerpt,
      content,
      category: 'guide',
      heroImage,
      readTimeMinutes,
      activityTypeId,
    };
    
    try {
      const result = await sql`
        INSERT INTO posts (
          site_id, slug, title, excerpt, content, category,
          hero_image, read_time_minutes, activity_type_id,
          status, published_at, created_at, updated_at
        ) VALUES (
          ${siteId}, ${postData.slug}, ${postData.title}, ${postData.excerpt},
          ${postData.content}, ${postData.category}, ${postData.heroImage},
          ${postData.readTimeMinutes}, ${postData.activityTypeId},
          'published', NOW(), NOW(), NOW()
        )
        RETURNING id
      `;
      
      const postId = result.rows[0].id;
      
      // Auto-tag
      const tags = extractTags(content, slug);
      const tagCount = await autoTag(postId, tags, siteId);
      taggedCount += tagCount;
      
      console.log(`  ✅ ${title} (${readTimeMinutes} min read, ${tagCount} tags)`);
      importedCount++;
    } catch (error) {
      console.error(`  ❌ Failed to import ${slug}:`, error);
    }
  }
  
  // Import guides (gear + seasonal)
  console.log('\n🎒 Importing gear & seasonal guides...');
  const guides = readMarkdownFiles(join(process.cwd(), 'content/guides'));
  
  for (const { slug, content } of guides) {
    const title = extractTitle(content);
    const excerpt = extractExcerpt(content);
    const readTimeMinutes = calculateReadTime(content);
    
    // Determine category
    let category: 'gear' | 'seasonal' = 'gear';
    if (slug.includes('autumn') || slug.includes('spring') || 
        slug.includes('summer') || slug.includes('winter')) {
      category = 'seasonal';
    }
    
    const heroImage = getOtherHeroImage(slug, category);
    
    const postData: PostData = {
      slug,
      title,
      excerpt,
      content,
      category,
      heroImage,
      readTimeMinutes,
      activityTypeId: null,
    };
    
    try {
      const result = await sql`
        INSERT INTO posts (
          site_id, slug, title, excerpt, content, category,
          hero_image, read_time_minutes, activity_type_id,
          status, published_at, created_at, updated_at
        ) VALUES (
          ${siteId}, ${postData.slug}, ${postData.title}, ${postData.excerpt},
          ${postData.content}, ${postData.category}, ${postData.heroImage},
          ${postData.readTimeMinutes}, ${postData.activityTypeId},
          'published', NOW(), NOW(), NOW()
        )
        RETURNING id
      `;
      
      const postId = result.rows[0].id;
      
      // Auto-tag
      const tags = extractTags(content, slug);
      const tagCount = await autoTag(postId, tags, siteId);
      taggedCount += tagCount;
      
      console.log(`  ✅ ${title} (${readTimeMinutes} min read, ${tagCount} tags)`);
      importedCount++;
    } catch (error) {
      console.error(`  ❌ Failed to import ${slug}:`, error);
    }
  }
  
  // Import safety guides
  console.log('\n⚠️  Importing safety guides...');
  const safety = readMarkdownFiles(join(process.cwd(), 'content/safety'));
  
  for (const { slug, content } of safety) {
    const title = extractTitle(content);
    const excerpt = extractExcerpt(content);
    const readTimeMinutes = calculateReadTime(content);
    const heroImage = getOtherHeroImage(slug, 'safety');
    
    const postData: PostData = {
      slug,
      title,
      excerpt,
      content,
      category: 'safety',
      heroImage,
      readTimeMinutes,
      activityTypeId: null,
    };
    
    try {
      const result = await sql`
        INSERT INTO posts (
          site_id, slug, title, excerpt, content, category,
          hero_image, read_time_minutes, activity_type_id,
          status, published_at, created_at, updated_at
        ) VALUES (
          ${siteId}, ${postData.slug}, ${postData.title}, ${postData.excerpt},
          ${postData.content}, ${postData.category}, ${postData.heroImage},
          ${postData.readTimeMinutes}, ${postData.activityTypeId},
          'published', NOW(), NOW(), NOW()
        )
        RETURNING id
      `;
      
      const postId = result.rows[0].id;
      
      // Auto-tag
      const tags = extractTags(content, slug);
      const tagCount = await autoTag(postId, tags, siteId);
      taggedCount += tagCount;
      
      console.log(`  ✅ ${title} (${readTimeMinutes} min read, ${tagCount} tags)`);
      importedCount++;
    } catch (error) {
      console.error(`  ❌ Failed to import ${slug}:`, error);
    }
  }
  
  console.log('\n✨ Import complete!');
  console.log(`📊 Summary: ${importedCount} posts imported, ${taggedCount} total tags applied\n`);
}

// Auto-tag posts based on content
async function autoTag(
  postId: number,
  tags: { activities: string[]; terrains: string[]; difficulties: string[] },
  siteId: number
): Promise<number> {
  let count = 0;
  
  // Tag activities
  for (const activity of tags.activities) {
    const slug = activity.toLowerCase().replace(/ /g, '-');
    try {
      const result = await sql`
        SELECT id FROM tags 
        WHERE site_id = ${siteId} 
        AND slug = ${slug}
        AND type = 'activity'
        LIMIT 1
      `;
      
      if (result.rows[0]) {
        await sql`
          INSERT INTO post_tags (post_id, tag_id, created_at)
          VALUES (${postId}, ${result.rows[0].id}, NOW())
          ON CONFLICT DO NOTHING
        `;
        count++;
      }
    } catch (error) {
      // Tag might not exist, skip
    }
  }
  
  // Tag terrains
  for (const terrain of tags.terrains) {
    try {
      const result = await sql`
        SELECT id FROM tags 
        WHERE site_id = ${siteId} 
        AND slug = ${terrain}
        AND type = 'terrain'
        LIMIT 1
      `;
      
      if (result.rows[0]) {
        await sql`
          INSERT INTO post_tags (post_id, tag_id, created_at)
          VALUES (${postId}, ${result.rows[0].id}, NOW())
          ON CONFLICT DO NOTHING
        `;
        count++;
      }
    } catch (error) {
      // Tag might not exist, skip
    }
  }
  
  // Tag difficulties
  for (const difficulty of tags.difficulties) {
    try {
      const result = await sql`
        SELECT id FROM tags 
        WHERE site_id = ${siteId} 
        AND slug = ${difficulty}
        AND type = 'difficulty'
        LIMIT 1
      `;
      
      if (result.rows[0]) {
        await sql`
          INSERT INTO post_tags (post_id, tag_id, created_at)
          VALUES (${postId}, ${result.rows[0].id}, NOW())
          ON CONFLICT DO NOTHING
        `;
        count++;
      }
    } catch (error) {
      // Tag might not exist, skip
    }
  }
  
  return count;
}

// Run the import
importPosts()
  .then(() => {
    console.log('✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });
