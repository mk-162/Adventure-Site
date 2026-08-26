#!/usr/bin/env python3
"""
Tests for scripts/jules/daily_jules_campaign.py.

Run with: python3 -m unittest discover -s scripts/jules/tests -v

These tests never make real network calls — the Jules API boundary
(`create_session`) is always mocked.
"""

from __future__ import annotations

import contextlib
import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import daily_jules_campaign as djc  # noqa: E402


def make_task(**overrides) -> dict:
    task = {
        "id": "content-ops-050-operator-example",
        "content_item_id": "operator-example",
        "channel": "commercial",
        "content_type": "operator",
        "route_or_slug": "/directory/example",
        "title": "Example Operator",
        "priority": 50,
        "status": "research_needed",
        "recommended_skill": "directory-premium-lure-model",
        "task_type": "research",
        "brief": "Improve content item operator-example.",
        "acceptance_criteria": ["Source URLs are included for factual claims."],
        "source_requirements": ["Prefer official sources."],
        "output_path": "data/research/content-ops/operator-example.json",
    }
    task.update(overrides)
    return task


class SelectResearchTasksTests(unittest.TestCase):
    def test_filters_to_research_type_and_eligible_status(self):
        tasks = [
            make_task(id="a", content_item_id="a", task_type="research", status="research_needed"),
            make_task(id="b", content_item_id="b", task_type="research", status="refresh_due"),
            make_task(id="c", content_item_id="c", task_type="qa", status="research_needed"),
            make_task(id="d", content_item_id="d", task_type="research", status="qa_needed"),
            make_task(id="e", content_item_id="e", task_type="commercial_review", status="research_needed"),
        ]
        selected_ids = [t["id"] for t in djc.select_research_tasks(tasks)]
        self.assertEqual(sorted(selected_ids), ["a", "b"])

    def test_sorts_by_priority_desc_then_id_asc(self):
        tasks = [
            make_task(id="z-low", content_item_id="z", priority=10),
            make_task(id="b-tie", content_item_id="b", priority=50),
            make_task(id="a-tie", content_item_id="a", priority=50),
            make_task(id="y-high", content_item_id="y", priority=90),
        ]
        ordered_ids = [t["id"] for t in djc.select_research_tasks(tasks)]
        self.assertEqual(ordered_ids, ["y-high", "a-tie", "b-tie", "z-low"])


class QueueLoadingTests(unittest.TestCase):
    def test_malformed_json_reports_fatal_error(self):
        with _tmp_file("{ not valid json") as path:
            valid, invalid_count, error = djc.load_queue(path)
            self.assertEqual(valid, [])
            self.assertEqual(invalid_count, 0)
            self.assertIsNotNone(error)

    def test_missing_tasks_array_reports_fatal_error(self):
        with _tmp_file(json.dumps({"generatedAt": "now"})) as path:
            valid, invalid_count, error = djc.load_queue(path)
            self.assertEqual(valid, [])
            self.assertIsNotNone(error)

    def test_missing_file_reports_fatal_error(self):
        valid, invalid_count, error = djc.load_queue(Path("/nonexistent/path/task-queue.json"))
        self.assertEqual(valid, [])
        self.assertIsNotNone(error)

    def test_individual_malformed_tasks_are_skipped_not_fatal(self):
        good = make_task(id="good", content_item_id="good")
        bad = {"id": "bad", "content_item_id": "bad"}  # missing required fields
        with _tmp_file(json.dumps({"tasks": [good, bad]})) as path:
            valid, invalid_count, error = djc.load_queue(path)
            self.assertIsNone(error)
            self.assertEqual(invalid_count, 1)
            self.assertEqual([t["id"] for t in valid], ["good"])


