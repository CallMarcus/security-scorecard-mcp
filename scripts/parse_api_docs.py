#!/usr/bin/env python3
"""Parse API documentation markdown files into a consolidated JSON reference."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API_DIR = ROOT / "build_docs" / "API.MDs"
OUTPUT_FILE = ROOT / "build_docs" / "api_reference.json"


TYPE_PATTERN = re.compile(r"^(string|number|integer|boolean|array|object|date|datetime)$", re.I)
METHOD_PATTERN = re.compile(r"^(get|post|put|patch|delete|head|options)\s+(https?://\S+)", re.I)
PARAM_GROUP_PATTERN = re.compile(r"^(Path|Query|Body|Form|URL|Header)s?\s+Params$", re.I)


def parse_param(lines: list[str], start: int) -> tuple[dict, int]:
    param = {"name": lines[start].strip(), "required": False}
    i = start + 1
    while i < len(lines):
        token = lines[i].strip()
        if token == "":
            i += 1
            continue
        if token in ("Response", "Responses") or PARAM_GROUP_PATTERN.match(token):
            break
        lowered = token.lower()
        if lowered == "required":
            param["required"] = True
            i += 1
            continue
        if TYPE_PATTERN.match(lowered):
            param["type"] = lowered
            i += 1
            continue
        if (
            re.match(r"^[A-Za-z0-9_\-\[\]\{\}]+$", token)
            and lines[i - 1].strip() == ""
            and (len(param) > 1)
        ):
            break
        if re.match(r"^[\w\-/]+$", token) and lowered not in ("optional",):
            param.setdefault("enum", []).extend(re.split(r"[\s,|/]+", token))
        else:
            desc = param.get("description", "")
            param["description"] = (desc + " " + token).strip()
        i += 1
    return param, i


def parse_markdown(path: Path) -> dict:
    lines = [line.rstrip() for line in path.read_text(encoding="utf-8").splitlines()]

    method = url = description = None
    def is_decoration(text: str) -> bool:
        t = text.strip()
        return bool(t) and all(ch in "=-_" for ch in t)

    for idx, line in enumerate(lines):
        m = METHOD_PATTERN.match(line)
        if m:
            method = m.group(1).upper()
            url = m.group(2)
            for j in range(idx - 1, -1, -1):
                if lines[j].strip() and not is_decoration(lines[j]):
                    description = lines[j].strip()
                    break
            break

    params: dict[str, list[dict]] = {}
    responses: list[dict] = []
    i = 0
    current_group: str | None = None
    while i < len(lines):
        line = lines[i].strip()
        group_match = PARAM_GROUP_PATTERN.match(line)
        if group_match:
            current_group = group_match.group(1).lower()
            params[current_group] = []
            i += 1
            continue
        if line in ("Response", "Responses"):
            current_group = None
            i += 1
            while i < len(lines):
                l = lines[i].strip()
                if re.match(r"^\d{3}$", l):
                    status = l
                    desc = None
                    if i + 1 < len(lines) and lines[i + 1].strip():
                        desc = lines[i + 1].strip()
                        i += 1
                    responses.append({"status": status, "description": desc})
                elif l.lower() == "response body":
                    snippet: list[str] = []
                    i += 1
                    while i < len(lines) and lines[i].strip():
                        snippet.append(lines[i])
                        i += 1
                    if responses:
                        responses[-1]["body"] = "\n".join(snippet).strip()
                    else:
                        responses.append({"body": "\n".join(snippet).strip()})
                i += 1
            break
        if current_group and line:
            if re.match(r"^[A-Za-z0-9_\-\[\]\{\}]+$", line) and line.lower() not in ("required",):
                param, i = parse_param(lines, i)
                params[current_group].append(param)
                continue
        i += 1

    endpoint = {"file": path.name, "method": method, "url": url, "description": description}
    if params:
        endpoint["parameters"] = params
    if responses:
        endpoint["responses"] = responses
    return endpoint


def main() -> None:
    endpoints = []
    for md_file in sorted(API_DIR.glob("*.md")):
        endpoints.append(parse_markdown(md_file))
    OUTPUT_FILE.write_text(json.dumps(endpoints, indent=2))
    print(f"Written {len(endpoints)} endpoints to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
