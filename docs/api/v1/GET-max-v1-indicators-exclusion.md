# Get list of indicator exclusion for the current partner

- **Method:** `GET`
- **Path:** `/max/v1/indicators/exclusion`
- **Tag:** `V1`
- **operationId:** `getV1IndicatorsExclusion`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `search` (optional, string) — word or phrase to search breaches for
- `sort` (optional, string) — stringified object with value for column to order by and operator
- `customer_id` (optional, string) — Customer ID filter, it also accepts a comma separated list of customer ids
- `scope` (optional, string) — Scope filter, it can be partner, vendor or customer, it also accepts a comma separated list of the previous values
- `vendor_id` (optional, string) — Vendor ID filter, it also accepts a comma separated list of customer ids
- `max_severity` (optional, string) — Max Severity filter, it also accepts a comma separated list of severities
- `issue_category` (optional, string) — Category filter, it also accepts a comma separated list of categories
- `issue_type_key` (optional, string) — Issue type key filter, it also accepts a comma separated list of issue types

## Responses
### 200
a list of all indicator exclusions
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "issue_type": {
            "type": "string",
            "description": "ID of the indicator and Issue Type"
          },
          "scope": {
            "type": "string",
            "enum": [
              "partner",
              "customer",
              "vendor"
            ],
            "description": "Scope of the exclusion, can be: partner (everybody), vendor or customer"
          },
          "customer_id": {
            "type": "string",
            "description": "ID of the customer if the scope is customer"
          },
          "customer_name": {
            "type": "string",
            "description": "Name of the customer if the scope is customer"
          },
          "vendor_id": {
            "type": "string",
            "description": "ID of the vendor if the scope is vendor"
          },
          "vendor_name": {
            "type": "string",
            "description": "Name of the vendor if the scope is vendor"
          },
          "vendor_domain": {
            "type": "string",
            "description": "Domain of the vendor if the scope is vendor"
          },
          "redundant": {
            "type": "boolean",
            "description": "If the exclusion is redundant"
          },
          "edited_at": {
            "type": "string",
            "description": "Date of the last edition"
          },
          "edited_by": {
            "type": "string",
            "description": "User Email of the last editor"
          },
          "reason": {
            "type": "string",
            "description": "Reason for the exclusion"
          },
          "issue_type_name": {
            "type": "string",
            "description": "Name of the issue type"
          },
          "issue_type_severity": {
            "type": "string",
            "description": "Severity of the issue type"
          },
          "issue_type_category": {
            "type": "string",
            "description": "Category of the issue type"
          },
          "issue_type_breach_risk": {
            "type": "string",
            "description": "Breach risk"
          },
          "issue_type_threat_level": {
            "type": "string",
            "description": "Threat level"
          }
        },
        "required": [
          "id",
          "issue_type",
          "scope",
          "redundant",
          "edited_at",
          "edited_by",
          "issue_type_name",
          "issue_type_severity",
          "issue_type_category",
          "issue_type_breach_risk",
          "issue_type_threat_level"
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
  'https://api.securityscorecard.io//max/v1/indicators/exclusion' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

