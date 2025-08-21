# Gets triaged and reported findings of a customer having the id

- **Method:** `GET`
- **Path:** `/max/v1/customer/findings`
- **Tag:** `V1`
- **operationId:** `getV1CustomerFindings`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `sort` (optional, string) — stringified object with value for column to sort by and operator
- `with_hostname` (optional, string) — true for findings with hostname
- `all_dates` (optional, string) — Default is false and retrieves 15 days findings, if allDates is true will return 30 days findings
- `domain` (optional, string) — Issue domain filter, it also accepts a comma separated list of domains
- `business_impacts` (optional, string) — Business impact filter, it also accepts a comma separated list of business impacts
- `incident_likelihoods` (optional, string) — Incident likelihood filter, it also accepts a comma separated list of incident likelihoods
- `hostname_matches` (optional, string) — true for findings that have matching vendor domain and hostname
- `max_severity` (optional, string) — Max Severity filter, it also accepts a comma separated list of severities
- `issue_category` (optional, string) — Category filter, it also accepts a comma separated list of categories
- `issue_type_name` (optional, string) — Issue type filter, it also accepts a comma separated list of issue types
- `issue_type_key` (optional, string) — Issue type key filter, it also accepts a comma separated list of issue types
- `hostname` (optional, string) — Hostname filter, it also accepts a comma separated list of hostnames
- `vendor_id` (optional, string) — Vendor ID filter, it also accepts a comma separated list of vendor ids
- `vendor_domain` (optional, string) — Vendor domain filter, it also accepts a comma separated list of domains
- `vendor_name` (optional, string) — Vendor name filter, it also accepts a comma separated list of strings
- `last_seen` (optional, string) — First seen filter, accept stringified object with date value and operator
- `first_seen` (optional, string) — Last seen filter, accept stringified object with date value and operator
- `first_observed_at` (optional, string) — First observed at filter, date filter
- `cve_severity` (optional, string) — CVE severity filter, it also accepts a comma separated list of severities
- `cve_exploited` (optional, string) — true for findings related with a known exploited CVE
- `edited_at` (optional, string) — get the findings that have ben edited at a specific date
- `triaged_at` (optional, string) — get the findings that have ben triaged in a specific date range
- `tiers` (optional, string) — The tiers to filter the findings. Optional, defaults to all tiers.
- `search` (optional, string) — word or phrase to search findings for

