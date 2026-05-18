#!/usr/bin/env python3
"""
Simple reusable client for the Jules API.
Uses the JULES_API_KEY from environment.
"""

import os
import requests
import json
from typing import Optional

JULES_API_KEY = os.getenv("JULES_API_KEY")
BASE_URL = "https://jules.googleapis.com/v1"  # Adjust if needed

def create_session(prompt: str, repo: str = "mk-162/Adventure-Site") -> dict:
    """Create a new Jules session with a prompt."""
    if not JULES_API_KEY:
        raise ValueError("JULES_API_KEY not found in environment")

    headers = {
        "Authorization": f"Bearer {JULES_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "prompt": prompt,
        "repo": repo
    }

    response = requests.post(f"{BASE_URL}/sessions", json=payload, headers=headers)
    response.raise_for_status()
    return response.json()


def get_session(session_id: str) -> dict:
    """Get status and output of a Jules session."""
    if not JULES_API_KEY:
        raise ValueError("JULES_API_KEY not found in environment")

    headers = {
        "Authorization": f"Bearer {JULES_API_KEY}"
    }

    response = requests.get(f"{BASE_URL}/sessions/{session_id}", headers=headers)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    print("Jules API client ready. Use create_session() or get_session().")
