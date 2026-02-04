import { sql } from '@vercel/postgres';

// ============================
// TYPES
// ============================

interface Itinerary {
  id: number;
  title: string;
  description: string;
  region_id: number | null;
  duration_days: number | null;
}

interface Activity {
  id: number;
  name: string;
  region_id: number | null;
  lat: string | null;
  lng: string | null;
  price_from: string | null;
  price_to: string | null;
  operator_id: number | null;
}

interface Accommodation {
  id: number;
  name: string;
  type: string | null;
  region_id: number | null;
  lat: string | null;
  lng: string | null;
  price_from: string | null;
  price_to: string | null;
}

interface Location {
  id: number;
  name: string;
  region_id: number | null;
  lat: string | null;
  lng: string | null;
}

interface Stop {
  itinerary_id: number;
  day_number: number;
  order_index: number;
  stop_type: 'activity' | 'food' | 'accommodation' | 'transport' | 'freeform';
  start_time: string | null;
  duration: string | null;
  travel_to_next: string | null;
  travel_mode: 'drive' | 'walk' | 'cycle' | 'bus' | 'train' | 'ferry' | 'none' | null;
  title: string;
  description: string | null;
  activity_id: number | null;
  accommodation_id: number | null;
  location_id: number | null;
  operator_id: number | null;
  cost_from: string | null;
  cost_to: string | null;
  wet_alt_title: string | null;
  wet_alt_description: string | null;
  wet_alt_activity_id: number | null;
  wet_alt_cost_from: string | null;
  wet_alt_cost_to: string | null;
  budget_alt_title: string | null;
  budget_alt_description: string | null;
  budget_alt_activity_id: number | null;
  budget_alt_cost_from: string | null;
  budget_alt_cost_to: string | null;
  food_name: string | null;
  food_budget: string | null;
  food_link: string | null;
  food_notes: string | null;
  food_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pub' | 'cafe' | null;
  lat: string | null;
  lng: string | null;
  route_to_next_json: any | null;
}

// ============================
// FUZZY MATCHING UTILITIES
// ============================