class FingerprintTests(unittest.TestCase):
    def test_same_content_yields_same_fingerprint(self):
        t1 = make_task()
        t2 = make_task()
        self.assertEqual(djc.task_fingerprint(t1), djc.task_fingerprint(t2))

    def test_brief_change_yields_different_fingerprint(self):
        t1 = make_task()
        t2 = make_task(brief="A materially different brief.")
        self.assertNotEqual(djc.task_fingerprint(t1), djc.task_fingerprint(t2))

    def test_status_change_yields_different_fingerprint(self):
        t1 = make_task(status="research_needed")
        t2 = make_task(status="refresh_due")
        self.assertNotEqual(djc.task_fingerprint(t1), djc.task_fingerprint(t2))

    def test_queue_rank_id_does_not_affect_fingerprint(self):
        # The numeric rank prefix in task["id"] shifts every audit regeneration;
        # it must not be part of the fingerprint, only content_item_id matters.
        t1 = make_task(id="content-ops-001-operator-example")
        t2 = make_task(id="content-ops-099-operator-example")
        self.assertEqual(djc.task_fingerprint(t1), djc.task_fingerprint(t2))


class LaunchStateTests(unittest.TestCase):
    def test_task_not_launched_before_is_eligible(self):
        state = {"runs": {}, "launch_records": {}}
        task = make_task()
        fp = djc.task_fingerprint(task)
        self.assertFalse(djc.is_already_launched(state, task["content_item_id"], fp))

    def test_submitted_record_blocks_relaunch_of_same_fingerprint(self):
        state = {"runs": {}, "launch_records": {}}
        task = make_task()
        fp = djc.task_fingerprint(task)
        djc.record_launch(state, task["content_item_id"], {"fingerprint": fp, "status": "submitted"})
        self.assertTrue(djc.is_already_launched(state, task["content_item_id"], fp))

    def test_failed_record_does_not_block_relaunch(self):
        state = {"runs": {}, "launch_records": {}}
        task = make_task()
        fp = djc.task_fingerprint(task)
        djc.record_launch(state, task["content_item_id"], {"fingerprint": fp, "status": "failed"})
        self.assertFalse(djc.is_already_launched(state, task["content_item_id"], fp))

    def test_material_change_makes_task_eligible_again(self):
        state = {"runs": {}, "launch_records": {}}
        old_task = make_task(brief="Old brief.")
        old_fp = djc.task_fingerprint(old_task)
        djc.record_launch(state, old_task["content_item_id"], {"fingerprint": old_fp, "status": "submitted"})

        new_task = make_task(brief="New brief after content-ops audit reran.")
        new_fp = djc.task_fingerprint(new_task)
        self.assertNotEqual(old_fp, new_fp)
        self.assertFalse(djc.is_already_launched(state, new_task["content_item_id"], new_fp))

    def test_historical_records_are_never_deleted(self):
        state = {"runs": {}, "launch_records": {}}
        task = make_task()
        fp1 = djc.task_fingerprint(task)
        djc.record_launch(state, task["content_item_id"], {"fingerprint": fp1, "status": "submitted"})
        fp2 = djc.task_fingerprint(make_task(brief="changed"))
        djc.record_launch(state, task["content_item_id"], {"fingerprint": fp2, "status": "submitted"})
        records = state["launch_records"][task["content_item_id"]]["records"]
        self.assertEqual(len(records), 2)
        self.assertEqual({r["fingerprint"] for r in records}, {fp1, fp2})

    def test_attempt_number_increments(self):
        state = {"runs": {}, "launch_records": {}}
        content_item_id = "operator-example"
        self.assertEqual(djc.next_attempt_number(state, content_item_id), 1)
        djc.record_launch(state, content_item_id, {"fingerprint": "x", "status": "failed"})
        self.assertEqual(djc.next_attempt_number(state, content_item_id), 2)


class PartitionByLaunchStateTests(unittest.TestCase):
    def test_already_launched_excluded_and_reported_separately(self):
        state = {"runs": {}, "launch_records": {}}
        launched = make_task(id="launched", content_item_id="launched", priority=90)
        fresh = make_task(id="fresh", content_item_id="fresh", priority=50)
        djc.record_launch(
            state, "launched", {"fingerprint": djc.task_fingerprint(launched), "status": "submitted"}
        )
        selected, skipped = djc.partition_by_launch_state([launched, fresh], state, limit=10)
        self.assertEqual([t["id"] for t in selected], ["fresh"])
        self.assertEqual([t["id"] for t in skipped], ["launched"])

    def test_limit_is_respected(self):
        state = {"runs": {}, "launch_records": {}}
        tasks = [make_task(id=f"t{i}", content_item_id=f"t{i}", priority=100 - i) for i in range(5)]
        selected, skipped = djc.partition_by_launch_state(tasks, state, limit=2)
        self.assertEqual(len(selected), 2)
        self.assertEqual([t["id"] for t in selected], ["t0", "t1"])


