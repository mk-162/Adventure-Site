import csv
import json
import urllib.request
import urllib.parse
import os
import time
import re

# Configuration
FILES = [
    'content/spots/beaches/anglesey.csv',
    'content/spots/beaches/llyn.csv',
    'content/spots/beaches/snowdonia-coast.csv',
    'content/spots/beaches/ceredigion.csv'
]
OUTPUT_FILE = 'content/images/beaches-north.csv'
MIN_SIZE = 1024
USER_AGENT = 'BeachImageBot/1.0 (internal-tool)'
EXCLUSIONS = ' -Australia -Sydney -Melbourne -NZ -"New Zealand" -"New South Wales"'

def clean_html(raw_html):
    if not raw_html:
        return ''
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext.strip()

def get_beaches(files):
    beaches = []
    for filepath in files:
        if not os.path.exists(filepath):
            print(f"Warning: File not found {filepath}")
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                beaches.append({
                    'slug': row['slug'],
                    'name': row['name'],
                    'region': row.get('region', '')
                })
    return beaches

def search_commons(query, limit=50):
    base_url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6", # File namespace
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "format": "json"
    }

    url = base_url + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})

    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return None

def is_valid_image(url, title):
    url_lower = url.lower()
    title_lower = title.lower()

    # Valid extensions
    valid_exts = ('.jpg', '.jpeg', '.png', '.webp')
    if not url_lower.endswith(valid_exts):
        return False

    # Invalid terms (books, scans, pdfs)
    # Also check for Australia keywords in title just in case
    invalid_terms = ['pdf', 'djvu', 'page', 'scan', 'book', 'text', 'extract', 'australia', 'sydney', 'melbourne']
    if any(term in title_lower for term in invalid_terms):
        return False

    return True

def process_beaches():
    beaches = get_beaches(FILES)

    # Ensure output dir exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['slug', 'image_url', 'width', 'height', 'license', 'author', 'source_url', 'title']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for beach in beaches:
            print(f"Processing {beach['name']} ({beach['slug']})...")

            search_terms = []

            # Base names
            name = beach['name']
            primary_name = name.split('(')[0].strip() if '(' in name else name

            # Strategy 1: Full Name + Wales + Exclusions
            search_terms.append(f"{name} Wales{EXCLUSIONS}")

            # Strategy 2: Primary Name + Wales (if different)
            if primary_name != name:
                search_terms.append(f"{primary_name} Wales{EXCLUSIONS}")

            # Strategy 3: Primary Name + Cymru
            search_terms.append(f"{primary_name} Cymru{EXCLUSIONS}")

            # Strategy 4: Primary Name + "beach" + Wales
            search_terms.append(f"{primary_name} beach Wales{EXCLUSIONS}")

            # Strategy 5: Special handling for "Main Beach"
            if "Main Beach" in primary_name:
                simplified = primary_name.replace("Main Beach", "Beach")
                search_terms.append(f"{simplified} Wales{EXCLUSIONS}")

            # Special cases for tricky beaches
            if beach['slug'] == 'blue-pool-ceibwr':
                 search_terms.append(f"Ceibwr Bay{EXCLUSIONS}")
            if beach['slug'] == 'new-quay-harbour':
                 search_terms.append(f"New Quay Ceredigion{EXCLUSIONS}")
            if beach['slug'] == 'cwmtydu':
                 search_terms.append(f"Cwmtydu{EXCLUSIONS}")
            if beach['slug'] == 'machroes':
                 search_terms.append(f"Machroes{EXCLUSIONS}")
            if beach['slug'] == 'porth-ysgo':
                 search_terms.append(f"Porth Ysgo{EXCLUSIONS}")

            images_found = []
            seen_urls = set()

            for term in search_terms:
                if len(images_found) >= 10:
                    break

                print(f"  Searching: {term}")
                data = search_commons(term, limit=50)

                if not data or 'query' not in data or 'pages' not in data['query']:
                    continue

                pages = data['query']['pages']

                for page_id, page_data in pages.items():
                    if len(images_found) >= 10:
                        break

                    if 'imageinfo' not in page_data:
                        continue

                    info = page_data['imageinfo'][0]
                    width = info.get('width', 0)
                    height = info.get('height', 0)
                    url = info['url']
                    title = page_data.get('title', '').replace('File:', '')

                    if width >= MIN_SIZE or height >= MIN_SIZE:
                        if url in seen_urls:
                            continue

                        if not is_valid_image(url, title):
                            continue

                        seen_urls.add(url)

                        # Metadata
                        ext = info.get('extmetadata', {})
                        license_short = ext.get('LicenseShortName', {}).get('value', 'Unknown')
                        artist_html = ext.get('Artist', {}).get('value', 'Unknown')
                        artist = clean_html(artist_html)

                        description_url = info.get('descriptionurl', '')

                        image_entry = {
                            'slug': beach['slug'],
                            'image_url': url,
                            'width': width,
                            'height': height,
                            'license': license_short,
                            'author': artist,
                            'source_url': description_url,
                            'title': title
                        }

                        images_found.append(image_entry)
                        writer.writerow(image_entry)
                        f.flush()

            print(f"  Found {len(images_found)} images.")
            time.sleep(0.5) # Be nice to API

if __name__ == "__main__":
    process_beaches()
