import { db } from './src/db';
import { events } from './src/db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { execSync } from 'child_process';
import { existsSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import sharp from 'sharp';

const API_KEY = process.env.GEMINI_API_KEY!;
const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

interface EventRow {
  id: number;
  name: string;
  slug: string;
  category: string | null;
}

function getPrompt(slug: string, name: string): string {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();

  // Specific events
  if (s.includes('pendine-sands')) return 'Professional photo of racing cars on a wide flat sandy beach in Wales, dramatic sky, speed, Pendine Sands, golden hour light, action shot, no text or watermarks';
  if (s.includes('bog-snorkelling')) return 'Professional photo of a competitor swimming through a muddy peat bog trench in Wales, wearing snorkel and flippers, splashing water, green Welsh countryside, quirky sporting event, no text';
  if (s.includes('man-vs-horse')) return 'Professional photo of runners racing alongside horses on a Welsh country trail, green hills, bright summer day, action shot, no text or watermarks';
  if (s.includes('red-bull-hardline')) return 'Professional photo of an extreme mountain biker jumping off a steep rocky cliff face in a Welsh forest, massive air, dramatic angle, action shot, no text or watermarks';
  if (s.includes('coed-y-brenin-enduro')) return 'Professional photo of mountain bikers racing through dense Welsh forest trails, muddy conditions, autumn colours, action shot, no text or watermarks';
  if (s.includes('welsh-gravity-enduro')) return 'Professional photo of gravity enduro mountain bikers descending a steep Welsh hillside trail, dust flying, dramatic valley backdrop, action shot, no text or watermarks';
  if (s.includes('dragon-ride') && !s.includes('back')) return 'Professional photo of road cyclists climbing a steep mountain pass in the Brecon Beacons Wales, green valleys stretching below, dramatic clouds, peloton of riders, no text or watermarks';
  if (s.includes('etape-eryri')) return 'Professional photo of road cyclists riding through Snowdonia mountain passes in Wales, dramatic peaks, misty morning, epic Welsh scenery, peloton, no text or watermarks';
  if (s.includes('tour-of-britain')) return 'Professional photo of professional road cycling peloton racing through a picturesque Welsh village, crowds cheering, colourful jerseys, no text or watermarks';
  if (s.includes('welsh-one-day-hill-climb')) return 'Professional photo of a lone road cyclist climbing a steep Welsh mountain road, autumn colours, dramatic gradient, hill climb time trial, no text or watermarks';

  // Ironman / triathlon
  if (s.includes('ironman-wales')) return 'Professional photo of triathlon athletes running along a colourful harbour town in Wales, pastel houses, dramatic coastal scenery, golden hour, endurance racing, no text or watermarks';
  if (s.includes('ironkids')) return 'Professional photo of children running happily in a kids triathlon race on a Welsh beach, families cheering, colourful race bibs, sunny day, no text or watermarks';
  if (s.includes('slateman-triathlon')) return 'Professional photo of triathletes swimming in a deep blue Welsh quarry lake with slate mountains behind, Snowdonia, dramatic scenery, dawn light, no text or watermarks';
  if (s.includes('llandudno-triathlon')) return 'Professional photo of triathletes transitioning from swim to bike on a Welsh seafront, large headland in background, sunny morning, action shot, no text or watermarks';

  // Trail running / ultra
  if (s.includes('trail-marathon-wales')) return 'Professional photo of trail runners ascending a rugged Welsh mountain path, dramatic peaks in background, misty valleys, dramatic scenery, endurance running, no text or watermarks';
  if (s.includes('beast-of-the-beacons')) return 'Professional photo of ultra runners on a wild ridge in the Brecon Beacons Wales, stormy sky, windswept grass, dramatic mountain scenery, tough endurance race, no text or watermarks';
  if (s.includes('dragon') && s.includes('back')) return 'Professional photo of ultra runners traversing a dramatic Welsh mountain ridge, stunning panoramic views, multi-day stage race, epic wilderness, no text or watermarks';
  if (s.includes('sheultra')) return 'Professional photo of female ultra runners on a beautiful Welsh coastal trail at sunrise, empowering athletic shot, dramatic cliffs, no text or watermarks';
  if (s.includes('ogwen')) return 'Professional photo of fell runners racing up a steep rocky Welsh mountain, dramatic cwm and ridge, cloud inversion, action shot, no text or watermarks';
  if (s.includes('backyard-ultra') || s.includes('medieval-backyard')) return 'Professional photo of ultra runners on a loop trail in a Welsh woodland, medieval castle ruins in background, endurance running, atmospheric lighting, no text or watermarks';
  if (s.includes('radyr-trail')) return 'Professional photo of trail runners racing through autumn woodland near Cardiff Wales, dappled sunlight, muddy trail, colourful leaves, no text or watermarks';
  if (s.includes('caerphilly-trail')) return 'Professional photo of trail runners with a large medieval castle in the background, Welsh green hills, misty morning, dramatic fortress, action shot, no text or watermarks';
  if (s.includes('red-warrior')) return 'Professional photo of obstacle course racers covered in mud climbing a wall, Welsh hillside, tough military-style challenge, dramatic sky, no text or watermarks';

  // Road running events
  if (s.includes('cardiff-half')) return 'Professional photo of thousands of runners in a city half marathon passing a grand castle, autumn morning, city streets, mass participation running event, no text or watermarks';
  if (s.includes('newport-marathon')) return 'Professional photo of marathon runners crossing a modern bridge in a Welsh city, city skyline, dramatic clouds, mass participation road race, no text or watermarks';
  if (s.includes('swansea-half')) return 'Professional photo of half marathon runners along a Welsh bay promenade, sea views, headland in distance, sunny morning, mass participation, no text or watermarks';
  if (s.includes('conwy-half')) return 'Professional photo of half marathon runners passing a medieval castle in North Wales, ancient walls, dramatic sky, scenic road race, no text or watermarks';
  if (s.includes('great-welsh-marathon')) return 'Professional photo of marathon runners on a scenic Welsh coastal road, dramatic sky, green countryside meeting the sea, no text or watermarks';
  if (s.includes('llanelli-half')) return 'Professional photo of runners in a half marathon along a coastal path in Wales, wetlands, sea views, sunny morning, no text or watermarks';
  if (s.includes('anglesey-trail-half')) return 'Professional photo of trail runners on the Anglesey Coastal Path, rugged cliffs, turquoise sea, lighthouse in distance, dramatic Welsh coastline, no text or watermarks';
  if (s.includes('jones-o-gymru') || s.includes('anglesey-half')) return 'Professional photo of half marathon runners on a scenic Anglesey road, mountains across the strait, blue sky, Welsh landscape, no text or watermarks';
  if (s.includes('llandudno-10k') || s.includes('nick-beer')) return 'Professional photo of 10K runners along a Welsh seaside promenade, large headland in background, Victorian pier, sunny morning run, no text or watermarks';
  if (s.includes('abersoch-10k')) return 'Professional photo of 10K runners on a coastal road in North Wales, turquoise sea, sandy beaches, summer running event, no text or watermarks';
  if (s.includes('barry-island-10k')) return 'Professional photo of 10K runners along Barry Island seafront in Wales, colourful beach huts, bay view, sunny morning, mass participation, no text or watermarks';
  if (s.includes('chepstow-running')) return 'Professional photo of runners in a race festival near castle ruins, River Wye valley, autumn colours, historic Welsh border town, no text or watermarks';

  // Water sports
  if (s.includes('abersoch-dinghy')) return 'Professional photo of colourful sailing dinghies racing in a Welsh bay, blue sea, white sails, peninsula coastline, no text or watermarks';
  if (s.includes('rhosneigr-wave')) return 'Professional photo of windsurfers and kitesurfers riding big waves at a Welsh beach, dramatic spray, stormy sky, extreme water sports, no text or watermarks';
  if (s.includes('cardiff-bay-water')) return 'Professional photo of water sports festival at a Welsh bay, kayakers and paddleboarders on the water, modern architecture in background, sunny day, festival atmosphere, no text or watermarks';
  if (s.includes('wakestock')) return 'Professional photo of a wakeboarder performing an aerial trick at a Welsh coastal festival, crowd watching, blue water, summer festival vibes, action shot, no text or watermarks';

  // Walking / hiking festivals
  if (s.includes('snowdonia-walking')) return 'Professional photo of hikers walking on a mountain trail in Snowdonia Wales, dramatic peaks, clear mountain lake below, green valleys, epic Welsh landscape, no text or watermarks';
  if (s.includes('pembrokeshire-coast-path')) return 'Professional photo of walkers on the Pembrokeshire Coast Path Wales, dramatic sea cliffs, wildflowers, turquoise sea, stunning coastal scenery, no text or watermarks';
  if (s.includes('wales-coast-path')) return 'Professional photo of walkers on the Wales Coast Path, dramatic cliff-top trail, sweeping views of the Celtic Sea, wildflowers, golden hour light, no text or watermarks';

  // Other
  if (s.includes('adventure-travel-world')) return 'Professional photo of adventure tourism landscape in Wales, zip line over a quarry, dramatic mountains, people enjoying outdoor activities, epic scenery, no text or watermarks';
  if (s.includes('green-man-festival')) return 'Professional photo of a music festival in the Brecon Beacons Wales at twilight, fairy lights, green mountains, festival crowd, atmospheric sunset, no text or watermarks';
  if (s.includes('trails-tarmac-winter')) return 'Professional photo of ultra runners on a winter trail loop in Welsh countryside, frost on ground, bare trees, atmospheric winter light, endurance running, no text or watermarks';

  // Generic Welsh adventure fallback
  return 'Professional photo of athletes competing in an outdoor adventure race in the Welsh mountains, dramatic scenery, green valleys, epic landscape, action shot, no text or watermarks';
}

async function generateImage(prompt: string, outputPath: string): Promise<boolean> {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: `Generate a professional photograph: ${prompt}` }] }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
  });

  const tmpJson = `/tmp/gemini-request-${Date.now()}.json`;
  writeFileSync(tmpJson, body);

  try {
    const result = execSync(
      `curl -s -X POST "${API_URL}" -H "Content-Type: application/json" -d @${tmpJson}`,
      { timeout: 120000, maxBuffer: 50 * 1024 * 1024 }
    ).toString();

    unlinkSync(tmpJson);

    const data = JSON.parse(result);
    if (data.error) {
      console.log(`    API Error: ${data.error.message?.substring(0, 200)}`);
      return false;
    }

    for (const candidate of data.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          const imgBuffer = Buffer.from(part.inlineData.data, 'base64');
          // Resize to 1200x630 and save as JPG
          await sharp(imgBuffer)
            .resize(1200, 630, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toFile(outputPath);
          return true;
        }
      }
    }

    console.log('    No image in response');
    return false;
  } catch (err: any) {
    try { unlinkSync(tmpJson); } catch {}
    console.log(`    Error: ${err.message?.substring(0, 200)}`);
    return false;
  }
}

