import csv
import json
import urllib.request
import urllib.parse
import re
import time
import sys
import os

def clean_html(raw_html):
    if not raw_html:
        return ""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext.strip()

def search_images(query, limit=20):
    base_url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "generator": "search",
        "gsrnamespace": "6",
        "gsrsearch": query,
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "format": "json"
    }
    url = base_url + "?" + urllib.parse.urlencode(params)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Bot/1.0 (internal research tool)'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data.get("query", {}).get("pages", {})
    except Exception as e:
        sys.stderr.write(f"Error searching for {query}: {e}\n")
        return {}

def clean_beach_name(name):
    # Remove text in parentheses
    name = re.sub(r'\s*\(.*?\)', '', name)
    return name.strip()

def process_beach(slug, name, region):
    images = []
    cleaned_name = clean_beach_name(name)

    # Strategy: First try quoted (strict), then unquoted (loose)
    base_queries = []
    base_queries.append((name, region))
    if cleaned_name != name:
        base_queries.append((cleaned_name, region))

    # Add 'Beach' if not present
    if "beach" not in cleaned_name.lower() and "bay" not in cleaned_name.lower() and "sands" not in cleaned_name.lower():
        base_queries.append((f"{cleaned_name} Beach", region))

    # Aliases
    aliases = {
        "blue-pool-bay": [("Blue Pool", "Broughton"), ("Blue Pool", "Gower")],
        "hunts-bay": [("Deep Slade", "Gower"), ("Deep Slade", "")],
        "broad-haven-north": [("Broad Haven", "Pembrokeshire")],
        "tenby-north": [("North Beach", "Tenby")],
        "tenby-south": [("South Beach", "Tenby")],
        "tor-bay": [("Tor Bay", "Gower")] # Enforce Gower for Tor Bay
    }

    if slug in aliases:
        base_queries.extend(aliases[slug])

    # Construct actual query strings
    queries = []
    for n, r in base_queries:
        if r:
            queries.append(f'"{n}" {r}')
        else:
            queries.append(f'"{n}"')

    # Fallback unquoted
    for n, r in base_queries:
        if r:
            queries.append(f"{n} {r}")
        else:
            queries.append(f"{n}")

    # Fallback with Wales quoted
    for n, r in base_queries:
        queries.append(f'"{n}" Wales')

    found_images = {} # Deduplicate by URL or pageid

    # Validation keywords
    validation_keywords = {'wales', 'cymru'}
    if region.lower() == 'pembrokeshire':
        validation_keywords.add('pembs')
        validation_keywords.add('pembrokeshire')
    if region.lower() == 'gower':
        validation_keywords.add('swansea')
        validation_keywords.add('gower')

    # Specific keywords required for ambiguous places
    required_keywords = {}
    if slug == "tenby-north":
        required_keywords = {'tenby'}
    if slug == "tor-bay":
        required_keywords = {'gower'} # Must mention Gower to avoid Devon

    blacklisted_authors = ["Internet Archive Book Images"]
    blacklisted_terms = [
        "Maine", "Sydney", "Australia", "New York", "Massachusetts", "Ohio", "Galapagos", "Rhodes",
        "New South Wales", "NSW", "Devon", "Harlech", "Kinmel", "North Wales"
    ]

    # Visual keywords to ensure it's a beach image (simple heuristic)
    visual_keywords = {'beach', 'bay', 'sand', 'coast', 'sea', 'ocean', 'cliff', 'view', 'scenic', 'water', 'wave', 'dune', 'shore'}

    for q in queries:
        if len(found_images) >= 10:
            break

        sys.stderr.write(f"Searching for {q}...\n")
        results = search_images(q, limit=20)

        for page_id, page_data in results.items():
            if len(found_images) >= 10:
                break

            if "imageinfo" not in page_data:
                continue

            info = page_data["imageinfo"][0]
            width = info.get("width", 0)
            height = info.get("height", 0)

            if width < 1024:
                continue

            url = info.get("url")
            if url in found_images:
                continue

            extmetadata = info.get("extmetadata", {})
            if not url.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                continue

            license_short = extmetadata.get("LicenseShortName", {}).get("value", "Unknown")
            artist_html = extmetadata.get("Artist", {}).get("value", "")
            author = clean_html(artist_html)

            if author in blacklisted_authors:
                continue

            attribution_html = extmetadata.get("Attribution", {}).get("value", "")
            attribution_text = clean_html(attribution_html)
            if not attribution_text:
                attribution_text = f"{name} by {author} ({license_short})"

            description_html = extmetadata.get("ImageDescription", {}).get("value", "")
            description = clean_html(description_html)
            title = page_data.get("title", "")
            categories_str = extmetadata.get("Categories", {}).get("value", "")

            text_to_check = (description + " " + categories_str + " " + title).lower()

            # Blacklist check
            if any(term.lower() in text_to_check for term in blacklisted_terms):
                continue

            # General Location Validation
            if not any(kw in text_to_check for kw in validation_keywords):
                continue

            # Specific Requirement Check
            if required_keywords and not any(kw in text_to_check for kw in required_keywords):
                continue

            # Visual Relevance Check (skip if it seems to be a map or document or random object)
            # Charts often have "Chart" in title/desc
            if "chart" in text_to_check or "map" in text_to_check or "plan" in text_to_check:
                continue

            # Ensure at least one visual keyword is present (unless name itself has it, which it usually does)
            # But "Tenby North Beach" name has "Beach". "Amroth" does not.
            # If name has no visual keyword, enforce one from list.
            if "beach" not in name.lower() and "bay" not in name.lower() and "sands" not in name.lower():
                 if not any(vk in text_to_check for vk in visual_keywords):
                     continue

            source = "Wikimedia Commons"

            image_entry = {
                "spot_slug": slug,
                "image_url": url,
                "source": source,
                "license": license_short,
                "author": author,
                "attribution_text": attribution_text,
                "width": width,
                "height": height,
                "description": description
            }

            found_images[url] = image_entry

        time.sleep(0.2)

    return list(found_images.values())

def main():
    input_files = [
        "content/spots/beaches/pembrokeshire.csv",
        "content/spots/beaches/gower.csv"
    ]
    output_file = "content/images/beaches-south.csv"

    all_images = []

    for file_path in input_files:
        if not os.path.exists(file_path):
            sys.stderr.write(f"File not found: {file_path}\n")
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                slug = row.get("slug")
                name = row.get("name")
                region = row.get("region")

                if not slug or not name:
                    continue

                sys.stderr.write(f"Processing {name} ({slug})...\n")
                beach_images = process_beach(slug, name, region)
                all_images.extend(beach_images)
                sys.stderr.write(f"Found {len(beach_images)} images for {name}\n")

    # Write to CSV
    fieldnames = ["spot_slug", "image_url", "source", "license", "author", "attribution_text", "width", "height", "description"]

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_images)

    sys.stderr.write(f"Done. Wrote {len(all_images)} images to {output_file}\n")

if __name__ == "__main__":
    main()
