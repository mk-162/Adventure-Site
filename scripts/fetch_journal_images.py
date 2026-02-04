#!/usr/bin/env python3
"""
Fetch hero images for all journal articles from Openverse.
Reads each article's metadata to build targeted search queries.
Updates attributions.json and sets heroImage in each article JSON.
"""

import json
import time
import hashlib
import requests
from datetime import datetime
from pathlib import Path

OPENVERSE_API = "https://api.openverse.org/v1/images/"
ALLOWED_LICENSES = ["cc0", "by", "by-sa"]

BASE_DIR = Path(__file__).parent.parent
JOURNAL_DIR = BASE_DIR / "data" / "journal"
IMAGES_DIR = BASE_DIR / "public" / "images"
JOURNAL_IMAGES_DIR = IMAGES_DIR / "journal"
ATTRIBUTIONS_FILE = IMAGES_DIR / "attributions.json"

LICENSE_URLS = {
    "cc0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "by": "https://creativecommons.org/licenses/by/4.0/",
    "by-sa": "https://creativecommons.org/licenses/by-sa/4.0/",
}

# Map activity/tag slugs to good search terms
TOPIC_SEARCH_MAP = {
    "coasteering": "coasteering cliff jumping sea",
    "mountain-biking": "mountain biking trail forest",
    "hiking": "hiking mountain trail wales",
    "climbing": "rock climbing outdoor cliff",
    "kayaking": "kayaking sea coast paddle",
    "surfing": "surfing wave beach ocean",
    "wild-swimming": "wild swimming lake outdoor",
    "caving": "caving underground cave helmet",
    "gorge-walking": "gorge walking waterfall canyon",
    "sup": "paddleboard lake calm water",
    "trail-running": "trail running mountain fell",
    "sailing": "sailing yacht coast",
    "zip-lining": "zip line adventure speed",
    "mountain-walking": "mountain walking ridge summit",
    "canoeing": "canoeing river valley",
}

REGION_SEARCH_MAP = {
    "snowdonia": "snowdonia mountain wales",
    "pembrokeshire": "pembrokeshire coast wales",
    "brecon-beacons": "brecon beacons wales hills",
    "anglesey": "anglesey wales coast island",
    "gower": "gower peninsula beach wales",
    "llyn-peninsula": "llyn peninsula wales coast",
    "south-wales": "south wales valleys green",
    "south-wales-valleys": "south wales valleys cardiff",
    "north-wales": "north wales mountains coast",
    "north-wales-coast": "north wales coast seaside",
    "mid-wales": "mid wales countryside reservoir",
    "carmarthenshire": "carmarthenshire wales countryside",
    "wye-valley": "wye valley river forest autumn",
}

