#!/usr/bin/env python3
"""
Minimal Jules API helper for Adventure-Site research workflows.
Uses JULES_API_KEY from the environment.

Examples:
  source .env.local
  python3 scripts/jules_api.py list
  python3 scripts/jules_api.py create --title "Snowdonia audit" --prompt-file plans/jules-snowdonia-audit-brief-v2.md
  python3 scripts/jules_api.py get sessions/1234567890
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from urllib import request, error

BASE_URL = "https://jules.googleapis.com/v1alpha"
SOURCE = "sources/github/mk-162/Adventure-Site"
STARTING_BRANCH = "phase1/broken-pages-fix"


def get_api_key() -> str:
    key = os.getenv("JULES_API_KEY")
    if not key:
        raise SystemExit("JULES_API_KEY not set. Put it in .env.local and run: source .env.local")
    return key


def api_call(method: str, path: str, payload: dict | None = None) -> dict:
    key = get_api_key()
    url = f"{BASE_URL}/{path.lstrip('/')}"
    data = None
    headers = {
        "X-Goog-Api-Key": key,
        "Content-Type": "application/json",
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")

    req = request.Request(url, data=data, headers=headers, method=method)
    try:
        with request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body) if body else {}
    except error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"HTTP {e.code}: {body}")


def list_sessions(page_size: int = 20) -> dict:
    return api_call("GET", f"sessions?pageSize={page_size}")


def get_session(name: str) -> dict:
    return api_call("GET", name)


def create_session(title: str, prompt: str) -> dict:
    payload = {
        "prompt": prompt,
        "sourceContext": {
            "source": SOURCE,
            "githubRepoContext": {
                "startingBranch": STARTING_BRANCH,
            },
        },
        "automationMode": "AUTO_CREATE_PR",
        "title": title,
    }
    return api_call("POST", "sessions", payload)


def main() -> None:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    list_p = sub.add_parser("list")
    list_p.add_argument("--page-size", type=int, default=20)

    get_p = sub.add_parser("get")
    get_p.add_argument("name", help="Full Jules resource name, e.g. sessions/123")

    create_p = sub.add_parser("create")
    create_p.add_argument("--title", required=True)
    group = create_p.add_mutually_exclusive_group(required=True)
    group.add_argument("--prompt")
    group.add_argument("--prompt-file")

    args = parser.parse_args()

    if args.command == "list":
        print(json.dumps(list_sessions(args.page_size), indent=2))
        return
    if args.command == "get":
        print(json.dumps(get_session(args.name), indent=2))
        return
    if args.command == "create":
        prompt = args.prompt or Path(args.prompt_file).read_text()
        print(json.dumps(create_session(args.title, prompt), indent=2))
        return


if __name__ == "__main__":
    main()
