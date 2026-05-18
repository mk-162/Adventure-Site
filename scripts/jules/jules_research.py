#!/usr/bin/env python3
"""
Jules Research Manager
A more robust wrapper for running research tasks with Jules CLI.
"""

import subprocess
import sys
import os
from pathlib import Path

def run_jules_task(prompt: str, repo: str = "mk-162/Adventure-Site", background: bool = False):
    """
    Start a new Jules research session.
    """
    cmd = ["jules", "new", "--repo", repo, prompt]

    print(f"🚀 Starting Jules research on {repo}...")
    print(f"Prompt preview: {prompt[:100]}...")

    if background:
        # Run in background (non-blocking)
        subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("Jules task started in background.")
    else:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Error running Jules:")
            print(result.stderr)
            return None
        print(result.stdout)
        return result.stdout


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python jules_research.py \"Your research prompt\"")
        sys.exit(1)

    prompt = sys.argv[1]
    run_jules_task(prompt)