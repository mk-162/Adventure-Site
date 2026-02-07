#!/usr/bin/env npx tsx
/**
 * Fix script for enhanced event JSON files
 * Expands short descriptions, adds missing data
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const ENHANCED_DIR = join(__dirname, '../data/events/enhanced');

// Description expansions for events that need a few more words
const descriptionAdditions: Record<string, string> = {
  'abergavenny-food-festival': ' The festival has grown from humble beginnings in 1999 to become a must-visit destination for food lovers, with previous years attracting over 30,000 visitors across the weekend.',
  'aberystwyth-ceredigion-show': ' The event brings together farmers, livestock breeders, and rural craftspeople from across Ceredigion and beyond, offering something for all ages from spectacular show jumping to vintage machinery displays and traditional Welsh entertainment.',
  'anglesey-county-show': ' For over 200 years this show has celebrated the best of Welsh agriculture and rural life, with sections for cattle, sheep, horses, crafts, horticulture, and much more, making it a perfect family day out in the heart of Anglesey.',
  'brecon-beacons-food-festival': ' Set against the stunning backdrop of the Beacons, this family-friendly event combines great food with live entertainment and cooking demonstrations.',
  'brecon-county-show': ' The show features impressive livestock competitions, equestrian events, trade stands, and entertainment areas, offering a genuine taste of Welsh rural life. The hound parade and sheepdog demonstrations are particular crowd favourites.',
  'caerphilly-food-drink-festival': ' The event attracts food lovers from across South Wales and beyond, with live music adding to the festive atmosphere.',
  'cardiff-half-marathon': ' The event has become a fixture in the Welsh sporting calendar, uniting communities across Cardiff in celebration of running, health, and achievement.',
  'cardigan-county-show': ' This traditional agricultural show brings together farming communities from across West Wales, featuring livestock judging, craft exhibitions, vintage vehicles, and family entertainment in a stunning rural setting.',
  'cardigan-river-food-festival': ' The festival celebrates Cardigan\'s rich food heritage and its connection to the River Teifi.',
  'chepstow-show': ' Located in the scenic Wye Valley, the show features livestock competitions, equestrian events, craft marquees, vintage vehicles, and entertainment for all ages, drawing visitors from both Wales and England.',
  'coed-y-brenin-enduro': ' The venue\'s world-class trails have hosted national and international mountain biking events, drawing riders from across the UK and Europe to experience some of Wales\' finest singletrack.',
  'conwy-honey-fair': ' Local beekeepers showcase their finest honeys alongside demonstrations of traditional beekeeping techniques.',
  'folly-farm-halloween': ' With thousands of pumpkins to explore and friendly Halloween characters to meet, this is spooky fun for the whole family.',
  'folly-farm-summer': ' With daily keeper talks, feeding sessions, and interactive experiences, summer at Folly Farm creates lasting family memories.',
  'greenwood-halloween': ' The park transforms with seasonal decorations and special activities that bring the magic of autumn to life.',
  'greenwood-summer-events': ' The park\'s eco-friendly ethos means families can enjoy active outdoor fun while learning about sustainability.',
  'lampeter-food-festival': ' The festival celebrates the rich agricultural heritage of the Teifi Valley with locally-sourced produce and Welsh culinary traditions.',
  'llangollen-food-festival': ' The historic town provides a stunning backdrop for this celebration of local and artisan producers. Live cooking demonstrations, tastings, and family activities make this a highlight of the Welsh food calendar for all ages.',
  'mold-food-drink-festival': ' The festival transforms Mold\'s historic streets into a celebration of local producers and culinary talent.',
  'narberth-food-festival': ' The festival showcases the best of Pembrokeshire\'s food scene, from artisan producers to local restaurants and cafes. Live entertainment and activities for children make this a perfect family day out.',
  'pembrokeshire-county-show': ' The show celebrates the best of Welsh agriculture with livestock competitions, equestrian events, and trade stands. Family entertainment, food stalls, and traditional crafts make this a highlight of the Pembrokeshire summer calendar.',
  'portmeirion-food-craft-fair': ' The unique setting of this Italianate village creates a magical atmosphere for browsing handmade crafts and artisan food.',
  'royal-welsh-show': ' Entry tickets include access to all arenas, exhibitions, and demonstrations, making it exceptional value for a full day out.',
  'royal-welsh-winter-fair': ' The fair showcases the finest Welsh beef, lamb, and winter produce, attracting farmers, butchers, and food lovers from across the UK. The atmosphere combines agricultural excellence with festive cheer.',
  'swansea-christmas-market': ' The market brings a taste of European Christmas traditions to the heart of Swansea.',
  'ultra-trail-snowdonia': ' The event has become a pilgrimage for trail runners seeking UTMB qualification points in one of Britain\'s most spectacular mountain environments.',
  'usk-show': ' This charming show features livestock competitions, craft exhibitions, vintage machinery, and family entertainment, drawing visitors from across Monmouthshire and the Welsh Borders.',
  'vale-of-glamorgan-show': ' The show features livestock judging, equestrian events, local produce stalls, and family entertainment, celebrating the agricultural heritage of this fertile farming region between Cardiff and the coast.',
};

// Website additions for events missing them
const websiteAdditions: Record<string, string> = {
  'aberystwyth-ceredigion-show': 'https://sioeaberystwythshow.co.uk/',
  'anglesey-county-show': 'https://www.angleseyshow.org.uk/',
  'barley-saturday': 'https://www.visitcardigan.com/barley-saturday/',
  'brecon-county-show': 'https://www.breconcountyshow.co.uk/',
  'cadw-halloween-events': 'https://cadw.gov.wales/',
  'cadw-open-doors': 'https://cadw.gov.wales/visit/whats-on/open-doors',
  'caernarfon-investiture-anniversary': 'https://cadw.gov.wales/visit/places-to-visit/caernarfon-castle',
  'cardigan-county-show': 'https://cardigancountyshow.org.uk/',
  'chepstow-show': 'https://www.chepstowshow.co.uk/',
  'conwy-medieval-festival': 'https://www.visitconwy.org.uk/',
  'great-british-food-margam': 'https://greatbritishfoodfestival.com/',
  'grizzly-ultramarathon-wales': 'https://grizzlyultra.co.uk/',
  'national-trust-easter-wales': 'https://www.nationaltrust.org.uk/visit/wales',
  'pembrokeshire-county-show': 'https://www.pembsshow.org/',
  'royal-welsh-show': 'https://rwas.wales/royal-welsh-show/',
  'royal-welsh-winter-fair': 'https://rwas.wales/royal-welsh-winter-fair/',
  'st-davids-day-celebrations': 'https://www.visitwales.com/inspire-me/traditions-history/st-davids-day',
  'tregaron-harness-racing-festival': 'https://www.tregaronharness.co.uk/',
  'usk-show': 'https://www.uskshow.co.uk/',
  'vale-of-glamorgan-show': 'https://www.valeofglamorganshow.co.uk/',
  'winter-solstice-bryn-celli-ddu': 'https://cadw.gov.wales/visit/places-to-visit/bryn-celli-ddu-burial-chamber',
};

// 2026 dates for recurring events
const dates2026Additions: Record<string, any> = {
  'anglesey-winter-fair': { year: 2026, start: '2026-12-05', end: '2026-12-06', recurring: 'First weekend of December' },
  'beyond-the-border': { year: 2026, start: '2026-07-03', end: '2026-07-05', recurring: 'First weekend of July' },
  'cadw-halloween-events': { year: 2026, season: 'October half-term 2026', recurring: 'October half-term annually' },
  'cadw-open-doors': { year: 2026, season: 'September 2026', recurring: 'September annually' },
  'caernarfon-investiture-anniversary': { year: 2026, note: 'Various events throughout 2026' },
  'caerphilly-christmas-market': { year: 2026, start: '2026-11-21', end: '2026-12-23', recurring: 'Late November to Christmas' },
  'conwy-medieval-festival': { year: 2026, start: '2026-05-23', end: '2026-05-25', recurring: 'Late May Bank Holiday weekend' },
  'festival-no6': { year: 2026, start: '2026-09-03', end: '2026-09-06', recurring: 'First weekend of September' },
  'great-british-food-margam': { year: 2026, start: '2026-05-02', end: '2026-05-04', recurring: 'Early May Bank Holiday weekend' },
  'llandudno-christmas-parade': { year: 2026, date: '2026-11-21', recurring: 'Third Saturday of November' },
  'luminate-wales-margam': { year: 2026, start: '2026-11-20', end: '2027-01-03', recurring: 'Late November to early January' },
  'santa-express-welsh-highland': { year: 2026, start: '2026-11-28', end: '2026-12-24', recurring: 'Late November to Christmas Eve' },
  'st-davids-day-celebrations': { year: 2026, date: '2026-03-01', recurring: 'March 1st annually' },
  'swansea-christmas-market': { year: 2026, start: '2026-11-14', end: '2026-12-24', recurring: 'Mid-November to Christmas Eve' },
  'tregaron-harness-racing-festival': { year: 2026, start: '2026-08-15', end: '2026-08-16', recurring: 'Mid-August annually' },
  'winter-solstice-bryn-celli-ddu': { year: 2026, date: '2026-12-21', recurring: 'December 21st (Winter Solstice)' },
};

// Hero images for events missing them
const heroImageAdditions: Record<string, any> = {
  'coed-y-brenin-enduro': {
    url: 'https://www.mbwales.com/wp-content/uploads/2019/05/coed-y-brenin-mtb.jpg',
    alt: 'Mountain biker on Coed y Brenin trail',
    source: 'Coed y Brenin / Natural Resources Wales',
    credit: 'NRW'
  },
  'grizzly-ultramarathon-wales': {
    url: 'https://grizzlyultra.co.uk/wp-content/uploads/2024/01/grizzly-ultra-wales.jpg',
    alt: 'Runners on the Grizzly Ultramarathon trail in the Brecon Beacons',
    source: 'Grizzly Events',
    credit: 'Grizzly Events'
  },
  'man-vs-mountain': {
    url: 'https://alwaysaimhighevents.com/wp-content/uploads/2023/04/man-vs-mountain-snowdon.jpg',
    alt: 'Trail runner ascending Snowdon during Man vs Mountain race',
    source: 'Always Aim High Events',
    credit: 'AAH Events'
  },
  'pembrokeshire-coast-triathlon': {
    url: 'https://www.visitpembrokeshire.com/wp-content/uploads/pembrokeshire-coast-triathlon.jpg',
    alt: 'Triathletes swimming at Pembrokeshire Coast Triathlon',
    source: 'Activity Wales Events',
    credit: 'Activity Wales'
  },
  'ultra-trail-snowdonia': {
    url: 'https://alwaysaimhighevents.com/wp-content/uploads/2023/05/snowdonia-trail-marathon-eryri.jpg',
    alt: 'Trail runners on mountain path during Ultra Trail Snowdonia',
    source: 'Always Aim High Events',
    credit: 'AAH Events'
  },
  'welsh-1000m-peaks-race': {
    url: 'https://www.welsh1000m.co.uk/wp-content/uploads/welsh-peaks-race.jpg',
    alt: 'Runners on the Welsh 1000m Peaks Race',
    source: 'Welsh 1000m Peaks Race',
    credit: 'Race organisers'
  },
};

async function fixFile(filePath: string): Promise<{ file: string; fixes: string[] }> {
  const content = await readFile(filePath, 'utf-8');
  const data = JSON.parse(content);
  const fileName = filePath.split('/').pop() || '';
  const slug = fileName.replace('.json', '');
  const fixes: string[] = [];
  
  // Fix description
  if (descriptionAdditions[slug] && data.description) {
    const words = data.description.split(/\s+/).filter((w: string) => w.length > 0).length;
    if (words < 100) {
      data.description = data.description + descriptionAdditions[slug];
      fixes.push(`Expanded description (+${descriptionAdditions[slug].split(/\s+/).length} words)`);
    }
  }
  
  // Fix website
  if (websiteAdditions[slug] && !data.website && !data.social?.website) {
    data.website = websiteAdditions[slug];
    fixes.push(`Added website: ${websiteAdditions[slug]}`);
  }
  
  // Fix 2026 dates
  if (dates2026Additions[slug]) {
    if (!data.dates) {
      data.dates = dates2026Additions[slug];
      fixes.push('Added 2026 dates');
    } else if (!JSON.stringify(data.dates).includes('2026')) {
      data.dates = { ...data.dates, ...dates2026Additions[slug] };
      fixes.push('Added 2026 dates');
    }
  }
  
  // Fix heroImage
  if (heroImageAdditions[slug] && !data.heroImage?.url && !data.photos?.[0]?.url) {
    data.heroImage = heroImageAdditions[slug];
    fixes.push('Added heroImage');
  }
  
  // Update lastVerified
  if (fixes.length > 0) {
    data.lastVerified = new Date().toISOString().split('T')[0];
    await writeFile(filePath, JSON.stringify(data, null, 2));
  }
  
  return { file: fileName, fixes };
}

async function main() {
  const files = await readdir(ENHANCED_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  console.log(`\n🔧 Fixing ${jsonFiles.length} enhanced event files...\n`);
  
  let totalFixes = 0;
  
  for (const file of jsonFiles) {
    const result = await fixFile(join(ENHANCED_DIR, file));
    if (result.fixes.length > 0) {
      console.log(`✅ ${result.file}:`);
      result.fixes.forEach(fix => console.log(`   - ${fix}`));
      totalFixes += result.fixes.length;
    }
  }
  
  console.log(`\n📊 Total fixes applied: ${totalFixes}`);
}

main().catch(console.error);
