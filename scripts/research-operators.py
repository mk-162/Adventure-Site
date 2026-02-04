#!/usr/bin/env python3
"""
Adventure Wales Operator Research — Gemini API with Google Search Grounding

Researches Welsh adventure operators and outputs structured JSON for the directory.

Usage:
    python scripts/research-operators.py --tier 1
    python scripts/research-operators.py --single adventure-britain
    python scripts/research-operators.py --region pembrokeshire
    python scripts/research-operators.py --tier 1 --dry-run
"""

import os
import sys
import json
import time
import re
import argparse
from pathlib import Path

try:
    import google.generativeai as genai
except ImportError:
    os.system("pip install google-generativeai")
    import google.generativeai as genai

# =============================================================================
# CONFIG
# =============================================================================

PROJECT_ROOT = Path(__file__).parent.parent
HITLIST_PATH = PROJECT_ROOT / "skills" / "adventure-research" / "references" / "operator-hitlist.json"
OUTPUT_DIR = PROJECT_ROOT / "data" / "research"

# =============================================================================
# SERVICE DETAIL TEMPLATES (included in prompt so Gemini knows the shape)
# =============================================================================

ACTIVITY_PROVIDER_TEMPLATE = {
    "sessions": [
        {"name": "Example Session", "duration": "3h", "times": ["09:30", "14:00"],
         "groupSizeMin": 4, "groupSizeMax": 12, "priceAdult": 55, "priceChild": 45, "pricePrivate": None}
    ],
    "qualifications": ["AALA Licensed"],
    "equipmentIncluded": ["wetsuit", "helmet"],
    "whatToBring": ["swimwear", "towel"],
    "minAge": 8,
    "fitnessLevel": "moderate",
    "seasons": {"open": "Apr-Oct", "peak": "Jun-Sep"},
    "meetingPoint": "Address or postcode",
    "parkingInfo": "Free parking on site",
    "bookingRequired": True,
    "bookingUrl": "https://...",
    "cancellationPolicy": "48h notice for full refund"
}

GEAR_RENTAL_TEMPLATE = {
    "hireItems": [
        {"type": "Mountain Bike", "halfDay": 25, "fullDay": 40, "weekly": 150, "deposit": 50}
    ],
    "includes": ["helmet", "lock"],
    "deliveryAvailable": False,
    "sizesAvailable": "XS to XL",
    "openingHours": {"mon-fri": "09:00-17:30", "sat-sun": "08:00-18:00"}
}

# =============================================================================
# OUTPUT JSON TEMPLATE
# =============================================================================

OUTPUT_TEMPLATE = """{
  "operator": {
    "name": "Operator Name",
    "slug": "operator-name",
    "category": "activity_provider",
    "website": "https://...",
    "email": "info@...",
    "phone": "01234 567890",
    "address": "Full address with postcode",
    "lat": 52.0000,
    "lng": -4.0000,
    "description": "150-250 word original description...",
    "tagline": "Punchy tagline under 10 words",
    "googleRating": 4.8,
    "reviewCount": 150,
    "tripadvisorUrl": "https://tripadvisor.com/...",
    "priceRange": "££",
    "uniqueSellingPoint": "One sentence USP",
    "regions": ["region-slug"],
    "activityTypes": ["activity-type"],
    "serviceTypes": ["service-1", "service-2"],
    "trustSignals": {
      "aala": true,
      "yearsExperience": 10,
      "certifications": ["AALA Licensed"],
      "awards": []
    },
    "serviceDetails": {}
  },
  "activities": [
    {
      "operatorSlug": "operator-name",
      "name": "Activity Name",
      "slug": "activity-name",
      "activityType": "coasteering",
      "region": "pembrokeshire",
      "description": "Original 2-3 sentence description",
      "priceFrom": 45,
      "priceTo": 65,
      "duration": "3 hours",
      "difficulty": "moderate",
      "minAge": 8,
      "season": "Apr-Oct",
      "bookingUrl": "https://..."
    }
  ]
}"""


def build_prompt(operator: dict) -> str:
    """Build the research prompt for a single operator."""

    category_hint = ""
    if operator["category"] == "activity_provider":
        category_hint = f"""
For serviceDetails, use this structure for activity providers:
{json.dumps(ACTIVITY_PROVIDER_TEMPLATE, indent=2)}

List ALL sessions/activities they offer with pricing."""
    elif "bike" in " ".join(operator.get("activityTypes", [])).lower():
        category_hint = f"""
This operator involves bike hire/rental. For serviceDetails, include hire pricing:
{json.dumps(GEAR_RENTAL_TEMPLATE, indent=2)}"""

    return f"""You are a research assistant with deep knowledge of Welsh adventure tourism.
You are gathering business data for Adventure Wales, an adventure tourism directory.

OPERATOR TO RESEARCH:
- Name: {operator['name']}
- Website: {operator['website']}
- Address: {operator['address']}
- Category: {operator['category']}
- Known activity types: {', '.join(operator.get('activityTypes', []))}
- Regions: {', '.join(operator.get('regions', []))}

Using your knowledge of this operator, provide:

1. CONTACT DETAILS: phone, email, full address with postcode
2. ALL ACTIVITIES/SERVICES with pricing in GBP, session durations, group sizes, minimum ages
3. QUALIFICATIONS: AALA licensing, BCU, MTA, Mountain Training, other certifications
4. LOGISTICS: booking URL, equipment included, what to bring, meeting point, parking, seasons
5. GOOGLE RATING: their approximate Google Maps rating and review count
6. TRIPADVISOR URL: their TripAdvisor page link
7. ORIGINAL DESCRIPTION: 150-250 words, written like a knowledgeable local guide.
   Mention what makes them different, who they're best for, standout experiences.
8. TAGLINE: punchy, under 10 words
9. UNIQUE SELLING POINT: one sentence
{category_hint}

Return ONLY valid JSON matching this exact structure. No markdown wrapping, no explanation:

{OUTPUT_TEMPLATE}

RULES:
- All prices in GBP (£) — use realistic current prices
- Coordinates in decimal degrees (Wales: lat 51-54, lng -6 to -2.5)
- If data is not available, use null — NEVER fabricate contact details
- Slugs: lowercase, hyphenated
- Write ORIGINAL descriptions — do not copy website text
- priceRange: £ (under £30pp), ££ (£30-60pp), £££ (£60-100pp), ££££ (over £100pp)
- List EVERY activity they offer as separate entries in the activities array
- Use their actual website URL for bookingUrl"""


