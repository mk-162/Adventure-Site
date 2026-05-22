#!/usr/bin/env python3
"""
Adventure Wales daily Jules campaign runner.

Purpose:
- Use MK's Jules quota every day to improve Adventure Wales content quality.
- Create focused, verifiable Jules sessions, not vague mega-briefs.
- Prioritise fixing content, not hiding content.

Default: submits up to 100 Jules sessions per day.
State lives outside the repo at ~/.hermes/state/adventure-wales-jules-campaign.json.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import re
import subprocess
from pathlib import Path
from typing import Iterable

REPO = Path("/home/minigeek/projects/Adventure-Site")
STATE_PATH = Path.home() / ".hermes" / "state" / "adventure-wales-jules-campaign.json"
REPO_NAME = "mk-162/Adventure-Site"
DEFAULT_DAILY_LIMIT = 100


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "item"


def load_json(path: Path, fallback):
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text())
    except Exception:
        return fallback


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False))


def load_state() -> dict:
    return load_json(STATE_PATH, {"runs": {}, "submitted_keys": []})


def save_state(state: dict) -> None:
    save_json(STATE_PATH, state)


def audit_gaps() -> list[dict]:
    audit_path = REPO / "content" / "content-gap-audit.json"
    data = load_json(audit_path, {"gaps": []})
    return data.get("gaps", [])


def coverage_rows() -> list[dict]:
    path = REPO / "content" / "inventory" / "coverage-findings.csv"
    if not path.exists():
        return []
    with path.open(newline="") as f:
        return list(csv.DictReader(f))


def operator_tasks(gaps: list[dict]) -> Iterable[dict]:
    priority_slugs = [
        "zip-world",
        "adventure-parc-snowdonia",
        "bikepark-wales",
        "plas-y-brenin",
        "coed-y-brenin-nrw",
        "antur-stiniog",
        "beics-brenin",
        "bala-watersports",
        "bala-adventure-watersports",
        "snowdonia-watersports",
        "go-below-underground",
        "national-white-water-centre",
        "cardiff-international-white-water",
        "celtic-quest-coasteering",
        "tyf-adventure",
        "preseli-venture",
        "dyfi-bike-park",
        "cwmcarn-forest",
        "oneplanet-adventure",
        "wye-valley-canoes",
    ]
    gap_by_slug = {g.get("slug"): g for g in gaps if g.get("category") == "Operators"}
    seen = set()

    for slug in priority_slugs:
        g = gap_by_slug.get(slug, {"slug": slug, "page": f"/directory/{slug}", "issue": "Priority operator needs launch-quality enrichment"})
        seen.add(slug)
        yield make_operator_task(slug, g, priority=True)

    severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    remaining = [g for g in gaps if g.get("category") == "Operators" and g.get("slug") not in seen]
    remaining.sort(key=lambda g: (severity_order.get(str(g.get("severity") or ""), 9), str(g.get("slug") or "")))
    for g in remaining:
        slug = g.get("slug") or slugify(g.get("page", "operator"))
        yield make_operator_task(slug, g, priority=False)


def make_operator_task(slug: str, gap: dict, priority: bool) -> dict:
    title = f"operator-{slug}"
    issue = gap.get("issue", "Operator content needs enrichment")
    page = gap.get("page", f"/directory/{slug}")
    prompt = f"""# Adventure Wales Jules Task: Fix operator listing quality for {slug}

Repo: {REPO_NAME}
Business rule: Adventure Wales should FIX weak content, not hide it. Stubs are allowed only as minimal public placeholders, but priority operators need useful, accurate, premium-quality content.

## Target
Operator slug: `{slug}`
Public page: `{page}`
Audit issue: {issue}
Priority operator: {priority}

## What to do
1. Inspect the repo for this operator in CSV/data/seed files/content briefs.
2. Research the operator from official/public sources.
3. Create or update a research file at `data/research/operators/{slug}.json` with:
   - name
   - official website
   - phone/email if public
   - address/location
   - region
   - activities offered
   - 150-300 word human description
   - 5-8 specific selling points
   - image sourcing notes: official media page, press kit, Openverse/Wikimedia/Flickr options, licence notes
   - sources array with URLs
   - confidence score 1-5
4. If a safe content/profile file already exists, improve it using verified facts. Do not invent prices, dates, safety claims, or ratings.
5. Add a short launch recommendation: publish as full profile / needs image only / needs operator confirmation.

