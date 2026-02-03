#!/usr/bin/env python3
"""
Unsplash Image Fetcher for Adventure Wales

Fetches high-quality hero images from the Unsplash API.
Uses a two-step workflow: preview first, then apply approved selections.

Workflow:
    1. PREVIEW: Fetch candidates, generate HTML review page
       python scripts/fetch_unsplash_images.py --preview --entity regions
       python scripts/fetch_unsplash_images.py --preview --entity activities --limit 20

    2. REVIEW: Open reports/unsplash_preview_*.html in browser

    3. APPLY: Commit approved selections
       python scripts/fetch_unsplash_images.py --apply reports/unsplash_preview_XXXXXX.json
       python scripts/fetch_unsplash_images.py --apply reports/unsplash_preview_XXXXXX.json --reject id1,id2

Requires UNSPLASH_ACCESS_KEY in .env.local or environment.
"""

import os
import json
import time
import argparse
import colorsys
import re
import requests
from datetime import datetime
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

load_dotenv()
load_dotenv(".env.local")

# Configuration
UNSPLASH_API = "https://api.unsplash.com"
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4")

BASE_DIR = Path(__file__).parent.parent
CONTENT_DIR = BASE_DIR / "content"
DATA_DIR = BASE_DIR / "data" / "wales"
IMAGES_DIR = BASE_DIR / "public" / "images"
REPORTS_DIR = BASE_DIR / "reports"
ATTRIBUTIONS_FILE = IMAGES_DIR / "attributions.json"

# Global deduplication
_used_image_urls: set = set()


# ── Style consistency ────────────────────────────────────────────────
# Welsh adventure style: dramatic, moody, outdoor action

WARM_HUES = [(0, 60), (300, 360)]  # reds, oranges, yellows
COLD_PENALTY_HUES = [(160, 260)]   # cyan-blue (overcast)