## Responses
### 200
Gets the list of findings
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "business_impact": {
            "type": "string",
            "description": "Business impact of the finding",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "none"
            ]
          },
          "incident_likelihood": {
            "type": "string",
            "description": "Incident likelihood of the finding",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "none"
            ]
          },
          "vendor_id": {
            "type": "string",
            "description": "the vendor (scorecard) id"
          },
          "vendor_domain": {
            "type": "string",
            "description": "the vendor (scorecard) domain"
          },
          "vendor_name": {
            "type": "string",
            "description": "the vendor name"
          },
          "finding_id": {
            "type": "string",
            "description": "an uuid of an existing finding"
          },
          "customers": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "id of the customer"
                },
                "domain": {
                  "type": "string",
                  "description": "domain of the customer"
                },
                "name": {
                  "type": "string",
                  "description": "name of the customer"
                }
              },
              "additionalProperties": false,
              "required": [
                "id",
                "domain",
                "name"
              ]
            }
          },
          "information": {
            "type": "array",
            "description": "Finding information of the finding",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Title of the field"
                },
                "value": {
                  "type": "string",
                  "description": "value of the field"
                }
              },
              "required": [
                "title",
                "value"
              ],
              "additionalProperties": false
            }
          },
          "extra_information": {
            "type": "array",
            "description": "extra information fields with not empty value",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Title of the field"
                },
                "value": {
                  "type": "string",
                  "description": "value of the field"
                }
              },
              "required": [
                "title",
                "value"
              ],
              "additionalProperties": false
            }
          },
          "first_observed_at": {
            "type": "string",
            "description": "first observed date time"
          },
          "last_observed_at": {
            "type": "string",
            "description": "last observed date time"
          },
          "is_active_breach": {
            "type": "boolean",
            "default": false,
            "description": "has the active breach"
          },
          "issue_name": {
            "type": "string",
            "description": "Issue Name"
          },
          "issue_type": {
            "type": "string",
            "description": "Issue Type"
          },
          "category": {
            "type": "string",
            "description": "Max Finding category"
          },
          "max_severity": {
            "type": "string",
            "description": "Max severity"
          },
          "breach_risk": {
            "type": "string",
            "description": "Breach risk"
          },
          "threat_level": {
            "type": "string",
            "description": "Threat level"
          },
          "description": {
            "type": "string",
            "description": "Description"
          },
          "hostname": {
            "type": "string",
            "description": "Asset hostname"
          },
          "ip_address": {
            "type": "string",
            "description": "the asset IP address"
          },
          "product_name": {
            "type": "string",
            "description": "Product Name"
          },
          "product_version": {
            "type": "string",
            "description": "Product Version"
          },
          "port": {
            "type": "number",
            "description": "Port number"
          },
          "cve": {
            "type": "object",
            "description": "CVE information",
            "properties": {
              "id": {
                "type": "string",
                "description": "CVE ID"
              },
              "known_exploit": {
                "type": "boolean",
                "description": "true if it is known the CVE was exploited"
              },
              "last_modified_date": {
                "type": "string",
                "description": "Last modified date"
              },
              "severity": {
                "type": "string",
                "description": "Nvd severity"
              },
              "score": {
                "type": "number",
                "description": "Nvd score"
              },
              "description": {
                "type": "string",
                "description": "CVE description"
              },
              "is_in_cisa_kev": {
                "type": "boolean",
                "description": "Is in CISA KEV"
              },
              "cisa_exploit_add": {
                "type": "string",
                "description": "Added date"
              },
              "cisa_action_due": {
                "type": "string",
                "description": "Due Date"
              },
              "cisa_vulnerability_name": {
                "type": "string",
                "description": "cisa vulnerablity name"
              },
              "cisa_required_action": {
                "type": "string",
                "description": "cisa required action"
              },
              "cisa_short_description": {
                "type": "string",
                "description": "cisa short description"
              },
              "cisa_notes": {
                "type": "string",
                "description": "cisa notes"
              }
            },
            "required": [
              "id",
              "known_exploit",
              "last_modified_date",
              "severity",
              "score",
              "description",
              "is_in_cisa_kev",
              "cisa_exploit_add",
              "cisa_action_due",
              "cisa_vulnerability_name",
              "cisa_required_action",
              "cisa_short_description",
              "cisa_notes"
            ],
            "additionalProperties": false
          },
          "malware": {
            "type": "object",
            "description": "Malware information",
            "properties": {
              "family": {
                "type": "string",
                "description": "Malware family"
              },
              "detection_method": {
                "type": "string",
                "description": "Malware Detection Methods"
              }
            },
            "required": [
              "family",
              "detection_method"
            ],
            "additionalProperties": false
          },
          "last_breach": {
            "type": "object",
            "description": "Last breach information",
            "properties": {
              "description": {
                "type": "string",
                "description": "Breach description"
              },
              "source_type": {
                "type": "string",
                "description": "Source type"
              },
              "news_source": {
                "type": "string",
                "description": "Source url (news)"
              },
              "source": {
                "type": "string",
                "description": "Source url (official)"
              },
              "published_at": {
                "type": "string",
                "description": "Breach published date"
              }
            },
            "required": [
              "description",
              "published_at"
            ],
            "additionalProperties": false
          },
          "report": {
            "type": "boolean",
            "description": "Report"
          },
          "triaged": {
            "type": "boolean",
            "description": "Triage"
          },
          "triaged_at": {
            "type": "string",
            "description": "last time the finding was edited"
          },
          "edited_at": {
            "type": "string",
            "description": "last time the finding was edited"
          },
          "edited_by": {
            "type": "string",
            "description": "last editor who updated the finding"
          }
        },
        "required": [
          "vendor_id",
          "vendor_domain",
          "vendor_name",
          "finding_id",
          "customers",
          "information",
          "first_observed_at",
          "last_observed_at",
          "is_active_breach",
          "issue_name",
          "issue_type",
          "category",
          "max_severity",
          "description",
          "report",
          "triaged",
          "triaged_at",
          "edited_at"
        ],
        "additionalProperties": false
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    },
    "total": {
      "type": "integer"
    }
  },
  "additionalProperties": true,
  "required": [
    "entries",
    "page",
    "size",
    "total"
  ]
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/findings' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

