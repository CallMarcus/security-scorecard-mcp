# Gets breaches for the current customer

- **Method:** `GET`
- **Path:** `/max/v1/customer/breaches`
- **Tag:** `V1`
- **operationId:** `getV1CustomerBreaches`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `triaged` (optional, string) — true for findings that are set to be triaged
- `report` (optional, string) — true for findings that are set to be reported
- `vendor_id` (optional, string) — Vendor ID filter, it also accepts a comma separated list of vendor ids
- `vendor_domain` (optional, string) — Vendor domain filter, it also accepts a comma separated list of domains
- `vendor_name` (optional, string) — Vendor name filter, it also accepts a comma separated list of strings
- `published_at` (optional, string) — Published date filter, accept stringified object with date value and operator
- `tiers` (optional, string) — The tiers to filter the breaches. Optional, defaults to all tiers.
- `search` (optional, string) — word or phrase to search breaches for
- `sort` (optional, string) — stringified object with value for column to order by and operator

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
  'https://api.securityscorecard.io//max/v1/customer/breaches' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