class BriefContentTests(unittest.TestCase):
    def test_brief_includes_required_fields(self):
        task = make_task()
        brief = djc.build_research_brief(task)
        self.assertIn(task["id"], brief)
        self.assertIn(task["route_or_slug"], brief)
        self.assertIn(task["output_path"], brief)
        self.assertIn(task["acceptance_criteria"][0], brief)
        self.assertIn(task["source_requirements"][0], brief)
        self.assertIn(djc.JULES_SOURCE, brief)

    def test_brief_forbids_out_of_scope_actions(self):
        brief = djc.build_research_brief(make_task())
        for phrase in [
            "application code",
            "migrations",
            "CI/CD",
            "production",
            "email",
            "AI-generated imagery",
            "guess facts",
            "seed CSV",
            "marketing copy",
        ]:
            self.assertIn(phrase, brief, f"expected brief to mention {phrase!r}")

    def test_brief_requests_next_status_recommendation_not_action(self):
        brief = djc.build_research_brief(make_task())
        self.assertIn("Recommend", brief)
        self.assertIn("do not perform", brief)


class MainDryRunTests(unittest.TestCase):
    def test_dry_run_makes_no_network_calls_and_prints_ids(self):
        queue = {"tasks": [make_task(id="dry-1", content_item_id="dry-1")]}
        with _tmp_file(json.dumps(queue)) as queue_path, _tmp_dir() as state_dir:
            state_path = state_dir / "state.json"
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                with patch.object(djc, "create_session", side_effect=AssertionError("must not call API")):
                    out = io.StringIO()
                    with redirect_stdout(out):
                        rc = djc.main(["--dry-run"])
            self.assertEqual(rc, 0)
            self.assertIn("dry-1", out.getvalue())
            self.assertFalse(state_path.exists(), "dry-run must not write state")

    def test_no_eligible_tasks_does_not_crash(self):
        queue = {"tasks": [make_task(task_type="qa", status="qa_needed")]}
        with _tmp_file(json.dumps(queue)) as queue_path, _tmp_dir() as state_dir:
            state_path = state_dir / "state.json"
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                out = io.StringIO()
                with redirect_stdout(out):
                    rc = djc.main(["--dry-run"])
            self.assertEqual(rc, 0)
            self.assertIn("No eligible", out.getvalue())


class MainMalformedQueueTests(unittest.TestCase):
    def test_malformed_queue_exits_gracefully(self):
        with _tmp_file("not json at all") as queue_path, _tmp_dir() as state_dir:
            state_path = state_dir / "state.json"
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                out = io.StringIO()
                with redirect_stdout(out):
                    rc = djc.main([])
            self.assertEqual(rc, 1)
            self.assertIn("ERROR", out.getvalue())


class MainApiKeyTests(unittest.TestCase):
    def test_missing_api_key_uses_authenticated_cli_path(self):
        queue = {"tasks": [make_task(id="needs-key", content_item_id="needs-key")]}
        with _tmp_file(json.dumps(queue)) as queue_path, _tmp_dir() as state_dir:
            state_path = state_dir / "state.json"
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                with patch.dict("os.environ", {"JULES_API_KEY": ""}, clear=False):
                    with patch.object(djc, "create_session", return_value={"name": "sessions/cli"}) as mock_create:
                        rc = djc.main([])
            self.assertEqual(rc, 0)
            self.assertEqual(mock_create.call_count, 1)

    def test_api_key_never_printed(self):
        secret = "sk-super-secret-value-12345"
        queue = {"tasks": [make_task(id="key-task", content_item_id="key-task")]}
        with _tmp_file(json.dumps(queue)) as queue_path, _tmp_dir() as state_dir:
            state_path = state_dir / "state.json"
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                with patch.dict("os.environ", {"JULES_API_KEY": secret}, clear=False):
                    with patch.object(djc, "create_session", return_value={"name": "sessions/abc123"}):
                        out = io.StringIO()
                        with redirect_stdout(out):
                            rc = djc.main([])
            self.assertEqual(rc, 0)
            self.assertNotIn(secret, out.getvalue())
            self.assertNotIn(secret, state_path.read_text())


