#!/usr/bin/env python3
"""
SecurityScorecard API Swagger Splitter
Converts large 2MB Swagger 2.0 file into AI-legible chunks
"""

import json
import os
import re
import pathlib
from typing import Dict, List, Any
from urllib.parse import quote

# Configuration
SRC = "../api-docs.json"  # Source Swagger file
OUT = pathlib.Path("../docs/api")
SCHEMAS_OUT = pathlib.Path("../docs/schemas")
BASE_URL = "https://platform.securityscorecard.io"

# Create output directories
OUT.mkdir(parents=True, exist_ok=True)
SCHEMAS_OUT.mkdir(parents=True, exist_ok=True)

def slug(s: str) -> str:
    """Convert string to URL-safe slug"""
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def path_slug(p: str) -> str:
    """Convert API path to filename-safe slug"""
    return slug(p.replace('{', '_').replace('}', '_').strip('/')) or 'root'

def extract_security_info(operation: Dict[str, Any]) -> List[str]:
    """Extract security/auth requirements from operation"""
    security = operation.get('security', [])
    auth_types = []
    for sec in security:
        auth_types.extend(sec.keys())
    return auth_types

def categorize_endpoint(path: str, method: str, operation: Dict[str, Any]) -> str:
    """Categorize endpoint based on path and operation"""
    path_lower = path.lower()
    
    # SecurityScorecard-specific categorization
    if '/companies/' in path_lower or '/scorecard' in path_lower:
        if '/issues/' in path_lower:
            return 'company-issues'
        elif '/factors/' in path_lower:
            return 'company-factors'
        elif '/history/' in path_lower:
            return 'company-history'
        else:
            return 'companies'
    elif '/footprint/' in path_lower:
        return 'asset-footprint'
    elif '/portfolios/' in path_lower:
        return 'portfolio-management'
    elif '/sentinel/' in path_lower:
        return 'threat-intelligence'
    elif '/managed-services/' in path_lower:
        return 'managed-services'
    elif '/plans/' in path_lower:
        return 'improvement-plans'
    elif '/reports/' in path_lower:
        return 'reports-analytics'
    elif '/users/' in path_lower or '/auth' in path_lower:
        return 'authentication-users'
    elif '/vendor-detection/' in path_lower:
        return 'vendor-analysis'
    elif '/aegis/' in path_lower:
        return 'evidence-management'
    elif '/atlas/' in path_lower:
        return 'compliance-standards'
    else:
        tags = operation.get("tags", [])
        if tags:
            return slug(tags[0])
        return 'other'

