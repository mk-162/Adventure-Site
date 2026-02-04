#!/usr/bin/env python3
"""
Fetch hero images for all journal articles.
Primary: Openverse (CC licensed, no rate limits)
Fallback: Unsplash (rate limited to 50/hour)
Updates attributions.json and sets heroImage in each article JSON.
"""

import json
import sys
import time
import hashlib
import requests
from datetime import datetime
from pathlib import Path

OPENVERSE_API = "https://api.openverse.org/v1/images/"
UNSPLASH_API = "https://api.unsplash.com/search/photos"
UNSPLASH_KEY = "BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4"

BASE_DIR = Path(__file__).parent.parent
JOURNAL_DIR = BASE_DIR / "data" / "journal"
IMAGES_DIR = BASE_DIR / "public" / "images"
JOURNAL_IMAGES_DIR = IMAGES_DIR / "journal"
ATTRIBUTIONS_FILE = IMAGES_DIR / "attributions.json"

OPENVERSE_TOKEN = "KMbv8u0vm2YIhLoOMvJ9fJpsEXpzJu"
OPENVERSE_HEADERS = {
    "User-Agent": "AdventureWales/1.0 (adventure@wales.com)",
    "Authorization": f"Bearer {OPENVERSE_TOKEN}",
}
BLOCKED_DOMAINS = ["wikimedia.org", "wikipedia.org", "upload.wikimedia", "staticflickr.com"]

LICENSE_URLS = {
    "cc0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "by": "https://creativecommons.org/licenses/by/4.0/",
    "by-sa": "https://creativecommons.org/licenses/by-sa/4.0/",
}

