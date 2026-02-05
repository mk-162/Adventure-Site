import { db } from './src/db';
import { events } from './src/db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import sharp from 'sharp';

const SCRIPT = '/home/minigeek/.npm-global/lib/node_modules/clawdbot/skills/nano-banana-pro/scripts/generate_image.py';

// Map event slugs/names to appropriate prompts
function getPrompt(slug: string, name: string): string {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();

  // Specific events
  if (s.includes('pendine-sands')) return 'Professional photo of vintage hot rod cars racing on a wide flat sandy beach in Wales, dramatic sky, speed blur, Pendine Sands, golden hour light, action shot';
  if (s.includes('bog-snorkelling')) return 'Professional photo of a competitor swimming through a muddy peat bog trench in Wales, wearing snorkel and flippers, splashing water, green Welsh countryside, quirky sporting event';
  if (s.includes('man-vs-horse')) return 'Professional photo of runners racing alongside horses on a Welsh country trail, green hills, Llanwrtyd Wells, bright summer day, action shot';
  if (s.includes('red-bull-hardline')) return 'Professional photo of an extreme mountain biker jumping off a steep rocky cliff face in a Welsh forest, massive air, dramatic angle, Red Bull style action shot';
  if (s.includes('coed-y-brenin-enduro')) return 'Professional photo of mountain bikers racing through dense Welsh forest trails, muddy conditions, Coed y Brenin, autumn colours, action shot';
  if (s.includes('welsh-gravity-enduro')) return 'Professional photo of gravity enduro mountain bikers descending a steep Welsh hillside trail, dust flying, dramatic valley backdrop, action shot';
  if (s.includes('dragon-ride') && !s.includes('back')) return 'Professional photo of road cyclists climbing a steep mountain pass in the Brecon Beacons Wales, green valleys stretching below, dramatic clouds, peloton of riders';
  if (s.includes('etape-eryri')) return 'Professional photo of road cyclists riding through Snowdonia mountain passes in Wales, dramatic peaks, misty morning, epic Welsh scenery, peloton';
  if (s.includes('tour-of-britain')) return 'Professional photo of professional road cycling peloton racing through a picturesque Welsh village, crowds cheering, colourful jerseys, Tour of Britain';
  if (s.includes('welsh-one-day-hill-climb')) return 'Professional photo of a lone road cyclist climbing a steep Welsh mountain road, autumn colours, dramatic gradient, hill climb time trial';
  
  // Ironman / triathlon
  if (s.includes('ironman-wales')) return 'Professional photo of IRONMAN triathlon athletes running along Tenby harbour in Wales, colourful harbour houses, dramatic coastal scenery, golden hour, endurance racing';
  if (s.includes('ironkids')) return 'Professional photo of children running happily in a triathlon kids race on a Welsh beach, families cheering, colourful race bibs, sunny day, Tenby Wales';
  if (s.includes('slateman-triathlon')) return 'Professional photo of triathletes swimming in a deep blue Welsh quarry lake with slate mountains behind, Snowdonia, dramatic scenery, dawn light';
  if (s.includes('llandudno-triathlon')) return 'Professional photo of triathletes transitioning from swim to bike on Llandudno seafront, Great Orme headland in background, sunny morning, action shot';
  
  // Trail running / ultra
  if (s.includes('trail-marathon-wales')) return 'Professional photo of trail runners ascending a rugged Welsh mountain path, Snowdonia peaks in background, misty valleys, dramatic scenery, endurance running';
  if (s.includes('beast-of-the-beacons')) return 'Professional photo of ultra runners on a wild ridge in the Brecon Beacons Wales, stormy sky, windswept grass, dramatic mountain scenery, tough endurance race';
  if (s.includes('dragon') && s.includes('back')) return 'Professional photo of ultra runners traversing a dramatic Welsh mountain ridge, stunning panoramic views, multi-day stage race, epic wilderness, Dragons Back Race';
  if (s.includes('sheultra')) return 'Professional photo of female ultra runners on a beautiful Welsh coastal trail at sunrise, empowering athletic shot, dramatic cliffs, women in sport';
  if (s.includes('ogwen')) return 'Professional photo of fell runners racing up a steep rocky Welsh mountain, Ogwen Valley, dramatic cwm and ridge, cloud inversion, action shot';
  if (s.includes('backyard-ultra') || s.includes('medieval-backyard')) return 'Professional photo of ultra runners on a loop trail in a Welsh woodland, medieval castle ruins in background, endurance running, atmospheric lighting';
  if (s.includes('radyr-trail')) return 'Professional photo of trail runners racing through autumn woodland near Cardiff Wales, dappled sunlight, muddy trail, colourful leaves';
  if (s.includes('caerphilly-trail')) return 'Professional photo of trail runners with Caerphilly Castle in the background, Welsh green hills, misty morning, dramatic medieval fortress, action shot';
  if (s.includes('red-warrior')) return 'Professional photo of obstacle course racers covered in mud climbing a wall, Welsh hillside, tough military-style challenge, dramatic sky';

  // Road running events
  if (s.includes('cardiff-half')) return 'Professional photo of thousands of runners in a city half marathon passing Cardiff Castle, autumn morning, city streets, mass participation running event';
  if (s.includes('newport-marathon')) return 'Professional photo of marathon runners crossing a modern bridge in Newport Wales, city skyline, dramatic clouds, mass participation road race';
  if (s.includes('swansea-half')) return 'Professional photo of half marathon runners along Swansea Bay promenade, sea views, The Mumbles in distance, sunny morning, mass participation';
  if (s.includes('conwy-half')) return 'Professional photo of half marathon runners passing Conwy Castle in North Wales, medieval walls, dramatic sky, scenic road race';
  if (s.includes('great-welsh-marathon')) return 'Professional photo of marathon runners on a scenic Welsh coastal road near Llanelli, dramatic sky, green countryside meeting the sea';
  if (s.includes('llanelli-half')) return 'Professional photo of runners in a half marathon along the Millennium Coastal Path in Llanelli Wales, wetlands, sea views, sunny morning';
  if (s.includes('anglesey-trail-half')) return 'Professional photo of trail runners on the Anglesey Coastal Path, rugged cliffs, turquoise sea, lighthouse in distance, dramatic Welsh coastline';
  if (s.includes('jones-o-gymru') || s.includes('anglesey-half')) return 'Professional photo of half marathon runners on a scenic Anglesey road, Snowdonia mountains across the Menai Strait, blue sky, Welsh landscape';
  if (s.includes('llandudno-10k') || s.includes('nick-beer')) return 'Professional photo of 10K runners along Llandudno promenade, Great Orme headland in background, Victorian pier, sunny morning run';
  if (s.includes('abersoch-10k')) return 'Professional photo of 10K runners on a coastal road near Abersoch, Llŷn Peninsula, turquoise sea, sandy beaches, summer running event';
  if (s.includes('barry-island-10k')) return 'Professional photo of 10K runners along Barry Island seafront in Wales, colourful beach huts, Whitmore Bay, sunny morning, mass participation';
  if (s.includes('chepstow-running')) return 'Professional photo of runners in a race festival near Chepstow Castle ruins, River Wye, autumn colours, historic Welsh border town';
  
  // Water sports
  if (s.includes('abersoch-dinghy')) return 'Professional photo of colourful sailing dinghies racing in Cardigan Bay off Abersoch Wales, blue sea, white sails, Llŷn Peninsula coastline';
  if (s.includes('rhosneigr-wave')) return 'Professional photo of windsurfers and kitesurfers riding big waves at Rhosneigr beach Anglesey Wales, dramatic spray, stormy sky, extreme water sports';
  if (s.includes('cardiff-bay-water')) return 'Professional photo of water sports festival at Cardiff Bay, kayakers and paddleboarders on the water, Millennium Centre in background, sunny day, festival atmosphere';
  if (s.includes('wakestock')) return 'Professional photo of a wakeboarder performing an aerial trick at a Welsh coastal festival, crowd watching, blue water, summer festival vibes, action shot';

  // Walking / hiking festivals
  if (s.includes('snowdonia-walking')) return 'Professional photo of hikers walking on a mountain trail in Snowdonia Wales, dramatic peaks, clear mountain lake below, green valleys, epic Welsh landscape';
  if (s.includes('pembrokeshire-coast-path')) return 'Professional photo of walkers on the Pembrokeshire Coast Path Wales, dramatic sea cliffs, wildflowers, turquoise sea, stunning coastal scenery';
  if (s.includes('wales-coast-path')) return 'Professional photo of walkers on the Wales Coast Path, dramatic cliff-top trail, sweeping views of the Celtic Sea, wildflowers, golden hour light';
  
  // Other
  if (s.includes('adventure-travel-world')) return 'Professional photo of adventure tourism landscape in Wales, zip line over a quarry, dramatic mountains, people enjoying outdoor activities, epic scenery';
  if (s.includes('green-man-festival')) return 'Professional photo of a music festival in the Brecon Beacons Wales at twilight, fairy lights, green mountains, festival crowd, atmospheric sunset, Green Man Festival vibes';
  if (s.includes('trails-tarmac-winter')) return 'Professional photo of ultra runners on a winter trail loop in Welsh countryside, frost on ground, bare trees, atmospheric winter light, endurance running';

  // Fallback by category keywords
  if (n.includes('cycling') || n.includes('bike') || n.includes('ride')) return 'Professional photo of road cyclists climbing a scenic mountain pass in Wales, green valleys, dramatic clouds, epic Welsh scenery';
  if (n.includes('trail') || n.includes('fell')) return 'Professional photo of trail runners on a rugged Welsh mountain path, Snowdonia peaks in background, misty valleys, action shot';
  if (n.includes('marathon') || n.includes('half') || n.includes('10k') || n.includes('running')) return 'Professional photo of runners on a scenic Welsh road race, green hills, dramatic sky, mass participation event';
  if (n.includes('triathlon') || n.includes('ironman')) return 'Professional photo of triathletes at a Welsh coastal triathlon, dramatic seaside scenery, action shot';
  if (n.includes('swim') || n.includes('water') || n.includes('kayak') || n.includes('surf')) return 'Professional photo of water sports on the Welsh coast, dramatic waves, rugged coastline';
  
  // Generic Welsh adventure
  return 'Professional photo of athletes competing in an outdoor adventure race in the Welsh mountains, dramatic scenery, green valleys, epic landscape, action shot';
}

