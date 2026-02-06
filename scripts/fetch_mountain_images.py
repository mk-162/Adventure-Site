import csv
import urllib.request
import urllib.parse
import json
import os
import time
import re

CSV_FILES = [
    'content/spots/hiking/snowdonia.csv',
    'content/spots/hiking/brecon.csv'
]
OUTPUT_DIR = 'content/images'
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'mountains.csv')
API_URL = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = 'Bot/1.0 (jules@example.com)'

def get_trails():
    trails = []
    for filepath in CSV_FILES:
        if not os.path.exists(filepath):
            print(f"Warning: File not found: {filepath}")
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                trails.append({
                    'slug': row['slug'],
                    'name': row['name'],
                    'region': row.get('region', '')
                })
    return trails

def search_wikimedia(query):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6", # File namespace
        "gsrlimit": "20",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|dimensions|user",
        "iiurlwidth": "1024"
    }

    url = API_URL + "?" + urllib.parse.urlencode(params)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if 'query' in data and 'pages' in data['query']:
                return list(data['query']['pages'].values())
    except Exception as e:
        print(f"Error searching for {query}: {e}")
    return []

def strip_html(text):
    if not text:
        return ""
    # Remove HTML tags
    clean = re.sub('<[^<]+?>', '', text)
    # Decode HTML entities (basic ones)
    clean = clean.replace('&amp;', '&').replace('&quot;', '"').replace('&lt;', '<').replace('&gt;', '>')
    return clean.strip()

def process_trails():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    trails = get_trails()
    results = []

    print(f"Found {len(trails)} trails to process.")

    for i, trail in enumerate(trails):
        print(f"[{i+1}/{len(trails)}] Processing {trail['name']} ({trail['slug']})...")
        images = []
        seen_urls = set()

        # Determine region name for search context
        region_slug = trail.get('region', '')
        if region_slug == 'brecon-beacons':
            region_name = 'Brecon Beacons'
        elif region_slug == 'Snowdonia':
            region_name = 'Snowdonia'
        else:
            region_name = 'Wales'

        # Strategies for search queries
        queries = []

        # 1. Full name with region (Most specific)
        queries.append(f"{trail['name']} {region_name}")

        # 2. Full name with Wales
        if region_name != 'Wales':
            queries.append(f"{trail['name']} Wales")

        # 3. Handle "via" or special constructs
        if ' via ' in trail['name']:
            parts = trail['name'].split(' via ')
            main_feature = parts[0]
            route_name = parts[1]

            # e.g. "Pen y Fan" "Storey Arms"
            queries.append(f"{route_name} {main_feature}") # "Storey Arms Pen y Fan"
            queries.append(f"{route_name} {region_name}") # "Storey Arms Brecon Beacons"
            # We don't just add main_feature yet, wait for clean name logic

        # 4. Clean name (strip "Walk", "Circular" etc) + Region
        clean_name = trail['name']
        for suffix in [" Walk", " Circular", " Trail", " Path", " Route"]:
             if suffix in clean_name:
                 clean_name = clean_name.replace(suffix, "")

        if clean_name != trail['name']:
             queries.append(f"{clean_name} {region_name}")
             if region_name != 'Wales':
                queries.append(f"{clean_name} Wales")

        # 5. Last resort: Main feature + Region if not already covered
        if ' via ' in trail['name']:
             parts = trail['name'].split(' via ')
             main_feature = parts[0]
             queries.append(f"{main_feature} {region_name}")
             if region_name != 'Wales':
                queries.append(f"{main_feature} Wales")

        # Deduplicate queries
        queries = list(dict.fromkeys([q for q in queries if q]))

        found_count = 0

        for q in queries:
            if found_count >= 10:
                break

            print(f"  Searching: {q}")
            items = search_wikimedia(q)

            for item in items:
                if found_count >= 10:
                    break

                if 'imageinfo' not in item:
                    continue

                info = item['imageinfo'][0]
                url = info.get('url')

                if not url or url in seen_urls:
                    continue

                # Filter out non-image files
                if url.lower().endswith(('.pdf', '.djvu', '.webm', '.ogv', '.ogg', '.tif', '.tiff')):
                    continue

                width = info.get('width', 0)
                height = info.get('height', 0)

                if width < 1024 and height < 1024:
                    continue

                # Extract metadata
                ext = info.get('extmetadata', {})
                license_name = strip_html(ext.get('LicenseShortName', {}).get('value', 'Unknown'))

                artist = strip_html(ext.get('Artist', {}).get('value', 'Unknown'))

                desc = strip_html(ext.get('ImageDescription', {}).get('value', ''))
                # Limit description length
                if len(desc) > 300:
                    desc = desc[:297] + "..."

                attribution = strip_html(ext.get('Attribution', {}).get('value', ''))
                if not attribution:
                     attribution = f"{artist} ({license_name}) via Wikimedia Commons"

                # Ensure attribution has source
                if "Wikimedia Commons" not in attribution:
                    attribution += " via Wikimedia Commons"

                images.append({
                    'spot_slug': trail['slug'],
                    'image_url': url,
                    'source': 'Wikimedia Commons',
                    'license': license_name,
                    'author': artist,
                    'attribution_text': attribution,
                    'width': width,
                    'height': height,
                    'description': desc
                })

                seen_urls.add(url)
                found_count += 1

            time.sleep(0.5) # Rate limit

        results.extend(images)

    # Write to CSV
    fieldnames = ['spot_slug', 'image_url', 'source', 'license', 'author', 'attribution_text', 'width', 'height', 'description']

    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print(f"Done. Wrote {len(results)} images to {OUTPUT_FILE}")

if __name__ == "__main__":
    process_trails()
