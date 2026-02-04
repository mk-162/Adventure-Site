#!/usr/bin/env python3
"""
Generate Activity+Region combo page content using Gemini API.

Usage:
    python scripts/generate-combo-pages.py --tier 1
    python scripts/generate-combo-pages.py --single snowdonia--hiking
    python scripts/generate-combo-pages.py --tier 1 --dry-run
"""

import os
import sys
import json
import time
import re
import argparse
from pathlib import Path

try:
    import google.generativeai as genai
except ImportError:
    os.system("pip install google-generativeai")
    import google.generativeai as genai

# =============================================================================
# CONFIG
# =============================================================================

PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / "data" / "combo-pages"
RESEARCH_DIR = PROJECT_ROOT / "data" / "research"

# =============================================================================
# TIER 1 COMBOS (10 pages)
# =============================================================================

TIER_1 = [
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Snowdon/Yr Wyddfa, Tryfan, Crib Goch, Cadair Idris, Carneddau, Glyderau",
        "targetKeyword": "hiking in snowdonia",
        "knownSpots": "Snowdon (6 routes), Tryfan North Ridge, Crib Goch, Cadair Idris, Cwm Idwal, Y Garn, Rhinog Fawr, Nantlle Ridge, Snowdon Horseshoe, Aber Falls to Carneddau",
        "knownOperators": "Plas y Brenin, Snowdonia Mountain Guides, MountainXperience",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor (Llanberis), Cotswold Outdoor (Betws-y-Coed)",
        "knownFood": "Pete's Eats (Llanberis), Moel Siabod Cafe (Capel Curig), Pinnacle Cafe (Capel Curig), Y Stablau (Betws-y-Coed), Heights Hotel (Llanberis), Bryn Tyrch Inn (Capel Curig)",
    },
    {
        "region": "pembrokeshire",
        "regionName": "Pembrokeshire",
        "activity": "surfing",
        "activityName": "Surfing",
        "whyFamous": "Freshwater West, Manorbier, Newgale, Whitesands Bay, Broadhaven South",
        "targetKeyword": "surfing in pembrokeshire",
        "knownSpots": "Freshwater West, Newgale, Manorbier, Whitesands Bay, Broadhaven South, Marloes Sands, West Angle Bay",
        "knownOperators": "MUUK Adventures, Outer Reef Surf School, Preseli Venture",
        "knownGearShops": "Newsurf (Newgale), Ma Simes Surf Hut (St Davids), West Wales Surf Shop",
        "knownFood": "The Sloop Inn (Porthgain), Bench Bar (Newgale), The Druidstone (Broad Haven), The Shed (Porthgain), Bishops (St Davids), Really Wild Emporium",
    },
    {
        "region": "pembrokeshire",
        "regionName": "Pembrokeshire",
        "activity": "coasteering",
        "activityName": "Coasteering",
        "whyFamous": "Birthplace of coasteering, St Davids, Abereiddy Blue Lagoon, Stackpole",
        "targetKeyword": "coasteering pembrokeshire",
        "knownSpots": "Abereiddy Blue Lagoon, St Davids Head, Stackpole Quay, St Non's Bay, Porthclais, Abercastle, Preseli cliffs",
        "knownOperators": "TYF Adventure, Activity Pembrokeshire, Preseli Venture, Celtic Quest Coasteering, MUUK Adventures, Outer Reef Surf School",
        "knownGearShops": "Ma Simes Surf Hut, TYF Shop (St Davids)",
        "knownFood": "The Sampler (St Davids), The Shed (Porthgain), The Sloop Inn (Porthgain), Bishops (St Davids), Bench Bar (Newgale), CWT (St Davids)",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "climbing",
        "activityName": "Climbing",
        "whyFamous": "Tryfan, Crib Goch, Idwal Slabs, Llanberis Pass, Tremadoc",
        "targetKeyword": "climbing in snowdonia",
        "knownSpots": "Tryfan, Idwal Slabs, Clogwyn Du'r Arddu (Cloggy), Dinas Mot, Dinas Cromlech, Tremadoc, Craig yr Ysfa, Milestone Buttress, Lliwedd",
        "knownOperators": "Plas y Brenin, Snowdonia Mountain Guides, MountainXperience",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor (Llanberis), Cotswold Outdoor (Betws-y-Coed), Siop Pinnacle",
        "knownFood": "Pete's Eats, Bryn Tyrch Inn, Heights Hotel, Gallt y Glyn, Vaynol Arms",
    },
    {
        "region": "gower",
        "regionName": "Gower",
        "activity": "surfing",
        "activityName": "Surfing",
        "whyFamous": "Llangennith/Rhossili, UK's first AONB, consistent Atlantic swells",
        "targetKeyword": "surfing in gower",
        "knownSpots": "Llangennith, Rhossili Bay, Langland Bay, Caswell Bay, Broughton Bay, Port Eynon, Oxwich Bay",
        "knownOperators": "Llangennith Surf School, Rip N Rock, Gower Activity Centres, Oxwich Watersports",
        "knownGearShops": "PJ's Surf Shop (Llangennith), Sam's Surf Shack, Gower Surf Development",
        "knownFood": "King's Head (Llangennith), Bay Bistro (Rhossili), Mewslade Bay beach cafe, The Ship Inn (Port Eynon), Verdi's (Mumbles), Pilot Inn (Mumbles)",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "zip-lining",
        "activityName": "Zip Lining",
        "whyFamous": "Zip World Velocity (world's fastest), Penrhyn Quarry, Bounce Below, Titan, Zip World Fforest",
        "targetKeyword": "zip lining snowdonia",
        "knownSpots": "Velocity 2 (Penrhyn Quarry), Titan (Blaenau Ffestiniog), Zip World Fforest (Betws-y-Coed), Bounce Below (Blaenau Ffestiniog), Caverns (Blaenau Ffestiniog), Quarry Karts, Skyride",
        "knownOperators": "Zip World",
        "knownGearShops": "Zip World on-site shops",
        "knownFood": "Zip World Penrhyn Quarry cafe, Blondies (Bethesda), Pete's Eats (Llanberis), The Cottage Loaf (Llanberis), Caffi Siabod (Capel Curig)",
    },
    {
        "region": "brecon-beacons",
        "regionName": "Brecon Beacons",
        "activity": "hiking",
        "activityName": "Hiking",
        "whyFamous": "Pen y Fan, Fan y Big, Sugar Loaf, Waterfall Country, Black Mountains",
        "targetKeyword": "hiking brecon beacons",
        "knownSpots": "Pen y Fan, Corn Du, Fan y Big, Sugar Loaf, Skirrid Fawr, Waterfall Country (Four Falls Trail), Fan Brycheiniog, Craig y Nos, Table Mountain (Crug Hywel), Blorenge",
        "knownOperators": "Adventure Britain, Black Mountain Adventure",
        "knownGearShops": "Cotswold Outdoor (Brecon area), Blacks, local outdoor shops",
        "knownFood": "The Felin Fach Griffin, Cafe on the Square (Brecon), The Bear Hotel (Crickhowell), Nantyfin Cider Mill, Star Inn (Talybont-on-Usk), White Hart Brecon",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "mountain-biking",
        "activityName": "Mountain Biking",
        "whyFamous": "Coed y Brenin, Antur Stiniog, Penmachno, Gwydir Mawr",
        "targetKeyword": "mountain biking snowdonia",
        "knownSpots": "Coed y Brenin (MBR, Dragon's Back, Temtiwr), Antur Stiniog (downhill), Penmachno trails, Gwydir Mawr, Marin Trail (Betws-y-Coed), Beddgelert Forest",
        "knownOperators": "Antur Stiniog, Coed y Brenin (NRW)",
        "knownGearShops": "Beics Brenin (Coed y Brenin), Antur Stiniog bike hire, Beics Betws (Betws-y-Coed)",
        "knownFood": "Cross Foxes (Dolgellau), Meirion Mill Cafe, Y Stablau (Betws-y-Coed), TY Siamas Cafe (Dolgellau), Caffi Siabod",
    },
    {
        "region": "pembrokeshire",
        "regionName": "Pembrokeshire",
        "activity": "kayaking",
        "activityName": "Kayaking",
        "whyFamous": "Sea kayaking around Ramsey Island, seals, puffins, Bitches rapids",
        "targetKeyword": "kayaking pembrokeshire",
        "knownSpots": "Ramsey Island circumnavigation, The Bitches rapids, Skomer Island, Solva harbour, Porthclais, Abereiddy, Stackpole Quay to Barafundle, Milford Haven",
        "knownOperators": "TYF Adventure, MUUK Adventures, Activity Pembrokeshire, Preseli Venture",
        "knownGearShops": "TYF Shop (St Davids), Ma Simes",
        "knownFood": "The Sampler (St Davids), The Shed (Porthgain), Cwtch (St Davids), The Sloop Inn (Porthgain), Bench Bar (Newgale)",
    },
    {
        "region": "snowdonia",
        "regionName": "Snowdonia",
        "activity": "gorge-walking",
        "activityName": "Gorge Walking",
        "whyFamous": "Ogwen Valley, Swallow Falls, Fairy Glen, Aberglaslyn Gorge",
        "targetKeyword": "gorge walking snowdonia",
        "knownSpots": "Ogwen Valley gorges, Swallow Falls area, Fairy Glen (Betws-y-Coed), Aberglaslyn Gorge (Beddgelert), Conwy Falls, Nant Gwynant, Dolgarrog",
        "knownOperators": "Adventure Britain, Plas y Brenin, MountainXperience",
        "knownGearShops": "Joe Brown's (Llanberis), V12 Outdoor",
        "knownFood": "Pete's Eats (Llanberis), Caffi Siabod (Capel Curig), Cobdens Hotel (Capel Curig), Ty Hyll Ugly House cafe",
    },
]

