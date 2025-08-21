#!/usr/bin/env python3
"""
Parse the large api-docs.json Swagger 2.0 file to extract all API endpoints.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from urllib.parse import urlparse
import sys

def load_json_file(file_path: Path) -> Optional[Dict[str, Any]]:
    """Load and parse the JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None
    except Exception as e:
        print(f"Error loading file: {e}")
        return None

def categorize_endpoint(path: str) -> List[str]:
    """Categorize endpoint based on its path."""
    tags = []
    path_lower = path.lower()
    
    # Core entity categories
    if '/companies/' in path_lower or path_lower.startswith('/companies'):
        tags.append('companies')
    if '/portfolios/' in path_lower or path_lower.startswith('/portfolios'):
        tags.append('portfolios')  
    if '/users/' in path_lower or path_lower.startswith('/users'):
        tags.append('users')
    if '/reports/' in path_lower or path_lower.startswith('/reports'):
        tags.append('reports')
    if '/plans/' in path_lower or path_lower.startswith('/plans'):
        tags.append('plans')
    
    # Specific functionalities
    if '/factors' in path_lower:
        tags.append('factors')
    if '/issues/' in path_lower:
        tags.append('issues')
    if '/assets/' in path_lower:
        tags.append('assets')
    if '/scorecard' in path_lower:
        tags.append('scorecards')
    if '/tags' in path_lower:
        tags.append('tags')
    if '/footprint' in path_lower:
        tags.append('footprint')
    if '/findings' in path_lower:
        tags.append('findings')
        
    # Historical/temporal data
    if '/history/' in path_lower or '/historical' in path_lower:
        tags.append('historical-data')
    if '/events/' in path_lower:
        tags.append('events')
    if '/breach' in path_lower:
        tags.append('breaches')
        
    # Security intelligence
    if '/sentinel/' in path_lower:
        tags.append('sentinel')
    if '/aegis/' in path_lower:
        tags.append('aegis')
    if '/asi/' in path_lower:
        tags.append('asi')
    if '/atlas/' in path_lower:
        tags.append('atlas')
    if '/max/' in path_lower:
        tags.append('max')
        
    # Specialized services
    if '/insurance' in path_lower:
        tags.append('insurance')
    if '/apps/' in path_lower:
        tags.append('apps-integrations')
    if '/managed-services' in path_lower:
        tags.append('managed-services')
    if '/vendor-detection' in path_lower or '/avd/' in path_lower:
        tags.append('vendor-detection')
    if '/bulk-data-export' in path_lower:
        tags.append('bulk-export')
    if '/whiteglove' in path_lower:
        tags.append('whiteglove')
    
    # Organization/admin
    if '/organizations/' in path_lower:
        tags.append('organizations')
    if '/signups/' in path_lower:
        tags.append('signups')
    if '/billing' in path_lower:
        tags.append('billing')
    if '/expressions' in path_lower:
        tags.append('expressions')
    
    # Data categories
    if any(term in path_lower for term in ['malware', 'infection', 'ransomware']):
        tags.append('malware')
    if any(term in path_lower for term in ['cve', 'vulnerability', 'vuln']):
        tags.append('vulnerabilities')
    if any(term in path_lower for term in ['cert', 'certificate', 'ssl', 'tls']):
        tags.append('certificates')
    if any(term in path_lower for term in ['dns', 'domain']):
        tags.append('dns-domains')
    if any(term in path_lower for term in ['/ip/', 'ips/']):
        tags.append('ip-addresses')
        
    return tags if tags else ['uncategorized']

