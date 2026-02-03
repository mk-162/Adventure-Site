#!/usr/bin/env python3
"""
Generate FAQ content for Adventure Wales using Gemini API with web research.

Usage:
    python scripts/generate-faqs.py --type regions
    python scripts/generate-faqs.py --type activities
    python scripts/generate-faqs.py --type all
    python scripts/generate-faqs.py --type region:snowdonia
    python scripts/generate-faqs.py --type activity:coasteering
"""

import os
import sys
import argparse
import time
import json
from pathlib import Path
from google import genai
from google.genai import types

# Configuration
REGIONS = [
    ("snowdonia", "Snowdonia", "Eryri"),
    ("pembrokeshire", "Pembrokeshire", "Sir Benfro"),
    ("brecon-beacons", "Brecon Beacons", "Bannau Brycheiniog"),
    ("anglesey", "Anglesey", "Ynys Môn"),
    ("gower", "Gower Peninsula", "Gŵyr"),
    ("llyn-peninsula", "Llŷn Peninsula", "Pen Llŷn"),
    ("south-wales", "South Wales", "South Wales Valleys"),
    ("north-wales", "North Wales", "Gogledd Cymru"),
    ("mid-wales", "Mid Wales", "Canolbarth Cymru"),
    ("carmarthenshire", "Carmarthenshire", "Sir Gaerfyrddin"),
    ("wye-valley", "Wye Valley", "Dyffryn Gwy"),
]

ACTIVITIES = [
    ("coasteering", "Coasteering", "cliff jumping, swimming, scrambling along coastline"),
    ("mountain-biking", "Mountain Biking", "MTB trails, downhill, cross-country"),
    ("hiking", "Hiking", "walking, hillwalking, scrambling, summit hikes"),
    ("climbing", "Climbing", "rock climbing, bouldering, indoor climbing"),
    ("kayaking", "Kayaking", "sea kayaking, river kayaking, paddling"),
    ("surfing", "Surfing", "wave riding, bodyboarding, surf lessons"),
    ("caving", "Caving", "potholing, cave exploration, underground adventures"),
    ("zip-lining", "Zip Lining", "zip wires, aerial adventures, Zip World"),
    ("wild-swimming", "Wild Swimming", "open water swimming, lake swimming, sea swimming"),
    ("gorge-walking", "Gorge Walking", "canyoning, gorge scrambling, waterfall climbing"),
]

# FAQ templates for regions
REGION_FAQ_TEMPLATES = [
    ("best-adventures-{slug}", "What are the best adventure activities in {name}?"),
    ("hidden-gems-{slug}", "What are the hidden gems and secret spots in {name}?"),
    ("how-long-spend-{slug}", "How many days should I spend in {name}?"),
    ("{slug}-families-kids", "Is {name} good for families with children?"),
    ("when-avoid-{slug}", "When should I avoid visiting {name}?"),
]

# FAQ templates for activities
ACTIVITY_FAQ_TEMPLATES = [
    ("fitness-required-{slug}", "How fit do I need to be for {name} in Wales?"),
    ("first-time-{slug}", "What should I expect on my first {name} experience?"),
    ("best-{slug}-spots-wales", "Where are the best {name} locations in Wales?"),
    ("{slug}-beginners-guide", "What are the best {name} tips for beginners?"),
    ("best-time-{slug}-wales", "What is the best time of year for {name} in Wales?"),
]

OUTPUT_DIR = Path("content/answers")


def create_gemini_client():
    """Initialize Gemini client with API key."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable not set")
        sys.exit(1)
    return genai.Client(api_key=api_key)


def generate_faq_content(client, question: str, context: str, slug: str, region: str = "general", activity: str = None) -> str:
    """Generate FAQ content using Gemini with web search grounding."""

    prompt = f"""You are writing FAQ content for Adventure Wales, an adventure tourism website helping people plan outdoor adventures in Wales.

