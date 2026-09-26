#!/usr/bin/env python3
"""Completion gate for Adventure Wales Jules research sessions.

A Jules session is never treated as delivered merely because its remote status
is complete. Its patch must be limited to the one queue-authorised research
JSON output. The monitor records ready, blocked and awaiting-feedback sessions
in the durable campaign state, so the daily report is an honest delivery view.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
STATE_PATH = Path.home() / ".hermes" / "state" / "adventure-wales-jules-campaign.json"


def changed_paths(patch: str) -> list[str]:
    """Return paths affected by a unified git patch, preserving order."""
    paths: list[str] = []
    for line in patch.splitlines():
        if line.startswith("diff --git "):
            match = re.match(r"diff --git a/(.*?) b/(.*)$", line)
            if not match:
                continue
            paths.append(match.group(2))
    return paths


def validate_research_patch(patch: str, expected_output_path: str) -> list[str]:
    """Enforce the research-only contract before a patch may be applied."""
    paths = changed_paths(patch)
    errors: list[str] = []
    if len(paths) != 1:
        errors.append(f"patch must modify exactly one file; found {len(paths)}")
        return errors
    actual = paths[0]
    if actual != expected_output_path:
        errors.append(f"patch path {actual!r} does not match expected output path {expected_output_path!r}")
    if not actual.startswith("data/research/content-ops/") or not actual.endswith(".json"):
        errors.append("patch output must be a JSON research file under data/research/content-ops/")
    return errors


def completion_status(record: dict, remote_status: str, validation_errors: list[str]) -> str:
    if remote_status == "Awaiting User Feedback":
        return "awaiting_feedback"
    if remote_status != "Completed":
        return "pending"
    return "blocked" if validation_errors else "ready_to_apply"


def load_state(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        data = {}
    data.setdefault("runs", {})
    data.setdefault("launch_records", {})
    return data


def save_state(path: Path, state: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")


def pull_patch(session_id: str) -> str:
    proc = subprocess.run(
        ["jules", "remote", "pull", "--session", session_id],
        cwd=REPO_ROOT,
        text=True,
        capture_output=True,
        timeout=120,
    )
    if proc.returncode:
        raise RuntimeError((proc.stderr or proc.stdout).strip()[-500:])
    return proc.stdout


def remote_statuses() -> dict[str, str]:
    """The CLI does not offer JSON; use its stable final status column."""
    proc = subprocess.run(["jules", "remote", "list", "--session"], cwd=REPO_ROOT, text=True, capture_output=True, timeout=120)
    if proc.returncode:
        raise RuntimeError((proc.stderr or proc.stdout).strip()[-500:])
    statuses: dict[str, str] = {}
    for line in proc.stdout.splitlines():
        match = re.match(r"\s*(\d+)\s+.*?\s{2,}(Completed|Awaiting User F(?:eedback)?|In Progress|Failed)\s*$", line)
        if match:
            status = match.group(2).replace("Awaiting User F", "Awaiting User Feedback")
            statuses[match.group(1)] = status
    return statuses


def monitor(state: dict, statuses: dict[str, str], pull=pull_patch) -> list[dict]:
    outcomes: list[dict] = []
    for content_item_id, item in state.get("launch_records", {}).items():
        for record in item.get("records", []):
            if record.get("status") != "submitted" or not record.get("session_id"):
                continue
            session_id = str(record["session_id"]).split("/")[-1]
            remote = statuses.get(session_id, "pending")
            errors: list[str] = []
            if remote == "Completed":
                try:
                    patch = pull(session_id)
                except Exception as exc:
                    errors = [f"could not retrieve completed patch: {exc}"]
                else:
                    # Queue path is intentionally persisted with the record at launch time.
                    expected = record.get("output_path")
                    if not expected:
                        errors = ["launch record has no expected output_path"]
                    else:
                        errors = validate_research_patch(patch, expected)
            status = completion_status(record, remote, errors)
            record["completion"] = {
                "checked_at": dt.datetime.now().isoformat(timespec="seconds"),
                "remote_status": remote,
                "status": status,
                "validation_errors": errors,
            }
            outcomes.append({"content_item_id": content_item_id, "session_id": session_id, "status": status, "errors": errors})
    return outcomes


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate Jules research completions; does not apply or publish patches.")
    parser.add_argument("--state", type=Path, default=STATE_PATH)
    args = parser.parse_args(argv)
    state = load_state(args.state)
    try:
        outcomes = monitor(state, remote_statuses())
    except RuntimeError as exc:
        print(f"ERROR: {exc}")
        return 1
    save_state(args.state, state)
    counts: dict[str, int] = {}
    for outcome in outcomes:
        counts[outcome["status"]] = counts.get(outcome["status"], 0) + 1
    print("Adventure Wales Jules completion gate")
    print(" ".join(f"{key}={value}" for key, value in sorted(counts.items())) or "No tracked sessions.")
    for outcome in outcomes:
        if outcome["status"] == "blocked":
            print(f"BLOCKED {outcome['content_item_id']} ({outcome['session_id']}): {'; '.join(outcome['errors'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