def extract_endpoints(swagger_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Extract all endpoints from the swagger paths section."""
    endpoints = []
    
    if 'paths' not in swagger_data:
        print("No 'paths' section found in swagger file")
        return endpoints
    
    paths = swagger_data['paths']
    print(f"Found {len(paths)} paths in swagger file")
    
    for path, methods in paths.items():
        if not isinstance(methods, dict):
            continue
            
        for method, details in methods.items():
            if method.upper() not in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']:
                continue
                
            endpoint = {
                'path': path,
                'method': method.upper(),
                'summary': details.get('summary', ''),
                'description': details.get('description', ''),
                'operationId': details.get('operationId', ''),
                'tags': details.get('tags', []),
                'categories': categorize_endpoint(path),
                'parameters': [],
                'responses': {}
            }
            
            # Extract parameters
            if 'parameters' in details:
                for param in details['parameters']:
                    param_info = {
                        'name': param.get('name', ''),
                        'in': param.get('in', ''),
                        'type': param.get('type', ''),
                        'required': param.get('required', False),
                        'description': param.get('description', '')
                    }
                    endpoint['parameters'].append(param_info)
            
            # Extract responses
            if 'responses' in details:
                for status_code, response_details in details['responses'].items():
                    endpoint['responses'][status_code] = {
                        'description': response_details.get('description', '')
                    }
                    if 'schema' in response_details:
                        endpoint['responses'][status_code]['schema'] = response_details['schema']
            
            endpoints.append(endpoint)
    
    return endpoints

def organize_by_category(endpoints: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """Organize endpoints by their primary category."""
    organized = {}
    
    for endpoint in endpoints:
        primary_category = endpoint['categories'][0] if endpoint['categories'] else 'uncategorized'
        
        if primary_category not in organized:
            organized[primary_category] = []
        
        organized[primary_category].append(endpoint)
    
    # Sort each category by path then method
    for category in organized:
        organized[category].sort(key=lambda x: (x['path'], x['method']))
    
    return organized

def print_summary(endpoints: List[Dict[str, Any]], organized: Dict[str, List[Dict[str, Any]]]):
    """Print a summary of the endpoints."""
    print(f"\n{'='*60}")
    print("SECURITYSCORECARD API ENDPOINTS SUMMARY")
    print(f"{'='*60}")
    print(f"Total endpoints: {len(endpoints)}")
    
    # Method breakdown
    methods = {}
    for endpoint in endpoints:
        method = endpoint['method']
        methods[method] = methods.get(method, 0) + 1
    
    print(f"\nMethods breakdown:")
    for method, count in sorted(methods.items()):
        print(f"  {method}: {count}")
    
    print(f"\nEndpoints by category:")
    for category, endpoints_list in sorted(organized.items(), key=lambda x: len(x[1]), reverse=True):
        print(f"  {category}: {len(endpoints_list)}")

def print_detailed_endpoints(organized: Dict[str, List[Dict[str, Any]]]):
    """Print detailed endpoint information organized by category."""
    print(f"\n{'='*60}")
    print("DETAILED ENDPOINTS BY CATEGORY")
    print(f"{'='*60}")
    
    for category, endpoints_list in sorted(organized.items(), key=lambda x: len(x[1]), reverse=True):
        print(f"\n{category.upper().replace('-', ' ')} ({len(endpoints_list)} endpoints)")
        print("-" * 50)
        
        for endpoint in endpoints_list:
            print(f"{endpoint['method']:6} {endpoint['path']}")
            if endpoint['summary']:
                print(f"       Summary: {endpoint['summary'][:100]}{'...' if len(endpoint['summary']) > 100 else ''}")
            if endpoint['description'] and endpoint['description'] != endpoint['summary']:
                print(f"       Description: {endpoint['description'][:100]}{'...' if len(endpoint['description']) > 100 else ''}")
            
            # Show parameters if any
            if endpoint['parameters']:
                param_strs = []
                for param in endpoint['parameters'][:3]:  # Show first 3
                    param_str = f"{param['name']} ({param.get('in', 'unknown')})"
                    if param.get('required'):
                        param_str += "*"
                    param_strs.append(param_str)
                if len(endpoint['parameters']) > 3:
                    param_strs.append(f"... and {len(endpoint['parameters']) - 3} more")
                print(f"       Params: {', '.join(param_strs)}")
            print()

def main():
    """Main execution function."""
    file_path = Path(__file__).parent / 'api-docs.json'
    
    if not file_path.exists():
        print(f"File not found: {file_path}")
        sys.exit(1)
    
    print(f"Loading swagger file: {file_path}")
    swagger_data = load_json_file(file_path)
    
    if not swagger_data:
        print("Failed to load swagger data")
        sys.exit(1)
    
    print(f"Swagger version: {swagger_data.get('swagger', 'unknown')}")
    print(f"API title: {swagger_data.get('info', {}).get('title', 'unknown')}")
    print(f"API version: {swagger_data.get('info', {}).get('version', 'unknown')}")
    
    # Extract endpoints
    endpoints = extract_endpoints(swagger_data)
    
    if not endpoints:
        print("No endpoints found")
        sys.exit(1)
    
    # Organize by category
    organized = organize_by_category(endpoints)
    
    # Print summary
    print_summary(endpoints, organized)
    
    # Print detailed endpoints
    print_detailed_endpoints(organized)
    
    # Save to file for reference
    output_file = Path(__file__).parent / 'extracted_endpoints.json'
    with open(output_file, 'w') as f:
        json.dump({
            'metadata': {
                'total_endpoints': len(endpoints),
                'categories': {cat: len(eps) for cat, eps in organized.items()},
                'methods': {method: sum(1 for ep in endpoints if ep['method'] == method) 
                           for method in set(ep['method'] for ep in endpoints)}
            },
            'endpoints_by_category': organized
        }, f, indent=2)
    
    print(f"\nDetailed results saved to: {output_file}")

if __name__ == "__main__":
    main()