async function run() {
  const evts = await db
    .select({ id: events.id, name: events.name, slug: events.slug, category: events.category })
    .from(events)
    .where(and(eq(events.status, 'published'), isNull(events.heroImage)));

  console.log(`Found ${evts.length} events without hero images\n`);

  let success = 0;
  let failed = 0;

  for (const evt of evts) {
    const filename = `public/images/events/${evt.slug}-hero.png`;
    const dbPath = `/images/events/${evt.slug}-hero.jpg`;
    const jpgFile = `public/images/events/${evt.slug}-hero.jpg`;
    
    // Skip if already generated
    if (existsSync(jpgFile)) {
      console.log(`[SKIP] ${evt.slug} — already exists, updating DB`);
      await db.update(events).set({ heroImage: dbPath }).where(eq(events.id, evt.id));
      success++;
      continue;
    }

    const prompt = getPrompt(evt.slug, evt.name);
    console.log(`[${success + failed + 1}/${evts.length}] Generating: ${evt.slug}`);
    console.log(`  Prompt: ${prompt.substring(0, 80)}...`);

    try {
      // Generate image
      execSync(
        `uv run ${SCRIPT} --prompt "${prompt.replace(/"/g, '\\"')}" --filename "${filename}" --resolution 1K`,
        { 
          stdio: 'pipe',
          env: { ...process.env },
          timeout: 120000
        }
      );

      // Convert/resize to 1200x630 JPG using sharp
      if (existsSync(filename)) {
        await sharp(filename)
          .resize(1200, 630, { fit: 'cover', position: 'center' })
          .jpeg({ quality: 85 })
          .toFile(jpgFile);
        unlinkSync(filename);
      } else if (existsSync(jpgFile)) {
        const tmpFile = jpgFile + '.tmp.jpg';
        await sharp(jpgFile)
          .resize(1200, 630, { fit: 'cover', position: 'center' })
          .jpeg({ quality: 85 })
          .toFile(tmpFile);
        execSync(`mv "${tmpFile}" "${jpgFile}"`, { stdio: 'pipe' });
      }

      if (existsSync(jpgFile)) {
        // Update database
        await db.update(events).set({ heroImage: dbPath }).where(eq(events.id, evt.id));
        console.log(`  ✅ Done: ${jpgFile}`);
        success++;
      } else {
        console.log(`  ❌ File not found after generation`);
        failed++;
      }
    } catch (err: any) {
      console.log(`  ❌ Error: ${err.message?.substring(0, 200)}`);
      failed++;
    }

    // Small delay to respect rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n=== COMPLETE: ${success} success, ${failed} failed out of ${evts.length} ===`);
  process.exit(0);
}

run();