class MainSubmissionTests(unittest.TestCase):
    def test_successful_submission_recorded_and_excluded_next_run(self):
        queue = {"tasks": [make_task(id="sub-1", content_item_id="sub-1")]}
        with _tmp_file(json.dumps(queue)) as queue_path, _tmp_dir() as state_dir:
            state_path = state_dir / "state.json"
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                with patch.dict("os.environ", {"JULES_API_KEY": "test-key"}, clear=False):
                    with patch.object(djc, "create_session", return_value={"name": "sessions/xyz"}) as mock_create:
                        rc1 = djc.main([])
                        self.assertEqual(rc1, 0)
                        self.assertEqual(mock_create.call_count, 1)

                        rc2 = djc.main([])
                        self.assertEqual(rc2, 0)
                        # Same fingerprint already submitted -> no second network call.
                        self.assertEqual(mock_create.call_count, 1)

            state = json.loads(state_path.read_text())
            records = state["launch_records"]["sub-1"]["records"]
            self.assertEqual(len(records), 1)
            self.assertEqual(records[0]["status"], "submitted")
            self.assertEqual(records[0]["session_id"], "sessions/xyz")
            self.assertEqual(records[0]["output_path"], "data/research/content-ops/operator-example.json")

    def test_failed_submission_recorded_and_retryable(self):
        queue = {"tasks": [make_task(id="fail-1", content_item_id="fail-1")]}
        with _tmp_file(json.dumps(queue)) as queue_path, _tmp_dir() as state_dir:
            state_path = state_dir / "state.json"
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                with patch.dict("os.environ", {"JULES_API_KEY": "test-key"}, clear=False):
                    with patch.object(
                        djc, "create_session", side_effect=djc.JulesApiError("Jules API returned HTTP 500: boom")
                    ):
                        out = io.StringIO()
                        with redirect_stdout(out):
                            rc = djc.main([])
                        self.assertEqual(rc, 0)
                        self.assertIn("FAILED", out.getvalue())

            state = json.loads(state_path.read_text())
            records = state["launch_records"]["fail-1"]["records"]
            self.assertEqual(len(records), 1)
            self.assertEqual(records[0]["status"], "failed")

            # A failed attempt must remain eligible for retry on the next run.
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                with patch.dict("os.environ", {"JULES_API_KEY": "test-key"}, clear=False):
                    with patch.object(djc, "create_session", return_value={"name": "sessions/retry-ok"}) as mock_create:
                        rc2 = djc.main([])
                        self.assertEqual(rc2, 0)
                        self.assertEqual(mock_create.call_count, 1)

            state2 = json.loads(state_path.read_text())
            records2 = state2["launch_records"]["fail-1"]["records"]
            self.assertEqual(len(records2), 2)
            self.assertEqual(records2[1]["status"], "submitted")
            self.assertEqual(records2[1]["attempt"], 2)

    def test_historical_records_survive_even_when_task_leaves_queue(self):
        task = make_task(id="leaving-1", content_item_id="leaving-1")
        queue_with_task = {"tasks": [task]}
        with _tmp_file(json.dumps(queue_with_task)) as queue_path, _tmp_dir() as state_dir:
            state_path = state_dir / "state.json"
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                with patch.dict("os.environ", {"JULES_API_KEY": "test-key"}, clear=False):
                    with patch.object(djc, "create_session", return_value={"name": "sessions/leaving"}):
                        djc.main([])

            queue_path.write_text(json.dumps({"tasks": []}))
            with patch.object(djc, "QUEUE_PATH", queue_path), patch.object(djc, "STATE_PATH", state_path):
                with patch.dict("os.environ", {"JULES_API_KEY": "test-key"}, clear=False):
                    djc.main([])

            state = json.loads(state_path.read_text())
            self.assertIn("leaving-1", state["launch_records"])
            self.assertEqual(len(state["launch_records"]["leaving-1"]["records"]), 1)


@contextlib.contextmanager
def _tmp_file(content: str):
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "queue.json"
        path.write_text(content, encoding="utf-8")
        yield path


@contextlib.contextmanager
def _tmp_dir():
    with tempfile.TemporaryDirectory() as d:
        yield Path(d)


if __name__ == "__main__":
    unittest.main()
