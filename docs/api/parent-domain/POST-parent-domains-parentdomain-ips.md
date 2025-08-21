# Get all the ips for the parent domain

- **Method:** `POST`
- **Path:** `/parent-domains/{parentDomain}/ips`
- **Tag:** `{Parent Domain}`
- **operationId:** `postByParentdomainAssetsIps`

## Path Parameters
- `parentDomain` (**required**) — parent domain

## Request Body
```json
{
  "type": "object",
  "properties": {
    "filters": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "operator",
          "field",
          "condition",
          "value"
        ],
        "properties": {
          "operator": {
            "description": "boolean operator - must be the same for all filters",
            "type": "string",
            "enum": [
              "and",
              "or"
            ],
            "example": "and"
          },
          "field": {
            "description": "column name used for filtering",
            "type": "string",
            "enum": [
              "status",
              "findings",
              "issues",
              "scoreImpact",
              "ip",
              "domain",
              "country",
              "tags",
              "assetCategories",
              "assignees",
              "sources",
              "hostnames"
            ],
            "example": "ip"
          },
          "condition": {
            "description": "condition that's used for comparing field value to input value",
            "type": "string",
            "enum": [
              "=",
              "!=",
              ">",
              "<",
              ">=",
              "<=",
              "contains",
              "does_not_contain",
              "between",
              "is_not_between",
              "includes_all",
              "includes_any",
              "excludes_all",
              "<<"
            ],
            "example": "="
          },
          "value": {
            "description": "filters input value - array of 2 values for comparisons such as `between`, string otherwise",
            "example": "127.0.0.1"
          }
        }
      }
    },
    "sort": {
      "type": "string",
      "description": "field to sort by",
      "enum": [
        "findings",
        "-findings",
        "issues",
        "-issues",
        "scoreImpact",
        "-scoreImpact",
        "ip",
        "-ip",
        "domain",
        "-domain",
        "assetCategories",
        "-assetCategories",
        "detection",
        "-detection",
        "sources",
        "-sources"
      ]
    },
    "page": {
      "description": "required page number, first page is 0",
      "type": "number",
      "default": 0
    },
    "page_size": {
      "description": "size of the pages in the paginated result",
      "type": "number",
      "default": 50
    }
  },
  "required": [
    "page",
    "page_size"
  ],
  "additionalProperties": false
}
```

## Responses
### 200
ip schema
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
curl -X POST \
  'https://api.securityscorecard.io//parent-domains/<parentDomain>/ips' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

