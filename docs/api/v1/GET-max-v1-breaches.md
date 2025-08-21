# Gets breaches

- **Method:** `GET`
- **Path:** `/max/v1/breaches`
- **Tag:** `V1`
- **operationId:** `getV1Breaches`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `triaged` (optional, string) — true for findings that are set to be triaged
- `report` (optional, string) — true for findings that are set to be reported
- `customer_id` (optional, string) — Customer ID filter, it also accepts a comma separated list of customer ids
- `customer_name` (optional, string) — Customer name filter, it also accepts a comma separated list of customer names
- `customer_domain` (optional, string) — Customer domain filter, it also accepts a comma separated list of customer domains
- `vendor_id` (optional, string) — Vendor ID filter, it also accepts a comma separated list of vendor ids
- `vendor_domain` (optional, string) — Vendor domain filter, it also accepts a comma separated list of domains
- `vendor_name` (optional, string) — Vendor name filter, it also accepts a comma separated list of strings
- `published_at` (optional, string) — Published date filter, accept stringified object with date value and operator
- `search` (optional, string) — word or phrase to search breaches for
- `tiers` (optional, string) — tiers comma separated
- `sort` (optional, string) — stringified object with value for column to order by and operator
- `triaged_at` (optional, string) — get the findings that have ben triaged in a specific date range

## Responses
### 200
Gets the list of breaches
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_id": {
            "type": "string",
            "description": "id of the vendor"
          },
          "vendor_domain": {
            "type": "string",
            "description": "domain of the vendor"
          },
          "vendor_name": {
            "type": "string",
            "description": "name of the vendor"
          },
          "breach_id": {
            "type": "string",
            "description": "id of the breach"
          },
          "description": {
            "type": "string",
            "description": "description of the breach"
          },
          "link": {
            "type": "string",
            "description": "source URL of the breach"
          },
          "published_date": {
            "type": "string",
            "description": "published date of the breach"
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
          "report": {
            "type": "boolean",
            "description": "report"
          },
          "triaged": {
            "type": "boolean",
            "description": "triaged"
          },
          "is_active_breach": {
            "type": "boolean",
            "description": "vendor has breach"
          },
          "edited_at": {
            "type": "string",
            "description": "last edition of report or trigger fields"
          },
          "triaged_at": {
            "type": "string",
            "description": "last triage date"
          },
          "edited_by": {
            "type": "string",
            "description": "last editor of report or trigger fields"
          }
        },
        "required": [
          "vendor_id",
          "vendor_domain",
          "vendor_name",
          "breach_id",
          "description",
          "link",
          "published_date",
          "customers",
          "report",
          "triaged",
          "is_active_breach",
          "edited_at",
          "triaged_at"
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
  'https://api.securityscorecard.io//max/v1/breaches' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

