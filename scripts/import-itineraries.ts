import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface Frontmatter {
  slug: string;
  title: string;
  region: string;
  days: number;
  difficulty: string;
}

interface ItineraryData {
  frontmatter: Frontmatter;
  body: string;
  tagline: string | null;
  bestSeason: string | null;
  priceFrom: number | null;
  priceTo: number | null;
}

interface DaySection {
  dayNumber: number;
  title: string;
  content: string;
}

// Parse markdown file and extract frontmatter + body
function parseMarkdownFile(filePath: string): ItineraryData {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Handle the edge case: first line might be 'yaml', second line is '---'
  let startLine = 0;
  if (lines[0].trim() === 'yaml' && lines[1].trim() === '---') {
    startLine = 2;
  } else if (lines[0].trim() === '---') {
    startLine = 1;
  } else {
    throw new Error(`Invalid frontmatter format in ${filePath}`);
  }
  
  // Find the closing '---'
  let endLine = startLine;
  while (endLine < lines.length && lines[endLine].trim() !== '---') {
    endLine++;
  }
  
  if (endLine >= lines.length) {
    throw new Error(`No closing --- found in frontmatter for ${filePath}`);
  }
  
  // Extract and parse frontmatter
  const frontmatterText = lines.slice(startLine, endLine).join('\n');
  const frontmatter = yaml.load(frontmatterText) as Frontmatter;
  
  // Extract body (everything after the closing ---)
  const body = lines.slice(endLine + 1).join('\n').trim();
  
  // Extract tagline from "Who This Trip Is For" section
  const tagline = extractTagline(body);
  
  // Extract best season from "Best Time of Year" section
  const bestSeason = extractBestSeason(body);
  
  // Extract price info from "Cost Reality" section
  const { priceFrom, priceTo } = extractPriceInfo(body);
  
  return {
    frontmatter,
    body,
    tagline,
    bestSeason,
    priceFrom,
    priceTo,
  };
}

// Extract tagline from "Who This Trip Is For" section (first sentence)
function extractTagline(body: string): string | null {
  const match = body.match(/## Who This Trip Is For\s+([^.]+\.)/);
  if (match) {
    const tagline = match[1].trim();
    // Truncate to 250 chars to be safe with varchar(255)
    return tagline.length > 250 ? tagline.substring(0, 247) + '...' : tagline;
  }
  return null;
}

// Extract best season from "Best Time of Year" section
function extractBestSeason(body: string): string | null {
  const match = body.match(/### Best Time of Year\s+([^\n]+)/);
  if (match) {
    return match[1].trim();
  }
  
  // Alternative: look in the body for mentions of best months
  const seasonMatch = body.match(/May, June, and September are generally the best months|best months|Best Time of Year/i);
  if (seasonMatch) {
    const lines = body.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/Best Time of Year|best months/i)) {
        // Return the next non-empty line
        for (let j = i + 1; j < lines.length && j < i + 5; j++) {
          if (lines[j].trim() && !lines[j].startsWith('#')) {
            return lines[j].trim();
          }
        }
      }
    }
  }
  
  return null;
}

