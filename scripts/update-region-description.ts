/**
 * Update region descriptions in the database
 * Usage: npx tsx scripts/update-region-description.ts <slug>
 */

import 'dotenv/config';
import { sql } from '@vercel/postgres';
import { snowdoniaData } from '../data/regions/snowdonia';
import { pembrokeshireData } from '../data/regions/pembrokeshire';
import { breconBeaconsData } from '../data/regions/brecon-beacons';

const regionDataMap: Record<string, any> = {
  snowdonia: snowdoniaData,
  pembrokeshire: pembrokeshireData,
  'brecon-beacons': breconBeaconsData,
};

// Build a rich description from the data
function buildDescription(data: typeof snowdoniaData): string {
  const parts: string[] = [];
  
  // Hero content
  parts.push(data.heroContent);
  
  // Best For section
  parts.push('\n\n**Best For:**');
  data.bestFor.slice(0, 5).forEach(item => {
    parts.push(`• ${item.activity}: ${item.description}`);
  });
  
  // Best Time to Visit
  parts.push('\n\n**Best Time to Visit:**');
  parts.push('The shoulder seasons – late spring (May-June) and early autumn (September-October) – offer the sweet spot. ' +
    'The weather is generally milder, the crowds are thinner than in peak summer, and the scenery is at its most vibrant. ' +
    'July and August are the busiest months, with trails and attractions packed, and accommodation prices soaring.\n\n' +
    "Be aware that Snowdonia's weather can be unpredictable year-round. Even in summer, be prepared for rain and wind, " +
    'especially at higher elevations. Winter brings snow and ice, making some routes impassable without proper equipment and experience.');
  
  // Getting There
  parts.push('\n\n**Getting There:**');
  parts.push('The nearest major airport is Manchester Airport (MAN), approximately 1.5-2 hours drive away. ' +
    'Liverpool John Lennon Airport (LPL) is slightly closer but offers fewer international flights. ' +
    'Bangor is the main train station serving Snowdonia, with direct connections to major UK cities like London (3.5 hrs), ' +
    'Manchester (2 hrs), and Birmingham (2.5 hrs). Driving offers the most flexibility for exploring the region. ' +
    'From London, expect a 4-5 hour drive (280 miles via M1/M6/A55).');
  
  // Pro Tips
  parts.push('\n\n**Pro Tips:**');
  data.insiderTips.slice(0, 5).forEach(tip => {
    parts.push(`• ${tip.tip}: ${tip.detail}`);
  });
  
  return parts.join('\n');
}

async function main() {
  const slug = process.argv[2];
  
  if (!slug) {
    console.error('Usage: npx tsx scripts/update-region-description.ts <slug>');
    process.exit(1);
  }
  
  const data = regionDataMap[slug];
  if (!data) {
    console.error(`No data found for region: ${slug}`);
    console.log('Available regions:', Object.keys(regionDataMap).join(', '));
    process.exit(1);
  }
  
  const description = buildDescription(data);
  
  console.log('Updating region:', slug);
  console.log('Description length:', description.length, 'characters');
  
  await sql`
    UPDATE regions 
    SET description = ${description}, updated_at = NOW()
    WHERE slug = ${slug}
  `;
  
  console.log('✓ Updated successfully');
}

main().catch(console.error);