# =============================================================================
# PROMPT
# =============================================================================

def build_prompt(combo: dict, operator_context: str) -> str:
    return f"""You are an expert Welsh adventure tourism writer creating a comprehensive
guide page for "{combo['activityName']} in {combo['regionName']}".

Write like a knowledgeable local guide who's done every route and knows every cafe.
Be specific, practical, and honest — not generic tourism board copy.

TARGET KEYWORD: "{combo['targetKeyword']}"
FAMOUS FOR: {combo['whyFamous']}

KNOWN SPOTS/ROUTES: {combo['knownSpots']}
KNOWN OPERATORS: {combo['knownOperators']}
KNOWN GEAR SHOPS: {combo['knownGearShops']}
KNOWN FOOD/DRINK: {combo['knownFood']}

EXISTING OPERATOR DATA FROM OUR DATABASE:
{operator_context}

Generate a complete JSON file with ALL of the following. Return ONLY valid JSON, no markdown wrapping.

{{
  "regionSlug": "{combo['region']}",
  "activityTypeSlug": "{combo['activity']}",
  "title": "{combo['activityName']} in {combo['regionName']}",
  "strapline": "One punchy sentence — specific to this combo, not generic",
  "metaTitle": "Max 60 chars, includes target keyword, ends with | Adventure Wales",
  "metaDescription": "Max 155 chars, action-oriented, includes keyword",
  "heroAlt": "Descriptive alt text for the hero image",

  "introduction": "300-500 words of editorial markdown. Why this region is specifically great for this activity. What makes it different from elsewhere in Wales. Who it's best for. Include the target keyword 2-3 times naturally. Be honest and opinionated — mention challenges too. Write like a friend, not a brochure.",

  "bestSeason": "e.g. May-October",
  "difficultyRange": "e.g. Easy to Expert",
  "priceRange": "e.g. Free - £80 guided",

  "spots": [
    // 8-10 spots. For EACH spot include ALL of these fields:
    {{
      "name": "Specific route/spot name",
      "slug": "url-safe-slug",
      "description": "3-4 sentences. Practical, honest, specific. What's the experience like? What will you see?",
      "difficulty": "Easy|Moderate|Challenging|Expert",
      "duration": "e.g. 6-7 hours round trip",
      "distance": "e.g. 14.5km (for hiking/biking, null for others)",
      "elevationGain": "e.g. 1,085m (for hiking/biking, null for others)",
      "bestFor": "Who this suits — be specific",
      "notSuitableFor": "Honest warnings",
      "bestSeason": "e.g. May-September",
      "parking": "WHERE to park, cost, how early, alternatives",
      "startPoint": {{ "name": "Place name", "lat": 52.000, "lng": -4.000 }},
      "estimatedCost": "e.g. Free (parking £5-10) or £55pp guided",
      "operatorSlug": "slug of operator who offers guided version, or null",
      "insiderTip": "One thing only locals know — parking hack, best time, quiet alternative, where to stop"
    }}
  ],

  "practicalInfo": {{
    "weather": "2-3 sentences specific to this activity in this region. What conditions matter? What to watch?",
    "weatherLinks": [
      {{ "name": "Relevant forecast service", "url": "https://..." }}
    ],
    "gearChecklist": [
      "Activity-specific item 1",
      "Item 2 — include WHY it matters",
      "6-10 items total, practical not generic"
    ],
    "gearHire": [
      {{ "name": "Where to hire gear", "location": "Town", "url": "https://..." }}
    ],
    "gettingThere": {{
      "driveTimes": [
        {{ "from": "London", "duration": "Xh", "route": "Via which roads" }},
        {{ "from": "Manchester", "duration": "Xh", "route": "Via which roads" }},
        {{ "from": "Birmingham", "duration": "Xh", "route": "Via which roads" }},
        {{ "from": "Cardiff", "duration": "Xh", "route": "Via which roads" }}
      ],
      "publicTransport": "Specific train stations, bus services, Sherpa etc",
      "parkingTips": "General parking advice for this area"
    }},
    "safety": "Key safety points specific to this activity+region. Emergency contacts."
  }},

  "faqs": [
    // 6-8 real questions people ask. Check Google 'People Also Ask' for the target keyword.
    {{
      "question": "The actual question people search for?",
      "answer": "Direct, helpful answer in 2-4 sentences. Be specific, include numbers/names."
    }}
  ],

  "localDirectory": {{
    "gearShops": [
      // 4-6 real gear shops in this region relevant to this activity
      // These are the big names everyone knows. Include ALL notable ones.
      {{
        "name": "Shop Name",
        "slug": "shop-name",
        "address": "Full address with postcode",
        "lat": 52.000,
        "lng": -4.000,
        "description": "What they're known for, why people go there. 1-2 sentences.",
        "website": "https://...",
        "phone": "01234 567890",
        "services": ["gear sales", "hire", "repairs", "boot fitting"],
        "googleRating": 4.6,
        "reviewCount": 200
      }}
    ],
    "postActivitySpots": [
      // 5-8 real pubs, cafes, restaurants. The ones EVERYONE goes to after this activity.
      // Include the famous ones — climber pubs, surfer cafes, etc.
      {{
        "name": "Place Name",
        "slug": "place-name",
        "address": "Address or town",
        "lat": 52.000,
        "lng": -4.000,
        "description": "What makes this place special. Be specific — famous dishes, vibe, history.",
        "vibe": "e.g. Climber-friendly cafe, Surfer hangout, Cosy pub",
        "priceRange": "£|££|£££",
        "website": "https://... or null",
        "knownFor": "e.g. Giant portions, Real ales, Post-surf burritos"
      }}
    ],
    "accommodation": [
      // 5-6 real places to stay near the key spots
      // Mix of budget (hostels, camping) and mid-range (B&Bs, hotels)
      {{
        "name": "Place Name",
        "slug": "place-name",
        "description": "What makes it good for this activity. Location advantage.",
        "type": "hostel|campsite|bunkhouse|hotel|b&b|glamping",
        "priceRange": "£|££|£££",
        "nearestSpot": "Which spot/trailhead is it closest to and how far",
        "website": "https://... or null"
      }}
    ]
  }},

  "events": [
    // 3-5 real recurring events/competitions relevant to this activity in this region
    {{
      "name": "Event Name",
      "type": "race|festival|competition|exhibition",
      "monthTypical": "Month it usually happens",
      "description": "One sentence about what it is",
      "website": "https://...",
      "relevantActivities": ["{combo['activity']}"],
      "registrationCost": 45
    }}
  ],

  "keywords": {{
    "primary": "{combo['targetKeyword']}",
    "secondary": ["3-5 secondary keyword phrases"],
    "longTail": ["8-12 long-tail keyword phrases people actually search"],
    "localIntent": ["3-5 'near [town]' keywords"],
    "commercialIntent": ["3-5 keywords with buying intent — guided, hire, book, price"]
  }},

  "nearbyAlternatives": {{
    "sameActivity": [
      // 2-3 other regions where you can do the same activity
      {{ "regionSlug": "region-slug", "label": "{combo['activityName']} in Region Name" }}
    ],
    "sameRegion": [
      // 3-4 other activities in this same region
      {{ "activityTypeSlug": "activity-slug", "label": "Activity in {combo['regionName']}" }}
    ]
  }}
}}

CRITICAL RULES:
- All GPS coordinates must be real and accurate for Wales (lat 51-54, lng -6 to -2.5)
- All businesses, shops, cafes, pubs must be REAL places that actually exist
- Prices in GBP
- Be GENEROUS with the local directory — include every well-known business, not just 3
- Gear shops: include ALL notable ones in the area, even if 5-6
- Food spots: include ALL the famous post-activity spots, 5-8 of them
- Accommodation: 5-6 options mixing budget and mid-range
- Events: only include real recurring events
- Insider tips should be genuinely useful, not obvious
- FAQ answers should be direct and specific
- Introduction should be 300-500 words of quality editorial — opinionated, honest, practical
- If you don't know something for certain, use null rather than fabricating"""


