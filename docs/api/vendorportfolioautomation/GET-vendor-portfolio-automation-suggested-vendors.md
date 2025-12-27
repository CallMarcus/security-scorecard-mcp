# retrieve suggested vendors for the caller's domain

- **Method:** `GET`
- **Path:** `/vendor-portfolio-automation/suggested-vendors`
- **Tag:** `VendorPortfolioAutomation`
- **operationId:** `get_vendor-portfolio-automation-suggested-vendors`

## Description
retrieve suggested vendors for the caller's domain

## Query Parameters
- `page` (optional, integer) — page number, 0 is the first page (default: 0)
- `page_size` (optional, integer) — number of portfolios per page (max: 200, default: 20)
- `sort` (optional, string) — sort scorecards, supported criteria: (-)domain, (-)name, (-)industry, (-)score, (-)grade, (-)last_month_score_change, (-)added_date, (-)business_impact, (-)last_logged_in, (-)status, (-)vsor_contract_end_date, (-)vsor_business_unit, (-)vsor_status, (-)vsor_risk, (-)vsor_monitored, (-)products_count (default: domain)
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
- `last_month_score_change` (optional, array) — filter by score points difference in the last 30 days
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
- `sources` (optional, array) — filter by vendor sources - vendors matching ANY of the provided sources will be returned
- `source_ids` (optional, array) — filter based on the source_id of the vendor record
- `monitored` (optional, boolean) — filter by monitored status
- `add_to_portfolio` (optional, boolean) — filter by whether the vendor was added to portfolio on ingest
- `vsor_status` (optional, array) — filter by VSOR status
- `vsor_data_types_shared` (optional, array) — filter by VSOR data types shared
- `vsor_risk` (optional, array) — filter by VSOR risk
- `vsor_business_unit` (optional, array) — filter by VSOR business unit
- `vsor_internal_contact` (optional, array) — filter by VSOR internal contact
- `vsor_contract_end_date_from` (optional, string) — filter by VSOR contract end date from
- `vsor_contract_end_date_to` (optional, string) — filter by VSOR contract end date to
- `has_contacts` (optional, boolean) — filter vendors with contacts or no contacts
- `uuids` (optional, array) — filter by uuids

## Responses
### 200
A page in a list of VendorPortfolioAutomationSuggestions
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
            "type": "boolean",
            "description": "Is monitored if it is present in at least one portfolio"
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
          },
          "vsor_status": {
            "type": "string",
            "description": "Status of the vendor in the vendor lifecycle"
          },
          "vsor_data_types_shared": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Data types shared with the vendor"
          },
          "vsor_business_unit": {
            "type": "string",
            "description": "Business unit that manages the relationship with the vendor"
          },
          "vsor_risk": {
            "type": "string",
            "description": "Riskiness of the vendor"
          },
          "vsor_contract_end_date": {
            "type": "string",
            "description": "Date on which the vendor's contract ends"
          },
          "vsor_contract_value_amount": {
            "type": "integer",
            "description": "Vendor's contract value amount in cents"
          },
          "vsor_contract_value_currency": {
            "type": "string",
            "description": "ISO 4217 code in which the contract amount is voiced"
          },
          "vsor_metadata": {
            "type": "object",
            "properties": {},
            "additionalProperties": true,
            "description": "Additional vendor's information"
          },
          "portfolios": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "portfolio_tag_id": {
                  "type": "string",
                  "description": "unique identifier of the tag"
                },
                "portfolio_tag_name": {
                  "type": "string",
                  "description": "the tag name"
                },
                "portfolio_is_private": {
                  "type": "boolean",
                  "description": "if portfolio tag is only visible for the user or not"
                }
              },
              "additionalProperties": false
            },
            "description": "list of portfolios where the company belongs to"
          },
          "last30Days_breach_count": {
            "type": "number",
            "description": "30-day breach count"
          },
          "contacts_count": {
            "type": "number",
            "description": "Number of contacts the current vendor has"
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
                  "type": "string",
                  "description": "Value of the custom field"
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
          "suggestion_confidence": {
            "type": "integer",
            "default": -1,
            "description": "suggestion confidence score"
          },
          "source_details": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "source": {
                  "type": "string",
                  "description": "the original source of the vendor record"
                },
                "source_id": {
                  "type": "string",
                  "description": "the original source unique id of the vendor record"
                },
                "vendor_name": {
                  "type": "string",
                  "description": "name of the vendor"
                },
                "vendor_metadata": {
                  "type": "object",
                  "properties": {},
                  "additionalProperties": true,
                  "description": "any other information about the vendor that the source can provide"
                },
                "vendor_domain": {
                  "type": "string",
                  "description": "domain to resolve vendor to.  If domain is present, matching on vendorName will not be performed"
                },
                "add_to_portfolio": {
                  "type": "boolean",
                  "description": "Indicates whether vendor was automatically ingested into the default portfolio"
                }
              },
              "additionalProperties": false,
              "required": [
                "source",
                "source_id",
                "vendor_name",
                "vendor_metadata"
              ],
              "description": "vendor details from the source"
            },
            "description": "data received from source"
          }
        },
        "additionalProperties": false,
        "description": "vendor details from the source"
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
  "description": "A page in a list of VendorPortfolioAutomationSuggestions"
}
```
### 403
No response body

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//vendor-portfolio-automation/suggested-vendors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