TONE: Confident, practical, adventure-focused. Write like an experienced local guide who knows every trail, beach, and hidden spot. Be specific - use real place names, actual operators, genuine insider tips. Never be generic or salesy.

QUESTION TO ANSWER: {question}

CONTEXT: {context}

Write a comprehensive FAQ answer in markdown format. Follow this EXACT structure:

---
slug: {slug}
question: "{question}"
region: {region}
{f'activity: {activity}' if activity else ''}
---

# {question}

## Quick Answer

[Write 2-3 sentences that directly answer the question. This will appear in Google search results, so make it count. Be specific and actionable.]

## [Create a relevant section heading]

[Write 2-3 paragraphs with detailed, specific information. Include:
- Real operator names and locations
- Specific trails, beaches, or venues
- Actual price ranges where relevant
- Seasonal considerations]

## [Create another relevant section heading]

[More detailed content. Consider adding a comparison table if relevant:]

| Option | Best For | Difficulty | Location |
|--------|----------|------------|----------|
| [Specific option 1] | [Who it suits] | [Level] | [Where] |
| [Specific option 2] | [Who it suits] | [Level] | [Where] |

## Practical Tips

- [Specific, actionable tip that only a local would know]
- [Another insider tip with real details]
- [Practical advice about booking, parking, timing, etc.]
- [Safety or preparation tip]

## Related Questions

- [Related question that links to another FAQ]?
- [Another related question]?
- [Third related question]?

IMPORTANT RULES:
1. Be SPECIFIC - mention real places, operators, trails by name
2. Be HONEST - include challenges and limitations, not just positives
3. Be PRACTICAL - focus on actionable information
4. NO FLUFF - every sentence should add value
5. Use Welsh place names where appropriate (e.g., Eryri for Snowdonia)
6. Include price ranges in GBP (£) where relevant
7. Mention specific operators from Wales (Zip World, TYF Adventure, etc.)
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())],
                temperature=0.7,
                max_output_tokens=2000,
            )
        )
        text = response.text
        # Strip markdown code blocks if present
        if text.startswith("```markdown"):
            text = text[len("```markdown"):].strip()
        if text.startswith("```"):
            text = text[3:].strip()
        if text.endswith("```"):
            text = text[:-3].strip()
        return text
    except Exception as e:
        print(f"  ERROR generating content: {e}")
        return None