def load_operator_context(combo: dict) -> str:
    """Load relevant operator data from our research files."""
    context_parts = []
    for batch_file in RESEARCH_DIR.glob("*.json"):
        try:
            with open(batch_file) as f:
                data = json.load(f)
            for op in data.get("operators", []):
                regions = op.get("regions", [])
                activities = op.get("activityTypes", [])
                if combo["region"] in regions:
                    context_parts.append(
                        f"- {op['name']}: {op.get('tagline', '')} | "
                        f"Activities: {', '.join(activities)} | "
                        f"Rating: {op.get('googleRating', 'N/A')} | "
                        f"Price range: {op.get('priceRange', 'N/A')}"
                    )
        except:
            pass

    if context_parts:
        return "\n".join(context_parts)
    return "No operator data available for this region."


def generate_combo_page(model, combo: dict) -> dict | None:
    """Generate a combo page JSON using Gemini."""
    operator_context = load_operator_context(combo)
    prompt = build_prompt(combo, operator_context)

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Strip markdown wrappers
        if text.startswith("```json"):
            text = text[len("```json"):].strip()
        if text.startswith("```"):
            text = text[3:].strip()
        if text.endswith("```"):
            text = text[:-3].strip()

        data = json.loads(text)
        return data

    except json.JSONDecodeError as e:
        print(f"\n    JSON parse error: {e}")
        # Try fixing trailing commas (common Gemini issue)
        try:
            fixed = re.sub(r',\s*([}\]])', r'\1', text)
            data = json.loads(fixed)
            print("    (fixed trailing commas)")
            return data
        except:
            pass
        try:
            json_match = re.search(r'\{[\s\S]*\}', text)
            if json_match:
                fixed = re.sub(r',\s*([}\]])', r'\1', json_match.group())
                return json.loads(fixed)
        except:
            pass
        print(f"    First 500 chars: {text[:500]}")
        return None
    except Exception as e:
        print(f"\n    API error: {e}")
        return None