// Extract price information from "Cost Reality" section
function extractPriceInfo(body: string): { priceFrom: number | null; priceTo: number | null } {
  const costSection = body.match(/## Cost Reality\s+([\s\S]*?)(?=\n##|\n$)/);
  if (!costSection) {
    return { priceFrom: null, priceTo: null };
  }
  
  const prices: number[] = [];
  const priceMatches = costSection[1].matchAll(/£(\d+)(?:-£?(\d+))?/g);
  
  for (const match of priceMatches) {
    if (match[1]) prices.push(parseInt(match[1]));
    if (match[2]) prices.push(parseInt(match[2]));
  }
  
  if (prices.length === 0) {
    return { priceFrom: null, priceTo: null };
  }
  
  return {
    priceFrom: Math.min(...prices),
    priceTo: Math.max(...prices),
  };
}

// Parse day sections from the body
function parseDaySections(body: string): DaySection[] {
  const daySections: DaySection[] = [];
  const dayRegex = /## Day (\d+):\s*([^\n]+)([\s\S]*?)(?=\n## Day \d+:|\n## [^D]|$)/g;
  
  let match;
  while ((match = dayRegex.exec(body)) !== null) {
    daySections.push({
      dayNumber: parseInt(match[1]),
      title: match[2].trim(),
      content: match[3].trim(),
    });
  }
  
  return daySections;
}

// Extract time of day from content
function extractTimeOfDay(content: string): string | null {
  const morningMatch = content.match(/\*\*Morning:\*\*/i);
  const afternoonMatch = content.match(/\*\*Afternoon:\*\*/i);
  const eveningMatch = content.match(/\*\*Evening:\*\*/i);
  
  if (morningMatch) return 'morning';
  if (afternoonMatch) return 'afternoon';
  if (eveningMatch) return 'evening';
  
  return null;
}

// Simple string similarity for matching activity names
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Find matching activity by name similarity
async function findActivityId(activityName: string): Promise<number | null> {
  const result = await sql`SELECT id, name FROM activities WHERE site_id = 1`;
  
  let bestMatch: { id: number; similarity: number } | null = null;
  
  for (const row of result.rows) {
    const sim = similarity(activityName, row.name);
    if (sim > 0.6 && (!bestMatch || sim > bestMatch.similarity)) {
      bestMatch = { id: row.id, similarity: sim };
    }
  }
  
  return bestMatch?.id || null;
}

// Find matching accommodation by name similarity
async function findAccommodationId(accommodationName: string): Promise<number | null> {
  const result = await sql`SELECT id, name FROM accommodation WHERE site_id = 1`;
  
  let bestMatch: { id: number; similarity: number } | null = null;
  
  for (const row of result.rows) {
    const sim = similarity(accommodationName, row.name);
    if (sim > 0.6 && (!bestMatch || sim > bestMatch.similarity)) {
      bestMatch = { id: row.id, similarity: sim };
    }
  }
  
  return bestMatch?.id || null;
}

// Main import function
async function importItineraries() {
  const itinerariesDir = path.join(process.cwd(), 'content', 'itineraries');
  const files = fs.readdirSync(itinerariesDir).filter(f => f.endsWith('.md'));
  
  console.log(`Found ${files.length} itinerary files to import`);
  
  // First, get region mappings
  const regionsResult = await sql`SELECT id, slug FROM regions WHERE site_id = 1`;
  const regionMap = new Map<string, number>();
  for (const row of regionsResult.rows) {
    regionMap.set(row.slug, row.id);
  }
  
  let itinerariesCreated = 0;
  let itemsCreated = 0;
  
  for (const file of files) {
    const filePath = path.join(itinerariesDir, file);
    console.log(`\nProcessing: ${file}`);
    
    try {
      const data = parseMarkdownFile(filePath);
      const { frontmatter, body, tagline, bestSeason, priceFrom, priceTo } = data;
      
      // Map region slug to region ID
      const regionId = regionMap.get(frontmatter.region);
      if (!regionId) {
        console.warn(`  ⚠️  Region '${frontmatter.region}' not found, skipping ${file}`);
        continue;
      }
      
      // Validate and truncate fields
      const safeTitle = frontmatter.title.substring(0, 255);
      const safeSlug = frontmatter.slug.substring(0, 255);
      const safeTagline = tagline ? tagline.substring(0, 255) : null;
      const safeDifficulty = frontmatter.difficulty.substring(0, 50);
      const safeBestSeason = bestSeason ? bestSeason.substring(0, 255) : null;
      
      console.log(`  Title length: ${frontmatter.title.length}, Tagline length: ${tagline?.length || 0}`);
      
      // Insert itinerary
      const itineraryResult = await sql`
        INSERT INTO itineraries (
          site_id,
          region_id,
          title,
          slug,
          tagline,
          description,
          duration_days,
          difficulty,
          best_season,
          price_estimate_from,
          price_estimate_to,
          status,
          created_at,
          updated_at
        ) VALUES (
          1,
          ${regionId},
          ${safeTitle},
          ${safeSlug},
          ${safeTagline},
          ${body},
          ${frontmatter.days},
          ${safeDifficulty},
          ${safeBestSeason},
          ${priceFrom},
          ${priceTo},
          'published',
          NOW(),
          NOW()
        )
        RETURNING id
      `;
      
      const itineraryId = itineraryResult.rows[0].id;
      itinerariesCreated++;
      console.log(`  ✓ Created itinerary: ${frontmatter.title} (ID: ${itineraryId})`);
      
      // Parse day sections
      const daySections = parseDaySections(body);
      console.log(`  Found ${daySections.length} day sections`);
      
      // Create itinerary items for each day
      for (const day of daySections) {
        const timeOfDay = extractTimeOfDay(day.content);
        
        // Try to extract activity mentions
        const activityMentions = [
          'coasteering', 'kayaking', 'climbing', 'caving', 'mountain biking',
          'surfing', 'wild swimming', 'hiking', 'boat trip'
        ];
        
        let activityId: number | null = null;
        for (const mention of activityMentions) {
          if (day.content.toLowerCase().includes(mention)) {
            activityId = await findActivityId(mention);
            if (activityId) break;
          }
        }
        
        // Try to extract accommodation mentions
        const accommodationMentions = ['hotel', 'hostel', 'b&b', 'camping', 'glamping', 'cottage'];
        let accommodationId: number | null = null;
        for (const mention of accommodationMentions) {
          if (day.content.toLowerCase().includes(mention)) {
            accommodationId = await findAccommodationId(mention);
            if (accommodationId) break;
          }
        }
        
        // Extract description (first paragraph after the day title)
        const descMatch = day.content.match(/### The Plan\s+([\s\S]*?)(?=\n###|\n\*\*|$)/);
        const description = descMatch ? descMatch[1].trim().substring(0, 500) : day.content.substring(0, 500);
        
        // Validate field lengths
        const safeItemTitle = day.title.substring(0, 255);
        const safeTimeOfDay = timeOfDay ? timeOfDay.substring(0, 50) : null;
        
        await sql`
          INSERT INTO itinerary_items (
            itinerary_id,
            day_number,
            order_index,
            activity_id,
            accommodation_id,
            time_of_day,
            title,
            description
          ) VALUES (
            ${itineraryId},
            ${day.dayNumber},
            ${day.dayNumber},
            ${activityId},
            ${accommodationId},
            ${safeTimeOfDay},
            ${safeItemTitle},
            ${description}
          )
        `;
        
        itemsCreated++;
      }
      
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error);
    }
  }
  
  console.log(`\n=== Import Complete ===`);
  console.log(`Itineraries created: ${itinerariesCreated}`);
  console.log(`Itinerary items created: ${itemsCreated}`);
  
  // Verify the import
  const verifyResult = await sql`
    SELECT COUNT(*) as count FROM itineraries WHERE site_id = 1 AND status = 'published'
  `;
  console.log(`\nVerification: ${verifyResult.rows[0].count} published itineraries in database`);
  
  const itemsResult = await sql`
    SELECT COUNT(*) as count FROM itinerary_items
  `;
  console.log(`Verification: ${itemsResult.rows[0].count} itinerary items in database`);
}

// Run the import
importItineraries()
  .then(() => {
    console.log('\n✓ Import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Import failed:', error);
    process.exit(1);
  });
