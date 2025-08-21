# Get all the IPs for the parent domain using query parameters

- **Method:** `GET`
- **Path:** `/footprint/{parentDomain}/assets/ips`
- **Tag:** `{Parent Domain}`
- **operationId:** `getByParentdomainAssetsIps`

## Path Parameters
- `parentDomain` (**required**) — parent domain

## Query Parameters
- `page` (optional, integer) — Page number, starting from 0
- `page-size` (optional, integer) — Number of items per page, max 100
- `sort` (optional, string) — Sort field, prefix with - for descending order
- `filters` (optional, string) — Filter string in format: "field:condition:value,field2:condition2:value2"
- `filter-operator` (optional, string) — Filter operator, expected values: and | or

## Responses
### 200
IP assets data
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "ip": {
            "type": "string",
            "description": "ip asset belonging to domain"
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
          "detection": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "detection methods"
          },
          "sources": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "data sources used to associate the asset to footprint"
          },
          "sources_metadata": {
            "type": "array",
            "description": "metadata for data sources",
            "items": {}
          },
          "user_contributed": {
            "type": "array",
            "description": "user contributed metadata",
            "items": {}
          },
          "domains_count": {
            "type": "number",
            "description": "count of domains associated with the ip asset"
          },
          "country": {
            "type": "object",
            "properties": {
              "country_abbr": {
                "type": "string",
                "description": "country abbreviation"
              },
              "name": {
                "type": "string",
                "description": "name of the country"
              }
            },
            "required": [
              "country_abbr",
              "name"
            ],
            "additionalProperties": false
          },
          "domains": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "top 30 associated domains"
          },
          "evidence_sources": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "data sources used to associate the asset to footprint"
          },
          "first_observed_at": {
            "type": "string",
            "description": "date of the first attribution"
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
          },
          "hostnames": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Hostnames associated with the IP"
          }
        },
        "required": [
          "ip",
          "status",
          "detection",
          "sources",
          "domains_count",
          "country",
          "domains"
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
  'https://api.securityscorecard.io//footprint/<parentDomain>/assets/ips' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