def validate_combo(data: dict) -> list[str]:
    """Validate combo page data."""
    warnings = []

    # Check spots
    spots = data.get("spots", [])
    if len(spots) < 5:
        warnings.append(f"Only {len(spots)} spots (want 5-10)")

    # Check GPS on spots
    for s in spots:
        sp = s.get("startPoint", {})
        lat = sp.get("lat", 0)
        lng = sp.get("lng", 0)
        if lat and lng and (lat < 51 or lat > 54 or lng < -6 or lng > -2.5):
            warnings.append(f"Bad GPS on spot '{s.get('name', '?')}': {lat},{lng}")

    # Check local directory
    ld = data.get("localDirectory", {})
    gear = len(ld.get("gearShops", []))
    food = len(ld.get("postActivitySpots", []))
    accom = len(ld.get("accommodation", []))
    if gear < 2:
        warnings.append(f"Only {gear} gear shops")
    if food < 3:
        warnings.append(f"Only {food} food spots")
    if accom < 3:
        warnings.append(f"Only {accom} accommodation options")

    # Check intro length
    intro = data.get("introduction", "")
    words = len(intro.split())
    if words < 150:
        warnings.append(f"Introduction too short ({words} words)")

    # Check FAQs
    faqs = len(data.get("faqs", []))
    if faqs < 4:
        warnings.append(f"Only {faqs} FAQs")

    return warnings


