#!/usr/bin/env python3
"""Enhanced API documentation parser with improved data quality and validation."""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Union, Any
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
API_DIR = ROOT / "build_docs" / "API.MDs"
OUTPUT_FILE = ROOT / "build_docs" / "api_reference_enhanced.json"

class APIEndpoint:
    """Represents a cleaned API endpoint with validation."""
    
    def __init__(self):
        self.filename: str = ""
        self.method: str = ""
        self.url: str = ""
        self.title: str = ""
        self.description: str = ""
        self.parameters: Dict[str, List[Dict[str, Any]]] = {
            "path": [],
            "query": [],
            "body": [],
            "header": []
        }
        self.responses: List[Dict[str, Any]] = []
        self.tags: List[str] = []

    def normalize_url(self) -> None:
        """Fix common URL formatting issues."""
        if not self.url:
            return
            
        # Fix escaped underscores
        self.url = self.url.replace('\\_', '_')
        
        # Fix double slashes (except after protocol)
        self.url = re.sub(r'(?<!:)//+', '/', self.url)
        
        # Ensure proper parameter format {param} instead of {param\_name}
        self.url = re.sub(r'\{([^}]+)\\_([^}]*)\}', r'{\1_\2}', self.url)
        
        # URL decode any encoded characters
        try:
            parsed = urlparse(self.url)
            self.url = f"{parsed.scheme}://{parsed.netloc}{unquote(parsed.path)}"
            if parsed.query:
                self.url += f"?{parsed.query}"
        except:
            pass  # Keep original if parsing fails

    def extract_path_parameters(self) -> List[Dict[str, Any]]:
        """Extract path parameters from URL and ensure they're properly documented."""
        if not self.url:
            return []
            
        # Find all {parameter} patterns in URL
        path_params = re.findall(r'\{([^}]+)\}', self.url)
        documented_params = {p['name']: p for p in self.parameters.get('path', [])}
        
        result = []
        for param_name in path_params:
            if param_name in documented_params:
                result.append(documented_params[param_name])
            else:
                # Create missing path parameter
                result.append({
                    'name': param_name,
                    'type': 'string',
                    'required': True,
                    'description': f'Path parameter: {param_name}',
                    'in': 'path'
                })
        
        return result

    def categorize_by_url(self) -> List[str]:
        """Generate tags based on URL structure."""
        if not self.url:
            return []
            
        tags = []
        path = urlparse(self.url).path.lower()
        
        # Core entity types
        if '/companies/' in path:
            tags.append('companies')
        if '/portfolios/' in path:
            tags.append('portfolios')
        if '/factors' in path:
            tags.append('factors')
        if '/issues/' in path:
            tags.append('issues')
        if '/assets/' in path:
            tags.append('assets')
        if '/reports/' in path:
            tags.append('reports')
        if '/asi/' in path:
            tags.append('asi')
        if '/max/' in path:
            tags.append('max')
            
        # Data types
        if any(word in path for word in ['breach', 'breaches']):
            tags.append('breaches')
        if 'historical' in path or '/history/' in path:
            tags.append('historical')
        if '/active' in path:
            tags.append('active')
        if any(word in path for word in ['cve', 'vulnerability', 'vuln']):
            tags.append('vulnerabilities')
        if any(word in path for word in ['malware', 'infection', 'ransomware']):
            tags.append('malware')
            
        return tags[:5]  # Limit to 5 most relevant tags

    def validate_and_clean(self) -> bool:
        """Validate and clean the endpoint data. Returns True if valid."""
        # Must have method and URL
        if not self.method or not self.url:
            return False
            
        # Normalize method
        self.method = self.method.upper().strip()
        if self.method not in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']:
            return False
            
        # Clean and validate URL
        self.normalize_url()
        if not self.url.startswith('https://api.securityscorecard.io'):
            return False
            
        # Extract and validate path parameters
        self.parameters['path'] = self.extract_path_parameters()
        
        # Generate tags
        self.tags = self.categorize_by_url()
        
        # Clean descriptions
        self.description = self.description.strip() if self.description else ""
        self.title = self.title.strip() if self.title else ""
        
        return True

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            'filename': self.filename,
            'method': self.method,
            'url': self.url,
            'title': self.title,
            'description': self.description,
            'parameters': {k: v for k, v in self.parameters.items() if v},
            'responses': self.responses,
            'tags': self.tags
        }