# Specific overrides for tricky articles
SLUG_SEARCH_OVERRIDES = {
    "adventure-photography-gear": ["camera hiking outdoor", "adventure photography mountains"],
    "best-hiking-boots-welsh-terrain": ["hiking boots trail muddy", "walking boots mountains"],
    "best-waterproof-jackets-welsh-weather": ["waterproof jacket rain hiking", "wet weather gear outdoor"],
    "budget-adventure-gear": ["outdoor gear equipment", "adventure equipment backpack"],
    "camping-in-rain-gear": ["camping rain tent", "rainy camping outdoor"],
    "first-aid-kit-adventure-wales": ["first aid outdoor hiking", "safety kit adventure"],
    "kids-adventure-gear-guide": ["children adventure outdoor", "family outdoor activity"],
    "packing-list-adventure-weekend-wales": ["backpack packing gear", "adventure travel preparation"],
    "van-life-gear-touring-wales": ["campervan wales coast", "van life countryside"],
    "wetsuit-buying-guide-welsh-waters": ["wetsuit surfing swimming", "neoprene water sports"],
    "winter-hiking-gear-welsh-mountains": ["winter hiking snow mountains", "cold weather walking"],
    "best-waterfalls-wales": ["waterfall wales forest", "welsh waterfall river"],
    "castles-adventure-combos": ["castle wales medieval", "welsh castle adventure"],
    "hidden-beaches-wales": ["hidden beach wales coast", "secluded cove wales"],
    "dog-friendly-adventures-wales": ["dog walking mountain", "hiking with dog outdoors"],
    "fishing-welsh-rivers-lakes": ["fishing river wales", "fly fishing stream"],
    "horse-riding-pony-trekking-wales": ["horse riding trail countryside", "pony trekking mountains"],
    "paragliding-hang-gliding-wales": ["paragliding mountain flying", "hang gliding sky"],
    "kitesurfing-wales": ["kitesurfing beach wind", "kitesurf wave"],
    "bodyboarding-wales-beaches": ["bodyboarding wave beach", "body board surf"],
    "abseiling-wales-guide": ["abseiling cliff rappelling", "rope descent outdoor"],
    "self-guided-vs-guided-adventures": ["group adventure hiking", "guided tour outdoor wales"],
    "public-transport-adventures-wales": ["train wales countryside", "bus travel scenic"],
    "wheelchair-accessible-adventures-wales": ["wheelchair outdoor nature", "accessible countryside path"],
    "wild-camping-wales-guide": ["wild camping tent mountain", "camping wilderness night"],
    "wildlife-watching-wales": ["puffin seabird wales", "wildlife nature coast"],
    "adventure-wales-platform-launch": ["wales adventure outdoor mountain", "welsh countryside scenic"],
    "new-trails-wales-2026": ["trail path mountains wales", "new hiking trail"],
    "wales-adventure-awards-2025": ["adventure awards ceremony", "outdoor sport celebration"],
    "group-safety-mixed-ability": ["group hiking safety", "team outdoor adventure"],
    "mountain-rescue-how-it-works": ["mountain rescue helicopter", "rescue team mountains"],
    "navigation-skills-welsh-mountains": ["compass map navigation hiking", "mountain navigation orienteering"],
    "river-safety-water-levels": ["river rapids water safety", "fast flowing river"],
    "sea-swimming-safety-wales": ["sea swimming safety coast", "open water swimmer"],
    "solo-adventure-safety-checklist": ["solo hiking mountain", "lone walker trail"],
    "tick-awareness-welsh-outdoors": ["countryside grass nature", "outdoor hiking hillside"],
    "weather-turns-snowdon": ["mountain weather cloud fog", "snowdon summit mist"],
    "autumn-colours-adventure-combos": ["autumn forest wales golden", "fall colours countryside"],
    "bank-holiday-weekend-ideas": ["bank holiday outdoor adventure", "weekend hiking group"],
    "christmas-new-year-wales": ["winter wales snowy mountain", "christmas countryside frost"],
    "dark-skies-season": ["night sky stars milky way", "stargazing dark skies"],
    "festival-season-adventure-add-ons": ["outdoor festival music camping", "summer festival wales"],
    "school-holiday-adventure-planner": ["family adventure children outdoor", "kids holiday activity"],
    "shoulder-season-deals": ["quiet hiking autumn trail", "empty beach low season"],
    "storm-season-adventures": ["storm coast waves dramatic", "wild weather sea cliffs"],
    "whats-open-in-winter": ["winter outdoor activity snow", "cold weather adventure"],
    "adventure-britain-profile": ["adventure centre snowdonia", "outdoor activity centre"],
    "antur-stiniog-mtb-profile": ["mountain bike downhill trail", "mtb forest bike park"],
    "celtic-quest-coasteering-profile": ["coasteering adventure group", "cliff jumping sea adventure"],
    "choosing-adventure-operator-wales": ["adventure guide instructor", "outdoor activity provider"],
    "plas-y-brenin-national-centre": ["outdoor training centre mountain", "mountain sport centre wales"],
    "preseli-venture-profile": ["pembrokeshire outdoor adventure", "adventure activity coast"],
    "small-operators-emerging-wales": ["small business outdoor wales", "local adventure guide"],
    "tyf-adventure-profile": ["coasteering pembrokeshire group", "sea adventure wales"],
    "what-qualified-instructor-means": ["instructor teaching outdoor", "qualified guide adventure"],
    "zip-world-empire-guide": ["zip line quarry speed", "zip world adventure"],
    "accessible-adventures-wheelchair-wales": ["wheelchair nature accessible", "accessible outdoor path"],
    "budget-wales-50-per-day": ["backpacker hiking budget", "cheap camping wales"],
    "coasteering-january": ["winter coasteering cold sea", "cliff jumping winter"],
    "couples-brecon-beacons-weekend": ["couple hiking romantic", "brecon beacons walking pair"],
    "dog-walking-snowdonia-report": ["dog walking mountain snowdonia", "hiking dog mountain"],
    "family-pembrokeshire-report": ["family beach pembrokeshire", "children coast adventure"],
    "mtb-trail-centre-tour": ["mountain bike trail centre", "mtb bike park wales"],
    "rainy-week-snowdonia": ["rain mountains snowdonia moody", "wet weather wales mountains"],
    "snowdonia-adventure-weekend-report": ["snowdonia adventure mountain group", "outdoor weekend wales"],
    "solo-female-north-wales": ["solo female hiker mountain", "woman hiking alone"],
    "vanlife-west-coast-wales": ["campervan coast wales sunset", "van life welsh coast"],
    "welsh-3000s-attempt": ["mountain summit ridge wales", "welsh three thousand peaks"],
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


def search_openverse(query: str, page_size: int = 10) -> list:
    params = {
        "q": query,
        "license": ",".join(ALLOWED_LICENSES),
        "page_size": page_size,
        "aspect_ratio": "wide",
    }
    try:
        response = requests.get(OPENVERSE_API, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])
    except Exception as e:
        print(f"    [ERROR] {e}")
        return []


