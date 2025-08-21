# Get all scorecards filtered by portfolio/s and/or 

- **Method:** `GET`
- **Path:** `/v2/scorecards/search`
- **Category:** `companies`
- **Operation ID:** `get_v2-scorecards-search`

## Description

Get all scorecards filtered by portfolio/s and/or watchlist/s

## Query Parameters

- `page` (integer, Optional) - page number, 0 is the first page (default: 0)
- `page_size` (integer, Optional) - number of portfolios per page (max: 200, default: 20)
- `sort` (string, Optional) - sort scorecards, supported criteria: (-)domain, (-)name, (-)industry, (-)score, (-)grade, (-)last_month_score_change, (-)added_date, (-)business_impact, (-)last_logged_in, (-)status, (-)vsor_contract_end_date, (-)vsor_business_unit, (-)vsor_status, (-)vsor_risk, (-)vsor_monitored, (-)products_count (default: domain)
- `portfolios` (array, Optional) - filter by portfolios
- `portfolios_criteria` (string, Optional) - Criteria(AND/OR) required to filter by portfolios
- `watchlists` (array, Optional) - filter by watchlists
- `watchlists_criteria` (string, Optional) - Criteria(AND/OR) required to filter by watchlists
- `search` (string, Optional) - search by name or domain
- `facet_search` (string, Optional) - facet search
- `is_custom_vendor` (boolean, Optional) - filter by custom vendors
- `industry` (array, Optional) - filter by industry
- `status` (string, Optional) - filter by status
- `score` (array, Optional) - filter by score
- `grade` (array, Optional) - filter by grade letter
- `last_month_score_change` (array, Optional) - filter by score points difference in the last 30 days
- `tags` (array, Optional) - filter by tag names
- `tags_criteria` (string, Optional) - Criteria(AND/OR) required to filter by tag names
- `public_tags` (array, Optional) - filter by public tag names
- `public_tags_criteria` (string, Optional) - Criteria(AND/OR) required to filter by public tag names
- `include_tags` (boolean, Optional) - Flag to include tags of the company
- `show_products` (boolean, Optional) - No description
- `cves` (array, Optional) - filter by CVEs
- `cves_criteria` (string, Optional) - Criteria(AND/OR) required to filter by CVEs
- `issue_types` (array, Optional) - filter by issue types
- `had_breach_within_last_days` (number, Optional) - filter by companies with breaches in the last N days
- `products` (array, Optional) - filter by products
- `business_impact` (array, Optional) - filter by business impact
- `new_added_only` (boolean, Optional) - Filter by scorecard_tag.created_at field last 30 days from current date
- `with_scoring_update` (boolean, Optional) - No description
- `critical_service_exposure_index` (array, Optional) - filter by critical service exposure index
- `malware_exposure_index` (array, Optional) - filter by malware exposure index
- `social_engineering_susceptibility_index` (array, Optional) - filter by social engineering susceptibility index
- `cumulative_vulnerability_exposure_index` (array, Optional) - filter by cumulative vulnerability exposure index

## Responses

### 200
A page in a list of ScorecardSearchBies
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "uuid": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$"
          },
          "domain": {
            "type": "string",
            "x-example": "example.com"
          },
          "name": {
            "type": "string",
            "x-example": "Example"
          },
          "industry_id": {
            "type": "string",
            "x-example": "technology"
          },
          "industry": {
            "type": "string",
            "x-example": "technology"
          },
          "size": {
            "type": "string",
            "x-example": "size_51_to_200"
          },
          "is_custom_vendor": {
            "type": "boolean",
            "description": "true if scorecard is custom vendor"
          },
          "is_unpublished": {
            "type": "boolean",
            "description": "true if custom scorecard is not public or if it was removed by the owner"
          },
          "score": {
            "type": "integer",
            "x-example": 98
          },
          "grade": {
            "type": "string",
            "x-example": "A"
          },
          "last_month_score_change": {
            "type": "number",
            "x-example": -5
          },
          "platform_score_date": {
            "type": "string",
            "format": "date",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
          },
          "recalibrated_score": {
            "type": "number"
          },
          "recalibrated_score_change": {
            "type": "number"
          },
          "last_logged_in": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$"
          },
          "status": {
            "type": "string",
            "x-example": "active"
          },
          "added_date": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$"
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^[\\da-z-]{16,}$",
                  "description": "tag id"
                },
                "name": {
                  "type": "string",
                  "description": "tag name"
                }
              },
              "additionalProperties": false,
              "required": [
                "id",
                "name"
              ]
            }
          },
          "public_tags": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^[\\da-z-]{16,}$",
                  "description": "public tag id"
                },
                "name": {
                  "type": "string",
                  "description": "public tag name"
                }
              },
              "additionalProperties": false,
              "required": [
                "id",
                "name"
              ]
            }
          },
          "business_impact": {
            "type": "string"
          },
          "vsor_monitored": {
            "type": "boolean"
          },
          "products": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "products_count": {
            "type": "integer"
          },
          "factors": {
            "type": "object",
            "properties": {
              "endpoint_security": {
                "type": "number"
              },
              "dns_health": {
                "type": "number"
              },
              "hacker_chatter": {
                "type": "number"
              },
              "network_security": {
                "type": "number"
              },
              "application_security": {
                "type": "number"
              },
              "ip_reputation": {
                "type": "number"
              },
              "social_engineering": {
                "type": "number"
              },
              "patching_cadence": {
                "type": "number"
              },
              "leaked_information": {
                "type": "number"
              },
              "cubit_score": {
                "type": "number"
              }
            },
            "additionalProperties": false
          }
        },
        "additionalProperties": false,
        "description": "Scorecard search by"
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    }
  },
  "additionalProperties": false,
  "required": [
    "entries",
    "page",
    "size"
  ],
  "description": "A page in a list of ScorecardSearchBies"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/v2/scorecards/search' \
  -H 'Authorization: Bearer <your-api-token>'
```
