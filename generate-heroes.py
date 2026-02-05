#!/usr/bin/env python3
"""Generate hero images for Adventure Wales articles using Imagen 4 Fast."""

import json
import base64
import os
import sys
import time
import urllib.request
import urllib.error

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY not set")
    sys.exit(1)

BASE_DIR = "/home/minigeek/Adventure-Site/public/images/journal"
os.makedirs(BASE_DIR, exist_ok=True)

# Articles that need unique hero images (currently using generic/mismatched images)
# Format: (post_id, slug, prompt)
ARTICLES = [
    # WORST MISMATCHES - these have clearly wrong images
    (80, "mtb-trail-centre-tour", "Mountain bikers riding through lush Welsh forest trail centre, dirt track with berms and jumps, professional action photography, dramatic green canopy"),
    (16, "mountain-biking-gear", "Professional flat-lay of mountain biking gear on wooden table: helmet, gloves, knee pads, cycling shoes, multi-tool, Welsh mountain landscape through window"),
    (17, "mtb-gear", "Close-up of mountain bike components and riding gear arranged neatly, full suspension bike wheel, helmet, goggles, Welsh hills in background"),
    
    # GENERIC HIKING HERO USED FOR NON-HIKING CONTENT
    (110, "trail-running-wales", "Trail runner sprinting along dramatic Welsh mountain ridge path, athletic motion, misty valleys below, rugged Snowdonia terrain, golden hour light"),
    (125, "wildlife-watching-wales", "Atlantic puffins on Welsh coastal cliff edge with turquoise ocean, Pembrokeshire coast wildlife scene, natural light photography"),
    (127, "wye-valley-adventure-border", "Kayakers on River Wye flowing through stunning valley with autumn trees on limestone cliffs, adventure scene, beautiful light"),
    (115, "via-ferrata-wales", "Climber on via ferrata iron rungs bolted into dramatic Welsh cliff face, harness and helmet, stunning valley view below, adventure photography"),
    (103, "snowdon-which-path", "Dramatic view of Mount Snowdon summit with multiple hiking paths visible, walkers on Pyg Track, moody Welsh mountain sky"),
    (75, "mid-wales-empty-quarter", "Rolling green hills of Mid Wales with no people, vast empty landscape, lonely farmhouse, Cambrian Mountains, atmospheric mist"),
    
    # GENERIC PARTNER IMAGE
    (128, "zip-world-empire-guide", "Person soaring on zip line over flooded quarry in Snowdonia, dramatic aerial shot, turquoise water below, slate quarry walls"),
    (90, "plas-y-brenin-national-centre", "Grand stone outdoor centre building in Snowdonia with kayaks and climbing gear outside, mountains behind, professional architecture photo"),
    (91, "preseli-venture-profile", "Coasteering group jumping off Pembrokeshire sea cliffs into blue water, eco-friendly adventure activity, dramatic coastal setting"),
    
    # GENERIC SAFETY IMAGES
    (22, "coasteering-safety", "Coasteering guide checking safety equipment on participant at Welsh sea cliff edge, helmets and buoyancy aids, safety briefing"),
    (23, "cycling-safety", "Mountain biker wearing full safety gear on Welsh trail, helmet, gloves, pads, well-maintained bike, forest trail setting"),
    (25, "water-safety", "Safety instructor with throw rope and buoyancy aid at Welsh river edge, rescue equipment laid out, professional water safety"),
    (26, "weather-awareness", "Dramatic Welsh weather changing over Snowdonia mountains, dark storm clouds approaching over sunny valley, atmospheric landscape"),
    (27, "weather-safety", "Hikers sheltering from sudden Welsh mountain rain storm, dramatic cloudy sky, wind-blown rain, emergency shelter deployed"),
    (69, "group-safety-mixed-ability", "Mixed group of adventurers with different fitness levels on Welsh mountain path, guide supporting slower participants, inclusive outdoor activity"),
    
    # GENERIC GEAR IMAGES  
    (14, "coasteering-gear", "Flat-lay of coasteering equipment: wetsuit, helmet, buoyancy aid, reef shoes, arranged on beach rocks with Welsh coast background"),
    (15, "hiking-gear", "Hiking gear flat-lay on wooden floor: boots, backpack, waterproof jacket, map, compass, flask, Welsh mountain view through window"),
    (20, "wild-swimming-gear", "Wild swimming gear arranged on lake shore: wetsuit, swim cap, goggles, tow float, changing robe, Welsh mountain lake background"),
    (65, "first-aid-kit-adventure-wales", "Open adventure first aid kit with contents spread on rock, bandages, plasters, emergency blanket, whistle, Welsh mountain backdrop"),
    (126, "winter-hiking-gear-welsh-mountains", "Winter hiking gear flat-lay: insulated jacket, crampons, ice axe, thermal layers, headtorch, snowy Welsh mountain visible through window"),
    
    # GENERIC SEASONAL IMAGES
    (18, "spring-adventures", "Beautiful spring wildflowers on Welsh hillside with adventurer hiking, bright green landscape, lambs in fields, blue sky with white clouds"),
    (19, "summer-adventures", "Adventurers wild swimming in crystal clear Welsh mountain lake on summer day, bright sunshine, green hills surrounding"),
    (21, "winter-adventures", "Snow-covered Welsh mountain peak with winter hikers ascending, dramatic winter light, ice formations, crisp blue sky"),
    (11, "autumn-adventures", "Welsh valley in full autumn colour, orange and red trees, misty morning, hiker on forest path, dramatic golden light"),
    
    # GENERIC ACTIVITY GUIDE IMAGES (already have semi-relevant images but shared)
    (24, "mountain-safety", "Mountain rescue helicopter over Welsh peaks, safety equipment on ground, dramatic cloud formation, professional rescue scene"),
]

def generate_image(prompt, output_path):
    """Generate an image using Imagen 4 Fast."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key={API_KEY}"
    
    payload = json.dumps({
        "instances": [{"prompt": prompt}],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "16:9",
            "outputMimeType": "image/jpeg"
        }
    }).encode()
    
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    
    try:
        resp = urllib.request.urlopen(req, timeout=120)
        data = json.loads(resp.read())
        
        if "predictions" in data and data["predictions"]:
            img_b64 = data["predictions"][0]["bytesBase64Encoded"]
            img_bytes = base64.b64decode(img_b64)
            with open(output_path, "wb") as f:
                f.write(img_bytes)
            return len(img_bytes)
        else:
            print(f"  ERROR: No predictions in response: {json.dumps(data)[:200]}")
            return 0
    except Exception as e:
        print(f"  ERROR: {e}")
        return 0

def main():
    total = len(ARTICLES)
    success = 0
    
    for i, (post_id, slug, prompt) in enumerate(ARTICLES):
        output_path = os.path.join(BASE_DIR, f"{slug}-hero.jpg")
        
        # Skip if already generated in this run
        if os.path.exists(output_path):
            size = os.path.getsize(output_path)
            if size > 100000:  # >100KB means it's a real image, not error
                print(f"[{i+1}/{total}] SKIP {slug} (already exists, {size} bytes)")
                success += 1
                continue
        
        print(f"[{i+1}/{total}] Generating {slug}...")
        size = generate_image(prompt, output_path)
        
        if size > 0:
            print(f"  OK: {size} bytes -> {output_path}")
            success += 1
        else:
            print(f"  FAILED: {slug}")
        
        # Rate limiting - wait between requests
        if i < total - 1:
            time.sleep(2)
    
    print(f"\nDone: {success}/{total} images generated successfully")

if __name__ == "__main__":
    main()
