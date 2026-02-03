#!/bin/bash
# Adventure Wales Image Fetcher
# Downloads images from Unsplash with proper attribution tracking

set -e

API_KEY="BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4"
BASE_DIR="$(dirname "$0")/.."
IMAGES_DIR="$BASE_DIR/public/images"
ATTRIBUTIONS_FILE="$IMAGES_DIR/attributions.json"

# Initialize attributions file if it doesn't exist
if [ ! -f "$ATTRIBUTIONS_FILE" ]; then
    echo "{}" > "$ATTRIBUTIONS_FILE"
fi

# Function to fetch and download an image
fetch_image() {
    local query="$1"
    local output_path="$2"
    local width="${3:-1200}"
    local height="${4:-800}"

    echo "Searching for: $query"

    # Search Unsplash
    response=$(curl -s "https://api.unsplash.com/search/photos?query=$(echo "$query" | jq -sRr @uri)&per_page=1&orientation=landscape" \
        -H "Authorization: Client-ID $API_KEY")

    # Extract data
    photo_id=$(echo "$response" | jq -r '.results[0].id // empty')

    if [ -z "$photo_id" ]; then
        echo "  No results found for: $query"
        return 1
    fi

    raw_url=$(echo "$response" | jq -r '.results[0].urls.raw')
    photo_url=$(echo "$response" | jq -r '.results[0].links.html')
    photographer=$(echo "$response" | jq -r '.results[0].user.name')
    photographer_url=$(echo "$response" | jq -r '.results[0].user.links.html')
    download_location=$(echo "$response" | jq -r '.results[0].links.download_location')

    # Trigger download (required by Unsplash API guidelines)
    curl -s "$download_location" -H "Authorization: Client-ID $API_KEY" > /dev/null

    # Create output directory
    mkdir -p "$(dirname "$output_path")"

    # Download with resize
    echo "  Downloading: $photographer - $photo_id"
    curl -sL "${raw_url}&w=${width}&h=${height}&fit=crop&crop=entropy&q=80" -o "$output_path"

    # Get relative path for attribution (strip leading public/)
    relative_path="${output_path#*/public/}"

    # Update attributions.json
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

    echo "  Saved to: $output_path"
    echo "  Credit: Photo by $photographer on Unsplash"
    echo ""
}

# Region image specifications - using broader search terms for better results
declare -A REGIONS=(
    ["snowdonia"]="snowdonia mountain dramatic clouds"
    ["pembrokeshire"]="pembrokeshire coast cliffs sea"
    ["brecon-beacons"]="brecon beacons reservoir hills"
    ["anglesey"]="anglesey lighthouse coastal"
    ["gower"]="gower beach cliffs sunset"
    ["llyn-peninsula"]="welsh coast remote cove"
    ["south-wales"]="welsh valleys green hills"
    ["north-wales"]="north wales slate mountains"
    ["mid-wales"]="welsh countryside reservoir remote"
    ["carmarthenshire"]="welsh countryside green rolling"
    ["wye-valley"]="wye valley river forest autumn"
)

# Activity type mappings
declare -A ACTIVITIES=(
    ["zip-lining"]="zip line adventure flying speed"
    ["coasteering"]="coasteering cliff jumping ocean adventure"
    ["mountain-biking"]="mountain biking trail forest action"
    ["hiking"]="hiking mountain summit trail view"
    ["climbing"]="rock climbing outdoor adventure ropes"
    ["kayaking"]="kayaking sea paddle scenic water"
    ["surfing"]="surfing wave ocean beach action"
    ["wild-swimming"]="wild swimming lake nature outdoor"
    ["caving"]="caving underground cave exploration helmet"
    ["gorge-walking"]="gorge walking waterfall adventure wetsuit"
)

# Download regions
download_regions() {
    echo "=== Downloading Region Images ==="
    for slug in "${!REGIONS[@]}"; do
        fetch_image "${REGIONS[$slug]}" "$IMAGES_DIR/regions/${slug}-hero.jpg" 1920 1080
    done
}

# Download activities by type
download_activities() {
    echo "=== Downloading Activity Type Images ==="
    for slug in "${!ACTIVITIES[@]}"; do
        fetch_image "${ACTIVITIES[$slug]}" "$IMAGES_DIR/activities/${slug}-hero.jpg" 1200 800
    done
}

# Main execution
case "${1:-all}" in
    regions)
        download_regions
        ;;
    activities)
        download_activities
        ;;
    all)
        download_regions
        download_activities
        ;;
    single)
        # Usage: ./fetch-images.sh single "search query" output/path.jpg [width] [height]
        fetch_image "$2" "$3" "${4:-1200}" "${5:-800}"
        ;;
    *)
        echo "Usage: $0 {regions|activities|all|single}"
        echo ""
        echo "Examples:"
        echo "  $0 regions                                    # Download all region images"
        echo "  $0 activities                                 # Download activity type images"
        echo "  $0 all                                        # Download everything"
        echo "  $0 single 'hiking wales' public/images/x.jpg  # Single image"
        exit 1
        ;;
esac

echo "Done! Attribution data saved to: $ATTRIBUTIONS_FILE"