class EnhancedAPIParser:
    """Enhanced parser with better pattern matching and validation."""
    
    def __init__(self):
        self.method_pattern = re.compile(r'^(get|post|put|patch|delete|head|options)\s+(https?://\S+)', re.I)
        self.param_group_pattern = re.compile(r'^(Path|Query|Body|Form|URL|Header)s?\s+Params?$', re.I)
        self.response_pattern = re.compile(r'^Response(?:s)?$', re.I)
        self.status_pattern = re.compile(r'^(\d{3})$')
        self.type_pattern = re.compile(r'^(string|number|integer|boolean|array|object|date|datetime|date-time)$', re.I)

    def extract_title_and_description(self, lines: List[str], method_line_idx: int) -> tuple[str, str]:
        """Extract title from header and description from context."""
        title = ""
        description = ""
        
        # Look backwards for title (usually first line or header)
        for i in range(method_line_idx - 1, -1, -1):
            line = lines[i].strip()
            if not line or line.startswith('=') or line.startswith('-'):
                continue
            if line.startswith('/') and not title:
                title = line
            elif not description and line:
                description = line
                break
                
        # Clean title (remove path decorations)
        title = re.sub(r'^/+|/+$', '', title)
        
        return title, description

    def parse_parameter_section(self, lines: List[str], start_idx: int) -> tuple[List[Dict[str, Any]], int]:
        """Parse a parameter section with improved validation."""
        parameters = []
        i = start_idx + 1
        
        while i < len(lines):
            line = lines[i].strip()
            
            # End conditions
            if not line:
                i += 1
                continue
            if self.param_group_pattern.match(line) or self.response_pattern.match(line):
                break
                
            # Start of new parameter
            if re.match(r'^[a-zA-Z_][a-zA-Z0-9_\-\[\]]*$', line):
                param = {
                    'name': line,
                    'type': '',
                    'required': False,
                    'description': ''
                }
                
                i += 1
                
                # Parse parameter details
                while i < len(lines):
                    detail = lines[i].strip()
                    if not detail:
                        i += 1
                        continue
                        
                    # Check for end conditions
                    if (self.param_group_pattern.match(detail) or 
                        self.response_pattern.match(detail) or
                        re.match(r'^[a-zA-Z_][a-zA-Z0-9_\-\[\]]*$', detail)):
                        break
                        
                    # Parse detail
                    if detail.lower() == 'required':
                        param['required'] = True
                    elif self.type_pattern.match(detail):
                        param['type'] = detail.lower()
                    elif detail.lower() in ['optional']:
                        param['required'] = False
                    else:
                        # Accumulate description
                        if param['description']:
                            param['description'] += ' ' + detail
                        else:
                            param['description'] = detail
                    
                    i += 1
                
                # Add parameter if it has meaningful content
                if param['name'] and (param['type'] or param['description']):
                    parameters.append(param)
                continue
            
            i += 1
        
        return parameters, i

    def parse_response_section(self, lines: List[str], start_idx: int) -> tuple[List[Dict[str, Any]], int]:
        """Parse response section with enhanced schema extraction."""
        responses = []
        i = start_idx + 1
        current_response = None
        in_response_body = False
        current_schema = {}
        current_property = None
        
        while i < len(lines):
            line = lines[i].strip()
            
            if not line:
                i += 1
                continue
                
            # End conditions
            if line.startswith('===') or 'Did this page help you?' in line:
                break
            
            # Status code
            status_match = self.status_pattern.match(line)
            if status_match:
                if current_response:
                    if current_schema:
                        current_response['schema'] = current_schema
                    responses.append(current_response)
                    
                current_response = {
                    'status': status_match.group(1),
                    'description': '',
                    'schema': None
                }
                current_schema = {}
                current_property = None
                in_response_body = False
                i += 1
                continue
            
            # Response body section
            if line.lower() == 'response body':
                in_response_body = True
                i += 1
                continue
                
            # Schema type definition
            if in_response_body and current_response:
                if line.lower() == 'object':
                    current_schema = {'type': 'object', 'properties': {}}
                    i += 1
                    continue
                    
                # Property name (if it's a valid identifier and not a type)
                if (re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', line) and 
                    not self.type_pattern.match(line) and 
                    line.lower() not in ['required', 'optional']):
                    current_property = line
                    if 'properties' not in current_schema:
                        current_schema['properties'] = {}
                    current_schema['properties'][current_property] = {
                        'type': '',
                        'description': ''
                    }
                    i += 1
                    continue
                
                # Type for current property
                if current_property and self.type_pattern.match(line):
                    current_schema['properties'][current_property]['type'] = line.lower()
                    i += 1
                    continue
                
                # Description for current property
                if (current_property and 
                    line not in ['required', 'optional'] and
                    not self.type_pattern.match(line) and
                    not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', line)):
                    
                    prop = current_schema['properties'][current_property]
                    if prop['description']:
                        prop['description'] += ' ' + line
                    else:
                        prop['description'] = line
                        
                    # Check for enum values (backtick-quoted values)
                    if '`' in line:
                        enum_values = re.findall(r'`([^`]+)`', line)
                        if enum_values:
                            prop['enum'] = enum_values
                    
                    i += 1
                    continue
            
            # Description for current response (not in response body)
            if current_response and not in_response_body:
                if not current_response['description']:
                    current_response['description'] = line
            
            i += 1
        
        # Add final response
        if current_response:
            if current_schema:
                current_response['schema'] = current_schema
            responses.append(current_response)
            
        return responses, i

    def parse_markdown_file(self, file_path: Path) -> Optional[APIEndpoint]:
        """Parse a single markdown file into an APIEndpoint."""
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
            lines = [line.rstrip() for line in content.splitlines()]
        except Exception as e:
            print(f"Warning: Could not read {file_path}: {e}")
            return None

        endpoint = APIEndpoint()
        endpoint.filename = file_path.name
        
        # Find method and URL
        method_line_idx = None
        for i, line in enumerate(lines):
            match = self.method_pattern.match(line)
            if match:
                endpoint.method = match.group(1)
                endpoint.url = match.group(2)
                method_line_idx = i
                break
        
        if not endpoint.method or not endpoint.url:
            return None
            
        # Extract title and description
        endpoint.title, endpoint.description = self.extract_title_and_description(lines, method_line_idx)
        
        # Parse parameters and responses
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # Parameter groups
            group_match = self.param_group_pattern.match(line)
            if group_match:
                group_name = group_match.group(1).lower()
                if group_name in ['path', 'query', 'body', 'header']:
                    params, next_i = self.parse_parameter_section(lines, i)
                    endpoint.parameters[group_name] = params
                    i = next_i
                    continue
            
            # Response section
            if self.response_pattern.match(line):
                responses, next_i = self.parse_response_section(lines, i)
                endpoint.responses = responses
                i = next_i
                continue
            
            i += 1
        
        # Validate and clean
        if endpoint.validate_and_clean():
            return endpoint
        else:
            print(f"Warning: Invalid endpoint in {file_path.name}")
            return None

    def parse_all_files(self) -> List[APIEndpoint]:
        """Parse all markdown files in the API directory."""
        endpoints = []
        
        for md_file in sorted(API_DIR.glob("*.md")):
            endpoint = self.parse_markdown_file(md_file)
            if endpoint:
                endpoints.append(endpoint)
            
        return endpoints

    def deduplicate_endpoints(self, endpoints: List[APIEndpoint]) -> List[APIEndpoint]:
        """Remove duplicates and merge similar endpoints."""
        unique_endpoints = {}
        
        for endpoint in endpoints:
            key = f"{endpoint.method} {endpoint.url}"
            
            if key in unique_endpoints:
                existing = unique_endpoints[key]
                # Merge descriptions if one is empty
                if not existing.description and endpoint.description:
                    existing.description = endpoint.description
                if not existing.title and endpoint.title:
                    existing.title = endpoint.title
                    
                # Merge parameters (keep more complete ones)
                for param_type in ['path', 'query', 'body', 'header']:
                    if len(endpoint.parameters[param_type]) > len(existing.parameters[param_type]):
                        existing.parameters[param_type] = endpoint.parameters[param_type]
                        
                # Merge responses
                if len(endpoint.responses) > len(existing.responses):
                    existing.responses = endpoint.responses
            else:
                unique_endpoints[key] = endpoint
                
        return list(unique_endpoints.values())

def main():
    """Main execution function."""
    parser = EnhancedAPIParser()
    
    print(f"Parsing API documentation from {API_DIR}")
    endpoints = parser.parse_all_files()
    print(f"Found {len(endpoints)} valid endpoints")
    
    # Deduplicate
    endpoints = parser.deduplicate_endpoints(endpoints)
    print(f"After deduplication: {len(endpoints)} unique endpoints")
    
    # Generate statistics
    methods = {}
    tags = {}
    for endpoint in endpoints:
        methods[endpoint.method] = methods.get(endpoint.method, 0) + 1
        for tag in endpoint.tags:
            tags[tag] = tags.get(tag, 0) + 1
    
    # Create output
    output = {
        "metadata": {
            "total_endpoints": len(endpoints),
            "source": "SecurityScorecard API Documentation",
            "parser_version": "enhanced_v1.0",
            "methods": methods,
            "top_tags": dict(sorted(tags.items(), key=lambda x: x[1], reverse=True)[:10])
        },
        "endpoints": [endpoint.to_dict() for endpoint in endpoints]
    }
    
    # Write output
    OUTPUT_FILE.write_text(json.dumps(output, indent=2))
    print(f"✅ Written enhanced API reference to {OUTPUT_FILE}")
    print(f"📊 Methods: {methods}")
    print(f"🏷️  Top tags: {list(tags.keys())[:10]}")

if __name__ == "__main__":
    main()