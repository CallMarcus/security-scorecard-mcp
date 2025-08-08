#!/usr/bin/env python3
"""Validation script for the enhanced API parser output."""

import json
from pathlib import Path
from typing import Dict, List, Any

def load_enhanced_api():
    """Load the enhanced API reference."""
    file_path = Path(__file__).resolve().parents[1] / "build_docs" / "api_reference_enhanced.json"
    with open(file_path, 'r') as f:
        return json.load(f)

def validate_urls(endpoints: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Validate URL formatting issues."""
    issues = {
        'escaped_underscores': [],
        'malformed_params': [],
        'double_slashes': [],
        'missing_https': []
    }
    
    for ep in endpoints:
        url = ep.get('url', '')
        
        if '\\_' in url:
            issues['escaped_underscores'].append(ep['filename'])
            
        if '//' in url and 'https://' not in url:
            issues['double_slashes'].append(ep['filename'])
            
        if not url.startswith('https://api.securityscorecard.io'):
            issues['missing_https'].append(ep['filename'])
            
        # Check for malformed parameters
        import re
        if re.search(r'\{[^}]*\\_[^}]*\}', url):
            issues['malformed_params'].append(ep['filename'])
    
    return issues

def validate_parameters(endpoints: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Validate parameter extraction quality."""
    stats = {
        'endpoints_with_path_params': 0,
        'endpoints_with_query_params': 0,
        'endpoints_with_body_params': 0,
        'well_documented_params': 0,
        'missing_required_info': []
    }
    
    for ep in endpoints:
        params = ep.get('parameters', {})
        
        if params.get('path'):
            stats['endpoints_with_path_params'] += 1
        if params.get('query'):
            stats['endpoints_with_query_params'] += 1
        if params.get('body'):
            stats['endpoints_with_body_params'] += 1
            
        # Check parameter quality
        all_params = []
        for param_type in ['path', 'query', 'body', 'header']:
            all_params.extend(params.get(param_type, []))
            
        well_documented = 0
        for param in all_params:
            if param.get('type') and param.get('description'):
                well_documented += 1
                
        if all_params:
            quality_ratio = well_documented / len(all_params)
            if quality_ratio > 0.7:  # 70% well documented
                stats['well_documented_params'] += 1
            elif quality_ratio < 0.3:  # Less than 30% documented
                stats['missing_required_info'].append(ep['filename'])
    
    return stats

def validate_responses(endpoints: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Validate response schema extraction."""
    stats = {
        'endpoints_with_responses': 0,
        'endpoints_with_schemas': 0,
        'schemas_with_properties': 0,
        'response_status_codes': {},
        'sample_schemas': []
    }
    
    for ep in endpoints:
        responses = ep.get('responses', [])
        
        if responses:
            stats['endpoints_with_responses'] += 1
            
        for response in responses:
            status = response.get('status', 'unknown')
            stats['response_status_codes'][status] = stats['response_status_codes'].get(status, 0) + 1
            
            schema = response.get('schema')
            if schema:
                stats['endpoints_with_schemas'] += 1
                
                if schema.get('properties'):
                    stats['schemas_with_properties'] += 1
                    
                    # Collect sample schemas
                    if len(stats['sample_schemas']) < 3:
                        stats['sample_schemas'].append({
                            'filename': ep['filename'],
                            'method': ep['method'],
                            'url': ep['url'],
                            'schema': schema
                        })
    
    return stats

def validate_tags_and_categorization(endpoints: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Validate tagging and categorization."""
    stats = {
        'endpoints_with_tags': 0,
        'tag_distribution': {},
        'untagged_endpoints': []
    }
    
    for ep in endpoints:
        tags = ep.get('tags', [])
        
        if tags:
            stats['endpoints_with_tags'] += 1
            for tag in tags:
                stats['tag_distribution'][tag] = stats['tag_distribution'].get(tag, 0) + 1
        else:
            stats['untagged_endpoints'].append(ep['filename'])
    
    return stats

def main():
    """Main validation function."""
    print("🔍 Validating Enhanced API Parser Output")
    print("=" * 50)
    
    # Load data
    api_data = load_enhanced_api()
    endpoints = api_data['endpoints']
    metadata = api_data['metadata']
    
    print(f"📊 Total Endpoints: {len(endpoints)}")
    print(f"📊 Metadata: {metadata}")
    print()
    
    # Validate URLs
    print("🔗 URL Validation:")
    url_issues = validate_urls(endpoints)
    for issue_type, files in url_issues.items():
        if files:
            print(f"  ❌ {issue_type}: {len(files)} files")
            if len(files) <= 3:
                for file in files:
                    print(f"    - {file}")
            else:
                print(f"    - {files[0]} ... and {len(files)-1} more")
        else:
            print(f"  ✅ {issue_type}: None found")
    print()
    
    # Validate parameters
    print("📋 Parameter Validation:")
    param_stats = validate_parameters(endpoints)
    for key, value in param_stats.items():
        if isinstance(value, list):
            print(f"  📈 {key}: {len(value)} endpoints")
        else:
            print(f"  📈 {key}: {value}")
    print()
    
    # Validate responses
    print("📥 Response Validation:")
    response_stats = validate_responses(endpoints)
    for key, value in response_stats.items():
        if key == 'response_status_codes':
            print(f"  📈 Status Codes: {dict(sorted(value.items()))}")
        elif key == 'sample_schemas':
            print(f"  📈 Sample Schemas Found: {len(value)}")
            for sample in value[:2]:  # Show first 2
                print(f"    - {sample['filename']}: {len(sample['schema'].get('properties', {}))} properties")
        else:
            print(f"  📈 {key}: {value}")
    print()
    
    # Validate tags
    print("🏷️ Tag Validation:")
    tag_stats = validate_tags_and_categorization(endpoints)
    for key, value in tag_stats.items():
        if key == 'tag_distribution':
            top_tags = sorted(value.items(), key=lambda x: x[1], reverse=True)[:10]
            print(f"  📈 Top Tags: {dict(top_tags)}")
        elif isinstance(value, list):
            print(f"  📈 {key}: {len(value)} endpoints")
        else:
            print(f"  📈 {key}: {value}")
    print()
    
    # Summary and recommendations
    print("🎯 Summary and Recommendations:")
    
    total = len(endpoints)
    schema_coverage = (response_stats['endpoints_with_schemas'] / total) * 100 if total > 0 else 0
    param_coverage = (param_stats['well_documented_params'] / total) * 100 if total > 0 else 0
    
    print(f"  📊 Schema Coverage: {schema_coverage:.1f}%")
    print(f"  📊 Parameter Coverage: {param_coverage:.1f}%")
    
    if schema_coverage < 10:
        print("  ⚠️  Schema extraction needs improvement - very low coverage")
    elif schema_coverage < 50:
        print("  ⚠️  Schema extraction partially working - needs enhancement")
    else:
        print("  ✅ Schema extraction working well")
        
    if url_issues['escaped_underscores']:
        print("  ⚠️  URL formatting issues found - consider fixing escaped underscores")
    else:
        print("  ✅ URL formatting looks good")

if __name__ == "__main__":
    main()