def main():
    print(f"Loading Swagger spec from {SRC}...")
    
    try:
        with open(SRC, 'r', encoding='utf-8') as f:
            spec = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find {SRC}")
        return
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {SRC}: {e}")
        return

    print(f"Swagger version: {spec.get('swagger', 'unknown')}")
    print(f"API title: {spec.get('info', {}).get('title', 'unknown')}")
    print(f"API version: {spec.get('info', {}).get('version', 'unknown')}")

    # Process schemas/definitions (Swagger 2.0 uses "definitions")
    definitions = spec.get("definitions", {})
    print(f"Processing {len(definitions)} schema definitions...")
    
    for name, schema in definitions.items():
        schema_file = SCHEMAS_OUT / f"{name}.md"
        with open(schema_file, "w", encoding="utf-8") as f:
            f.write(f"# {name} Schema\n\n")
            
            # Add description if available
            if schema.get("description"):
                f.write(f"{schema['description']}\n\n")
            
            # Add properties table if it's an object
            if schema.get("type") == "object" and schema.get("properties"):
                f.write("## Properties\n\n")
                f.write("| Property | Type | Required | Description |\n")
                f.write("|----------|------|----------|-------------|\n")
                
                required_props = schema.get("required", [])
                for prop_name, prop_def in schema["properties"].items():
                    prop_type = prop_def.get("type", "unknown")
                    is_required = "Yes" if prop_name in required_props else "No"
                    description = prop_def.get("description", "")
                    f.write(f"| {prop_name} | {prop_type} | {is_required} | {description} |\n")
                f.write("\n")
            
            # Full schema definition
            f.write("## Full Schema\n\n")
            f.write("```json\n" + json.dumps(schema, indent=2) + "\n```\n")

    # Process endpoints
    index = []
    paths = spec.get("paths", {})
    
    print(f"Processing {len(paths)} API paths...")
    
    endpoint_count = 0
    for path, methods in paths.items():
        for method, operation in methods.items():
            if method.lower() not in ["get", "post", "put", "delete", "patch", "head", "options"]:
                continue
            
            endpoint_count += 1
            
            # Categorize endpoint
            category = categorize_endpoint(path, method, operation)
            
            # Create category directory
            dest_dir = OUT / category
            dest_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate operation ID
            op_id = operation.get("operationId") or f"{method}_{path_slug(path)}"
            
            # Create filename
            filename = f"{method.upper()}-{path_slug(path)}.md"
            
            # Extract parameters
            params = operation.get("parameters", [])
            req_headers = [p for p in params if p.get("in") == "header"]
            path_params = [p for p in params if p.get("in") == "path"]
            query_params = [p for p in params if p.get("in") == "query"]
            body_params = [p for p in params if p.get("in") == "body"]
            
            # Generate cURL example
            curl_path = path
            for p in path_params:
                curl_path = curl_path.replace("{" + p["name"] + "}", f"<{p['name']}>")
            
            curl_parts = [
                f"curl -X {method.upper()}",
                f"  '{BASE_URL}{curl_path}'"
            ]
            
            # Add common headers
            curl_parts.append("  -H 'Authorization: Bearer <your-api-token>'")
            
            for h in req_headers:
                if h["name"].lower() != "authorization":
                    curl_parts.append(f"  -H '{h['name']}: <{h.get('description', 'value')}>'")
            
            if body_params:
                curl_parts.append("  -H 'Content-Type: application/json'")
                curl_parts.append("  -d '<JSON-body>'")
            
            curl_cmd = " \\\n".join(curl_parts)
            
            # Create endpoint documentation
            content = f"# {operation.get('summary', op_id)}\n\n"
            
            # Basic info
            content += f"- **Method:** `{method.upper()}`\n"
            content += f"- **Path:** `{path}`\n"
            content += f"- **Category:** `{category}`\n"
            content += f"- **Operation ID:** `{op_id}`\n"
            
            # Add security info
            auth_types = extract_security_info(operation)
            if auth_types:
                content += f"- **Authentication:** {', '.join(auth_types)}\n"
            
            content += "\n"
            
            # Description
            if operation.get("description"):
                content += f"## Description\n\n{operation['description']}\n\n"
            
            # Path parameters
            if path_params:
                content += "## Path Parameters\n\n"
                for p in path_params:
                    required = "**Required**" if p.get("required") else "Optional"
                    content += f"- `{p['name']}` ({required}) - {p.get('description', 'No description')}\n"
                content += "\n"
            
            # Query parameters
            if query_params:
                content += "## Query Parameters\n\n"
                for p in query_params:
                    required = "**Required**" if p.get("required") else "Optional"
                    param_type = p.get("type", "string")
                    content += f"- `{p['name']}` ({param_type}, {required}) - {p.get('description', 'No description')}\n"
                content += "\n"
            
            # Request body
            if body_params:
                content += "## Request Body\n\n"
                for p in body_params:
                    if p.get("schema"):
                        content += "```json\n" + json.dumps(p["schema"], indent=2) + "\n```\n\n"
            
            # Responses
            if "responses" in operation:
                content += "## Responses\n\n"
                for code, response in operation["responses"].items():
                    content += f"### {code}\n"
                    if response.get("description"):
                        content += f"{response['description']}\n"
                    if response.get("schema"):
                        content += "```json\n" + json.dumps(response["schema"], indent=2) + "\n```\n"
                    content += "\n"
            
            # cURL example
            content += "## Example Request\n\n"
            content += "```bash\n" + curl_cmd + "\n```\n"
            
            # Write endpoint file
            endpoint_file = dest_dir / filename
            with open(endpoint_file, "w", encoding="utf-8") as f:
                f.write(content)
            
            # Add to index
            index.append({
                "category": category,
                "method": method.upper(),
                "path": path,
                "operationId": op_id,
                "summary": operation.get("summary", ""),
                "description": operation.get("description", ""),
                "hasBody": bool(body_params),
                "requiredPathParams": [p["name"] for p in path_params if p.get("required")],
                "optionalPathParams": [p["name"] for p in path_params if not p.get("required")],
                "queryParams": [p["name"] for p in query_params],
                "authRequired": bool(auth_types),
                "authTypes": auth_types,
                "file": f"docs/api/{category}/{filename}",
                "tags": operation.get("tags", [])
            })
    
    # Write searchable index
    index_file = OUT / "index.jsonl"
    with open(index_file, "w", encoding="utf-8") as f:
        for row in index:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    
    # Write summary statistics
    summary_file = OUT / "README.md"
    with open(summary_file, "w", encoding="utf-8") as f:
        f.write("# SecurityScorecard API Documentation\n\n")
        f.write(f"This directory contains {endpoint_count} API endpoints split into categories.\n\n")
        
        # Count by category
        category_counts = {}
        method_counts = {}
        for item in index:
            category_counts[item["category"]] = category_counts.get(item["category"], 0) + 1
            method_counts[item["method"]] = method_counts.get(item["method"], 0) + 1
        
        f.write("## Categories\n\n")
        for category, count in sorted(category_counts.items()):
            f.write(f"- **{category}**: {count} endpoints\n")
        
        f.write("\n## HTTP Methods\n\n")
        for method, count in sorted(method_counts.items()):
            f.write(f"- **{method}**: {count} endpoints\n")
        
        f.write(f"\n## Usage\n\n")
        f.write(f"- Browse endpoints by category in the subdirectories\n")
        f.write(f"- Search endpoints using `index.jsonl`\n")
        f.write(f"- View schema definitions in `../schemas/`\n")
    
    print(f"\n✅ Processing complete!")
    print(f"📊 Statistics:")
    print(f"   - Endpoints: {endpoint_count}")
    print(f"   - Categories: {len(category_counts)}")
    print(f"   - Schemas: {len(definitions)}")
    print(f"   - Files created: {endpoint_count + len(definitions) + 2}")
    print(f"\n📁 Output locations:")
    print(f"   - API docs: {OUT}")
    print(f"   - Schemas: {SCHEMAS_OUT}")
    print(f"   - Index: {OUT}/index.jsonl")
    print(f"   - Summary: {OUT}/README.md")

if __name__ == "__main__":
    main()