def main():
    parser = argparse.ArgumentParser(description="Generate combo page content via Gemini")
    parser.add_argument("--tier", type=int, help="Generate tier 1 (10 pages)")
    parser.add_argument("--single", type=str, help="Single combo e.g. snowdonia--hiking")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true", help="Overwrite existing")
    args = parser.parse_args()

    if args.single:
        region, activity = args.single.split("--")
        combos = [c for c in TIER_1 if c["region"] == region and c["activity"] == activity]
        if not combos:
            print(f"ERROR: Combo '{args.single}' not found")
            sys.exit(1)
    elif args.tier == 1:
        combos = TIER_1
    else:
        print("ERROR: Specify --tier 1 or --single region--activity")
        sys.exit(1)

    print(f"Generating {len(combos)} combo pages...\n")

    if args.dry_run:
        for c in combos:
            print(f"  {c['region']}--{c['activity']}: {c['activityName']} in {c['regionName']}")
        return

    # Init Gemini
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    success = 0
    failed = 0

    for i, combo in enumerate(combos, 1):
        slug = f"{combo['region']}--{combo['activity']}"
        output_file = OUTPUT_DIR / f"{slug}.json"

        if output_file.exists() and not args.force:
            print(f"[{i}/{len(combos)}] {slug} ... SKIPPED (exists)")
            success += 1
            continue

        print(f"[{i}/{len(combos)}] {slug} ...", end=" ", flush=True)

        data = generate_combo_page(model, combo)

        if data:
            warnings = validate_combo(data)

            with open(output_file, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            spots = len(data.get("spots", []))
            ld = data.get("localDirectory", {})
            gear = len(ld.get("gearShops", []))
            food = len(ld.get("postActivitySpots", []))
            accom = len(ld.get("accommodation", []))
            faqs = len(data.get("faqs", []))
            warn = f" WARNINGS: {', '.join(warnings)}" if warnings else ""
            print(f"done ({spots} spots, {gear} shops, {food} food, {accom} accom, {faqs} FAQs){warn}")
            success += 1
        else:
            print("FAILED")
            failed += 1

        if i < len(combos):
            time.sleep(3)

    print(f"\n=== COMPLETE: {success} generated, {failed} failed ===")
    print(f"Output: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
