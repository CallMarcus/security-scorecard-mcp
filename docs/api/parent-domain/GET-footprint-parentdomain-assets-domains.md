# Get all the domains for the parent domain using query parameters

- **Method:** `GET`
- **Path:** `/footprint/{parentDomain}/assets/domains`
- **Tag:** `{Parent Domain}`
- **operationId:** `getByParentdomainAssetsDomains`

## Path Parameters
- `parentDomain` (**required**) — parent domain

## Query Parameters
- `page` (optional, integer) — Page number, starting from 0
- `page-size` (optional, integer) — Number of items per page, max 100
- `sort` (optional, string) — Sort field, prefix with - for descending order
- `filters` (optional, string) — Filter string in format: "field:condition:value,field2:condition2:value2"
- `filter-operator` (optional, string) — Filter operator, expected values: and | or
- `include-evidence` (optional, boolean) — Include evidence sources in response

## Responses
### 200
Domain assets data
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "domain": {
            "type": "string",
            "description": "domain asset"
          },
          "status": {
            "type": "string",
            "enum": [
              "CLAIMED",
              "ATTRIBUTED",
              "REFUTED",
              "UNDER_REVIEW_ADD",
              "UNDER_REVIEW_REMOVE"
            ],
            "description": "status of asset"
          },
          "issues": {
            "type": "number",
            "description": "number of issue types associated with the asset"
          },
          "findings": {
            "type": "number",
            "description": "number of findings associated with the asset"
          },
          "score_impact": {
            "type": "number",
            "description": "sum impact of issue findings associated with the asset"
          },
          "age": {
            "type": "number",
            "description": "how long the asset has been attributed"
          },
          "domain_type": {
            "type": "string",
            "enum": [
              "SUBDOMAIN",
              "PARENT DOMAIN"
            ],
            "description": "type of domain"
          },
          "ips_count": {
            "type": "number",
            "description": "count of associated ips"
          },
          "sources_metadata": {
            "type": "array",
            "description": "metadata for data sources",
            "items": {}
          },
          "first_observed_at": {
            "type": "string",
            "description": "date of the first attribution"
          },
          "criticality": {
            "type": "string",
            "description": "criticality of the domain asset"
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "description": "tag id",
                  "type": "string"
                },
                "tag": {
                  "description": "tag name",
                  "type": "string"
                }
              }
            },
            "description": "associated tags"
          },
          "public_tags": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "description": "tag id",
                  "type": "string"
                },
                "tag": {
                  "description": "tag name",
                  "type": "string"
                }
              }
            },
            "description": "associated tags"
          },
          "evidence_sources": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "data sources evidence used to associate the asset to footprint"
          },
          "sources": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "data sources used to associate the asset to footprint"
          },
          "asset_categories": {
            "type": "array",
            "description": "asset category list",
            "items": {
              "type": "string"
            }
          },
          "assignees": {
            "type": "object",
            "properties": {
              "user": {
                "description": "assignee users",
                "type": "string"
              },
              "team": {
                "description": "assignee teams",
                "type": "string"
              }
            }
          }
        },
        "required": [
          "domain",
          "status",
          "domain_type",
          "ips_count",
          "first_observed_at",
          "criticality"
        ],
        "additionalProperties": false
      }
    },
    "size": {
      "type": "number"
    }
  },
  "required": [
    "entries",
    "size"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//footprint/<parentDomain>/assets/domains' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