def hex_to_hsl(hex_color: str) -> tuple:
    """Convert #RRGGBB to (hue 0-360, saturation 0-1, lightness 0-1)."""
    hex_color = hex_color.lstrip("#")
    if len(hex_color) != 6:
        return (0, 0, 0.5)
    r, g, b = (int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return (h * 360, s, l)


def style_score(photo: dict) -> float:
    """Score a photo for visual style consistency."""
    score = 0.0
    color = photo.get("color", "#808080")
    hue, sat, light = hex_to_hsl(color)

    for lo, hi in WARM_HUES:
        if lo <= hue <= hi:
            score += 15
            break

    for lo, hi in COLD_PENALTY_HUES:
        if lo <= hue <= hi:
            score -= 10
            break

    if sat >= 0.5:
        score += 10
    elif sat >= 0.3:
        score += 5
    elif sat < 0.15:
        score -= 10

    if light > 0.85:
        score -= 8
    elif light < 0.15:
        score -= 8
    elif 0.3 <= light <= 0.7:
        score += 5

    return score


# ── Location confidence ──────────────────────────────────────────────

WELSH_LOCATIONS = {
    "snowdonia", "snowdon", "eryri", "pembrokeshire", "brecon beacons",
    "gower", "anglesey", "llyn peninsula", "cardigan", "wales",
    "welsh", "cymru", "conwy", "caernarfon", "bangor", "swansea",
    "cardiff", "tenby", "st davids", "betws-y-coed", "bala",
}


def assess_location_confidence(name: str, photo: dict, query: str) -> str:
    """Assess how likely a photo depicts the named location."""
    name_lower = name.lower()
    desc = (photo.get("description") or "").lower()
    alt = (photo.get("alt_description") or "").lower()
    tags = [t.get("title", "").lower() for t in photo.get("tags", [])]
    location = photo.get("location", {})
    loc_name = (location.get("name") or "").lower()
    loc_country = (location.get("country") or "").lower()

    all_text = f"{desc} {alt} {' '.join(tags)} {loc_name}"

    # HIGH: Wales/UK explicitly mentioned
    if "wales" in all_text or "welsh" in all_text or "cymru" in all_text:
        return "high"
    if loc_country in ("united kingdom", "uk", "wales"):
        return "high"

    # HIGH: Specific location match
    name_words = [w for w in name_lower.split() if len(w) > 3]
    if name_words:
        matches = sum(1 for w in name_words if w in all_text)
        if matches >= len(name_words) * 0.5:
            return "high"

    # MEDIUM: Known Welsh location in query/text
    for known in WELSH_LOCATIONS:
        if known in name_lower or known in all_text:
            return "medium"

    # LOW: Generic fallback
    return "low"


# ── Search terms ─────────────────────────────────────────────────────

REGION_SEARCH_TERMS = {
    "snowdonia": ["snowdonia mountain", "snowdon wales", "eryri dramatic"],
    "pembrokeshire": ["pembrokeshire coast", "pembrokeshire cliffs", "st davids coast"],
    "brecon-beacons": ["brecon beacons", "bannau hills", "welsh mountains green"],
    "anglesey": ["anglesey wales", "anglesey coast lighthouse"],
    "gower": ["gower peninsula beach", "rhossili bay", "gower cliffs"],
    "llyn-peninsula": ["llyn peninsula wales", "abersoch coast", "welsh beach remote"],
    "south-wales": ["south wales valleys", "welsh valleys green"],
    "north-wales": ["north wales mountains", "conwy valley", "welsh slate"],
    "mid-wales": ["elan valley reservoir", "mid wales wilderness"],
    "carmarthenshire": ["carmarthenshire countryside", "welsh green hills"],
    "wye-valley": ["wye valley river", "tintern abbey", "wye gorge forest"],
}

ACTIVITY_SEARCH_TERMS = {
    "zip-lining": ["zip line adventure", "zipline flying", "aerial adventure"],
    "coasteering": ["coasteering cliff jumping", "cliff jumping ocean", "sea cliff adventure"],
    "mountain-biking": ["mountain biking trail", "mtb forest action", "downhill biking"],
    "hiking": ["hiking mountain summit", "trekking ridge dramatic", "hill walking"],
    "climbing": ["rock climbing outdoor", "climber cliff ropes", "sport climbing"],
    "kayaking": ["sea kayaking scenic", "kayak coast adventure", "paddling ocean"],
    "surfing": ["surfing wave action", "surfer ocean", "surf beach"],
    "wild-swimming": ["wild swimming lake", "open water swimming nature", "swimming river"],
    "caving": ["caving underground adventure", "cave exploration helmet", "potholing"],
    "gorge-walking": ["gorge walking waterfall", "canyoning river", "gorge scrambling"],
    "paddleboarding": ["stand up paddleboard", "SUP lake calm", "paddleboard scenic"],
    "rafting": ["white water rafting", "river rafting rapids", "rafting adventure"],
    "horse-riding": ["horse riding mountains", "horseback trail", "equestrian outdoor"],
    "sailing": ["sailing yacht coast", "dinghy sailing", "sailing adventure"],
    "paragliding": ["paragliding mountains", "paraglider flying scenic"],
    "kitesurfing": ["kitesurfing action", "kitesurf beach waves"],
    "windsurfing": ["windsurfing action", "windsurf waves"],
    "archery": ["archery outdoor bow", "archery adventure"],
    "high-ropes": ["high ropes course", "treetop adventure", "aerial ropes"],
    "abseiling": ["abseiling cliff", "rappelling adventure outdoor"],
}


# ── Core API ─────────────────────────────────────────────────────────


def load_attributions() -> dict:
    """Load existing attributions."""
    if ATTRIBUTIONS_FILE.exists():
        with open(ATTRIBUTIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_attributions(data: dict):
    """Save attributions."""
    ATTRIBUTIONS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(ATTRIBUTIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def search_unsplash(query: str, per_page: int = 10, orientation: str = "landscape") -> list:
    """Search Unsplash API for photos."""
    if not UNSPLASH_ACCESS_KEY:
        raise RuntimeError("UNSPLASH_ACCESS_KEY not set")

    headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
    params = {
        "query": query,
        "per_page": per_page,
        "orientation": orientation,
        "content_filter": "high",
    }

    resp = requests.get(f"{UNSPLASH_API}/search/photos", headers=headers, params=params, timeout=30)

    if resp.status_code == 403:
        remaining = resp.headers.get("X-Ratelimit-Remaining", "0")
        print(f"    [RATE LIMITED] Remaining: {remaining}")
        return []

    resp.raise_for_status()
    data = resp.json()
    remaining = resp.headers.get("X-Ratelimit-Remaining", "?")
    print(f"    [API] {len(data.get('results', []))} results (limit remaining: {remaining})")
    return data.get("results", [])


def calculate_score(photo: dict, query_terms: list) -> float:
    """Score an Unsplash photo for quality and relevance."""
    score = 0.0

    width = photo.get("width", 0)
    height = photo.get("height", 1)

    # Resolution
    if width >= 4000:
        score += 30
    elif width >= 3000:
        score += 25
    elif width >= 2000:
        score += 20
    elif width >= 1200:
        score += 10

    # Aspect ratio
    ratio = width / height if height > 0 else 0
    if ratio >= 1.6:
        score += 20
    elif ratio >= 1.4:
        score += 15

    # Likes
    likes = photo.get("likes", 0)
    if likes >= 500:
        score += 25
    elif likes >= 100:
        score += 20
    elif likes >= 50:
        score += 15
    elif likes >= 10:
        score += 10

    # Text relevance
    desc = (photo.get("description") or "").lower()
    alt = (photo.get("alt_description") or "").lower()
    tags = " ".join(t.get("title", "") for t in photo.get("tags", []))
    all_text = f"{desc} {alt} {tags}".lower()

    for term in query_terms:
        for word in term.lower().split():
            if word in all_text and len(word) > 3:
                score += 4

    # Style score
    score += style_score(photo)

    return score


def format_url(photo: dict, width: int = 1600) -> str:
    """Get optimised image URL."""
    raw_url = photo.get("urls", {}).get("raw", "")
    if raw_url:
        return f"{raw_url}&w={width}&q=80&auto=format"
    return photo.get("urls", {}).get("regular", "")


def format_attribution(photo: dict) -> dict:
    """Format Unsplash attribution."""
    user = photo.get("user", {})
    return {
        "photographer": user.get("name", "Unknown"),
        "photographer_url": user.get("links", {}).get("html", ""),
        "photo_url": photo.get("links", {}).get("html", ""),
        "downloaded": datetime.now().strftime("%Y-%m-%d"),
    }


def trigger_download(photo: dict):
    """Trigger Unsplash download endpoint (API requirement)."""
    url = photo.get("links", {}).get("download_location", "")
    if url and UNSPLASH_ACCESS_KEY:
        try:
            headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
            requests.get(url, headers=headers, timeout=10)
        except Exception:
            pass


# ── Candidate fetching ───────────────────────────────────────────────


def fetch_candidates(queries: list, name: str, max_total: int = 3) -> list:
    """Fetch candidate photos from Unsplash."""
    global _used_image_urls

    all_candidates = []
    seen_ids = set()

    for query in queries:
        try:
            results = search_unsplash(query, per_page=10)
            for photo in results:
                pid = photo.get("id", "")
                url = format_url(photo)
                if pid not in seen_ids and url not in _used_image_urls:
                    seen_ids.add(pid)
                    photo["_score"] = calculate_score(photo, queries)
                    photo["_confidence"] = assess_location_confidence(name, photo, query)
                    photo["_query_used"] = query
                    all_candidates.append(photo)

            time.sleep(1.5)  # Rate limit protection
        except Exception as e:
            print(f"    [WARN] Query failed: {query} — {e}")

    # Sort by confidence then score
    confidence_order = {"high": 0, "medium": 1, "low": 2}
    all_candidates.sort(
        key=lambda x: (confidence_order.get(x.get("_confidence", "low"), 3), -x.get("_score", 0))
    )

    return all_candidates[:max_total]


# ── Preview generation ───────────────────────────────────────────────


def build_preview_entry(name: str, entity_type: str, slug: str, candidates: list) -> dict:
    """Build a preview manifest entry."""
    images = []
    for photo in candidates:
        images.append({
            "unsplashId": photo.get("id", ""),
            "url": format_url(photo, 1920 if entity_type == "regions" else 1200),
            "url_thumb": format_url(photo, 400),
            "alt": photo.get("alt_description") or photo.get("description") or "",
            "photographer": photo.get("user", {}).get("name", "Unknown"),
            "photographer_url": photo.get("user", {}).get("links", {}).get("html", ""),
            "photo_url": photo.get("links", {}).get("html", ""),
            "download_location": photo.get("links", {}).get("download_location", ""),
            "confidence": photo.get("_confidence", "low"),
            "score": round(photo.get("_score", 0), 1),
            "query_used": photo.get("_query_used", ""),
            "likes": photo.get("likes", 0),
            "width": photo.get("width", 0),
            "height": photo.get("height", 0),
            "color": photo.get("color", "#000"),
        })

    return {
        "name": name,
        "entity_type": entity_type,
        "slug": slug,
        "images": images,
    }


def generate_preview_html(entries: list, output_path: Path):
    """Generate HTML preview for review."""
    conf_colors = {"high": "#2e7d32", "medium": "#f57f17", "low": "#c62828"}

    total_high = sum(1 for e in entries for img in e["images"] if img["confidence"] == "high")
    total_med = sum(1 for e in entries for img in e["images"] if img["confidence"] == "medium")
    total_low = sum(1 for e in entries for img in e["images"] if img["confidence"] == "low")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Unsplash Preview — Adventure Wales</title>
    <style>
        * {{ box-sizing: border-box; }}
        body {{ font-family: system-ui, sans-serif; max-width: 1400px; margin: 0 auto; padding: 20px; background: #fafafa; }}
        h1 {{ margin-bottom: 8px; }}
        .summary {{ background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 20px; display: flex; gap: 20px; }}
        .stat {{ text-align: center; }}
        .stat .num {{ font-size: 24px; font-weight: bold; }}
        .stat .label {{ font-size: 12px; color: #666; }}
        .entry {{ background: white; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #ddd; }}
        .entry h2 {{ margin: 0 0 8px; }}
        .candidates {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }}
        .card {{ border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }}
        .card img {{ width: 100%; height: 180px; object-fit: cover; }}
        .card-body {{ padding: 10px; }}
        .badge {{ padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; color: white; }}
        .badge-high {{ background: {conf_colors["high"]}; }}
        .badge-medium {{ background: {conf_colors["medium"]}; }}
        .badge-low {{ background: {conf_colors["low"]}; }}
        .meta {{ font-size: 11px; color: #666; margin-top: 4px; }}
        .id {{ font-family: monospace; font-size: 10px; color: #999; }}
    </style>
</head>
<body>
    <h1>Adventure Wales — Unsplash Preview</h1>
    <p>Generated {datetime.now().strftime("%Y-%m-%d %H:%M")}</p>

    <div class="summary">
        <div class="stat"><div class="num">{len(entries)}</div><div class="label">Items</div></div>
        <div class="stat"><div class="num" style="color:{conf_colors['high']}">{total_high}</div><div class="label">High</div></div>
        <div class="stat"><div class="num" style="color:{conf_colors['medium']}">{total_med}</div><div class="label">Medium</div></div>
        <div class="stat"><div class="num" style="color:{conf_colors['low']}">{total_low}</div><div class="label">Low</div></div>
    </div>
"""

    for entry in entries:
        html += f"""
    <div class="entry">
        <h2>{entry["name"]}</h2>
        <p>{entry["entity_type"]} / {entry["slug"]}</p>
        <div class="candidates">
"""
        for img in entry["images"]:
            conf = img["confidence"]
            html += f"""
            <div class="card">
                <a href="{img['photo_url']}" target="_blank">
                    <img src="{img['url_thumb']}" alt="{img['alt']}" loading="lazy">
                </a>
                <div class="card-body">
                    <span class="badge badge-{conf}">{conf.upper()}</span>
                    <div class="meta">Score: {img['score']} | Likes: {img['likes']} | {img['width']}x{img['height']}</div>
                    <div class="meta">By: {img['photographer']}</div>
                    <div class="id">ID: {img['unsplashId']}</div>
                </div>
            </div>
"""
        html += """
        </div>
    </div>
"""

    html += """
</body>
</html>
"""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    print(f"\n[HTML] Preview: {output_path}")


def save_manifest(entries: list, output_path: Path):
    """Save preview manifest as JSON."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"generated": datetime.now().isoformat(), "entries": entries}, f, indent=2)
    print(f"[JSON] Manifest: {output_path}")


# ── Apply mode ───────────────────────────────────────────────────────


def apply_manifest(manifest_path: str, reject_ids: set):
    """Apply a preview manifest, downloading images."""
    path = Path(manifest_path)
    if not path.exists():
        path = REPORTS_DIR / manifest_path
    if not path.exists():
        print(f"[ERROR] Manifest not found: {manifest_path}")
        return

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    entries = data.get("entries", [])
    attributions = load_attributions()

    for entry in entries:
        name = entry["name"]
        entity_type = entry["entity_type"]
        slug = entry["slug"]
        images = [img for img in entry["images"] if img["unsplashId"] not in reject_ids]

        if not images:
            print(f"[SKIP] {name} — all images rejected")
            continue

        img = images[0]  # Take best match
        print(f"[APPLY] {name}")

        # Download image
        output_dir = IMAGES_DIR / entity_type
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"{slug}-hero.jpg"

        try:
            resp = requests.get(img["url"], timeout=30)
            resp.raise_for_status()
            output_path.write_bytes(resp.content)
            print(f"    Saved: {output_path}")

            # Trigger download notification
            if img.get("download_location"):
                headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
                requests.get(img["download_location"], headers=headers, timeout=10)

            # Update attributions
            rel_path = f"images/{entity_type}/{slug}-hero.jpg"
            attributions[rel_path] = {
                "photographer": img["photographer"],
                "photographer_url": img["photographer_url"],
                "photo_url": img["photo_url"],
                "downloaded": datetime.now().strftime("%Y-%m-%d"),
            }

        except Exception as e:
            print(f"    [ERROR] {e}")

    save_attributions(attributions)
    print(f"\nDone! Attributions saved to {ATTRIBUTIONS_FILE}")


# ── Entity discovery ─────────────────────────────────────────────────


def get_regions() -> list:
    """Get list of regions from content."""
    regions = []
    regions_dir = CONTENT_DIR / "regions"
    if regions_dir.exists():
        for f in regions_dir.glob("*.md"):
            slug = f.stem
            regions.append({"slug": slug, "name": slug.replace("-", " ").title()})
    return regions


def get_activities() -> list:
    """Get unique activity types."""
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


# ── Main ─────────────────────────────────────────────────────────────


def run(
    entity: str = "regions",
    limit: int = 50,
    preview: bool = False,
    apply: Optional[str] = None,
    reject: Optional[str] = None,
):
    """Main runner."""
    print("=" * 60)
    print("Adventure Wales — Unsplash Image Fetcher")
    print("=" * 60)

    # Apply mode
    if apply:
        reject_ids = set(reject.split(",")) if reject else set()
        apply_manifest(apply, reject_ids)
        return

    # Check for existing images to skip
    existing = set()
    for f in (IMAGES_DIR / entity).glob("*-hero.jpg"):
        existing.add(f.stem.replace("-hero", ""))

    # Get entities
    if entity == "regions":
        items = get_regions()
        search_terms = REGION_SEARCH_TERMS
        width, height = 1920, 1080
    elif entity == "activities":
        items = get_activities()
        search_terms = ACTIVITY_SEARCH_TERMS
        width, height = 1200, 800
    else:
        print(f"Unknown entity type: {entity}")
        return

    # Filter out existing
    items = [i for i in items if i["slug"] not in existing][:limit]
    print(f"Found {len(items)} {entity} needing images")

    if not items:
        print("Nothing to do!")
        return

    preview_entries = []

    for i, item in enumerate(items):
        slug = item["slug"]
        name = item["name"]
        print(f"\n[{i+1}/{len(items)}] {name}")

        queries = search_terms.get(slug, [f"{name} wales", f"{name} outdoor adventure"])
        candidates = fetch_candidates(queries, name, max_total=3)

        if candidates:
            entry = build_preview_entry(name, entity, slug, candidates)
            preview_entries.append(entry)
        else:
            print("    [SKIP] No results")

    if preview_entries:
        ts = datetime.now().strftime("%Y%m%d_%H%M")
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)

        html_path = REPORTS_DIR / f"unsplash_preview_{ts}.html"
        json_path = REPORTS_DIR / f"unsplash_preview_{ts}.json"

        generate_preview_html(preview_entries, html_path)
        save_manifest(preview_entries, json_path)

        print(f"\nNext steps:")
        print(f"  1. Open {html_path} in browser to review")
        print(f"  2. Apply: python scripts/fetch_unsplash_images.py --apply {json_path.name}")
        print(f"     Or reject: --apply {json_path.name} --reject id1,id2")

    print("\nDone.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch Unsplash images for Adventure Wales")
    parser.add_argument("--entity", choices=["regions", "activities"], default="regions",
                        help="Entity type to fetch images for")
    parser.add_argument("--limit", type=int, default=50, help="Max items to process")
    parser.add_argument("--preview", action="store_true", help="Generate preview (default behavior)")
    parser.add_argument("--apply", type=str, help="Apply a preview manifest JSON")
    parser.add_argument("--reject", type=str, help="Comma-separated IDs to reject")

    args = parser.parse_args()
    run(
        entity=args.entity,
        limit=args.limit,
        preview=args.preview,
        apply=args.apply,
        reject=args.reject,
    )