def write_faq_file(content: str, slug: str) -> bool:
    """Write FAQ content to markdown file."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filepath = OUTPUT_DIR / f"{slug}.md"

    try:
        with open(filepath, "w") as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"  ERROR writing file: {e}")
        return False


def generate_region_faqs(client, regions: list = None):
    """Generate all region FAQs."""
    if regions is None:
        regions = REGIONS

    total = len(regions) * len(REGION_FAQ_TEMPLATES)
    current = 0

    print(f"\n=== GENERATING REGION FAQs ({total} total) ===\n")

    for slug, name, welsh_name in regions:
        context = f"Region: {name} (Welsh: {welsh_name}). A major adventure destination in Wales."

        for template_slug, template_question in REGION_FAQ_TEMPLATES:
            current += 1
            faq_slug = template_slug.format(slug=slug)
            question = template_question.format(name=name, welsh_name=welsh_name)

            # Skip if file already exists
            if (OUTPUT_DIR / f"{faq_slug}.md").exists():
                print(f"[{current}/{total}] {faq_slug}.md ... SKIPPED (exists)")
                continue

            print(f"[{current}/{total}] {faq_slug}.md ... ", end="", flush=True)

            content = generate_faq_content(
                client, question, context, faq_slug, region=slug
            )

            if content:
                write_faq_file(content, faq_slug)
                word_count = len(content.split())
                print(f"done ({word_count} words)")
            else:
                print("FAILED")

            # Rate limiting
            time.sleep(2)

    print(f"\n=== REGION FAQs COMPLETE ===\n")


def generate_activity_faqs(client, activities: list = None):
    """Generate all activity FAQs."""
    if activities is None:
        activities = ACTIVITIES

    total = len(activities) * len(ACTIVITY_FAQ_TEMPLATES)
    current = 0

    print(f"\n=== GENERATING ACTIVITY FAQs ({total} total) ===\n")

    for slug, name, description in activities:
        context = f"Activity: {name}. Description: {description}. Popular adventure activity in Wales."

        for template_slug, template_question in ACTIVITY_FAQ_TEMPLATES:
            current += 1
            faq_slug = template_slug.format(slug=slug)
            question = template_question.format(name=name)

            # Skip if file already exists
            if (OUTPUT_DIR / f"{faq_slug}.md").exists():
                print(f"[{current}/{total}] {faq_slug}.md ... SKIPPED (exists)")
                continue

            print(f"[{current}/{total}] {faq_slug}.md ... ", end="", flush=True)

            content = generate_faq_content(
                client, question, context, faq_slug, region="general", activity=slug
            )

            if content:
                write_faq_file(content, faq_slug)
                word_count = len(content.split())
                print(f"done ({word_count} words)")
            else:
                print("FAILED")

            # Rate limiting
            time.sleep(2)

    print(f"\n=== ACTIVITY FAQs COMPLETE ===\n")


def main():
    parser = argparse.ArgumentParser(description="Generate FAQ content for Adventure Wales")
    parser.add_argument(
        "--type",
        required=True,
        help="Type of FAQs to generate: regions, activities, all, region:<slug>, activity:<slug>"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be generated without making API calls"
    )

    args = parser.parse_args()

    # Change to project root
    script_dir = Path(__file__).parent
    os.chdir(script_dir.parent)

    if args.dry_run:
        print("\n=== DRY RUN - Showing FAQ topics ===\n")

        if args.type in ("regions", "all"):
            print("REGION FAQs (55 total):")
            for slug, name, _ in REGIONS:
                for template_slug, template_question in REGION_FAQ_TEMPLATES:
                    faq_slug = template_slug.format(slug=slug)
                    question = template_question.format(name=name)
                    exists = "EXISTS" if (OUTPUT_DIR / f"{faq_slug}.md").exists() else "NEW"
                    print(f"  [{exists}] {faq_slug}: {question}")
            print()

        if args.type in ("activities", "all"):
            print("ACTIVITY FAQs (50 total):")
            for slug, name, _ in ACTIVITIES:
                for template_slug, template_question in ACTIVITY_FAQ_TEMPLATES:
                    faq_slug = template_slug.format(slug=slug)
                    question = template_question.format(name=name)
                    exists = "EXISTS" if (OUTPUT_DIR / f"{faq_slug}.md").exists() else "NEW"
                    print(f"  [{exists}] {faq_slug}: {question}")

        return

    client = create_gemini_client()

    if args.type == "regions":
        generate_region_faqs(client)
    elif args.type == "activities":
        generate_activity_faqs(client)
    elif args.type == "all":
        generate_region_faqs(client)
        generate_activity_faqs(client)
    elif args.type.startswith("region:"):
        region_slug = args.type.split(":")[1]
        regions = [(s, n, w) for s, n, w in REGIONS if s == region_slug]
        if not regions:
            print(f"ERROR: Unknown region '{region_slug}'")
            sys.exit(1)
        generate_region_faqs(client, regions)
    elif args.type.startswith("activity:"):
        activity_slug = args.type.split(":")[1]
        activities = [(s, n, d) for s, n, d in ACTIVITIES if s == activity_slug]
        if not activities:
            print(f"ERROR: Unknown activity '{activity_slug}'")
            sys.exit(1)
        generate_activity_faqs(client, activities)
    else:
        print(f"ERROR: Unknown type '{args.type}'")
        sys.exit(1)

    print("\n=== ALL DONE ===")
    print(f"FAQs written to: {OUTPUT_DIR.absolute()}")


if __name__ == "__main__":
    main()
