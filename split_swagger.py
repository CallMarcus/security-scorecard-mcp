#!/usr/bin/env python3
"""
SecurityScorecard API Swagger 2.0 Splitter
Splits the massive 2MB API spec into manageable chunks for AI analysis.

Usage: python split_swagger.py
"""

import json
import os
import re
import shutil
import pathlib
from urllib.parse import quote

# Configuration
SRC = "api-docs.json"  # 2MB Swagger 2.0 file
OUT = pathlib.Path("docs/api")
SCHEMAS_OUT = pathlib.Path("docs/schemas")

# Files at the OUT root that this script does NOT own and must never delete.
# index-embeddings.json is produced by the separate `api:embed` step and acts
# as an incremental cache — wiping it would force a full (slow) recompute.
PRESERVE = {"index-embeddings.json"}

def clean_outputs():
    """Remove everything this script generates so routes/schemas dropped from
    the spec don't linger as stale orphans, while preserving files we don't own
    (e.g. index-embeddings.json). Generators that only ever add files cause the
    docs tree to drift; cleaning first keeps it an exact mirror of the spec."""
    if OUT.exists():
        for child in OUT.iterdir():
            if child.name in PRESERVE:
                continue
            if child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
    if SCHEMAS_OUT.exists():
        shutil.rmtree(SCHEMAS_OUT)

def slug(s):
    """Convert string to URL-safe slug"""
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def path_slug(p): 
    """Convert API path to filename-safe slug"""
    return slug(p.replace('{', '_').replace('}', '_').strip('/')) or 'root'

