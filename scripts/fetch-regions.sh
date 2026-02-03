#!/bin/bash
# Download region images with fallback queries
set -e

API_KEY="BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4"
IMAGES_DIR="public/images"
ATTRIBUTIONS_FILE="$IMAGES_DIR/attributions.json"

mkdir -p "$IMAGES_DIR/regions"

# Initialize attributions file if it doesn't exist
if [ ! -f "$ATTRIBUTIONS_FILE" ]; then
    echo "{}" > "$ATTRIBUTIONS_FILE"
fi

fetch_image() {
    local query="$1"
    local output_path="$2"
    local width="${3:-1920}"
    local height="${4:-1080}"

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
    relative_path="images/regions/$(basename "$output_path")"
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

download_region() {
    local slug="$1"
    shift
    local queries=("$@")

    echo ""
    echo "=== $slug ==="

    if [ -f "$IMAGES_DIR/regions/${slug}-hero.jpg" ]; then
        echo "  Already exists, skipping"
        return 0
    fi

    for query in "${queries[@]}"; do
        if fetch_image "$query" "$IMAGES_DIR/regions/${slug}-hero.jpg" 1920 1080; then
            return 0
        fi
    done

    echo "  ✗ No results found"
    return 1
}

echo "Downloading Adventure Wales Region Images"
echo "=========================================="

# Each region with multiple fallback queries
download_region "snowdonia" \
    "snowdonia mountain" \
    "snowdon wales" \
    "welsh mountains dramatic"

download_region "pembrokeshire" \
    "pembrokeshire coast" \
    "pembrokeshire cliffs" \
    "welsh coastline cliffs"

download_region "brecon-beacons" \
    "brecon beacons" \
    "brecon reservoir" \
    "welsh hills green"

download_region "anglesey" \
    "anglesey wales" \
    "anglesey lighthouse" \
    "welsh island coast"

download_region "gower" \
    "gower peninsula" \
    "gower beach" \
    "rhossili bay"

download_region "llyn-peninsula" \
    "abersoch wales" \
    "welsh peninsula coast" \
    "wales hidden beach"

download_region "south-wales" \
    "south wales valleys" \
    "welsh valleys green" \
    "valleys wales nature"

download_region "north-wales" \
    "north wales" \
    "welsh slate quarry" \
    "conwy wales"

download_region "mid-wales" \
    "elan valley" \
    "mid wales reservoir" \
    "welsh wilderness"

download_region "carmarthenshire" \
    "carmarthenshire" \
    "welsh countryside castle" \
    "wales green countryside"

download_region "wye-valley" \
    "wye valley" \
    "tintern abbey" \
    "river wye forest"

echo ""
echo "=========================================="
echo "Done! Check $ATTRIBUTIONS_FILE for credits"