## Quality rules
- No AI images.
- No generic travel filler.
- Do not scrape or copy copyrighted copy verbatim.
- Use official source first, then trusted third-party sources.
- If data is missing, mark it `needs_verification` rather than guessing.

## Exit criteria
- `data/research/operators/{slug}.json` exists.
- It has at least 3 source URLs.
- It contains a useful human description and launch recommendation.
"""
    return {"key": title, "prompt": prompt}


def combo_tasks(rows: list[dict]) -> Iterable[dict]:
    priority = {"P0": 0, "P1": 1, "P2": 2, "": 9}
    combo_rows = [r for r in rows if r.get("Page Type") == "Combo"]
    combo_rows.sort(key=lambda r: (priority.get(r.get("Priority", ""), 9), int(r.get("Current Coverage Score (1-5)") or 9), r.get("Page Title / Slug", "")))
    for row in combo_rows:
        title = row.get("Page Title / Slug", "")
        region = row.get("Region", "")
        activity = row.get("Activity", "")
        page_match = re.search(r"\((.*?)\)", title)
        page = page_match.group(1) if page_match else title
        key = f"combo-{slugify(region)}-{slugify(activity)}"
        prompt = f"""# Adventure Wales Jules Task: Improve combo page quality

Repo: {REPO_NAME}
Business rule: FIX weak content. Do not recommend hiding/removing unless the page is factually invalid; if invalid, propose a better content angle that still helps users.

## Target
Region: {region}
Activity: {activity}
Page: {page}
Current tracker score: {row.get('Current Coverage Score (1-5)')}
Priority: {row.get('Priority')}
Known missing: {row.get('Famous Things Missing')}
Notes: {row.get('Notes')}

## What to do
1. Inspect existing combo data file in `data/combo-pages/` if present.
2. Research official/trusted sources for this region + activity.
3. Create or update `data/research/combo-improvements/{slugify(region)}--{slugify(activity)}.json` with:
   - best 5-8 spots or experiences
   - local operators
   - practical planning notes
   - transport/parking notes
   - weather/seasonality
   - risks/downsides/honest caveats
   - image sourcing ideas with licence/source notes
   - source URLs
   - recommended content changes
4. If the existing `data/combo-pages/{slugify(region)}--{slugify(activity)}.json` is clearly thin and safe to improve, update it. Otherwise leave researched recommendations only.

## Quality rules
- Specific Welsh places only.
- No invented pricing/timetables/opening hours.
- No AI-sounding filler.
- Do not make safety claims without sources.

## Exit criteria
- Research output JSON exists under `data/research/combo-improvements/`.
- It has at least 5 source URLs or clear notes explaining why fewer exist.
- It includes a clear list of recommended repo changes.
"""
        yield {"key": key, "prompt": prompt}


def image_tasks() -> Iterable[dict]:
    items = [
        ("homepage-cta", "Audit and source replacements for homepage CTA/newsletter images previously flagged as Maryland, Poland, Colorado/Rockies."),
        ("snowdonia-region-hero", "Fix Snowdonia region hero: must show recognisable Snowdonia/Eryri, not generic forest."),
        ("wye-valley-region-hero", "Fix Wye Valley hero: must show River Wye/Tintern/Symonds Yat, not New Zealand alpine lake."),
        ("snowdonia-mtb-combo", "Find proper Snowdonia mountain biking combo image: activity + correct region, ideally Coed y Brenin/Antur Stiniog/Penmachno."),
        ("gower-surfing-combo", "Find proper Gower surfing combo image: surfers at/near Llangennith/Rhossili/Caswell/Langland."),
        ("operator-zip-world", "Source verified media options for Zip World listing."),
        ("operator-adventure-parc-snowdonia", "Source verified media options for Adventure Parc Snowdonia listing."),
        ("operator-plas-y-brenin", "Source verified media options for Plas y Brenin listing."),
        ("operator-coed-y-brenin", "Source verified media options for Coed y Brenin NRW listing."),
        ("operator-bikepark-wales", "Source verified media options for BikePark Wales listing."),
    ]
    for key, brief in items:
        prompt = f"""# Adventure Wales Jules Task: Image sourcing and validation

Repo: {REPO_NAME}
Task: {brief}

