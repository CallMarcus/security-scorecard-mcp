# SecurityScorecard API Documentation

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
