#!/bin/bash
# Generate hero images using Imagen 4 Fast via curl
set -euo pipefail

cd /home/minigeek/Adventure-Site
GEMINI_API_KEY=$(grep GEMINI_API_KEY .env | cut -d= -f2)
OUTDIR="public/images/journal"
mkdir -p "$OUTDIR"

generate() {
  local slug="$1"
  local prompt="$2"
  local outfile="${OUTDIR}/${slug}-hero.jpg"
  
  # Skip if already exists and is >100KB
  if [ -f "$outfile" ] && [ $(stat -c%s "$outfile" 2>/dev/null || echo 0) -gt 100000 ]; then
    echo "SKIP $slug (already exists)"
    return 0
  fi
  
  echo -n "GEN  $slug ... "
  
  local tmpfile="/tmp/imagen_${slug}.json"
  local http_code
  http_code=$(curl -s --max-time 90 -X POST \
    "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${GEMINI_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
      \"instances\": [{\"prompt\": \"${prompt}\"}],
      \"parameters\": {\"sampleCount\": 1, \"aspectRatio\": \"16:9\", \"outputMimeType\": \"image/jpeg\"}
    }" -o "$tmpfile" -w "%{http_code}" 2>/dev/null)
  
  if [ "$http_code" = "200" ]; then
    python3 -c "
import json, base64, sys
with open('${tmpfile}') as f:
    data = json.load(f)
if 'predictions' in data and data['predictions']:
    img = base64.b64decode(data['predictions'][0]['bytesBase64Encoded'])
    with open('${outfile}', 'wb') as out:
        out.write(img)
    print(f'OK ({len(img)} bytes)')
else:
    print(f'FAIL: no predictions')
    sys.exit(1)
"
  else
    echo "FAIL (HTTP $http_code)"
    cat "$tmpfile" 2>/dev/null | head -3
    return 1
  fi
  
  rm -f "$tmpfile"
  sleep 3
}

echo "=== Generating hero images ==="

# Worst mismatches first
generate "mountain-biking-gear" "Professional flat-lay of mountain biking gear on wooden table, helmet gloves knee pads cycling shoes multi-tool, Welsh mountain landscape through window"
generate "mtb-gear" "Close-up of mountain bike components and riding gear arranged neatly, full suspension bike wheel helmet goggles, Welsh hills in background"

# Generic hiking hero used for non-hiking content
generate "trail-running-wales" "Trail runner sprinting along dramatic Welsh mountain ridge path, athletic motion, misty valleys below, rugged Snowdonia terrain, golden hour light"
generate "wildlife-watching-wales" "Atlantic puffins on Welsh coastal cliff edge with turquoise ocean, Pembrokeshire coast wildlife scene, natural light photography"
generate "wye-valley-adventure-border" "Kayakers on River Wye flowing through stunning valley with autumn trees on limestone cliffs, adventure scene, beautiful light"
generate "via-ferrata-wales" "Climber on via ferrata iron rungs bolted into dramatic Welsh cliff face, harness and helmet, stunning valley view below, adventure photography"
generate "snowdon-which-path" "Dramatic view of Mount Snowdon summit with multiple hiking paths visible, walkers on mountain path, moody Welsh mountain sky"
generate "mid-wales-empty-quarter" "Rolling green hills of Mid Wales with no people, vast empty landscape, lonely farmhouse, Cambrian Mountains, atmospheric mist"

# Generic partner images
generate "zip-world-empire-guide" "Person soaring on zip line over flooded quarry in Snowdonia, dramatic aerial shot, turquoise water below, slate quarry walls"
generate "plas-y-brenin-national-centre" "Grand stone outdoor centre building in Snowdonia with kayaks and climbing gear outside, mountains behind, professional photo"
generate "preseli-venture-profile" "Coasteering group jumping off Pembrokeshire sea cliffs into blue water, adventure activity, dramatic coastal setting"

# Safety articles
generate "coasteering-safety" "Coasteering guide checking safety equipment on participant at Welsh sea cliff edge, helmets and buoyancy aids, safety briefing"
generate "cycling-safety" "Mountain biker wearing full safety gear on Welsh trail, helmet gloves pads, well-maintained bike, forest trail setting"
generate "water-safety" "Safety instructor with throw rope and buoyancy aid at Welsh river edge, rescue equipment laid out, professional water safety"
generate "weather-awareness" "Dramatic Welsh weather changing over Snowdonia mountains, dark storm clouds approaching over sunny valley, atmospheric landscape"
generate "weather-safety" "Hikers sheltering from sudden Welsh mountain rain storm, dramatic cloudy sky, emergency shelter deployed on hillside"
generate "group-safety-mixed-ability" "Mixed group of adventurers with different fitness levels on Welsh mountain path, guide supporting participants, inclusive outdoor activity"
generate "mountain-safety" "Mountain rescue helicopter over Welsh peaks, safety equipment on ground, dramatic cloud formation, professional rescue scene"

# Gear articles
generate "coasteering-gear" "Flat-lay of coasteering equipment wetsuit helmet buoyancy aid reef shoes, arranged on beach rocks with Welsh coast background"
generate "hiking-gear" "Hiking gear flat-lay on wooden floor, boots backpack waterproof jacket map compass flask, Welsh mountain view through window"
generate "wild-swimming-gear" "Wild swimming gear arranged on lake shore, wetsuit swim cap goggles tow float changing robe, Welsh mountain lake background"
generate "first-aid-kit-adventure-wales" "Open adventure first aid kit with contents spread on rock, bandages plasters emergency blanket whistle, Welsh mountain backdrop"
generate "winter-hiking-gear-welsh-mountains" "Winter hiking gear flat-lay, insulated jacket crampons ice axe thermal layers headtorch, snowy Welsh mountain visible through window"

# Seasonal articles
generate "spring-adventures" "Beautiful spring wildflowers on Welsh hillside with adventurer hiking, bright green landscape, lambs in fields, blue sky"
generate "summer-adventures" "Adventurers wild swimming in crystal clear Welsh mountain lake on summer day, bright sunshine, green hills surrounding"
generate "winter-adventures" "Snow-covered Welsh mountain peak with winter hikers ascending, dramatic winter light, ice formations, crisp blue sky"
generate "autumn-adventures" "Welsh valley in full autumn colour, orange and red trees, misty morning, hiker on forest path, dramatic golden light"

echo ""
echo "=== Done ==="
ls -la ${OUTDIR}/*-hero.jpg 2>/dev/null | wc -l
echo "hero images in ${OUTDIR}"