def is_blocked_url(url: str) -> bool:
    blocked = ["wikimedia.org", "wikipedia.org", "upload.wikimedia"]
    return any(b in url for b in blocked)


def score_image(img: dict) -> float:
    score = 0.0
    w = img.get("width", 0)
    h = img.get("height", 1)
    aspect = w / h if h > 0 else 0

    if aspect >= 1.5:
        score += 30
    elif aspect >= 1.3:
        score += 15
    elif aspect < 1.0:
        score -= 30

    if w >= 2000:
        score += 25
    elif w >= 1500:
        score += 20
    elif w >= 1024:
        score += 10
    elif w < 800:
        score -= 20

    return score


def build_queries(article: dict) -> list:
    slug = article.get("slug", "")

    # Check overrides first
    if slug in SLUG_SEARCH_OVERRIDES:
        return SLUG_SEARCH_OVERRIDES[slug]

    queries = []

    # Activity-based query
    activity = article.get("activityTypeSlug")
    if activity and activity in TOPIC_SEARCH_MAP:
        queries.append(TOPIC_SEARCH_MAP[activity])

    # Region-based query
    region = article.get("regionSlug")
    if region and region in REGION_SEARCH_MAP:
        queries.append(REGION_SEARCH_MAP[region])

    # Tag-based queries
    tags = article.get("tags", [])
    for tag in tags[:2]:
        if tag in TOPIC_SEARCH_MAP:
            q = TOPIC_SEARCH_MAP[tag]
            if q not in queries:
                queries.append(q)

    # Title-based fallback
    title = article.get("title", "")
    # Clean title for search
    title_clean = title.replace(":", "").replace("—", "").replace("–", "")
    title_clean = title_clean.replace("?", "").replace("!", "").strip()
    if title_clean:
        queries.append(f"{title_clean} wales")

    if not queries:
        queries.append(f"{slug.replace('-', ' ')} wales outdoor")

    return queries


