#!/usr/bin/env python3
"""
Openverse Image Fetcher for Adventure Wales

Fetches Creative Commons licensed images from Openverse API.
No API key required, much higher rate limits than Unsplash.

Usage:
    python scripts/fetch_openverse_images.py --entity activities
    python scripts/fetch_openverse_images.py --entity regions --limit 5
"""

import json
import time
import argparse
import requests
from datetime import datetime
from pathlib import Path

# Configuration
OPENVERSE_API = "https://api.openverse.org/v1/images/"
ALLOWED_LICENSES = ["cc0", "by", "by-sa"]

BASE_DIR = Path(__file__).parent.parent
CONTENT_DIR = BASE_DIR / "content"
DATA_DIR = BASE_DIR / "data" / "wales"
IMAGES_DIR = BASE_DIR / "public" / "images"
REPORTS_DIR = BASE_DIR / "reports"
ATTRIBUTIONS_FILE = IMAGES_DIR / "attributions.json"

LICENSE_URLS = {
    "cc0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "by": "https://creativecommons.org/licenses/by/4.0/",
    "by-sa": "https://creativecommons.org/licenses/by-sa/4.0/",
}

# Search terms
ACTIVITY_SEARCH_TERMS = {
    "zip-lining": ["zip line adventure", "zipline", "aerial adventure"],
    "coasteering": ["cliff jumping sea", "coasteering", "sea cliff adventure"],
    "mountain-biking": ["mountain biking", "mtb trail", "downhill bike"],
    "hiking": ["hiking mountain", "trekking trail", "hill walking"],
    "climbing": ["rock climbing outdoor", "climber cliff"],
    "kayaking": ["sea kayaking", "kayak coast", "paddling"],
    "surfing": ["surfing wave", "surfer ocean"],
    "wild-swimming": ["wild swimming lake", "open water swimming"],
    "caving": ["caving underground", "cave exploration"],
    "gorge-walking": ["gorge waterfall", "canyoning river"],
    "paddleboarding": ["stand up paddleboard", "SUP lake"],
    "rafting": ["white water rafting", "river rafting"],
    "horse-riding": ["horse riding trail", "horseback mountains"],
    "sailing": ["sailing yacht", "dinghy sailing"],
    "paragliding": ["paragliding mountain", "paraglider"],
    "kitesurfing": ["kitesurfing", "kitesurf beach"],
    "windsurfing": ["windsurfing", "windsurf"],
    "archery": ["archery outdoor", "bow arrow"],
    "high-ropes": ["high ropes course", "treetop adventure"],
    "abseiling": ["abseiling cliff", "rappelling"],
    "canyoning": ["canyoning waterfall", "canyon adventure"],
    "jet-ski": ["jet ski", "water sport"],
    "powerboating": ["speedboat", "powerboat"],
    "trail-running": ["trail running mountain", "fell running"],
    "toboggan": ["alpine coaster", "mountain coaster"],
    "mine-exploration": ["mine tour underground", "slate mine"],
    "underground-trampolines": ["underground trampoline", "bounce below"],
    "wildlife-boat-tour": ["wildlife boat tour", "seal watching"],
}

REGION_SEARCH_TERMS = {
    "snowdonia": ["snowdonia mountain", "snowdon wales", "eryri"],
    "pembrokeshire": ["pembrokeshire coast", "pembrokeshire cliffs"],
    "brecon-beacons": ["brecon beacons", "bannau brycheiniog"],
    "anglesey": ["anglesey wales", "anglesey coast"],
    "gower": ["gower peninsula", "rhossili bay"],
    "llyn-peninsula": ["llyn peninsula", "abersoch"],
    "south-wales": ["south wales valleys", "welsh valleys"],
    "north-wales": ["north wales mountains", "conwy"],
    "mid-wales": ["elan valley", "mid wales"],
    "carmarthenshire": ["carmarthenshire", "welsh countryside"],
    "wye-valley": ["wye valley", "tintern abbey"],
}


