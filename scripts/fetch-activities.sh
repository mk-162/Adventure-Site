#!/bin/bash
# Download activity images with fallback queries
set -e

API_KEY="BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4"
IMAGES_DIR="public/images"
ATTRIBUTIONS_FILE="$IMAGES_DIR/attributions.json"

mkdir -p "$IMAGES_DIR/activities"

# Initialize attributions file if it doesn't exist
if [ ! -f "$ATTRIBUTIONS_FILE" ]; then
    echo "{}" > "$ATTRIBUTIONS_FILE"
fi

fetch_image() {
    local query="$1"
    local output_path="$2"
    local width="${3:-1200}"
    local height="${4:-800}"

    echo "  Trying: $query"

    response=$(curl -s "https://api.unsplash.com/search/photos?query=$(echo "$query" | jq -sRr @uri)&per_page=1&orientation=landscape" \
        -H "Authorization: Client-ID $API_KEY")

    photo_id=$(echo "$response" | jq -r '.results[0].id // empty')

    if [ -z "$photo_id" ]; then
        return 1
    fi

    raw_url=$(echo "$response" | jq -r '.results[0].urls.raw')
    photo_url=$(echo "$response" | jq -r '.results[0].links.html')
    photographer=$(echo "$response" | jq -r '.results[0].user.name')
    photographer_url=$(echo "$response" | jq -r '.results[0].user.links.html')
    download_location=$(echo "$response" | jq -r '.results[0].links.download_location')

    # Trigger download (required by Unsplash API)
    curl -s "$download_location" -H "Authorization: Client-ID $API_KEY" > /dev/null

    curl -sL "${raw_url}&w=${width}&h=${height}&fit=crop&crop=entropy&q=80" -o "$output_path"

    # Update attributions
    relative_path="images/activities/$(basename "$output_path")"
    tmp_file=$(mktemp)
    jq --arg path "$relative_path" \
       --arg photographer "$photographer" \
       --arg photographer_url "$photographer_url" \
       --arg photo_url "$photo_url" \
       --arg date "$(date +%Y-%m-%d)" \
       '.[$path] = {
           "photographer": $photographer,
           "photographer_url": $photographer_url,
           "photo_url": $photo_url,
           "downloaded": $date
       }' "$ATTRIBUTIONS_FILE" > "$tmp_file"
    mv "$tmp_file" "$ATTRIBUTIONS_FILE"

    echo "  ✓ Downloaded: $photographer"
    return 0
}

download_activity() {
    local slug="$1"
    shift
    local queries=("$@")

    echo ""
    echo "=== $slug ==="

    if [ -f "$IMAGES_DIR/activities/${slug}-hero.jpg" ]; then
        echo "  Already exists, skipping"
        return 0
    fi

    for query in "${queries[@]}"; do
        if fetch_image "$query" "$IMAGES_DIR/activities/${slug}-hero.jpg" 1200 800; then
            return 0
        fi
    done

    echo "  ✗ No results found"
    return 1
}

echo "Downloading Adventure Wales Activity Images"
echo "============================================"

# Priority activities (hero content)
download_activity "zip-lining" \
    "zip line adventure" \
    "zipline flying" \
    "aerial adventure wire"

download_activity "coasteering" \
    "coasteering cliff jumping" \
    "cliff jumping ocean" \
    "jumping into sea rocks"

download_activity "mountain-biking" \
    "mountain biking trail action" \
    "mtb downhill" \
    "cycling forest trail"

download_activity "hiking" \
    "hiking mountain summit" \
    "hiker ridge dramatic" \
    "trekking mountain view"

download_activity "climbing" \
    "rock climbing outdoor" \
    "climber cliff face" \
    "climbing adventure ropes"

download_activity "kayaking" \
    "sea kayaking scenic" \
    "kayak ocean adventure" \
    "paddling kayak coast"

download_activity "surfing" \
    "surfing wave action" \
    "surfer ocean wave" \
    "surf beach wave"

download_activity "wild-swimming" \
    "wild swimming lake" \
    "open water swimming nature" \
    "swimming lake mountains"

download_activity "caving" \
    "caving adventure underground" \
    "cave exploration helmet light" \
    "potholing cave"

download_activity "gorge-walking" \
    "gorge walking waterfall" \
    "canyoning adventure" \
    "river gorge scrambling"

# Additional activities from the data
download_activity "paddleboarding" \
    "stand up paddleboard" \
    "SUP paddleboard lake" \
    "paddleboarding calm water"

download_activity "rafting" \
    "white water rafting" \
    "river rafting adventure" \
    "rafting rapids team"

download_activity "horse-riding" \
    "horse riding trail" \
    "horseback beach" \
    "equestrian countryside"

download_activity "sailing" \
    "sailing boat adventure" \
    "yacht sailing coast" \
    "dinghy sailing"

download_activity "paragliding" \
    "paragliding mountain" \
    "paraglider flying" \
    "tandem paragliding"

download_activity "kitesurfing" \
    "kitesurfing action" \
    "kitesurf beach" \
    "kiteboarding wave"

download_activity "windsurfing" \
    "windsurfing action" \
    "windsurf wave" \
    "windsurfer beach"

download_activity "archery" \
    "archery outdoor" \
    "bow arrow target" \
    "archery adventure"

download_activity "high-ropes" \
    "high ropes course" \
    "aerial adventure park" \
    "treetop adventure"

download_activity "abseiling" \
    "abseiling cliff" \
    "rappelling adventure" \
    "rope descent outdoor"

echo ""
echo "============================================"
echo "Done! Check $ATTRIBUTIONS_FILE for credits"
