# Get all scorecards filtered by portfolio/s and/or 

- **Method:** `GET`
- **Path:** `/v2/scorecards/search`
- **Tag:** `Scorecard`
- **operationId:** `get_v2-scorecards-search`

## Description
Get all scorecards filtered by portfolio/s and/or watchlist/s

## Query Parameters
- `page` (optional, integer) — page number, 0 is the first page (default: 0)
- `page_size` (optional, integer) — number of portfolios per page (max: 200, default: 20)
- `sort` (optional, string) — sort scorecards, supported criteria: (-)domain, (-)name, (-)industry, (-)score, (-)grade, (-)last_month_score_change, (-)ransomware_score, (-)ransomwareScore, (-)ransomware_score_categorical_value, (-)ransomwareScoreCategoricalValue, (-)bsi_score, (-)bsiScore, (-)bsi_score_categorical_value, (-)bsiScoreCategoricalValue, (-)added_date, (-)business_impact, (-)last_logged_in, (-)status, (-)vsor_contract_end_date, (-)vsor_business_unit, (-)vsor_status, (-)vsor_risk, (-)vsor_monitored, (-)products_count, (-)vsor_metadata_internal_vendor_id, (-)vsor_metadata_external_vendor_id (default: domain)
- `portfolios` (optional, array) — filter by portfolios
- `portfolios_criteria` (optional, string) — Criteria(AND/OR) required to filter by portfolios
- `watchlists` (optional, array) — filter by watchlists
- `watchlists_criteria` (optional, string) — Criteria(AND/OR) required to filter by watchlists
- `search` (optional, string) — search by name or domain
- `facet_search` (optional, string) — facet search
- `is_custom_vendor` (optional, boolean) — filter by custom vendors
- `industry` (optional, array) — filter by industry
- `status` (optional, string) — filter by status
- `score` (optional, array) — filter by score
- `grade` (optional, array) — filter by grade letter
- `recalibrated_score` (optional, array) — filter by recalibrated score
- `recalibrated_score_grade` (optional, array) — filter by recalibrated score grade letter
- `last_month_score_change` (optional, array) — filter by score points difference in the last 30 days
- `ransomware_score_categorical_value` (optional, array) — filter by ransomware score severity level
- `bsi_score_categorical_value` (optional, array) — filter by Breach Susceptibility Indicator score severity level
- `tags` (optional, array) — filter by tag names
- `tags_criteria` (optional, string) — Criteria(AND/OR) required to filter by tag names
- `public_tags` (optional, array) — filter by public tag names
- `public_tags_criteria` (optional, string) — Criteria(AND/OR) required to filter by public tag names
- `include_tags` (optional, boolean) — Flag to include tags of the company
- `show_products` (optional, boolean) — 
- `cves` (optional, array) — filter by CVEs
- `cves_criteria` (optional, string) — Criteria(AND/OR) required to filter by CVEs
- `issue_types` (optional, array) — filter by issue types
- `had_breach_within_last_days` (optional, number) — filter by companies with breaches in the last N days
- `products` (optional, array) — filter by products
- `business_impact` (optional, array) — filter by business impact
- `new_added_only` (optional, boolean) — Filter by scorecard_tag.created_at field last 30 days from current date
- `with_scoring_update` (optional, boolean) — 
- `critical_service_exposure_index` (optional, array) — filter by critical service exposure index
- `malware_exposure_index` (optional, array) — filter by malware exposure index
- `social_engineering_susceptibility_index` (optional, array) — filter by social engineering susceptibility index
- `cumulative_vulnerability_exposure_index` (optional, array) — filter by cumulative vulnerability exposure index

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
          "ransomware_score": {
            "type": "integer",
            "x-example": "95"
          },
          "ransomware_score_categorical_value": {
            "type": "string",
            "x-example": "very_low"
          },
          "bsi_score": {
            "type": "integer",
            "x-example": "90"
          },
          "bsi_score_categorical_value": {
            "type": "string",
            "x-example": "very_high"
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
          "vsor_status": {
            "type": "string",
            "description": "VSOR lifecycle status of the vendor"
          },
          "vsor_risk": {
            "type": "string",
            "description": "VSOR risk level of the vendor"
          },
          "vsor_data_types_shared": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "VSOR data types shared with the vendor"
          },
          "vsor_business_unit": {
            "type": "string",
            "description": "VSOR business unit that owns the vendor relationship"
          },
          "vsor_contract_end_date": {
            "type": "string",
            "description": "VSOR contract end date"
          },
          "vsor_metadata": {
            "type": "object",
            "properties": {},
            "additionalProperties": true,
            "description": "VSOR additional vendor metadata (e.g. internalVendorId, externalVendorId)"
          },
          "custom_fields": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^[\\da-z-]{16,}$",
                  "description": "Custom field value ID"
                },
                "field_type": {
                  "type": "string",
                  "description": "Type of the custom field"
                },
                "field_label": {
                  "type": "string",
                  "description": "Label of the custom field"
                },
                "data": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "Value(s) of the custom field. Multi-valued types (multi-select) hold multiple entries; single-valued types (text, date, switch) hold a one-element array."
                }
              },
              "additionalProperties": false,
              "required": [
                "id",
                "field_type",
                "field_label",
                "data"
              ]
            },
            "description": "Custom field values for this vendor"
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

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v2/scorecards/search' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

