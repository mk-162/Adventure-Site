/**
 * Research utilities for Adventure Wales content enrichment
 * Uses Perplexity API for deep research and Brave for quick searches
 */

import 'dotenv/config';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  citations?: string[];
}

/**
 * Deep research query using Perplexity's sonar model
 * Best for: location details, historical context, insider knowledge, comprehensive guides
 */
export async function deepResearch(query: string, systemPrompt?: string): Promise<{ content: string; citations: string[] }> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY not set');
  }

  const messages: PerplexityMessage[] = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  } else {
    messages.push({
      role: 'system',
      content: `You are an expert travel researcher specializing in Wales. Provide detailed, accurate, and locally-informed information. Include specific details like place names, distances, prices where known, and insider tips that only locals would know. Cite your sources.`
    });
  }
  
  messages.push({ role: 'user', content: query });

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages,
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${error}`);
  }

  const data: PerplexityResponse = await response.json();
  
  return {
    content: data.choices[0]?.message?.content || '',
    citations: data.citations || [],
  };
}

/**
 * Quick search for specific facts using Perplexity
 * Best for: opening hours, prices, specific details, recent info
 */
export async function quickSearch(query: string): Promise<string> {
  const result = await deepResearch(query, 
    'You are a helpful assistant. Provide concise, factual answers. If you don\'t know, say so.'
  );
  return result.content;
}

/**
 * Research a Welsh location/region for Adventure Wales
 */
export async function researchLocation(locationName: string, locationType: 'region' | 'town' | 'attraction'): Promise<{
  overview: string;
  keyFacts: string[];
  bestFor: string[];
  gettingThere: string;
  insiderTips: string[];
  seasonalAdvice: string;
  citations: string[];
}> {
  const query = `
    Research ${locationName} in Wales for an adventure tourism website. I need:
    
    1. OVERVIEW: 2-3 paragraphs about what makes this place special for outdoor adventures and tourism. Include what sets it apart from other Welsh destinations.
    
    2. KEY FACTS: 5-8 specific facts (area size, population, notable features, UNESCO status, national park details, etc.)
    
    3. BEST FOR: What activities/experiences is this location best known for? List 5-10.
    
    4. GETTING THERE: How to reach this location from major UK cities (London, Birmingham, Manchester). Include train stations, main roads, approximate journey times.
    
    5. INSIDER TIPS: 5-8 things only locals would know - best hidden spots, when to visit to avoid crowds, local customs, where to eat, parking tips, etc.
    
    6. SEASONAL ADVICE: Best times to visit for different activities, what to expect in each season, any seasonal events or considerations.
    
    Be specific with names, distances, and details. This is for a premium adventure tourism guide.
  `;

  const result = await deepResearch(query);
  
  // Parse the response (this is a simplified parser - in production you'd want more robust parsing)
  const content = result.content;
  
  return {
    overview: extractSection(content, 'OVERVIEW'),
    keyFacts: extractList(content, 'KEY FACTS'),
    bestFor: extractList(content, 'BEST FOR'),
    gettingThere: extractSection(content, 'GETTING THERE'),
    insiderTips: extractList(content, 'INSIDER TIPS'),
    seasonalAdvice: extractSection(content, 'SEASONAL ADVICE'),
    citations: result.citations,
  };
}

/**
 * Research an activity type in Wales
 */
export async function researchActivity(activityName: string): Promise<{
  overview: string;
  whyWales: string;
  bestLocations: Array<{ name: string; description: string; bestFor: string }>;
  seasonGuide: string;
  skillLevels: string;
  gearAdvice: string;
  safetyTips: string[];
  citations: string[];
}> {
  const query = `
    Research ${activityName} in Wales for a comprehensive adventure guide. I need:
    
    1. OVERVIEW: 2-3 paragraphs about ${activityName} in Wales - the scene, the community, what makes it special here.
    
    2. WHY WALES: What makes Wales particularly good for ${activityName}? What's unique here compared to other UK/European destinations?
    
    3. BEST LOCATIONS: Top 8-10 specific locations for ${activityName} in Wales. For each, provide:
       - Name of the spot/venue
       - Brief description (what it's like, difficulty)
       - Who it's best for (beginners, experts, families, etc.)
    
    4. SEASON GUIDE: Best times of year for ${activityName} in Wales. What to expect each season.
    
    5. SKILL LEVELS: Breakdown of what's available for complete beginners vs intermediates vs experts.
    
    6. GEAR ADVICE: What equipment is needed, what can be hired locally, what to bring.
    
    7. SAFETY TIPS: 5-8 specific safety considerations for ${activityName} in Wales.
    
    Be specific with real place names, operator names where relevant, and Welsh-specific details.
  `;

  const result = await deepResearch(query);
  const content = result.content;
  
  return {
    overview: extractSection(content, 'OVERVIEW'),
    whyWales: extractSection(content, 'WHY WALES'),
    bestLocations: parseLocations(extractSection(content, 'BEST LOCATIONS')),
    seasonGuide: extractSection(content, 'SEASON GUIDE'),
    skillLevels: extractSection(content, 'SKILL LEVELS'),
    gearAdvice: extractSection(content, 'GEAR ADVICE'),
    safetyTips: extractList(content, 'SAFETY TIPS'),
    citations: result.citations,
  };
}

/**
 * Research a specific combo (activity + region)
 */
export async function researchCombo(activityName: string, regionName: string): Promise<{
  introduction: string;
  topSpots: Array<{ name: string; description: string; difficulty: string; highlight: string }>;
  practicalInfo: string;
  localOperators: string[];
  bestTimeToVisit: string;
  insiderTips: string[];
  faqs: Array<{ question: string; answer: string }>;
  citations: string[];
}> {
  const query = `
    Create a comprehensive guide for ${activityName} in ${regionName}, Wales. I need:
    
    1. INTRODUCTION: 2-3 engaging paragraphs about doing ${activityName} specifically in ${regionName}. What makes this region special for this activity? What can visitors expect?
    
    2. TOP SPOTS: The 5-8 best specific locations for ${activityName} in ${regionName}. For each:
       - Exact name/location
       - What it's like and what makes it special
       - Difficulty level (beginner/intermediate/advanced)
       - One standout highlight or reason to visit
    
    3. PRACTICAL INFO: Parking, facilities, access points, any fees, best approach routes.
    
    4. LOCAL OPERATORS: Names of guide companies, rental shops, or instruction centers for ${activityName} in ${regionName}. Real business names only.
    
    5. BEST TIME TO VISIT: Specific seasonal advice for ${activityName} in ${regionName}.
    
    6. INSIDER TIPS: 5-8 local secrets - less crowded alternatives, best conditions, where to go after, local cafes/pubs.
    
    7. FAQS: 5-6 common questions visitors ask about ${activityName} in ${regionName}, with detailed answers.
    
    Be extremely specific with real place names, grid references where useful, and Welsh-specific details.
  `;

  const result = await deepResearch(query);
  const content = result.content;
  
  return {
    introduction: extractSection(content, 'INTRODUCTION'),
    topSpots: parseSpots(extractSection(content, 'TOP SPOTS')),
    practicalInfo: extractSection(content, 'PRACTICAL INFO'),
    localOperators: extractList(content, 'LOCAL OPERATORS'),
    bestTimeToVisit: extractSection(content, 'BEST TIME TO VISIT'),
    insiderTips: extractList(content, 'INSIDER TIPS'),
    faqs: parseFaqs(extractSection(content, 'FAQS')),
    citations: result.citations,
  };
}

// Helper functions for parsing
function extractSection(content: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}[:\\s]*([\\s\\S]*?)(?=\\n\\d+\\.|\\n[A-Z]{2,}|$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function extractList(content: string, sectionName: string): string[] {
  const section = extractSection(content, sectionName);
  const lines = section.split('\n').filter(line => line.trim());
  return lines.map(line => line.replace(/^[-•*\d.)\s]+/, '').trim()).filter(Boolean);
}

function parseLocations(text: string): Array<{ name: string; description: string; bestFor: string }> {
  // Simplified parser - returns raw text items for now
  const items = text.split(/\n(?=[-•*\d])/);
  return items.filter(Boolean).map(item => ({
    name: item.split(/[-–:]/)[0]?.trim() || item.slice(0, 50),
    description: item,
    bestFor: 'All levels',
  }));
}

function parseSpots(text: string): Array<{ name: string; description: string; difficulty: string; highlight: string }> {
  const items = text.split(/\n(?=[-•*\d])/);
  return items.filter(Boolean).map(item => ({
    name: item.split(/[-–:]/)[0]?.trim() || item.slice(0, 50),
    description: item,
    difficulty: 'Varies',
    highlight: '',
  }));
}

function parseFaqs(text: string): Array<{ question: string; answer: string }> {
  const items = text.split(/\n(?=[-•*\d]|\?)/);
  return items.filter(Boolean).map(item => {
    const [q, ...a] = item.split('?');
    return {
      question: (q + '?').replace(/^[-•*\d.)\s]+/, '').trim(),
      answer: a.join('?').trim(),
    };
  });
}

// CLI for testing
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  (async () => {
    try {
      switch (command) {
        case 'location':
          console.log(JSON.stringify(await researchLocation(args[1], args[2] as any || 'region'), null, 2));
          break;
        case 'activity':
          console.log(JSON.stringify(await researchActivity(args[1]), null, 2));
          break;
        case 'combo':
          console.log(JSON.stringify(await researchCombo(args[1], args[2]), null, 2));
          break;
        case 'query':
          console.log(JSON.stringify(await deepResearch(args.slice(1).join(' ')), null, 2));
          break;
        default:
          console.log('Usage: npx tsx scripts/research-utils.ts <command> [args]');
          console.log('Commands: location <name>, activity <name>, combo <activity> <region>, query <text>');
      }
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}
