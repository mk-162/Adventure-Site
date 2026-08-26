#!/usr/bin/env python3
"""Tests for the Jules completion gate. No Jules/network calls are made."""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import jules_completion as jc  # noqa: E402


class PatchGateTests(unittest.TestCase):
    def test_accepts_single_expected_research_json_file(self):
        patch = """diff --git a/data/research/content-ops/operator-example.json b/data/research/content-ops/operator-example.json
new file mode 100644
--- /dev/null
+++ b/data/research/content-ops/operator-example.json
@@ -0,0 +1 @@
+{\"sources\":[\"https://example.org\"]}
"""
        self.assertEqual(jc.validate_research_patch(patch, "data/research/content-ops/operator-example.json"), [])

    def test_rejects_application_code_or_extra_files(self):
        patch = """diff --git a/data/research/content-ops/operator-example.json b/data/research/content-ops/operator-example.json
new file mode 100644
--- /dev/null
+++ b/data/research/content-ops/operator-example.json
@@ -0,0 +1 @@
+{}
diff --git a/src/app/page.tsx b/src/app/page.tsx
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -1 +1 @@
-old
+new
"""
        errors = jc.validate_research_patch(patch, "data/research/content-ops/operator-example.json")
        self.assertTrue(any("exactly one file" in error for error in errors))

    def test_rejects_wrong_output_path(self):
        patch = """diff --git a/data/research/content-ops/other.json b/data/research/content-ops/other.json
new file mode 100644
--- /dev/null
+++ b/data/research/content-ops/other.json
@@ -0,0 +1 @@
+{}
"""
        errors = jc.validate_research_patch(patch, "data/research/content-ops/operator-example.json")
        self.assertTrue(any("expected output path" in error for error in errors))

    def test_session_is_ready_only_when_output_is_valid(self):
        record = {"status": "submitted", "session_id": "123", "queue_task_id": "q"}
        self.assertEqual(jc.completion_status(record, "Completed", []), "ready_to_apply")
        self.assertEqual(jc.completion_status(record, "Completed", ["wrong file"]), "blocked")
        self.assertEqual(jc.completion_status(record, "Awaiting User Feedback", []), "awaiting_feedback")


if __name__ == "__main__":
    unittest.main()
