#!/usr/bin/env python3
"""Validate API references by merging sources and reporting issues."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
BUILD_DOCS = ROOT / "build_docs"
API_REFERENCE_FILE = BUILD_DOCS / "api_reference.json"
CLEAN_FILE = BUILD_DOCS / "securityscorecard_api_clean.json"

Endpoint = Dict[str, object]


def load_endpoints() -> tuple[List[Endpoint], List[Endpoint]]:
    """Load endpoints from both JSON sources."""
    api_reference = json.loads(API_REFERENCE_FILE.read_text())
    clean = json.loads(CLEAN_FILE.read_text()).get("endpoints", [])
    return api_reference, clean


def merge_endpoint(existing: Endpoint, new: Endpoint, conflicts: List[str]) -> None:
    """Merge ``new`` into ``existing`` recording any conflicts."""
    if new.get("description"):
        if not existing.get("description"):
            existing["description"] = new["description"]
        elif existing["description"] != new["description"]:
            conflicts.append(
                f"description mismatch for {existing['method']} {existing['url']}"
            )

    existing_params = existing.setdefault("parameters", {})
    for group, params in (new.get("parameters") or {}).items():
        group_list = existing_params.setdefault(group, [])
        index = {p.get("name"): p for p in group_list if p.get("name")}
        for param in params:
            name = param.get("name")
            if name in index and index[name] != param:
                conflicts.append(
                    f"parameter conflict for {existing['method']} {existing['url']} param '{name}'"
                )
            elif name not in index:
                group_list.append(param)

    new_responses = new.get("responses", [])
    if new_responses:
        existing_responses = existing.setdefault("responses", [])
        index = {r.get("status"): r for r in existing_responses if r.get("status")}
        for resp in new_responses:
            status = resp.get("status")
            if status in index and index[status] != resp:
                conflicts.append(
                    f"response conflict for {existing['method']} {existing['url']} status {status}"
                )
            elif status not in index:
                existing_responses.append(resp)


def main() -> None:
    api_reference, clean = load_endpoints()

    merged: Dict[Tuple[str, str], Endpoint] = {}
    conflicts: List[str] = []
    duplicates = 0

    def add(ep: Endpoint) -> None:
        nonlocal duplicates
        method = ep.get("method")
        url = ep.get("url")
        if not method or not url:
            return
        key = (method.upper(), url)
        if key in merged:
            duplicates += 1
            merge_endpoint(merged[key], ep, conflicts)
        else:
            merged[key] = ep

    for ep in clean:
        add(ep)
    for ep in api_reference:
        add(ep)

    missing_descriptions: List[str] = []
    missing_parameters: List[str] = []
    missing_responses: List[str] = []

    for ep in merged.values():
        if not ep.get("description"):
            missing_descriptions.append(f"{ep['method']} {ep['url']}")
        params = ep.get("parameters") or {}
        if not any(params.get(k) for k in params.keys()):
            missing_parameters.append(f"{ep['method']} {ep['url']}")
        if not ep.get("responses"):
            missing_responses.append(f"{ep['method']} {ep['url']}")

    report = {
        "duplicates_merged": duplicates,
        "conflicts": conflicts,
        "missing_descriptions": missing_descriptions,
        "missing_parameters": missing_parameters,
        "missing_responses": missing_responses,
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
