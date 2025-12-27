# Gets the list of remediation plans for a partner

- **Method:** `GET`
- **Path:** `/max/v1/partner/remediation-plans`
- **Tag:** `V1`
- **operationId:** `getV1PartnerRemediationPlans`

## Query Parameters
- `search` (optional, string) — word or phrase to search for
- `sort` (optional, string) — stringified object with value for column to sort by and operator
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `vendor_domain` (optional, string) — Vendor domains whoes report is needed comma separated
- `tiers` (optional, string) — Tiers comma separated
- `incident_likelihoods` (optional, string) — incident likelihood comma separated
- `business_impacts` (optional, string) — business impacts comma separated
- `customer_domain` (optional, string) — Customer Domain whoes report is needed comma separated
- `published` (optional, string) — boolean to get the published reports
- `published_at` (optional, string) — published at filter, accept stringified object with date value and operator
- `hide_report_body` (optional, string) — pass true if we dont need the report body

## Responses
### 200
A list of remediation plan data
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "updated_at": {
            "type": "string"
          },
          "updated_by": {
            "type": "string"
          },
          "id": {
            "type": "string"
          },
          "customer_name": {
            "type": "string",
            "description": "Name of the customer"
          },
          "customer_domain": {
            "type": "string"
          },
          "vendor_name": {
            "type": "string"
          },
          "vendor_domain": {
            "type": "string"
          },
          "created_at": {
            "type": "string"
          },
          "is_published": {
            "type": "boolean"
          },
          "published_at": {
            "type": "string"
          },
          "published_by": {
            "type": "string"
          },
          "incident_likelihood": {
            "type": "string"
          },
          "remediation_plan": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "risk_severity": {
                  "type": "string"
                },
                "risk_category": {
                  "type": "string"
                },
                "remediation_actions": {
                  "type": "string"
                },
                "evidence": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "title": {
                        "type": "string"
                      },
                      "key": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "title",
                      "key"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "risk_severity",
                "risk_category",
                "remediation_actions",
                "evidence"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "updated_at",
          "updated_by",
          "customer_name",
          "customer_domain",
          "vendor_name",
          "vendor_domain",
          "created_at",
          "is_published",
          "published_at",
          "published_by"
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
  'https://api.securityscorecard.io//max/v1/partner/remediation-plans' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