# Map article slugs to targeted search queries
SLUG_SEARCH_MAP = {
    "48-hours-snowdonia": "snowdonia mountain landscape wales",
    "abseiling-wales-guide": "abseiling cliff rappelling outdoor",
    "accessible-adventures-wheelchair-wales": "wheelchair nature accessible path",
    "adventure-britain-profile": "outdoor adventure group mountains",
    "adventure-photography-gear": "camera hiking photography mountains",
    "adventure-wales-platform-launch": "wales adventure mountain scenic",
    "anglesey-underrated-adventure-island": "anglesey wales coast lighthouse",
    "antur-stiniog-mtb-profile": "mountain bike downhill trail forest",
    "autumn-colours-adventure-combos": "autumn forest golden leaves hiking",
    "bank-holiday-weekend-ideas": "outdoor adventure group hiking weekend",
    "best-adventures-near-cardiff": "cardiff wales outdoor adventure",
    "best-adventures-near-manchester": "north wales mountain peaks scenic",
    "best-beginner-surf-beaches-wales": "surfing beginner beach waves",
    "best-hiking-boots-welsh-terrain": "hiking boots trail muddy walking",
    "best-viewpoints-snowdonia": "snowdonia viewpoint mountain panorama",
    "best-waterfalls-wales": "waterfall forest river moss",
    "best-waterproof-jackets-welsh-weather": "rain jacket hiking waterproof outdoor",
    "bodyboarding-wales-beaches": "bodyboarding wave beach ocean surf",
    "brecon-beacons-non-hikers": "brecon beacons hills green landscape",
    "budget-adventure-gear": "outdoor gear backpack equipment adventure",
    "budget-wales-50-per-day": "backpacker hiking camping budget",
    "camping-in-rain-gear": "camping rain tent outdoor wet",
    "canoeing-wye-valley-guide": "canoeing river valley autumn",
    "canyoning-snowdonia": "canyoning waterfall gorge adventure",
    "carmarthenshire-quiet-adventures": "countryside rolling hills green welsh",
    "castles-adventure-combos": "castle wales medieval dramatic",
    "celtic-quest-coasteering-profile": "coasteering cliff jumping ocean",
    "choosing-adventure-operator-wales": "adventure instructor guide outdoor",
    "christmas-new-year-wales": "winter wales frost snowy mountain",
    "coasteering-january": "coasteering winter cold cliff sea",
    "coasteering-with-kids": "family coasteering children beach",
    "couples-brecon-beacons-weekend": "couple hiking romantic mountain",
    "dark-skies-season": "night sky stars milky way mountains",
    "dog-friendly-adventures-wales": "dog hiking mountain trail outdoor",
    "dog-walking-snowdonia-report": "dog walking mountain snowdonia",
    "family-pembrokeshire-report": "family beach pembrokeshire coast",
    "festival-season-adventure-add-ons": "outdoor music festival camping summer",
    "first-aid-kit-adventure-wales": "first aid kit outdoor safety",
    "fishing-welsh-rivers-lakes": "fly fishing river stream nature",
    "gorge-walking-vs-canyoning": "gorge walking waterfall canyon river",
    "gower-peninsula-adventure-guide": "gower peninsula beach cliff coast",
    "group-safety-mixed-ability": "group hiking teamwork outdoor safety",
    "hidden-beaches-wales": "hidden beach secluded cove coast",
    "horse-riding-pony-trekking-wales": "horse riding trail countryside mountains",
    "kids-adventure-gear-guide": "children outdoor adventure gear family",
    "kitesurfing-wales": "kitesurfing beach wind waves sport",
    "llyn-peninsula-hidden-gem": "peninsula coast wales beach",
    "mid-wales-empty-quarter": "mid wales wilderness reservoir remote",
    "mountain-biking-trail-centres-ranked": "mountain biking trail forest downhill",
    "mountain-rescue-how-it-works": "mountain rescue helicopter safety",
    "mountain-walking-welsh-3-peaks": "mountain walking ridge summit wales",
    "mtb-hire-vs-bring-your-own": "mountain bike rental cycling trail",
    "mtb-trail-centre-tour": "mountain bike trail centre forest",
    "navigation-skills-welsh-mountains": "compass map navigation hiking mountain",
    "new-trails-wales-2026": "trail path hiking mountains new",
    "night-hiking-wales": "night hiking headlamp mountain dark",
    "north-wales-coast-more-than-caravans": "north wales coast seaside scenic",
    "open-water-swimming-events-wales": "open water swimming lake event",
    "packing-list-adventure-weekend-wales": "backpack packing adventure travel gear",
    "paragliding-hang-gliding-wales": "paragliding mountain flying aerial",
    "pembrokeshire-beyond-beaches": "pembrokeshire coast cliffs dramatic",
    "pembrokeshire-coast-path-sections": "coastal path hiking cliffs",
    "plas-y-brenin-national-centre": "outdoor mountain centre training sport",
    "preseli-venture-profile": "pembrokeshire outdoor adventure coast",
    "public-transport-adventures-wales": "train scenic countryside travel wales",
    "rainy-week-snowdonia": "rain mountains moody clouds dramatic",
    "river-safety-water-levels": "river rapids water flowing safety",
    "rock-climbing-beginners-wales": "rock climbing beginner outdoor cliff",
    "sailing-around-anglesey": "sailing yacht coast sea boat",
    "school-holiday-adventure-planner": "family adventure children holiday outdoor",
    "sea-kayaking-vs-river-kayaking": "kayaking sea coast paddle scenic",
    "sea-swimming-safety-wales": "sea swimming ocean coast safety",
    "self-guided-vs-guided-adventures": "hiking group guided adventure trail",
    "shoulder-season-deals": "quiet hiking autumn trail",
    "small-operators-emerging-wales": "outdoor adventure guide local",
    "snowdonia-adventure-weekend-report": "snowdonia adventure mountain group outdoor",
    "snowdon-which-path": "snowdon summit path hiking mountain",
    "solo-adventure-safety-checklist": "solo hiking mountain solitude trail",
    "solo-female-north-wales": "woman hiking mountain solo nature",
    "storm-season-adventures": "storm coast waves dramatic weather",
    "sup-paddleboarding-wales": "paddleboard lake calm water SUP",
    "tick-awareness-welsh-outdoors": "countryside grass hiking hillside nature",
    "trail-running-wales": "trail running mountain fell runner",
    "tyf-adventure-profile": "coasteering pembrokeshire adventure sea",
    "underground-adventures-wales": "cave underground mine exploration dark",
    "van-life-gear-touring-wales": "campervan coast road trip scenic",
    "vanlife-west-coast-wales": "campervan coast sunset wales road",
    "via-ferrata-wales": "via ferrata climbing iron path mountain",
    "wales-adventure-awards-2025": "outdoor sport celebration adventure",
    "weather-turns-snowdon": "mountain weather fog mist cloud summit",
    "welsh-3000s-attempt": "mountain summit ridge peaks hiking",
    "welsh-3000s-challenge": "mountain peaks challenge summit hiking",
    "wetsuit-buying-guide-welsh-waters": "wetsuit surfing neoprene water sport",
    "what-qualified-instructor-means": "instructor teaching outdoor safety guide",
    "whats-open-in-winter": "winter outdoor activity snow adventure",
    "wheelchair-accessible-adventures-wales": "accessible nature path outdoor",
    "wild-camping-wales-guide": "wild camping tent mountain wilderness",
    "wildlife-watching-wales": "puffin seabird wildlife nature coast",
    "winter-hiking-gear-welsh-mountains": "winter hiking snow mountain gear",
    "wye-valley-adventure-border": "wye valley river forest autumn scenic",
    "zip-world-empire-guide": "zip line quarry speed adventure flying",
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


def is_blocked_url(url: str) -> bool:
    return any(b in url for b in BLOCKED_DOMAINS)


def try_openverse(query: str, retry: int = 2) -> dict | None:
    """Search Openverse and try to download. Returns image data or None."""
    try:
        r = requests.get(OPENVERSE_API, params={
            "q": query,
            "license": "cc0,by,by-sa",
            "page_size": 15,
            "aspect_ratio": "wide",
        }, headers=OPENVERSE_HEADERS, timeout=10)
        if r.status_code == 403 and retry > 0:
            time.sleep(5)
            return try_openverse(query, retry - 1)
        r.raise_for_status()
        results = r.json().get("results", [])
    except Exception as e:
        print(f"    [OV error] {e}")
        return None

    # Try each result until we find one that downloads quickly
    for img in results[:10]:
        url = img.get("url", "")
        if not url or is_blocked_url(url):
            continue

        w = img.get("width", 0)
        h = img.get("height", 1)
        if w < 800 or (w / h) < 1.2:
            continue

        # Try thumbnail first (more reliable), then full URL
        thumb_url = img.get("thumbnail", "")
        urls_to_try = []
        if thumb_url and not is_blocked_url(thumb_url):
            urls_to_try.append(thumb_url)
        if not is_blocked_url(url):
            urls_to_try.append(url)

        for try_url in urls_to_try:
            try:
                dl = requests.get(try_url, timeout=6)
                dl.raise_for_status()
                content = dl.content
                if len(content) < 5000:
                    continue
                return {
                    "url": try_url,
                    "content": content,
                    "source": "openverse",
                    "creator": img.get("creator", "Unknown"),
                    "creator_url": img.get("creator_url", ""),
                    "foreign_landing_url": img.get("foreign_landing_url", url),
                    "license": img.get("license", "by"),
                    "title": img.get("title", ""),
                    "tags": [t.get("name", "") for t in img.get("tags", [])[:5]],
                    "width": w,
                    "height": h,
                }
            except Exception:
                continue

    return None


unsplash_remaining = 50  # Track rate limit


def try_unsplash(query: str) -> dict | None:
    """Search Unsplash. Returns image data or None."""
    global unsplash_remaining

    if unsplash_remaining <= 2:
        return None  # Don't bother if rate limited

    try:
        r = requests.get(UNSPLASH_API, params={
            "query": query,
            "per_page": 1,
            "orientation": "landscape",
        }, headers={
            "Authorization": f"Client-ID {UNSPLASH_KEY}",
        }, timeout=10)

        unsplash_remaining = int(r.headers.get("X-Ratelimit-Remaining", 50))

        if r.status_code == 403:
            unsplash_remaining = 0
            return None

        r.raise_for_status()
        results = r.json().get("results", [])
        if not results:
            return None

        photo = results[0]

        # Trigger download (API requirement)
        dl_url = photo.get("links", {}).get("download_location", "")
        if dl_url:
            try:
                requests.get(dl_url, headers={
                    "Authorization": f"Client-ID {UNSPLASH_KEY}",
                }, timeout=5)
            except Exception:
                pass

        raw_url = photo.get("urls", {}).get("raw", "")
        if not raw_url:
            return None

        img_url = f"{raw_url}&w=1200&h=800&fit=crop&crop=entropy&q=80"
        dl = requests.get(img_url, timeout=10)
        dl.raise_for_status()

        return {
            "url": img_url,
            "content": dl.content,
            "source": "unsplash",
            "photographer": photo.get("user", {}).get("name", "Unknown"),
            "photographer_url": photo.get("user", {}).get("links", {}).get("html", ""),
            "photo_url": photo.get("links", {}).get("html", ""),
            "width": photo.get("width", 0),
            "height": photo.get("height", 0),
        }
    except Exception as e:
        print(f"    [US error] {e}")
        return None


def build_query(article: dict) -> str:
    slug = article.get("slug", "")
    if slug in SLUG_SEARCH_MAP:
        return SLUG_SEARCH_MAP[slug]
    title = article.get("title", slug.replace("-", " "))
    return f"{title} wales outdoor"


def main():
    print("=" * 60)
    print("Adventure Wales — Journal Hero Image Fetcher")
    print(f"Sources: Openverse (primary) + Unsplash (fallback)")
    print("=" * 60)
    sys.stdout.flush()

    JOURNAL_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    articles = []
    for f in sorted(JOURNAL_DIR.glob("*.json")):
        with open(f, "r", encoding="utf-8") as fp:
            data = json.load(fp)
            data["_file"] = f
            articles.append(data)

    print(f"Found {len(articles)} journal articles")

    need_images = []
    for art in articles:
        slug = art.get("slug", "")
        existing = list(JOURNAL_IMAGES_DIR.glob(f"{slug}-hero-*.jpg"))
        if not existing:
            need_images.append(art)

    print(f"{len(need_images)} need hero images\n")
    sys.stdout.flush()

    if not need_images:
        print("All articles already have images!")
        return

    attributions = load_attributions()
    downloaded = 0
    ov_count = 0
    us_count = 0
    failed = []

    for i, art in enumerate(need_images):
        slug = art.get("slug", "")
        title = art.get("title", slug)

        print(f"[{i+1}/{len(need_images)}] {title}")
        sys.stdout.flush()

        query = build_query(art)

        # Try Unsplash first (faster, more reliable)
        result = try_unsplash(query)
        source_label = "US"

        # Fall back to Openverse
        if not result:
            result = try_openverse(query)
            source_label = "OV"

        if not result:
            print(f"    [SKIP] No results: {query}")
            failed.append(slug)
            sys.stdout.flush()
            continue

        # Save image
        url_hash = hashlib.md5(result["url"].encode()).hexdigest()[:8]
        filename = f"{slug}-hero-{url_hash}.jpg"
        output_path = JOURNAL_IMAGES_DIR / filename

        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(result["content"])

        downloaded += 1
        if source_label == "OV":
            ov_count += 1
            creator = result.get("creator", "Unknown")
            print(f"    ✓ [{source_label}] {creator} ({result.get('width', 0)}x{result.get('height', 0)})")

            rel_path = f"images/journal/{filename}"
            license_code = result.get("license", "by")
            attributions[rel_path] = {
                "creator": creator,
                "creator_url": result.get("creator_url", ""),
                "source": result.get("foreign_landing_url", ""),
                "license": license_code.upper(),
                "license_url": LICENSE_URLS.get(license_code, ""),
                "title": result.get("title", ""),
                "tags": result.get("tags", []),
                "width": result.get("width", 0),
                "height": result.get("height", 0),
                "downloaded": datetime.now().strftime("%Y-%m-%d"),
                "usage": f"journal/{slug}",
            }
        else:
            us_count += 1
            photographer = result.get("photographer", "Unknown")
            print(f"    ✓ [{source_label}] {photographer} ({result.get('width', 0)}x{result.get('height', 0)})")

            rel_path = f"images/journal/{filename}"
            attributions[rel_path] = {
                "photographer": photographer,
                "photographer_url": result.get("photographer_url", ""),
                "photo_url": result.get("photo_url", ""),
                "source": "unsplash",
                "downloaded": datetime.now().strftime("%Y-%m-%d"),
                "usage": f"journal/{slug}",
            }

        sys.stdout.flush()

        # Update article JSON
        art["heroImage"] = f"/images/journal/{filename}"
        with open(art["_file"], "w", encoding="utf-8") as fp:
            clean = {k: v for k, v in art.items() if k != "_file"}
            json.dump(clean, fp, indent=2, ensure_ascii=False)

        # Save attributions periodically
        if downloaded % 10 == 0:
            save_attributions(attributions)
            print(f"    [CHECKPOINT] {downloaded} done (OV:{ov_count} US:{us_count})")
            sys.stdout.flush()

        time.sleep(1.5)  # Respect API rate limits

    save_attributions(attributions)

    print(f"\n{'=' * 60}")
    print(f"Downloaded: {downloaded}/{len(need_images)}")
    print(f"  Openverse: {ov_count}")
    print(f"  Unsplash: {us_count}")
    if failed:
        print(f"Failed ({len(failed)}): {', '.join(failed)}")
    print(f"Attributions saved to {ATTRIBUTIONS_FILE}")
    sys.stdout.flush()


if __name__ == "__main__":
    main()
