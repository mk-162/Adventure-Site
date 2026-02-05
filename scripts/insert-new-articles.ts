import { db } from "../src/db";
import { posts } from "../src/db/schema";

const articles = [
  {
    siteId: 1,
    slug: "horse-riding-wales-epic-trail-rides",
    title: "Horse Riding in Wales: 5 Epic Trail Rides You Need to Try",
    excerpt:
      "Wales has some of the best horse riding terrain in Britain — from Brecon Beacons ridge lines to wild Cambrian mountain tracks that'll make you feel like you're in a film. Here are five trail rides actually worth booking.",
    category: "trip-report" as const,
    author: "Adventure Wales",
    readTimeMinutes: 5,
    status: "published" as const,
    publishedAt: new Date(),
    content: `## Forget the Plodding Pony Ride

Let's get something out of the way: when we say horse riding in Wales, we're not talking about walking in a circle while someone holds a lead rope. Wales has proper trail riding — the kind where you're cantering across mountain ridges, fording rivers, and covering serious ground through some of the most dramatic landscapes in Britain.

Whether you're a confident rider looking for a multi-day expedition or a nervous beginner who just wants to trot through some gorgeous scenery without embarrassing yourself, these five rides deliver.

## 1. Cantref Adventure Farm — Brecon Beacons

**Best for:** Beginners and families who want scenery without stress

Cantref sits right in the heart of the Brecon Beacons, and their trail rides head straight up into the hills above the Usk Valley. The one-hour trek takes you through woodland and open moorland with views that'll make you forget you're sitting on a horse for the first time.

What we like: they match horses to riders properly. You won't end up on a stubborn Shetland that refuses to move, and you won't be given a fizzy thoroughbred when you've only ridden twice. The two-hour ride is the sweet spot — long enough to get comfortable in the saddle and see some genuinely spectacular country.

**Book:** Half-day rides available year-round. Expect to pay around £45-60 per person for a two-hour trek.

## 2. Grange Trekking Centre — Black Mountains

**Best for:** Intermediate riders who want proper mountain terrain

Grange Trekking in the Black Mountains is the real deal. Their rides head up onto the ridge above Llanthony Priory — a route that's been used on horseback since medieval monks were commuting between abbeys. On a clear day, you can see across to the Brecon Beacons, the Sugar Loaf, and well into Herefordshire.

The horses here are mostly Welsh Cobs and crosses — bred for exactly this terrain. They're surefooted on the steep, rocky paths that would have a flat-country horse panicking. The full-day ride (around 5-6 hours) is genuinely one of the best things you can do on horseback in the UK. You'll cover 15+ miles of mountain trail, stop for a packed lunch somewhere ridiculous, and come back aching in places you didn't know existed.

**Pro tip:** Book the full day if you can. The half-day rides are good, but the longer route gets you up onto the ridge proper where the views are life-changing.

## 3. Trans Wales Trails — Multi-Day Expedition

**Best for:** Experienced riders who want a genuine adventure

If you've got the riding chops and fancy something properly ambitious, Trans Wales Trails offer multi-day riding expeditions through the Cambrian Mountains. We're talking wild country here — huge empty valleys, ancient drovers' roads, barely a car in sight. This is the Wales that most visitors never see.

Routes typically run 3-5 days, staying at farms and B&Bs along the way. You'll cover 20-25 miles a day through terrain that ranges from gentle river valleys to exposed mountain passes. The Cambrian Mountains are often called "the desert of Wales" — not because they're dry, but because they're so gloriously empty.

**Reality check:** You need to be a competent rider for this. Comfortable at all paces, confident on steep ground, and able to spend 5+ hours in the saddle without needing a stretcher at the end. If that's you, this is genuinely one of the most memorable adventures in Wales.

## 4. Ellesmere Riding Centre — Snowdonia Foothills

**Best for:** Mixed ability groups who want mountain views without mountain difficulty

Tucked in the rolling country south of Snowdonia, the rides here follow old farm tracks and bridleways with views of the Cader Idris range. It's less dramatic than the Black Mountains routes but more accessible for groups where riders have different experience levels.

The terrain is forgiving — mostly good going on grass tracks — which means you can actually enjoy the scenery instead of gripping on for dear life. Their sunset rides in summer are properly special: golden light across the Mawddach Estuary with Cader Idris turning pink behind you.

## 5. Parc-Le-Breos Riding — Gower Peninsula

**Best for:** People who want to ride on a beach (honestly, who doesn't?)

Beach riding is the dream, and the Gower delivers. Several operators run rides that take you along Oxwich Bay and the surrounding coastline — cantering along the sand with waves crashing beside you. It's every horse-lover's fantasy and it's even better than it sounds.

The rides typically combine woodland trails with beach sections, so you get variety. Low tide is essential for the beach stretches, so availability depends on the tides — book ahead and be flexible with dates.

## What You Need to Know

**Gear:** Most centres provide hard hats. Wear long trousers (jeans are fine), boots with a small heel (walking boots work — trainers don't), and layers. Wales, remember? It will rain.

**Booking:** Always book ahead, especially summer and bank holidays. Most centres require riders to be at least 8-10 years old and have weight limits (typically around 14-15 stone).

**Experience levels:** Be honest about your ability. Centres want you to have a good time, not a terrifying one. If you haven't ridden in years, say so — they'll put you on something sensible.

**Cost:** Budget £35-50 per hour for standard treks, £80-120 for half-day rides, and £150-250+ per day for multi-day expeditions.

Wales has been a horse-riding destination since before it was a country. The terrain was literally shaped by centuries of riders, drovers, and farmers on horseback. Getting up on a horse and seeing it the way it was meant to be seen? That's not just a nice afternoon out. That's the proper way to do it.`,
  },
  {
    siteId: 1,
    slug: "complete-guide-sea-fishing-wales",
    title: "The Complete Guide to Sea Fishing in Wales",
    excerpt:
      "From bass off the Gower to mackerel in Cardigan Bay, Wales has some of the most underrated sea fishing in Britain. Here's everything you need to know — spots, seasons, gear, and the fish actually biting right now.",
    category: "gear" as const,
    author: "Adventure Wales",
    readTimeMinutes: 5,
    status: "published" as const,
    publishedAt: new Date(),
    content: `## Why Wales for Sea Fishing?

While everyone's queuing for a charter boat in Cornwall or fighting for a spot on the Dorset shore, Wales has 1,680 miles of coastline with fish that haven't been pressured to death. Cardigan Bay is one of the most productive marine environments in the UK. The Pembrokeshire coast has bass that'd make a Devon angler weep. And you can often fish in complete solitude on beaches where you won't see another soul.

That's the thing about Wales — the fishing is brilliant, but nobody's shouting about it. Which, honestly, is exactly how we like it.

## Shore Fishing

### The Best Spots

**Pembrokeshire** is the headline act. The rocky coves and headlands around Freshwater West, Broad Haven, and the Castlemartin coast produce excellent bass, wrasse, and pollack. Fish the rock marks at dawn or dusk for the best results. Freshwater West in particular is one of the finest bass beaches in Wales — work the gutters and channels as the tide pushes in.

**The Gower Peninsula** offers superb shore fishing from Rhossili through to Mumbles. The Worm's Head causeway (accessible at low tide — check your times or you'll be stuck) is legendary for bass, conger, and ray. Langland Bay and Caswell are productive for flatfish and bass in the surf.

**North Wales** is underrated. The Menai Strait fishes brilliantly for bass, ray, and dogfish. Trefor Pier on the Llŷn Peninsula is a cracking spot for mackerel in summer, and the beaches around Harlech and Barmouth produce bass and flounder.

### What You'll Catch (and When)

- **Bass:** April to November, peaking June-September. Best on surf beaches after a blow.
- **Mackerel:** June to October. Shoals move inshore from June — feathering from piers and rocks is easy and productive.
- **Flatfish (flounder, dab, plaice):** Year-round, best October to March in estuaries.
- **Ray (thornback, small-eyed):** March to October on sandy/mixed ground.
- **Wrasse (ballan):** April to October on rocky marks. Incredible fun on light tackle.
- **Cod:** November to February, mainly from North Wales marks and deeper rock gullies.

## Boat Fishing

### Charter Boats

This is where Wales really shines. Cardigan Bay boat fishing is exceptional — tope, huss, ray, and blue sharks all feature depending on season. Charter boats run from **Saundersfoot**, **Tenby**, **New Quay**, **Aberystwyth**, and **Pwllheli**.

**For beginners:** Most charter skippers welcome novices. A typical half-day trip (4-5 hours) costs £35-50 per person on a shared boat. Rods, tackle, and bait are usually provided. You'll target whatever's feeding — mackerel, pollack, dogfish, and ray are the usual suspects.

**For the serious:** Book a full-day charter targeting specific species. Tope fishing in Cardigan Bay (June-September) is world-class — fish to 50lb+ are caught regularly. Blue shark trips run from July to October, heading 15-20 miles offshore into proper Atlantic waters.

### Kayak Fishing

Growing fast in Wales, and for good reason. Launching a kayak from a quiet beach gives you access to marks that shore anglers can't reach and boat anglers don't bother with. The Gower, Pembrokeshire, and Llŷn Peninsula all have excellent kayak fishing — bass, pollack, and wrasse from the rock edges, plus ray and tope further out.

**Safety first:** Sea kayak fishing requires proper kit — a stable fishing kayak, lifejacket, VHF radio, and knowledge of tides and weather. Don't push it. The Welsh coast can turn nasty fast.

## River and Estuary Fishing

### Sea Trout (Sewin)

This is Wales's secret weapon. The sea trout (called sewin locally) run on rivers like the Tywi, Teifi, and Dovey from May to September. Night fishing for sewin is one of the most exciting things you can do with a rod — these fish fight like demons in the dark and there's nothing else quite like it.

You'll need a rod licence from the Environment Agency and a permit for whichever river you're fishing. Local tackle shops are your best friend here — they'll tell you what's running and which beats are fishing well.

### Estuaries

The Mawddach, Dyfi, and Teifi estuaries all produce excellent bass, flounder, and mullet. Estuary fishing is often overlooked but it's incredibly productive — especially for bass that push in with the tide to feed on the flats.

## What Gear Do You Need?

### Shore Fishing Kit

- **Rod:** 12ft beachcaster for distance casting, or a 10ft bass rod for lighter work on rock marks
- **Reel:** Fixed spool, loaded with 15-20lb mono or braid
- **Terminal tackle:** Size 2-4/0 hooks, grip leads (for holding bottom in surf), running ledger rigs
- **Bait:** Ragworm and lugworm are the go-to. Fresh mackerel strip for bass and ray. Peeler crab when you can get it — it's liquid gold

**Budget tip:** You don't need to spend £300 on a rod to catch fish. A decent combo (rod + reel) for £80-120 will handle anything you'll encounter from the Welsh shore. Spend the savings on good bait instead — that's what actually catches fish.

### Boat Fishing Kit

Most charter boats provide everything. If you're bringing your own gear, a 20-30lb class boat rod with a multiplier reel is the workhorse setup. Lighter gear (12lb class) makes mackerel and pollack far more fun.

## Licences and Regulations

- **Sea fishing:** No licence needed for saltwater fishing in Wales
- **Rivers and estuaries above tidal limits:** You need an EA rod licence (£33/year or £12 for a day)
- **Minimum sizes apply:** Bass 42cm, mackerel 20cm — check current regulations as they change
- **Bass regulations:** Currently 2 bass per day for recreational anglers. Catch and release is increasingly popular and strongly encouraged
- **Byelaws:** Some areas have seasonal closures or gear restrictions. Check Natural Resources Wales before you go

## Getting Started

If you've never sea fished before, the easiest entry point is a charter boat trip. Everything's provided, there's someone to help you, and you'll catch fish. Mackerel feathering in summer is practically guaranteed action.

For shore fishing, start on a beach rather than rocks. Surf fishing is more forgiving of mistakes, and beaches like Freshwater West and Newgale are big enough that you won't get in trouble with tides as easily.

The Welsh coastline is genuinely one of the best-kept fishing secrets in the UK. While the rest of Britain crowds into the usual spots, there are miles of empty beaches, untouched rock marks, and productive waters here that most anglers never discover. Their loss.`,
  },
  {
    siteId: 1,
    slug: "wales-best-wildlife-encounters",
    title: "Wales' Best Wildlife Encounters: From Puffins to Red Kites",
    excerpt:
      "Puffins on Skomer, red kites at Gigrin Farm, dolphins in Cardigan Bay — Wales packs more world-class wildlife encounters into a small country than anywhere else in Britain. Here's where to go and when.",
    category: "trip-report" as const,
    author: "Adventure Wales",
    readTimeMinutes: 5,
    status: "published" as const,
    publishedAt: new Date(),
    content: `## A Country Punching Above Its Weight

Wales doesn't get enough credit for its wildlife. While the Scottish Highlands hog the nature documentary spotlight, Wales quietly delivers some of the best wildlife encounters in Europe — and you can reach most of them without a six-hour drive to the middle of nowhere.

Puffins? Got them. Red kites soaring in their hundreds? Absolutely. Dolphins visible from the shore? Regularly. Grey seals hauled out on beaches? All year round. And unlike a lot of "wildlife experiences" that involve squinting at a distant dot through binoculars, many of these encounters are up-close and genuinely unforgettable.

## Skomer Island Puffins

**When:** Mid-April to mid-July (peak late May-June)
**Where:** Skomer Island, off the Pembrokeshire coast

This is the big one. Skomer is home to around 40,000 puffins — one of the largest colonies in Southern Britain — and the experience of visiting is absolutely world-class. These aren't distant seabirds you need a telescope for. On Skomer, puffins waddle past your feet, literally within arm's reach. They couldn't care less that you're there.

The boat crossing from Martin's Haven takes 15 minutes and you'll probably spot harbour porpoises on the way over. Once on the island, the puffins are everywhere — popping out of burrows, crash-landing with beakfuls of sand eels, shuffling about looking perpetually concerned about something.

**Pro tips:**
- Only 250 day visitors allowed per trip. Book online through the Wildlife Trust of South & West Wales as early as possible — trips sell out weeks ahead
- The overnight stays on Skomer (available through the Wildlife Trust) are extraordinarily special. You get the island virtually to yourself after the day trippers leave, and you can watch Manx shearwaters return to their burrows at dusk — an experience so atmospheric it borders on eerie
- Wear good walking boots. The island paths are uneven and muddy
- Bring lunch and plenty of water — there's nothing to buy on the island

## Gigrin Farm Red Kite Feeding

**When:** Year-round, daily at 2pm (3pm in summer)
**Where:** Gigrin Farm, Rhayader, Mid Wales

Fifty years ago, red kites were nearly extinct in Britain — down to just a handful of breeding pairs, all in Mid Wales. Today, thanks to one of conservation's greatest success stories, there are thousands. And the best place to see them is Gigrin Farm, where hundreds gather every afternoon for the daily feeding.

This isn't a gentle nature experience. It's genuinely jaw-dropping. Hundreds of red kites wheel and dive overhead, fighting over scraps of meat while buzzards, ravens, and the occasional cheeky crow try to grab what they can. In winter, you might see 500+ kites at once — the sky literally full of them.

**What to expect:**
- Arrive 30 minutes before feeding time for a good spot in the hides
- Photography is incredible here — bring a long lens if you have one, but even a phone will capture something decent given how close the birds come
- Admission is around £8 for adults. One of the best wildlife bargains in Britain
- Combine with a walk along the Elan Valley reservoirs nearby — stunning Victorian engineering in equally stunning scenery

## Dolphins in Cardigan Bay

**When:** April to November (peak June-September)
**Where:** Cardigan Bay, particularly around New Quay and Aberaeron

Cardigan Bay has the largest resident population of bottlenose dolphins in the UK — around 300 animals that live here year-round. In summer, they move inshore to feed and socialise, and the sightings from New Quay harbour wall are so regular that locals barely look up from their chips.

**Best ways to see them:**

- **New Quay harbour wall and beach:** Free and surprisingly reliable. Dolphins often feed within 50 metres of the harbour, particularly around high tide. Sit with a coffee and watch — you might wait 20 minutes, you might wait 2 hours, but they usually show up
- **Boat trips:** Several operators run dolphin-watching trips from New Quay and Aberaeron. A Bay to Remember and SeaMor are well-established. Trips cost £15-25 and you'll typically see dolphins, grey seals, and various seabirds. The dolphins often ride the bow wave of the boat, which is as thrilling as it sounds
- **Kayaking:** For the paddlers, sea kayaking from New Quay gives you a chance of dolphins surfacing right next to your boat. Keep a respectful distance (at least 100m — let them come to you) and resist the urge to chase them

## Grey Seals

**When:** Year-round, pupping season September-November
**Where:** Ramsey Island, Skomer, the Pembrokeshire coast, Bardsey Island

Wales has some of the most accessible grey seal colonies in Britain. Ramsey Island (boat trips from St Davids) is home to hundreds, and in autumn the beaches fill up with fluffy white seal pups — one of the most photogenic wildlife spectacles going.

You'll also see seals regularly while coasteering, kayaking, or simply walking the Pembrokeshire Coast Path. They're curious animals and will often pop up to stare at you with those enormous dark eyes before rolling over and going back to sleep.

**Responsible watching:** Keep at least 50m from seals on beaches, especially during pupping season. A stressed seal mother may abandon her pup. Use binoculars, not your feet.

## More Wildlife Worth Seeking Out

### Ospreys at Cors Dyfi (Dyfi Osprey Project)
**When:** April to August
A breeding pair returns each spring to a specially built nest at the Dyfi Wildlife Centre near Machynlleth. Live cameras stream the action, but visiting in person and watching from the hide is far more special. Free entry.

### Choughs on the Pembrokeshire Coast
**When:** Year-round
These rare, red-billed corvids are one of Wales's conservation success stories. The Pembrokeshire coast is one of the best places in Britain to see them — look for them on clifftops at Elegug Stacks and around St Davids Head. Their acrobatic flying and distinctive "chee-ow" call make them easy to identify once you know what you're looking for.

### Red Squirrels on Anglesey
**When:** Year-round, best in autumn
Anglesey has its own red squirrel recovery programme, and numbers are growing. Newborough Forest and Pentraeth are good spots. They're shyer than their grey cousins, so patience and quiet footsteps are essential.

### Dark Sky Stargazing
Not wildlife exactly, but the Brecon Beacons (now Bannau Brycheiniog) and Snowdonia both have International Dark Sky Reserve status. On a clear night, the Milky Way is visible to the naked eye. It's wildlife for your soul.

## Making a Wildlife Trip Work

The beauty of Wales is that you can combine wildlife watching with proper adventure. Kayak to see dolphins in the morning, coasteer in the afternoon. Watch red kites in Mid Wales, then hit the mountain bike trails at Cwmcarn. Visit Skomer for puffins, then surf at Newgale on the way home.

Wildlife watching in Wales isn't a passive, binoculars-only affair. It's woven into the landscape, accessible from the same beaches, clifftops, and waters where you'll be having your adventures anyway. Keep your eyes open. You'll be amazed what shows up.`,
  },
  {
    siteId: 1,
    slug: "stag-hen-party-adventures-wales",
    title: "Stag & Hen Party Adventures in Wales: Beyond the Pub Crawl",
    excerpt:
      "Ditch the matching t-shirts and Wetherspoons crawl — Wales has stag and hen party adventures that people will actually remember. Coasteering, gorge walking, canyoning, and more besides.",
    category: "opinion" as const,
    author: "Adventure Wales",
    readTimeMinutes: 4,
    status: "published" as const,
    publishedAt: new Date(),
    content: `## Let's Be Honest About Stag and Hen Dos

We've all been on one. The kind where you wake up in a Premier Inn with a traffic cone and no memory of anything between the third bar and the kebab shop. Fun at the time (allegedly), but not exactly the stuff of lasting stories.

Here's a radical thought: what if your stag or hen do was actually... good? What if people talked about it for years because they jumped off a cliff into the sea, not because someone lost a shoe in a nightclub toilet?

Wales is quietly becoming one of the best stag and hen destinations in the UK, and it's got nothing to do with cheap pints. Although those are available too, obviously.

## Coasteering — The One Everyone Remembers

If you only do one adventure activity for your stag or hen, make it coasteering. There's nothing like watching your mate — the one who acts hard in the pub — absolutely bricking it on a 25-foot cliff jump while the rest of the group screams encouragement from below.

Pembrokeshire is the coasteering capital of the UK. Operators like Celtic Quest and Preseli Venture run sessions that include cliff jumping, sea cave swimming, wave riding, and scrambling along the rocks. It's physical, it's hilarious, and the shared terror/exhilaration bonds a group like nothing else.

**Expect to pay:** £45-65 per person for a half-day session. All gear (wetsuits, helmets, buoyancy aids) provided.

## Gorge Walking & Canyoning — Get Properly Soaked

Gorge walking is the Welsh valleys at their most dramatic. You'll wade, scramble, slide, and jump your way up a river gorge, navigating waterfalls and plunge pools while your mates try to push you in. It's like a water park designed by a sadist, and it's absolutely brilliant.

Canyoning takes it up a notch — abseiling down waterfalls, zip-lining across gorges, and generally doing things that look insane on the Instagram photos afterwards. Snowdonia has some cracking canyoning routes, and operators like Adrenalin Addicts and RAW Adventures know every inch of them.

**Best for:** Groups who want proper bragging rights and aren't precious about getting absolutely drenched.

## Paintball & Combat Games

Classic stag/hen territory, and Wales has some properly good setups beyond your standard field-with-a-few-pallets. Some centres in the Brecon Beacons area use former military training land — woodland, bunkers, the works. It's a step up from the suburban paintball places and the scenarios are genuinely tactical.

Laser tag and combat archery are growing alternatives if your group doesn't fancy the paintball bruises. Same competitive energy, fewer welts.

## Multi-Activity Days — The Full Package

This is the smart move for groups where fitness levels and bravery vary wildly (which is every group, let's be honest). Several Welsh operators offer full-day or weekend packages that combine multiple activities — a morning of kayaking, afternoon of coasteering, evening in the pub recovering.

**Popular combos:**
- Coasteering + surf lesson + BBQ on the beach
- Gorge walk + zip line + pub dinner
- Canyoning + mountain biking + campfire night
- Kayaking + cliff jumping + fish & chips in Tenby

Most operators will build a custom package for groups of 8+. Some handle accommodation too — bunkhouses, glamping pods, and self-catering cottages that fit a whole group are much more fun (and cheaper per head) than a block of hotel rooms.

## Where to Base Yourself

**Pembrokeshire** — Best for coasteering and beach activities. Tenby and St Davids both have good pubs and restaurants for the evening portion of proceedings.

**Snowdonia** — Best for gorge walking, canyoning, and mountain activities. Betws-y-Coed and Llanberis are solid bases with good nightlife for a small town.

**Brecon Beacons** — Best for mixed activity packages and more accessible from the Midlands and South England. Brecon town has a surprisingly good food and drink scene.

**Gower** — Best for surf, coasteering, and beach days. Mumbles is the go-to for evening entertainment.

## The Practical Stuff

- **Group size:** Most operators need a minimum of 6-8 people, maximum usually 16-20. Larger groups get split into smaller teams.
- **Fitness:** Be honest with the operator about your group's fitness level. They'll adjust the activity accordingly. Nobody wants the groom to have a cardiac event before the wedding.
- **Booze:** Most operators won't take you out if you're visibly drunk. Save it for afterwards. Trust us — you'll want a clear head for the cliff jumps.
- **Budget:** A full day of activities typically costs £80-150 per person. A weekend package including accommodation and multiple activities runs £200-350 per head. Still cheaper than a weekend in Barcelona, and you'll actually remember it.

## The Bottom Line

A stag or hen do should be something the group talks about for years. "Remember when Dave screamed like a child jumping off that cliff?" is a much better story than "Remember when Dave was sick in a taxi?" Wales delivers those stories. Big, daft, brilliant stories that don't require a liver transplant afterwards.

Book the adventure. Thank us at the wedding.`,
  },
  {
    siteId: 1,
    slug: "welsh-beaches-forget-cornwall",
    title: "10 Welsh Beaches That'll Make You Forget About Cornwall",
    excerpt:
      "Cornwall gets all the hype, but Wales has beaches that are just as stunning — and you won't need to queue for two hours to park. Here are 10 that prove the point, backed by sand, science, and absolutely zero bias.",
    category: "opinion" as const,
    author: "Adventure Wales",
    readTimeMinutes: 6,
    status: "published" as const,
    publishedAt: new Date(),
    content: `## Cornwall Has a PR Problem (For Everyone Else)

We need to talk about Cornwall. Specifically, we need to talk about why half of Britain fights through five hours of traffic on the M5 every summer to reach beaches that are — and we say this with respect — not actually better than what Wales has got.

Cornwall is lovely. We're not denying that. But its reputation has outgrown its capacity. You know the drill: leave at 4am, arrive at lunchtime, circle a car park for 45 minutes, squeeze onto a beach where your towel touches three other families, and pay £8 for an ice cream.

Meanwhile, Wales has beaches that are just as beautiful, a fraction as busy, and hours closer for anyone north of Bristol. The secret's been out for a while now, but somehow people still haven't caught on. Their loss. Your gain.

## 1. Rhossili Bay, Gower

**The showstopper.** Regularly voted one of the best beaches in the UK — and the world — Rhossili is three miles of golden sand backed by the dramatic sweep of Rhossili Down. The walk down from the car park is steep enough to thin out the crowds, and even at peak summer you can find space. At low tide, the remains of the shipwreck *Helvetia* emerge from the sand like a Tim Burton set piece.

Surfers: the south end gets consistent waves. Walkers: the headland at Worm's Head is spectacular (but check the tide times — people get stranded every year).

## 2. Barafundle Bay, Pembrokeshire

**The one on every "best of" list, and it deserves to be.** No road access — you have to walk 15 minutes from Stackpole car park through woodland and over a headland before it appears below you like something from a Mediterranean holiday brochure. Turquoise water, golden sand, sheltered by cliffs on both sides. No facilities, no shops, no noise. Just an absurdly beautiful beach.

Pack everything you need. There's nothing there. That's the entire point.

## 3. Three Cliffs Bay, Gower

**The dramatic one.** Three limestone cliffs jutting out of the sand, a river you have to wade across to reach the beach, and a ruined castle on the headland above. Three Cliffs looks like someone designed it specifically for landscape photography.

Getting there requires a 20-30 minute walk from Southgate or Penmaen, which again keeps the crowd levels sensible. Swimming is good in the sheltered areas, but watch the currents around the cliffs.

## 4. Whitesands Bay (Traeth Mawr), Pembrokeshire

**The surfer's beach.** Wales's answer to Fistral — a wide, west-facing beach that picks up Atlantic swell consistently. The surf school here (Ma Simes) is one of the best in Wales. Even when it's flat, the beach is gorgeous — bright white sand (hence the name) with views to Ramsey Island and its seal colonies.

St Davids — Britain's smallest city — is a mile up the road, with excellent food and the extraordinary cathedral tucked in its valley. Beach day + cathedral + pub dinner in Britain's smallest city = perfect day out.

## 5. Newborough Beach & Llanddwyn Island, Anglesey

**The romantic one.** Walk through Newborough Forest (red squirrels if you're lucky), emerge onto a vast beach, and keep going to Llanddwyn Island — a tidal peninsula dedicated to Wales's patron saint of lovers, St Dwynwen. There are lighthouse ruins, Celtic crosses, and views across to Snowdonia that look genuinely unreal.

At low tide, you can walk right round the island. The beach stretches for miles in both directions and even in August you can walk for 20 minutes without seeing another person.

## 6. Marloes Sands, Pembrokeshire

**The geology nerd's beach.** Dramatic folded rock formations at both ends, bright red and grey layers twisted into impossible shapes by 400 million years of tectonic forces. Oh, and it's also a stunning beach — half a mile of sand accessible via a 15-minute walk from the car park (noticing the pattern? The best Welsh beaches make you earn them).

Great rock pools at low tide. Skomer Island sits just offshore — you might see puffins from the beach in summer.

## 7. Mwnt, Ceredigion

**The hidden one.** A tiny perfect cove reached by a steep path from a clifftop church that's been there since the 14th century. Mwnt is small — don't come expecting Rhossili-scale space — but what it lacks in size it makes up for in character. Dolphins are regularly spotted from the headland above.

This is the kind of beach you discover on a detour and then annoyingly tell everyone about. We're doing that right now. Sorry, Mwnt.

## 8. Broad Haven South, Pembrokeshire

**The secret sibling.** Not to be confused with Broad Haven (the village with the car park and the ice cream vans). Broad Haven South is reached through the Bosherston lily ponds — themselves worth the visit — and opens up into a dramatic horseshoe bay backed by high cliffs. The lily ponds in June are extraordinary, and the beach has a natural rock arch called the Church Doors that looks like it belongs in a fantasy novel.

## 9. Porth Oer (Whistling Sands), Llŷn Peninsula

**The novelty one that's actually brilliant.** The sand here literally squeaks under your feet — something to do with the grain shape and compression. It's odd, it's delightful, and kids go absolutely mental for it. Beyond the party trick, it's a beautiful sheltered bay on the Llŷn Peninsula with clear water and relatively gentle waves.

The Llŷn in general is criminally undervisited. Think Cornwall's coast but with a fraction of the people and signs in Welsh.

## 10. Freshwater West, Pembrokeshire

**The wild one.** This is the beach they used in the Harry Potter films (Dobby's grave scene, Shell Cottage). It's vast, exposed, and untamed — big Atlantic waves, dramatic dunes, and a slightly end-of-the-world atmosphere that's intoxicating on a blustery day. Not the best for a quiet swim (strong currents), but for surfing, bodyboarding, or just standing in the wind feeling dramatically alive, it's unbeatable.

## Why Wales Wins

Here's the thing: Cornwall has maybe 10-15 genuinely world-class beaches. Wales has the same — but with half the visitors, shorter drive times for most of England, better parking, and (whisper it) comparable or superior scenery.

The Pembrokeshire Coast National Park alone has more Blue Flag beaches than you can shake a bucket and spade at. The Gower was Britain's first Area of Outstanding Natural Beauty. Anglesey and the Llŷn Peninsula are amongst the most beautiful coastlines in Europe.

And you can actually park. Sometimes for free. In July.

Stop driving to Cornwall. Start driving to Wales. Your blood pressure, your wallet, and your Instagram feed will all thank you.`,
  },
];

async function main() {
  console.log("Inserting 5 new journal articles...");

  for (const article of articles) {
    try {
      await db
        .insert(posts)
        .values(article)
        .onConflictDoNothing();
      console.log(`✅ Inserted: ${article.slug}`);
    } catch (err: any) {
      console.error(`❌ Failed: ${article.slug} — ${err.message}`);
    }
  }

  console.log("\nDone!");
  process.exit(0);
}

main();
