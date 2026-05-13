import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Rich descriptions based on research - adventure-focused, local knowledge
const descriptions: Record<string, string> = {
  // === SNOWDONIA ===
  'yha-snowdon-pen-y-pass': `Perched at over 1,000ft directly at the foot of Yr Wyddfa (Snowdon), this is the closest hostel to the summit. Step out the door and you're at the Pyg Track and Miners' Track trailheads - no driving, no parking battles, just straight onto the mountain. Essential for early-morning summit bids when you want to beat the crowds. Bunk rooms, self-catering kitchen, and drying facilities for Welsh weather. The communal vibe means swapping stories with fellow hikers over tea. Book months ahead for summer weekends.`,
  
  'yha-snowdon-llanberis': `In the heart of Llanberis village, this hostel puts you within walking distance of the Llanberis Path (the longest but most gradual Snowdon route) and local pubs, cafes, and the Electric Mountain. Perfect for multi-day trips where you want a recovery day at Pete's Eats or exploring Padarn Lake. Budget bunks with communal spaces for trip planning. Gear shops nearby if you've forgotten anything.`,
  
  'plas-y-brenin': `The National Mountain Centre - where serious climbers and mountaineers come to level up. This isn't just accommodation; it's a training facility with world-class instruction in rock climbing, scrambling, mountaineering, and winter skills. Bunkhouse lodging is simple but you're steps from climbing walls, instructors, and the Ogwen Valley's legendary routes. Stay here if you want to actually improve, not just survive. Group bookings welcome; courses often include meals.`,
  
  'treks-bunkhouse': `No-frills Llanberis bunkhouse for hikers who'd rather spend money on pints than pillows. Central location means you're steps from the Llanberis Path start and stumbling distance from good pubs. Shared bunks, basic kitchen, and the camaraderie of fellow muddy walkers. Perfect pre/post-Snowdon crash pad without the hostel bureaucracy.`,
  
  'bens-bunkhouse': `Solid budget option for Snowdonia adventures. Simple bunks, shared facilities, and the kind of relaxed atmosphere where wet boots and tired legs are expected. Good base for exploring multiple routes - close enough to reach different trailheads without major detours.`,
  
  'arete-outdoor-centre': `Activity centre with accommodation - come for the guided adventures, stay for the easy logistics. On-site instructors run everything from scrambling to gorge walking to climbing. Bunkhouse-style rooms mean you're ready to go at dawn without commuting. Great for groups who want everything organized.`,
  
  'crashpad-lodges-at-yr-helfa': `Modern eco-lodges near Llanberis with a climber-friendly vibe. Self-contained units with proper beds (not bunks) when you want comfort after hard days on rock. Gear drying, parking, and easy access to both Snowdon routes and the Pass of Llanberis climbing. Sustainable build for those who care about treading lightly.`,
  
  'platts-farm': `Campsite and bunkhouse combo near Betws-y-Coed with space for tents, vans, and groups. Rural location with mountain views and that camping-in-Wales atmosphere. Self-catering facilities mean you're not dependent on village restaurants. Good fallback when the main hostels are booked.`,
  
  'the-snowdon-inn-y-fricsan': `Pub with camping and bunkhouse attached - the Welsh adventure trifecta. Pint after your hike, bed upstairs or tent outside. Traditional atmosphere without pretension. Well-positioned for Snowdon routes and Nantlle Ridge exploration.`,
  
  'bala-backpackers': `Chilled hostel in Bala town, gateway to white water rafting on the Tryweryn and hiking in the southern Snowdonia peaks. Different vibe from the Llanberis crowds - more about paddling, Bala Lake watersports, and the quieter mountains like Aran Fawddwy. Good for multi-sport weekends.`,
  
  // === BRECON BEACONS ===
  'yha-brecon-beacons': `Proper hostel base for the Brecon Beacons, positioned for Pen y Fan (the most popular summit) and the waterfall walks. Budget bunks, self-catering, and that YHA reliability. Fills up with Duke of Edinburgh groups in summer, so book ahead or aim for shoulder season for quieter vibes. Drying room essential after Beacons weather.`,
  
  'yha-llanbedr': `Quieter YHA option in the Beacons area, away from the Pen y Fan crowds. Good for those seeking the less-trampled paths and genuine wilderness feel. Simple facilities but you're here for the walking, not the luxury.`,
  
  'llanthony-priory-hotel': `Sleep in a 12th-century priory ruin in the Black Mountains - genuinely atmospheric. Stone walls, candlelit bar, and trails to Waun Fach and the Offa's Dyke Path right outside. This is for adventurers who want character with their hiking. The pub serves proper food; the rooms are simple but the setting is extraordinary. Remote and off-grid feeling.`,
  
  'craig-y-nos-castle': `Victorian Gothic castle turned hotel, dramatically positioned near Dan yr Ogof caves and Waterfall Country. Former opera house (Adelina Patti's home), now serves adventure seekers with comfortable rooms and proximity to caving, gorge walking, and the southern Beacons trails. Ghost tours optional. Ideal when you want luxury after underground adventures.`,
  
  'penstar-bunkhouse': `Brecon bunkhouse for groups and individuals tackling Pen y Fan and the central Beacons. Basic beds, shared kitchen, and the practical setup walkers actually need - gear drying, parking, and early breakfast options. No frills but well-maintained.`,
  
  'the-lodge-staylittle': `Remote bunkhouse near the reservoirs and upland walking of Mid Wales/Beacons border country. The name suits the vibe - simple overnight stop for long-distance walkers and cyclists. Surrounded by proper wilderness.`,
  
  'twin-trails-b&b': `B&B focused on mountain bikers and hikers, with secure bike storage, drying facilities, and breakfast that fuels big days out. Owners know the local trails and can point you to the good stuff. More personal than hostels, practical touches adventurers need.`,
  
  'waterfall-country-campsite': `Camp right in Waterfall Country - wake up and walk to Sgwd yr Eira and the other famous falls without driving. Tent pitches, basic facilities, and unbeatable location for waterfall hunters. Book ahead for summer; gets popular for good reason.`,
  
  'grawen-camping': `Simple camping in the Brecon Beacons with space, views, and access to the main walking areas. No glamping frills - this is tent-and-sleeping-bag territory for those who want the full outdoor experience.`,
  
  'premier-inn-merthyr-tydfil': `Chain hotel convenience on the Beacons' edge. Not glamorous but predictable: clean rooms, parking, early breakfast available. Useful when everywhere else is booked or you need reliable Wi-Fi and a proper shower. Easy access to Bike Park Wales and Pen y Fan.`,
  
  // === PEMBROKESHIRE ===
  'preseli-venture-eco-lodge': `Five-star eco-lodge run by coasteering pioneers - stay here and you're at the source. On-site guides with 25+ years experience lead coasteering, sea kayaking, and surfing from their North Pembrokeshire base. Accommodation includes excellent meals from local ingredients, wetsuit drying, and minibus shuttles to the best coastal spots. Perfect for solo adventurers, families, or groups wanting expert-led water sports in a sustainable setting. Book activity packages for best value.`,
  
  'st-davids-yha': `Budget base in Britain's smallest city, walking distance from TYF and the coasteering/surfing action at Whitesands Bay. Simple dorms and private rooms with self-catering kitchen. Prime location for Pembrokeshire Coast Path walking combined with water sports days. The city itself has great cafes and pubs for post-adventure refueling.`,
  
  'stackpole-centre-national-trust': `National Trust field centre on the dramatic Stackpole estate - cliffs, coves, lily ponds, and the famous Barafundle Bay. Bunkhouse accommodation and camping with educational programs, but also available for independent adventure stays. Sea kayaking through coastal inlets, coasteering on NT-protected cliffs, and wildlife encounters with seals and seabirds. Book through National Trust.`,
  
  'tyf-cliff-top-campsite': `TYF's own campsite near St Davids - camp then coasteer. Basic facilities but location is everything: cliff-top position overlooking the coast, easy walk to TYF's activity centre for water sports, and St Davids amenities nearby. The authentic adventure camping experience.`,
  
  'sealyham-activity-centre': `Activity centre with accommodation focused on group adventures - school trips, corporate teams, and activity weekends. On-site instructors and equipment for various outdoor pursuits. Bunkhouse setup prioritizes function over luxury.`,
  
  'broadhaven-camping': `Campsite near Broadhaven beach - family-friendly camping with access to both beach days and coastal walking. South Pembrokeshire location means different character from the northern coast. Good facilities for a campsite.`,
  
  'newgale-campsite': `Camp behind one of Wales' great surf beaches. Newgale's two-mile stretch is perfect for beginners and intermediate surfers, and you're sleeping steps from the break. Basic but adequate facilities; you're here for the waves.`,
  
  'whitesands-bay-caravan-park': `Caravan and camping near Whitesands - one of Pembrokeshire's premier beaches for surfing and swimming. More established facilities than wild camping, with the beach practically on your doorstep.`,
  
  'the-grove-hotel': `Luxury country house hotel for when you want Pembrokeshire adventures with fine dining and spa recovery. Located inland but within easy reach of the coast for day trips. Perfect for couples mixing activity days with relaxation.`,
  
  'tregwynt-hotel': `Boutique hotel in the North Pembrokeshire countryside, near the famous Tregwynt woolen mill. Comfortable base for coastal exploring, walking, and the quieter side of Pembrokeshire tourism.`,
  
  // === GOWER ===
  'rhosili-bunkhouse': `Budget bunkhouse in Rhossili village, steps from one of the UK's best beaches and surf spots. Basic bunks, shared facilities, and that surfer-hiker communal vibe. Wake up and walk straight onto Rhossili Bay's three miles of sand. The Worm's Head tidal island and coastal path are right there. Perfect for groups or solo adventurers on a budget.`,
  
  'llangennith-campsite': `Camp at Gower's surf capital - Llangennith has consistent waves suitable for all levels and you're sleeping in view of the break. Tent pitches, basic facilities, and the authentic surf camping experience. Popular with surfers, so book ahead for good weather weekends.`,
  
  'pitton-cross-campsite': `Flexible camping near Rhossili with space for families, groups, and late arrivals. Sea views, basic but clean facilities, and easy access to Gower's best beaches and coastal walking. The kind of campsite that welcomes muddy adventurers.`,
  
  'three-cliffs-bay-campsite': `Camp near the most photographed bay on Gower - Three Cliffs' dramatic limestone stacks and sweeping beach. Walking distance to the bay (though it's a proper walk), with coastal path access for cliff walks and coasteering options.`,
  
  'port-eynon-beach-campsite': `Beach camping at Port Eynon - another beautiful Gower bay with good swimming and easy coastal walking. Family-friendly atmosphere with village amenities nearby.`,
  
  'fairyhill': `Gower's luxury option - country house hotel in Reynoldston with fine dining, grounds to explore, and a 15-minute drive to Rhossili or Three Cliffs. For adventurers who want proper beds, great food, and a hot bath after surfing or hiking. The restaurant uses local seafood and Welsh produce.`,
  
  'oxwich-bay-hotel': `Hotel overlooking Oxwich Bay - one of Gower's prettiest beaches. Good for combining beach days with coastal walking, or as a comfortable base for peninsula exploration. Family-friendly with beach access.`,
  
  'the-king-arthur-hotel': `Traditional pub-hotel in Reynoldston, central Gower. Comfortable rooms, good food, and easy access to multiple beaches and walking routes. The kind of place where you can dry off and warm up properly after coastal adventures.`,
  
  'cwtsh-hostel': `Gower hostel option for budget travelers - basic accommodation with the flexibility of hostel-style facilities. Good base for exploring the peninsula without camping.`,
  
  'gower-cottage': `Self-catering cottage option for families or groups wanting privacy and kitchen facilities. Book through local agencies for varied options across the peninsula.`,
  
  // === ANGLESEY ===
  'plas-menai-accommodation': `Wales' National Outdoor Centre on the Menai Strait - the place for serious watersports development. RYA courses in sailing, kayaking, windsurfing, and kitesurfing with expert instruction and sheltered waters. Accommodation ranges from bunkhouses to self-catering chalets, sleeping 2-50+. Stay here to actually learn and improve, not just mess about. Sauna and facilities for recovery. 45-minute drive to Rhosneigr for additional kitesurfing.`,
  
  'rhosneigr-bunkhouse': `Budget base in Wales' kitesurfing capital. Rhosneigr's beaches have consistent wind conditions that draw kite and windsurfers from across the UK. Basic bunkhouse setup lets you spend money on gear rental instead of fancy beds. Walking distance to beach and village pubs.`,
  
  'trearddur-bay-hotel': `Comfortable hotel overlooking Trearddur Bay - sheltered waters good for kayaking, paddleboarding, and family beach days. Traditional hotel facilities with sea views. Good base for Anglesey coastal walking and the Holy Island area.`,
  
  'driftwood-guest-house': `B&B option on Anglesey with the personal touch chain hotels lack. Owners know local beaches, conditions, and the best spots for different water sports. Breakfast included to fuel morning sessions.`,
  
  'church-bay-cottages': `Self-catering near Church Bay in northwest Anglesey - quieter corner of the island with good coastal walking and swimming beaches. Family-friendly setup with kitchen facilities.`,
  
  'morawelon-house': `Self-catering accommodation on Anglesey suited for families or groups wanting independence. Well-positioned for exploring the island's varied coastline.`,
  
  'sea-breeze-apartment': `Self-contained apartment option for couples or small groups wanting hotel-alternative accommodation on Anglesey. Coastal position with parking for beach gear.`,
  
  'surfs-edge-apartment': `Aptly named apartment near Rhosneigr's surf and kite beaches. Self-catering setup for water sports enthusiasts wanting kitchen facilities and flexibility.`,
  
  'cemaes-bay-caravan-park': `Caravan site in northern Anglesey - quieter end of the island with good beaches and coastal walking. Family-oriented facilities.`,
  
  'newborough-forest-campsite': `Camp in Newborough Forest with beach access - the forest meets the sea here, creating unique walking opportunities and access to Llanddwyn Island (the romantic ruins and wildlife). Basic camping in beautiful surroundings.`,
  
  // === LLŶN PENINSULA ===
  'aberdaron-yha': `YHA at the wild western tip of Llŷn - Aberdaron is where pilgrims ended their journey to Bardsey Island, and it still has that edge-of-the-world feel. Simple hostel accommodation with coastal path access in both directions. The village has character: old church, proper pubs, and the Bardsey ferry. Perfect for walking the wild Llŷn coast.`,
  
  'abersoch-yha': `Budget beds in Llŷn's holiday hotspot - Abersoch has the beaches, water sports, and village buzz. This YHA puts you in the action without holiday cottage prices. Good for surfers, families, and coastal walkers who want evening entertainment nearby.`,
  
  'criccieth-yha': `Hostel in the castle town of Criccieth - dramatic setting with the medieval fortress overlooking Cardigan Bay. Different vibe from Abersoch: quieter, more historic, with good walking and beaches. The castle ice cream shop is legendary.`,
  
  'llanbedrog-beach-huts': `Glamping-style beach huts on Llanbedrog beach - one of Llŷn's prettiest. Quirky accommodation with beach at your doorstep. Popular and books quickly; check availability early for summer.`,
  
  'ty-coch-inn-morfa-nefyn': `Stay near the famous Tŷ Coch Inn - the pink pub on Porthdinllaen beach voted one of the world's best beach bars. B&B accommodation with the bonus of that pub walk along the sand. Unique Llŷn experience.`,
  
  'whistling-sands-campsite': `Camp near Porth Oer (Whistling Sands) - the beach that squeaks underfoot. Unique geological feature, beautiful bay, and camping in proper Llŷn wilderness. Basic facilities; you're here for the location.`,
  
  'nefyn-golf-club-accommodation': `Accommodation attached to Nefyn golf club - clifftop course with dramatic views. Non-golfers welcome; good coastal walking and access to Porthdinllaen from here.`,
  
  'pwllheli-marina-apartments': `Modern apartments near Pwllheli marina - good for sailing enthusiasts or those wanting self-catering with town amenities. Marina has water sports options; town has practical shops and transport links.`,
  
  'the-vaynol': `Hotel option on Llŷn for those wanting comfort over hostels. Traditional setup with restaurant and bar. Good base for peninsula exploration.`,
  
  'west-wales-windsurf': `Campsite connected to windsurfing operation - learn or practice on sheltered waters, then sleep nearby. Activity-focused accommodation for water sports enthusiasts.`,
  
  // === MID WALES ===
  'aberystwyth-yha': `University town hostel with beach and mountains nearby. Aberystwyth has personality: Victorian seafront, Constitution Hill railway, and access to the Cambrian Mountains. Budget base for varied adventures.`,
  
  'borth-yha': `Coastal hostel at Borth - massive beach backed by the famous submerged forest (prehistoric stumps visible at low tide). Gateway to Dyfi National Nature Reserve and wildlife watching. Quirky village with good community feel.`,
  
  'corris-hostel': `Budget beds near Corris mine adventures and mountain biking at Dyfi. The slate heritage here is fascinating - underground explorations in Victorian workings. Also positioned for southern Snowdonia access.`,
  
  'dolgellau-yha': `Hostel in the handsome market town of Dolgellau - gateway to Cader Idris and the Mawddach Trail. The town has good pubs and cafes; the mountains are magnificent and less crowded than Snowdonia proper.`,
  
  'machynlleth-yha': `Eco-friendly hostel in Machynlleth - the green capital of Wales with the Centre for Alternative Technology nearby. Good base for Dyfi Biosphere adventures, cycling, and environmental tourism with purpose.`,
  
  'hafren-forest-hideaway': `Accommodation in the forests around the source of the River Severn. Remote, peaceful, and surrounded by walking and cycling trails. For those seeking genuine wilderness quiet.`,
  
  'elan-valley-hotel': `Traditional hotel in the Elan Valley - dramatic Victorian reservoir landscape with incredible walking and cycling. Red kite country, dark skies, and genuine remoteness. Good base for exploring this underrated area.`,
  
  'lake-vyrnwy-hotel': `Grand Victorian hotel overlooking Lake Vyrnwy - another reservoir with stunning scenery, good walking, cycling, and wildlife. The hotel has spa facilities for post-adventure recovery. RSPB reserve nearby for nature focus.`,
  
  'tynycornel-hotel': `Hotel on Tal-y-llyn lake - beautiful setting at the foot of Cader Idris. Fishing, walking, and the Talyllyn steam railway nearby. Traditional hospitality in spectacular surroundings.`,
  
  'the-lodge-llandegla': `Bunkhouse near Llandegla mountain bike trails - purpose-built for riders with secure bike storage, drying facilities, and the trails on your doorstep. Also good for walkers exploring the Clwydian Range. Practical rather than luxurious.`,
};

async function updateAccommodation() {
  console.log('Starting accommodation enrichment...\n');
  
  let updated = 0;
  let skipped = 0;
  
  for (const [slug, description] of Object.entries(descriptions)) {
    try {
      const result = await sql`
        UPDATE accommodation 
        SET description = ${description}
        WHERE slug = ${slug} AND (description IS NULL OR description = '')
        RETURNING id, name
      `;
      
      if (result.length > 0) {
        console.log(`✅ Updated: ${result[0].name}`);
        updated++;
      } else {
        // Check if it exists
        const exists = await sql`SELECT id, name, description FROM accommodation WHERE slug = ${slug}`;
        if (exists.length > 0) {
          if (exists[0].description) {
            console.log(`⏭️  Skipped (has description): ${exists[0].name}`);
          } else {
            console.log(`⚠️  No match for slug: ${slug}`);
          }
        } else {
          console.log(`❌ Not found: ${slug}`);
        }
        skipped++;
      }
    } catch (err) {
      console.error(`Error updating ${slug}:`, err);
    }
  }
  
  console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped`);
}

updateAccommodation();