def load_attributions() -> dict:
    if ATTRIBUTIONS_FILE.exists():
        with open(ATTRIBUTIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_attributions(data: dict):
    ATTRIBUTIONS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(ATTRIBUTIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def search_openverse(query: str, page_size: int = 20) -> list:
    """Search Openverse API for images."""
    params = {
        "q": query,
        "license": ",".join(ALLOWED_LICENSES),
        "page_size": page_size,
    }

    try:
        response = requests.get(OPENVERSE_API, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        print(f"    [API] {len(data.get('results', []))} results for '{query}'")
        return data.get("results", [])
    except Exception as e:
        print(f"    [ERROR] {e}")
        return []


def calculate_score(image: dict, queries: list) -> float:
    """Score an image based on quality."""
    score = 0.0

    width = image.get("width", 0)
    height = image.get("height", 1)
    aspect_ratio = width / height if height > 0 else 0

    # Prefer landscape
    if aspect_ratio >= 1.6:
        score += 30
    elif aspect_ratio >= 1.4:
        score += 20
    elif aspect_ratio < 1.0:
        score -= 20

    # Resolution
    if width >= 2000:
        score += 25
    elif width >= 1500:
        score += 20
    elif width >= 1200:
        score += 15
    elif width < 800:
        score -= 10

    # Keywords in title/tags
    title = (image.get("title") or "").lower()
    tags = " ".join(t.get("name", "") for t in image.get("tags", []))
    all_text = f"{title} {tags}".lower()

    for term in queries:
        for word in term.lower().split():
            if word in all_text and len(word) > 3:
                score += 5

    return score


def fetch_best_image(queries: list, existing_urls: set) -> dict | None:
    """Fetch the best matching image from Openverse."""
    all_candidates = []
    seen_urls = set()

    for query in queries:
        results = search_openverse(query)
        for img in results:
            url = img.get("url", "")
            if url and url not in seen_urls and url not in existing_urls:
                seen_urls.add(url)
                img["_score"] = calculate_score(img, queries)
                all_candidates.append(img)
        time.sleep(0.5)  # Be nice to the API

    if not all_candidates:
        return None

    # Sort by score descending
    all_candidates.sort(key=lambda x: -x.get("_score", 0))
    return all_candidates[0]


def download_image(url: str, output_path: Path) -> bool:
    """Download an image to the specified path."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(response.content)
        return True
    except Exception as e:
        print(f"    [ERROR] Download failed: {e}")
        return False


def get_activities() -> list:
    """Get unique activity types from CSV."""
    activities = set()
    csv_path = DATA_DIR / "Wales database - Activities.csv"
    if csv_path.exists():
        import csv
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                activity_type = row.get("Type", "").strip()
                if activity_type:
                    slug = activity_type.lower().replace(" ", "-").replace("/", "-")
                    activities.add((slug, activity_type))
    return [{"slug": s, "name": n} for s, n in sorted(activities)]


def get_regions() -> list:
    """Get list of regions."""
    regions = []
    regions_dir = CONTENT_DIR / "regions"
    if regions_dir.exists():
        for f in regions_dir.glob("*.md"):
            slug = f.stem
            regions.append({"slug": slug, "name": slug.replace("-", " ").title()})
    return regions


def run(entity: str = "activities", limit: int = 50):
    """Main runner."""
    print("=" * 60)
    print("Adventure Wales — Openverse Image Fetcher")
    print("=" * 60)

    # Check existing images
    existing = set()
    entity_dir = IMAGES_DIR / entity
    for f in entity_dir.glob("*-hero.jpg"):
        existing.add(f.stem.replace("-hero", ""))

    # Get items
    if entity == "activities":
        items = get_activities()
        search_terms = ACTIVITY_SEARCH_TERMS
    elif entity == "regions":
        items = get_regions()
        search_terms = REGION_SEARCH_TERMS
    else:
        print(f"Unknown entity: {entity}")
        return

    # Filter existing
    items = [i for i in items if i["slug"] not in existing][:limit]
    print(f"Found {len(items)} {entity} needing images\n")

    if not items:
        print("Nothing to do!")
        return

    attributions = load_attributions()
    existing_urls = set(attributions.keys())
    downloaded = 0

    for i, item in enumerate(items):
        slug = item["slug"]
        name = item["name"]
        print(f"[{i+1}/{len(items)}] {name}")

        # Get search queries
        queries = search_terms.get(slug, [f"{name} adventure", f"{name} outdoor"])

        # Fetch best image
        img = fetch_best_image(queries, existing_urls)

        if not img:
            print("    [SKIP] No suitable images found")
            continue

        # Download
        url = img.get("url", "")
        output_path = entity_dir / f"{slug}-hero.jpg"

        if download_image(url, output_path):
            print(f"    ✓ Downloaded: {img.get('creator', 'Unknown')} ({img.get('width')}x{img.get('height')})")
            downloaded += 1

            # Track attribution
            rel_path = f"images/{entity}/{slug}-hero.jpg"
            license_code = img.get("license", "by")
            attributions[rel_path] = {
                "creator": img.get("creator", "Unknown"),
                "creator_url": img.get("creator_url", ""),
                "source": img.get("foreign_landing_url", url),
                "license": license_code.upper(),
                "license_url": LICENSE_URLS.get(license_code, ""),
                "downloaded": datetime.now().strftime("%Y-%m-%d"),
            }
            existing_urls.add(url)

    save_attributions(attributions)
    print(f"\n{'=' * 60}")
    print(f"Downloaded {downloaded}/{len(items)} images")
    print(f"Attributions saved to {ATTRIBUTIONS_FILE}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch images from Openverse")
    parser.add_argument("--entity", choices=["regions", "activities"], default="activities")
    parser.add_argument("--limit", type=int, default=50)

    args = parser.parse_args()
    run(entity=args.entity, limit=args.limit)