def main():
    print(f"Reading {SRC}...")
    try:
        with open(SRC, "r", encoding="utf-8") as f:
            spec = json.load(f)
    except FileNotFoundError:
        print(f"Error: {SRC} not found!")
        return 1
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return 1

    print(f"Swagger version: {spec.get('swagger', 'unknown')}")
    print(f"API title: {spec.get('info', {}).get('title', 'Unknown')}")
    print(f"API version: {spec.get('info', {}).get('version', 'unknown')}")

    # Only clean once we know the spec is valid, so a broken/missing source
    # never wipes the existing docs. Then (re)create the output directories.
    clean_outputs()
    OUT.mkdir(parents=True, exist_ok=True)
    SCHEMAS_OUT.mkdir(parents=True, exist_ok=True)

    # Extract base URL info
    base_url = ""
    if spec.get("host"):
        scheme = spec.get('schemes', ['https'])[0]
        base_path = spec.get('basePath', '')
        base_url = f"{scheme}://{spec['host']}{base_path}"

    # Process schemas/definitions (Swagger 2.0 uses "definitions")
    definitions = spec.get("definitions", {})
    print(f"Processing {len(definitions)} schema definitions...")
    
    for name, schema in definitions.items():
        schema_file = SCHEMAS_OUT / f"{name}.md"
        with open(schema_file, "w", encoding="utf-8") as f:
            f.write(f"# {name}\n\n")
            f.write("```json\n" + json.dumps(schema, indent=2) + "\n```\n")

    # Process API endpoints
    index = []
    paths = spec.get("paths", {})
    print(f"Processing {len(paths)} API paths...")

    for path, methods in paths.items():
        for method, op in methods.items():
            method_lower = method.lower()
            if method_lower not in ["get", "post", "put", "delete", "patch", "head", "options"]:
                continue

            # Extract operation metadata
            tags = op.get("tags", ["untagged"])
            tag = slug(tags[0]) if tags else "untagged"
            dest_dir = OUT / tag
            dest_dir.mkdir(parents=True, exist_ok=True)

            op_id = op.get("operationId") or f"{method}_{path_slug(path)}"
            filename = f"{method.upper()}-{path_slug(path)}.md"
            
            # Parse parameters
            params = op.get("parameters", [])
            req_headers = [p for p in params if p.get("in") == "header"]
            path_params = [p for p in params if p.get("in") == "path"]
            query_params = [p for p in params if p.get("in") == "query"]
            body_params = [p for p in params if p.get("in") == "body"]
            form_params = [p for p in params if p.get("in") == "formData"]

            # Build cURL example
            curl_path = path
            for p in path_params:
                curl_path = curl_path.replace("{" + p["name"] + "}", f"<{p['name']}>")

            curl = [
                "curl -X " + method.upper(),
                f"  '{base_url}{curl_path}'" if base_url else f"  '<BASE_URL>{curl_path}'"
            ]
            
            # Add common headers
            curl.append("  -H 'Authorization: Token <YOUR_API_TOKEN>'")
            
            for h in req_headers:
                curl.append(f"  -H '{h['name']}: <value>'")
            
            if body_params or form_params:
                curl.append("  -H 'Content-Type: application/json'")
                if body_params:
                    curl.append("  -d '<JSON body>'")

            curl_cmd = " \\\n".join(curl)

            # Build markdown content
            content = f"# {op.get('summary', op_id)}\n\n"
            content += f"- **Method:** `{method.upper()}`\n"
            content += f"- **Path:** `{path}`\n"
            content += f"- **Tag:** `{tags[0] if tags else 'untagged'}`\n"
            content += f"- **operationId:** `{op_id}`\n\n"
            
            if op.get("description"): 
                content += f"## Description\n{op['description']}\n\n"

            # Parameters documentation
            if path_params:
                content += "## Path Parameters\n"
                for p in path_params:
                    required = "**required**" if p.get("required") else "optional"
                    desc = p.get("description", "")
                    content += f"- `{p['name']}` ({required}) — {desc}\n"
                content += "\n"

            if query_params:
                content += "## Query Parameters\n"
                for p in query_params:
                    required = "**required**" if p.get("required") else "optional"
                    desc = p.get("description", "")
                    param_type = p.get("type", "")
                    content += f"- `{p['name']}` ({required}, {param_type}) — {desc}\n"
                content += "\n"

            if req_headers:
                content += "## Headers\n"
                for p in req_headers:
                    required = "**required**" if p.get("required") else "optional"
                    desc = p.get("description", "")
                    content += f"- `{p['name']}` ({required}) — {desc}\n"
                content += "\n"

            if body_params:
                content += "## Request Body\n"
                for p in body_params:
                    if p.get("schema"):
                        content += "```json\n" + json.dumps(p["schema"], indent=2) + "\n```\n\n"

            if form_params:
                content += "## Form Parameters\n"
                for p in form_params:
                    required = "**required**" if p.get("required") else "optional"
                    desc = p.get("description", "")
                    param_type = p.get("type", "")
                    content += f"- `{p['name']}` ({required}, {param_type}) — {desc}\n"
                content += "\n"

            # Responses
            if "responses" in op:
                content += "## Responses\n"
                for status_code, response in op["responses"].items():
                    desc = response.get("description", "")
                    content += f"### {status_code}\n{desc}\n"
                    if response.get("schema"):
                        content += "```json\n" + json.dumps(response["schema"], indent=2) + "\n```\n"
                content += "\n"

            # cURL example
            content += "## Example cURL Request\n"
            content += "```bash\n" + curl_cmd + "\n```\n\n"

            # Security info
            if op.get("security"):
                content += "## Security\n"
                content += "```json\n" + json.dumps(op["security"], indent=2) + "\n```\n"

            # Write the file
            (dest_dir / filename).write_text(content, encoding="utf-8")

            # Add to index
            index.append({
                "tag": tags[0] if tags else "untagged",
                "method": method.upper(),
                "path": path,
                "operationId": op_id,
                "summary": op.get("summary", ""),
                "description": op.get("description", "")[:200] + "..." if len(op.get("description", "")) > 200 else op.get("description", ""),
                "hasBody": bool(body_params or form_params),
                "requiredPathParams": [p["name"] for p in path_params if p.get("required")],
                "queryParams": [p["name"] for p in query_params],
                "security": op.get("security", []),
                "file": f"docs/api/{tag}/{filename}"
            })

    # Write searchable index
    index_file = OUT / "index.jsonl"
    with open(index_file, "w", encoding="utf-8") as f:
        for row in index:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    # Create README with usage instructions
    readme_content = """# SecurityScorecard API Documentation

This directory contains the split SecurityScorecard API documentation, processed from the original 2MB Swagger 2.0 file.

## Structure

- `index.jsonl` - Searchable index of all API endpoints
- `{tag}/` - Directories organized by API tag/category
- `../schemas/` - Individual schema definitions

## Usage for AI/Claude Code

To find specific endpoints:

1. Search `index.jsonl` for relevant endpoints:
   ```bash
   grep -i "portfolio" docs/api/index.jsonl
   ```

2. Open the referenced markdown file for full details:
   ```bash
   cat docs/api/portfolios/GET-portfolios.md
   ```

## Example Queries

- Find all endpoints related to companies: `grep -i "company" docs/api/index.jsonl`
- Find all POST endpoints: `grep '"method":"POST"' docs/api/index.jsonl`
- Find endpoints with specific tags: `grep '"tag":"scores"' docs/api/index.jsonl`

## API Base URL

Most endpoints use: `https://platform.securityscorecard.io/`

## Authentication

All requests require an API token:
```bash
curl -H "Authorization: Token YOUR_API_TOKEN" ...
```
"""

    readme_file = OUT / "README.md"
    readme_file.write_text(readme_content, encoding="utf-8")

    print(f"\n✅ Processing complete!")
    print(f"📊 Endpoints: {len(index)}")
    print(f"🏷️  Schemas: {len(definitions)}")
    print(f"📁 Output: {OUT.absolute()}")
    print(f"📋 Index: {index_file.absolute()}")
    
    # Show tag distribution
    tag_counts = {}
    for item in index:
        tag = item["tag"]
        tag_counts[tag] = tag_counts.get(tag, 0) + 1
    
    print(f"\n📈 Endpoints by tag:")
    for tag, count in sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"   {tag}: {count}")

    return 0

if __name__ == "__main__":
    exit(main())