async function run() {
  if (!API_KEY) {
    console.error('GEMINI_API_KEY not set');
    process.exit(1);
  }

  const evts = await db
    .select({ id: events.id, name: events.name, slug: events.slug, category: events.category })
    .from(events)
    .where(and(eq(events.status, 'published'), isNull(events.heroImage)));

  console.log(`Found ${evts.length} events without hero images\n`);

  let success = 0;
  let failed = 0;

  for (const evt of evts) {
    const jpgFile = `public/images/events/${evt.slug}-hero.jpg`;
    const dbPath = `/images/events/${evt.slug}-hero.jpg`;

    // Skip if already generated locally
    if (existsSync(jpgFile)) {
      console.log(`[SKIP] ${evt.slug} — file exists, updating DB only`);
      await db.update(events).set({ heroImage: dbPath }).where(eq(events.id, evt.id));
      success++;
      continue;
    }

    const prompt = getPrompt(evt.slug, evt.name);
    const idx = success + failed + 1;
    console.log(`[${idx}/${evts.length}] ${evt.slug}`);
    console.log(`  Prompt: ${prompt.substring(0, 90)}...`);

    const ok = await generateImage(prompt, jpgFile);

    if (ok && existsSync(jpgFile)) {
      await db.update(events).set({ heroImage: dbPath }).where(eq(events.id, evt.id));
      const size = (readFileSync(jpgFile).length / 1024).toFixed(0);
      console.log(`  ✅ Saved (${size}KB) → ${dbPath}`);
      success++;
    } else {
      console.log(`  ❌ Failed`);
      failed++;
    }

    // Rate limit: 3s between requests
    if (idx < evts.length) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\n=== COMPLETE: ${success} success, ${failed} failed out of ${evts.length} ===`);
  process.exit(0);
}

run();