## What to do
1. Inspect current image references in repo for this target.
2. Identify what is wrong/missing.
3. Research replacement image options from allowed sources: official media/press pages where permitted, Wikimedia Commons, Geograph, Flickr Creative Commons, Openverse, Unsplash only if location/activity is credible.
4. Create `data/research/image-sourcing/{key}.json` with:
   - current image problem
   - 3-8 candidate replacement images
   - source URL
   - licence/attribution
   - exact location shown
   - why it fits
   - implementation notes: target file/component/data field
5. Do not download images unless the licence and source are clear.

## Rules
- No AI-generated images.
- Exact location matters for region images.
- Combo images should show both activity and place where possible.

## Exit criteria
- `data/research/image-sourcing/{key}.json` exists.
- At least 3 candidate images or an explanation of why fewer are available.
"""
        yield {"key": f"image-{key}", "prompt": prompt}


def event_tasks(gaps: list[dict]) -> Iterable[dict]:
    events = [g for g in gaps if g.get("category") == "Events"][:30]
    for g in events:
        slug = g.get("slug") or slugify(g.get("page", "event"))
        prompt = f"""# Adventure Wales Jules Task: Fix event content quality

Repo: {REPO_NAME}
Target event: {slug}
Page: {g.get('page')}
Audit issue: {g.get('issue')}

## What to do
1. Inspect the current event data.
2. Research official event information and current status.
3. Create/update `data/research/events/{slug}.json` with verified:
   - official name
   - website
   - date/status notes
   - location/region
   - organiser
   - activity category
   - 120-220 word practical description
   - source URLs
   - recommendation: publish / needs current date / archive candidate

## Quality rules
- Never invent event dates.
- If 2026 date is not announced, say so.
- No copied event marketing text.

## Exit criteria
- `data/research/events/{slug}.json` exists with source URLs and a publish recommendation.
"""
        yield {"key": f"event-{slug}", "prompt": prompt}


def task_bank() -> list[dict]:
    gaps = audit_gaps()
    rows = coverage_rows()
    tasks = []
    tasks.extend(operator_tasks(gaps))
    tasks.extend(combo_tasks(rows))
    tasks.extend(image_tasks())
    tasks.extend(event_tasks(gaps))
    # Deduplicate preserving order
    seen = set()
    out = []
    for t in tasks:
        if t["key"] in seen:
            continue
        seen.add(t["key"])
        out.append(t)
    return out


def submit_task(task: dict, dry_run: bool = False) -> tuple[bool, str]:
    if dry_run:
        return True, "DRY_RUN"
    proc = subprocess.run(
        ["jules", "new", "--repo", REPO_NAME, task["prompt"]],
        cwd=str(REPO),
        text=True,
        capture_output=True,
        timeout=120,
    )
    output = (proc.stdout + "\n" + proc.stderr).strip()
    return proc.returncode == 0, output


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=DEFAULT_DAILY_LIMIT)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--reset-today", action="store_true")
    args = parser.parse_args()

    today = dt.date.today().isoformat()
    state = load_state()
    runs = state.setdefault("runs", {})
    submitted_keys = set(state.setdefault("submitted_keys", []))
    if args.reset_today:
        runs.pop(today, None)

    today_run = runs.setdefault(today, {"submitted": [], "failed": []})
    already_today = len(today_run["submitted"])
    remaining = max(args.limit - already_today, 0)
    if remaining <= 0:
        print(f"Daily Jules limit already reached for {today}: {already_today}/{args.limit}")
        return 0

    available = [t for t in task_bank() if t["key"] not in submitted_keys]
    selected = available[:remaining]

    print(f"Adventure Wales Jules campaign {today}")
    print(f"Daily limit: {args.limit}; already today: {already_today}; submitting now: {len(selected)}; dry_run={args.dry_run}")

    for idx, task in enumerate(selected, start=1):
        print(f"[{idx}/{len(selected)}] {task['key']}")
        ok, output = submit_task(task, dry_run=args.dry_run)
        record = {"key": task["key"], "at": dt.datetime.now().isoformat(timespec="seconds"), "output": output[-2000:]}
        if args.dry_run:
            print("  OK (dry run; not recorded)")
            continue
        if ok:
            today_run["submitted"].append(record)
            submitted_keys.add(task["key"])
            print("  OK")
        else:
            today_run["failed"].append(record)
            print("  FAILED")
            print(output[-1000:])
        state["submitted_keys"] = sorted(submitted_keys)
        save_state(state)

    print(f"Done. Submitted {len(today_run['submitted'])}/{args.limit} for {today}.")
    print(f"State: {STATE_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