function normalizeString(str: string): string {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

function fuzzyMatch<T extends { name: string }>(
  searchTerm: string,
  items: T[],
  threshold: number = 0.6
): T | null {
  const normalizedSearch = normalizeString(searchTerm);
  let bestMatch: T | null = null;
  let bestScore = 0;

  for (const item of items) {
    const normalizedItem = normalizeString(item.name);
    
    // Exact match
    if (normalizedItem === normalizedSearch) {
      return item;
    }

    // Contains match
    if (normalizedItem.includes(normalizedSearch) || normalizedSearch.includes(normalizedItem)) {
      const containsScore = Math.max(
        normalizedSearch.length / normalizedItem.length,
        normalizedItem.length / normalizedSearch.length
      );
      if (containsScore > bestScore) {
        bestScore = containsScore;
        bestMatch = item;
      }
      continue;
    }

    // Levenshtein distance
    const distance = levenshteinDistance(normalizedSearch, normalizedItem);
    const maxLen = Math.max(normalizedSearch.length, normalizedItem.length);
    const similarity = 1 - distance / maxLen;

    if (similarity > bestScore && similarity >= threshold) {
      bestScore = similarity;
      bestMatch = item;
    }
  }

  return bestScore >= threshold ? bestMatch : null;
}

// ============================
// MARKDOWN PARSING
// ============================

interface ParsedDay {
  dayNumber: number;
  title: string;
  content: string;
}

function parseDaysFromMarkdown(description: string): ParsedDay[] {
  const days: ParsedDay[] = [];
  
  // Match day headers: ## Day 1: Title or ## Day 1 - Title
  const dayRegex = /##\s*Day\s+(\d+)[:\-]\s*([^\n]+)/gi;
  const matches = [...description.matchAll(dayRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const dayNumber = parseInt(match[1]);
    const title = match[2].trim();
    
    // Extract content between this day and the next
    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : description.length;
    const content = description.slice(startIndex, endIndex).trim();

    days.push({ dayNumber, title, content });
  }

  return days;
}

// ============================
// STOP GENERATION
// ============================

function inferActivityType(content: string): string {
  const normalized = content.toLowerCase();
  
  // Water activities
  if (normalized.match(/surf|paddle|kayak|coast|beach|sea|ocean/)) {
    return 'water';
  }
  // Climbing
  if (normalized.match(/climb|boulder|crag/)) {
    return 'climbing';
  }
  // Hiking
  if (normalized.match(/hike|walk|trail|mountain|summit|peak/)) {
    return 'hiking';
  }
  // Cycling
  if (normalized.match(/bike|cycle|ride/)) {
    return 'cycling';
  }
  // Underground
  if (normalized.match(/cave|mine|underground|zip|bounce below/i)) {
    return 'underground';
  }
  
  return 'general';
}

function extractActivitiesFromDay(
  dayContent: string,
  activities: Activity[],
  locations: Location[],
  regionId: number | null
): { name: string; matchedActivity: Activity | null; matchedLocation: Location | null }[] {
  const results: { name: string; matchedActivity: Activity | null; matchedLocation: Location | null }[] = [];
  
  // Look for activity mentions in paragraphs
  const paragraphs = dayContent.split(/\n\n+/);
  
  for (const para of paragraphs) {
    // Skip very short paragraphs
    if (para.length < 30) continue;
    
    // Try to extract activity names (capitalized phrases, known patterns)
    const sentences = para.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      // Look for specific activity keywords
      const activityKeywords = [
        'surfing', 'climbing', 'hiking', 'kayaking', 'paddleboarding',
        'coasteering', 'zip', 'bounce', 'mine', 'mountain', 'trail',
        'gorge', 'waterfall', 'beach', 'crag'
      ];
      
      for (const keyword of activityKeywords) {
        if (sentence.toLowerCase().includes(keyword)) {
          // Try to find a matching activity
          const regionalActivities = activities.filter(a => !regionId || a.region_id === regionId);
          const match = fuzzyMatch(keyword, regionalActivities, 0.5);
          
          if (match) {
            results.push({
              name: keyword,
              matchedActivity: match,
              matchedLocation: null
            });
          } else {
            // Try locations
            const regionalLocations = locations.filter(l => !regionId || l.region_id === regionId);
            const locMatch = fuzzyMatch(keyword, regionalLocations, 0.5);
            
            results.push({
              name: keyword,
              matchedActivity: null,
              matchedLocation: locMatch
            });
          }
          break; // Only one match per sentence
        }
      }
    }
  }
  
  return results;
}

function generateDefaultStops(
  itinerary: Itinerary,
  day: ParsedDay,
  activities: Activity[],
  accommodations: Accommodation[],
  locations: Location[]
): Stop[] {
  const stops: Stop[] = [];
  let currentTime = '09:00';
  let orderIndex = 0;
  
  // Extract activities from day content
  const extractedActivities = extractActivitiesFromDay(
    day.content,
    activities,
    locations,
    itinerary.region_id
  );
  
  // Morning activity (09:00-12:00)
  if (extractedActivities.length > 0) {
    const first = extractedActivities[0];
    stops.push({
      itinerary_id: itinerary.id,
      day_number: day.dayNumber,
      order_index: orderIndex++,
      stop_type: 'activity',
      start_time: currentTime,
      duration: '3h',
      travel_to_next: '15min drive',
      travel_mode: 'drive',
      title: first.matchedActivity?.name || first.matchedLocation?.name || `Morning ${inferActivityType(day.content)}`,
      description: day.content.slice(0, 200).trim() + '...',
      activity_id: first.matchedActivity?.id || null,
      location_id: first.matchedLocation?.id || null,
      operator_id: first.matchedActivity?.operator_id || null,
      cost_from: first.matchedActivity?.price_from || null,
      cost_to: first.matchedActivity?.price_to || null,
      lat: first.matchedActivity?.lat || first.matchedLocation?.lat || null,
      lng: first.matchedActivity?.lng || first.matchedLocation?.lng || null,
      wet_alt_title: null,
      wet_alt_description: null,
      wet_alt_activity_id: null,
      wet_alt_cost_from: null,
      wet_alt_cost_to: null,
      budget_alt_title: null,
      budget_alt_description: null,
      budget_alt_activity_id: null,
      budget_alt_cost_from: null,
      budget_alt_cost_to: null,
      food_name: null,
      food_budget: null,
      food_link: null,
      food_notes: null,
      food_type: null,
      route_to_next_json: null
    });
    currentTime = '12:15';
  }
  
  // Lunch (12:30-13:30)
  stops.push({
    itinerary_id: itinerary.id,
    day_number: day.dayNumber,
    order_index: orderIndex++,
    stop_type: 'food',
    start_time: '12:30',
    duration: '1h',
    travel_to_next: '10min drive',
    travel_mode: 'drive',
    title: 'Lunch stop',
    description: 'Refuel with local food before the afternoon activities',
    activity_id: null,
    location_id: null,
    accommodation_id: null,
    operator_id: null,
    cost_from: '10',
    cost_to: '20',
    lat: null,
    lng: null,
    wet_alt_title: null,
    wet_alt_description: null,
    wet_alt_activity_id: null,
    wet_alt_cost_from: null,
    wet_alt_cost_to: null,
    budget_alt_title: 'Packed lunch',
    budget_alt_description: 'Bring your own sandwiches and snacks to save money',
    budget_alt_activity_id: null,
    budget_alt_cost_from: '0',
    budget_alt_cost_to: '5',
    food_name: 'Local café or pub',
    food_budget: '£10-20',
    food_link: null,
    food_notes: 'Find a local spot near your activity location',
    food_type: 'lunch',
    route_to_next_json: null
  });
  currentTime = '13:45';
  
  // Afternoon activity (14:00-17:00)
  if (extractedActivities.length > 1) {
    const second = extractedActivities[1];
    stops.push({
      itinerary_id: itinerary.id,
      day_number: day.dayNumber,
      order_index: orderIndex++,
      stop_type: 'activity',
      start_time: currentTime,
      duration: '3h',
      travel_to_next: day.dayNumber < (itinerary.duration_days || 1) ? '20min drive' : null,
      travel_mode: day.dayNumber < (itinerary.duration_days || 1) ? 'drive' : null,
      title: second.matchedActivity?.name || second.matchedLocation?.name || `Afternoon ${inferActivityType(day.content)}`,
      description: day.content.slice(200, 400).trim() + '...',
      activity_id: second.matchedActivity?.id || null,
      location_id: second.matchedLocation?.id || null,
      operator_id: second.matchedActivity?.operator_id || null,
      cost_from: second.matchedActivity?.price_from || null,
      cost_to: second.matchedActivity?.price_to || null,
      lat: second.matchedActivity?.lat || second.matchedLocation?.lat || null,
      lng: second.matchedActivity?.lng || second.matchedLocation?.lng || null,
      wet_alt_title: null,
      wet_alt_description: null,
      wet_alt_activity_id: null,
      wet_alt_cost_from: null,
      wet_alt_cost_to: null,
      budget_alt_title: null,
      budget_alt_description: null,
      budget_alt_activity_id: null,
      budget_alt_cost_from: null,
      budget_alt_cost_to: null,
      food_name: null,
      food_budget: null,
      food_link: null,
      food_notes: null,
      food_type: null,
      route_to_next_json: null
    });
    currentTime = '17:15';
  } else if (extractedActivities.length === 1) {
    // Create a generic afternoon activity
    stops.push({
      itinerary_id: itinerary.id,
      day_number: day.dayNumber,
      order_index: orderIndex++,
      stop_type: 'activity',
      start_time: currentTime,
      duration: '2h',
      travel_to_next: day.dayNumber < (itinerary.duration_days || 1) ? '20min drive' : null,
      travel_mode: day.dayNumber < (itinerary.duration_days || 1) ? 'drive' : null,
      title: `Afternoon exploration`,
      description: 'Continue your adventure with more activities in the area',
      activity_id: null,
      location_id: null,
      accommodation_id: null,
      operator_id: null,
      cost_from: null,
      cost_to: null,
      lat: null,
      lng: null,
      wet_alt_title: null,
      wet_alt_description: null,
      wet_alt_activity_id: null,
      wet_alt_cost_from: null,
      wet_alt_cost_to: null,
      budget_alt_title: null,
      budget_alt_description: null,
      budget_alt_activity_id: null,
      budget_alt_cost_from: null,
      budget_alt_cost_to: null,
      food_name: null,
      food_budget: null,
      food_link: null,
      food_notes: null,
      food_type: null,
      route_to_next_json: null
    });
  }
  
  // Accommodation (if not last day)
  if (day.dayNumber < (itinerary.duration_days || 1)) {
    // Try to find accommodation in the region
    const regionalAccommodation = accommodations.filter(a => 
      !itinerary.region_id || a.region_id === itinerary.region_id
    );
    
    const accom = regionalAccommodation.length > 0 ? regionalAccommodation[0] : null;
    
    stops.push({
      itinerary_id: itinerary.id,
      day_number: day.dayNumber,
      order_index: orderIndex++,
      stop_type: 'accommodation',
      start_time: '18:00',
      duration: 'overnight',
      travel_to_next: '5min drive',
      travel_mode: 'drive',
      title: accom?.name || 'Evening accommodation',
      description: accom ? `Stay at ${accom.name}` : 'Rest and recharge for tomorrow',
      activity_id: null,
      location_id: null,
      accommodation_id: accom?.id || null,
      operator_id: null,
      cost_from: accom?.price_from || '60',
      cost_to: accom?.price_to || '120',
      lat: accom?.lat || null,
      lng: accom?.lng || null,
      wet_alt_title: null,
      wet_alt_description: null,
      wet_alt_activity_id: null,
      wet_alt_cost_from: null,
      wet_alt_cost_to: null,
      budget_alt_title: 'Camping or hostel',
      budget_alt_description: 'Save money with camping or budget hostel accommodation',
      budget_alt_activity_id: null,
      budget_alt_cost_from: '15',
      budget_alt_cost_to: '40',
      food_name: null,
      food_budget: null,
      food_link: null,
      food_notes: null,
      food_type: null,
      route_to_next_json: null
    });
  }
  
  return stops;
}

// ============================
// WET WEATHER ALTERNATIVES
// ============================

const KNOWN_INDOOR_ACTIVITIES = [
  'Bounce Below',
  'Zip World Caverns',
  'King Arthur\'s Labyrinth',
  'National Slate Museum',
  'Llechwedd Slate Caverns',
  'Electric Mountain',
  'indoor climbing'
];

function generateWetAlternatives(
  stops: Stop[],
  activities: Activity[],
  locations: Location[]
): void {
  for (const stop of stops) {
    if (stop.stop_type !== 'activity') continue;
    if (!stop.title) continue;
    
    const activityType = inferActivityType(stop.title + ' ' + (stop.description || ''));
    
    // Only outdoor activities need wet alternatives
    if (activityType === 'underground') continue;
    
    // Try to find an indoor activity in the same region
    const indoorActivities = activities.filter(a => {
      const name = a.name.toLowerCase();
      return KNOWN_INDOOR_ACTIVITIES.some(indoor => 
        name.includes(indoor.toLowerCase())
      ) && (!stop.activity_id || a.region_id === activities.find(act => act.id === stop.activity_id)?.region_id);
    });
    
    if (indoorActivities.length > 0) {
      const wetAlt = indoorActivities[0];
      stop.wet_alt_title = wetAlt.name;
      stop.wet_alt_description = `Indoor alternative: ${wetAlt.name}`;
      stop.wet_alt_activity_id = wetAlt.id;
      stop.wet_alt_cost_from = wetAlt.price_from;
      stop.wet_alt_cost_to = wetAlt.price_to;
    } else {
      // Generate generic wet alternative
      const regionName = stop.activity_id ? 
        activities.find(a => a.id === stop.activity_id)?.region_id : null;
      
      stop.wet_alt_title = 'Visit local visitor centre or museum';
      stop.wet_alt_description = 'Explore indoor attractions, cafés, and local shops when the weather doesn\'t cooperate';
      stop.wet_alt_activity_id = null;
      stop.wet_alt_cost_from = '0';
      stop.wet_alt_cost_to = '10';
    }
  }
}

// ============================
// BUDGET ALTERNATIVES
// ============================

function generateBudgetAlternatives(
  stops: Stop[],
  activities: Activity[],
  locations: Location[]
): void {
  for (const stop of stops) {
    if (stop.stop_type !== 'activity') continue;
    if (!stop.cost_from || parseFloat(stop.cost_from) === 0) continue;
    
    // Try to find a free location in the same region
    const regionId = stop.activity_id ? 
      activities.find(a => a.id === stop.activity_id)?.region_id : null;
    
    const freeLocations = locations.filter(l => 
      !regionId || l.region_id === regionId
    );
    
    const activityType = inferActivityType(stop.title + ' ' + (stop.description || ''));
    
    if (activityType === 'water') {
      stop.budget_alt_title = 'Visit a local beach or coastal walk';
      stop.budget_alt_description = 'Enjoy the coastline for free with swimming, beach walks, and tide pooling';
      stop.budget_alt_cost_from = '0';
      stop.budget_alt_cost_to = '0';
    } else if (activityType === 'climbing') {
      stop.budget_alt_title = 'Outdoor bouldering or scrambling';
      stop.budget_alt_description = 'Find local boulders and natural climbing features for free';
      stop.budget_alt_cost_from = '0';
      stop.budget_alt_cost_to = '0';
    } else if (activityType === 'hiking') {
      stop.budget_alt_title = 'Self-guided mountain walk';
      stop.budget_alt_description = 'Explore the mountains independently with OS maps';
      stop.budget_alt_cost_from = '0';
      stop.budget_alt_cost_to = '0';
    } else {
      // Generic free alternative
      if (freeLocations.length > 0) {
        const loc = freeLocations[0];
        stop.budget_alt_title = `Visit ${loc.name}`;
        stop.budget_alt_description = `Free alternative: explore ${loc.name} independently`;
        stop.budget_alt_activity_id = null;
        stop.budget_alt_cost_from = '0';
        stop.budget_alt_cost_to = '0';
      } else {
        stop.budget_alt_title = 'Self-guided exploration';
        stop.budget_alt_description = 'Explore the area independently for free';
        stop.budget_alt_cost_from = '0';
        stop.budget_alt_cost_to = '0';
      }
    }
  }
}

// ============================
// MAIN SCRIPT
// ============================

async function main() {
  console.log('🏴󐁧󐁢󐁷󐁬󐁳󐁿 Adventure Wales Itinerary Enrichment Script\n');
  
  try {
    // Fetch all itineraries
    console.log('📖 Fetching itineraries...');
    const { rows: itineraries } = await sql<Itinerary>`
      SELECT id, title, description, region_id, duration_days
      FROM itineraries
      WHERE description IS NOT NULL
      ORDER BY id
    `;
    console.log(`Found ${itineraries.length} itineraries\n`);
    
    // Fetch reference data
    console.log('📚 Loading reference data...');
    const { rows: activities } = await sql<Activity>`
      SELECT id, name, region_id, lat, lng, price_from, price_to, operator_id
      FROM activities
    `;
    console.log(`  - ${activities.length} activities`);
    
    const { rows: accommodations } = await sql<Accommodation>`
      SELECT id, name, type, region_id, lat, lng, price_from, price_to
      FROM accommodation
    `;
    console.log(`  - ${accommodations.length} accommodations`);
    
    const { rows: locations } = await sql<Location>`
      SELECT id, name, region_id, lat, lng
      FROM locations
    `;
    console.log(`  - ${locations.length} locations\n`);
    
    // Process each itinerary
    const stats: Record<number, number> = {};
    
    for (const itinerary of itineraries) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${itinerary.title} (ID: ${itinerary.id})`);
      console.log('='.repeat(60));
      
      if (!itinerary.description || itinerary.description.trim().length < 50) {
        console.log('⚠️  Skipping - no description or too short');
        stats[itinerary.id] = 0;
        continue;
      }
      
      // Parse days from markdown
      const days = parseDaysFromMarkdown(itinerary.description);
      console.log(`📅 Found ${days.length} days`);
      
      if (days.length === 0) {
        console.log('⚠️  No day structure found in description');
        stats[itinerary.id] = 0;
        continue;
      }
      
      // Generate stops for each day
      const allStops: Stop[] = [];
      
      for (const day of days) {
        console.log(`\n  Day ${day.dayNumber}: ${day.title}`);
        const dayStops = generateDefaultStops(
          itinerary,
          day,
          activities,
          accommodations,
          locations
        );
        console.log(`    Generated ${dayStops.length} stops`);
        allStops.push(...dayStops);
      }
      
      // Generate alternatives
      console.log(`\n🌧️  Generating wet weather alternatives...`);
      generateWetAlternatives(allStops, activities, locations);
      
      console.log(`💰 Generating budget alternatives...`);
      generateBudgetAlternatives(allStops, activities, locations);
      
      // Insert stops into database
      console.log(`\n💾 Inserting ${allStops.length} stops into database...`);
      
      for (const stop of allStops) {
        await sql`
          INSERT INTO itinerary_stops (
            itinerary_id, day_number, order_index, stop_type,
            start_time, duration, travel_to_next, travel_mode,
            title, description,
            activity_id, accommodation_id, location_id, operator_id,
            cost_from, cost_to,
            wet_alt_title, wet_alt_description, wet_alt_activity_id,
            wet_alt_cost_from, wet_alt_cost_to,
            budget_alt_title, budget_alt_description, budget_alt_activity_id,
            budget_alt_cost_from, budget_alt_cost_to,
            food_name, food_budget, food_link, food_notes, food_type,
            lat, lng, route_to_next_json
          ) VALUES (
            ${stop.itinerary_id}, ${stop.day_number}, ${stop.order_index}, ${stop.stop_type},
            ${stop.start_time}, ${stop.duration}, ${stop.travel_to_next}, ${stop.travel_mode},
            ${stop.title}, ${stop.description},
            ${stop.activity_id}, ${stop.accommodation_id}, ${stop.location_id}, ${stop.operator_id},
            ${stop.cost_from}, ${stop.cost_to},
            ${stop.wet_alt_title}, ${stop.wet_alt_description}, ${stop.wet_alt_activity_id},
            ${stop.wet_alt_cost_from}, ${stop.wet_alt_cost_to},
            ${stop.budget_alt_title}, ${stop.budget_alt_description}, ${stop.budget_alt_activity_id},
            ${stop.budget_alt_cost_from}, ${stop.budget_alt_cost_to},
            ${stop.food_name}, ${stop.food_budget}, ${stop.food_link}, ${stop.food_notes}, ${stop.food_type},
            ${stop.lat}, ${stop.lng}, ${stop.route_to_next_json}
          )
        `;
      }
      
      stats[itinerary.id] = allStops.length;
      console.log(`✅ Successfully inserted ${allStops.length} stops`);
    }
    
    // Summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 ENRICHMENT SUMMARY');
    console.log('='.repeat(60));
    
    let totalStops = 0;
    for (const [itineraryId, count] of Object.entries(stats)) {
      const itinerary = itineraries.find(i => i.id === parseInt(itineraryId));
      console.log(`  ${itinerary?.title}: ${count} stops`);
      totalStops += count;
    }
    
    console.log(`\n🎉 Total stops created: ${totalStops}`);
    console.log(`✨ Enrichment complete!\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main().catch(console.error);