def fetch_image(queries: list, used_urls: set) -> dict | None:
    candidates = []
    seen = set()

    for query in queries[:3]:  # Max 3 queries per article
        results = search_openverse(query)
        for img in results:
            url = img.get("url", "")
            if not url or url in seen or url in used_urls:
                continue
            if is_blocked_url(url):
                continue
            seen.add(url)
            img["_score"] = score_image(img)
            if img["_score"] > 0:
                candidates.append(img)
        time.sleep(0.3)

    if not candidates:
        return None

    candidates.sort(key=lambda x: -x["_score"])
    return candidates[0]


def download_image(url: str, path: Path) -> bool:
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(r.content)
        return True
    except Exception as e:
        print(f"    [DOWNLOAD ERROR] {e}")
        return False


def main():
    print("=" * 60)
    print("Adventure Wales — Journal Hero Image Fetcher")
    print("=" * 60)

    JOURNAL_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    # Load all articles
    articles = []
    for f in sorted(JOURNAL_DIR.glob("*.json")):
        with open(f, "r", encoding="utf-8") as fp:
            data = json.load(fp)
            data["_file"] = f
            articles.append(data)

    print(f"Found {len(articles)} journal articles")

    # Check which already have images
    need_images = []
    for art in articles:
        slug = art.get("slug", "")
        img_path = JOURNAL_IMAGES_DIR / f"{slug}-hero.jpg"
        if not img_path.exists():
            need_images.append(art)

    print(f"{len(need_images)} need hero images\n")

    if not need_images:
        print("All articles already have images!")
        return

    attributions = load_attributions()
    used_urls = {v.get("source", "") for v in attributions.values()}
    downloaded = 0
    failed = []

    for i, art in enumerate(need_images):
        slug = art.get("slug", "")
        title = art.get("title", slug)
        category = art.get("category", "")

        print(f"[{i+1}/{len(need_images)}] {title} ({category})")

        queries = build_queries(art)
        print(f"    Queries: {queries[:2]}")

        img = fetch_image(queries, used_urls)

        if not img:
            print("    [SKIP] No suitable images found")
            failed.append(slug)
            continue

        url = img.get("url", "")
        short_hash = hashlib.md5(url.encode()).hexdigest()[:8]
        filename = f"{slug}-hero-{short_hash}.jpg"
        output_path = JOURNAL_IMAGES_DIR / filename

        if download_image(url, output_path):
            downloaded += 1
            creator = img.get("creator", "Unknown")
            w = img.get("width", 0)
            h = img.get("height", 0)
            print(f"    ✓ {creator} ({w}x{h})")

            # Track attribution
            rel_path = f"images/journal/{filename}"
            license_code = img.get("license", "by")
            attributions[rel_path] = {
                "creator": img.get("creator", "Unknown"),
                "creator_url": img.get("creator_url", ""),
                "source": img.get("foreign_landing_url", url),
                "license": license_code.upper(),
                "license_url": LICENSE_URLS.get(license_code, ""),
                "title": img.get("title", ""),
                "tags": [t.get("name", "") for t in img.get("tags", [])[:5]],
                "width": w,
                "height": h,
                "downloaded": datetime.now().strftime("%Y-%m-%d"),
                "usage": f"journal/{slug}",
            }
            used_urls.add(url)

            # Update article JSON with heroImage path
            art["heroImage"] = f"/images/journal/{filename}"
            with open(art["_file"], "w", encoding="utf-8") as fp:
                clean = {k: v for k, v in art.items() if k != "_file"}
                json.dump(clean, fp, indent=2, ensure_ascii=False)

            # Save attributions periodically
            if downloaded % 10 == 0:
                save_attributions(attributions)
                print(f"    [SAVE] Attributions checkpoint ({downloaded} done)")
        else:
            failed.append(slug)

    save_attributions(attributions)

    print(f"\n{'=' * 60}")
    print(f"Downloaded: {downloaded}/{len(need_images)}")
    if failed:
        print(f"Failed ({len(failed)}): {', '.join(failed)}")
    print(f"Attributions saved to {ATTRIBUTIONS_FILE}")


if __name__ == "__main__":
    main()