def research_operator(model, operator: dict) -> dict | None:
    """Research operator using Gemini and return structured JSON."""

    prompt = build_prompt(operator)

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Strip markdown code block wrappers
        if text.startswith("```json"):
            text = text[len("```json"):].strip()
        if text.startswith("```"):
            text = text[3:].strip()
        if text.endswith("```"):
            text = text[:-3].strip()

        data = json.loads(text)
        return data

    except json.JSONDecodeError as e:
        print(f"\n    JSON parse error: {e}")
        try:
            json_match = re.search(r'\{[\s\S]*\}', text)
            if json_match:
                data = json.loads(json_match.group())
                return data
        except:
            pass
        print(f"    Raw response (first 500 chars): {text[:500]}")
        return None
    except Exception as e:
        print(f"\n    API error: {e}")
        return None


def validate_result(data: dict, operator: dict) -> list[str]:
    """Validate research result and return list of warnings."""
    warnings = []

    op = data.get("operator", {})

    # Check required fields
    for field in ["name", "description", "tagline", "lat", "lng"]:
        if not op.get(field):
            warnings.append(f"Missing {field}")

    # Validate GPS
    lat = op.get("lat", 0)
    lng = op.get("lng", 0)
    if lat and lng:
        if lat < 51 or lat > 54 or lng < -6 or lng > -2.5:
            warnings.append(f"GPS out of Wales range: {lat}, {lng}")

    # Check activities
    activities = data.get("activities", [])
    if not activities:
        warnings.append("No activities found")

    # Check description length
    desc = op.get("description", "")
    word_count = len(desc.split()) if desc else 0
    if word_count < 50:
        warnings.append(f"Description too short ({word_count} words)")

    return warnings


def main():
    parser = argparse.ArgumentParser(description="Research Welsh adventure operators via Gemini API")
    parser.add_argument("--tier", type=int, help="Research operators of a specific tier (1 or 2)")
    parser.add_argument("--single", type=str, help="Research a single operator by slug")
    parser.add_argument("--region", type=str, help="Research operators in a specific region")
    parser.add_argument("--dry-run", action="store_true", help="Show prompts without calling API")
    parser.add_argument("--force", action="store_true", help="Overwrite existing research files")
    args = parser.parse_args()

    # Load hitlist
    with open(HITLIST_PATH) as f:
        hitlist = json.load(f)

    # Filter operators
    if args.single:
        operators = [op for op in hitlist if op["slug"] == args.single]
        if not operators:
            print(f"ERROR: Operator '{args.single}' not found in hitlist")
            sys.exit(1)
    elif args.tier:
        operators = [op for op in hitlist if op.get("tier") == args.tier]
    elif args.region:
        operators = [op for op in hitlist if args.region in op.get("regions", [])]
    else:
        print("ERROR: Specify --tier, --single, or --region")
        sys.exit(1)

    print(f"Researching {len(operators)} operators...\n")

    if args.dry_run:
        for op in operators:
            print(f"=== {op['name']} ===")
            print(build_prompt(op))
            print("\n" + "=" * 80 + "\n")
        return

    # Init Gemini
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable not set")
        sys.exit(1)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    # Ensure output dir exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Determine batch filename
    existing = list(OUTPUT_DIR.glob("batch-*.json"))
    batch_num = len(existing) + 1
    if args.single:
        output_file = OUTPUT_DIR / f"{args.single}.json"
    else:
        tier_label = f"tier{args.tier}" if args.tier else args.region or "batch"
        output_file = OUTPUT_DIR / f"{tier_label}-{batch_num}.json"

    results = {"operators": [], "activities": []}
    success = 0
    failed = 0

    for i, op in enumerate(operators, 1):
        print(f"[{i}/{len(operators)}] {op['name']} ...", end=" ", flush=True)

        data = research_operator(model, op)

        if data:
            warnings = validate_result(data, op)

            # Merge operator data
            operator_data = data.get("operator", data)
            activities_data = data.get("activities", [])

            results["operators"].append(operator_data)
            results["activities"].extend(activities_data)

            activity_count = len(activities_data)
            warn_str = f" (warnings: {', '.join(warnings)})" if warnings else ""
            print(f"done ({activity_count} activities){warn_str}")
            success += 1
        else:
            print("FAILED")
            failed += 1

        # Rate limit
        if i < len(operators):
            time.sleep(3)

    # Write output
    with open(output_file, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n=== COMPLETE: {success} researched, {failed} failed ===")
    print(f"Output: {output_file}")


if __name__ == "__main__":
    main()
