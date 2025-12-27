# Gets the list of schedules for the partner customer vendors

- **Method:** `GET`
- **Path:** `/max/v1/partner/schedules`
- **Tag:** `V1`
- **operationId:** `getV1PartnerSchedules`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `search` (optional, string) — word or phrase to search for
- `sort` (optional, string) — stringified object with value for column to sort by and operator
- `customer_id` (optional, string) — Customer id or comma separated list of customer ids
- `customer_domain` (optional, string) — Customer domain or comma separated list of customer domains
- `vendor_id` (optional, string) — Vendor id or comma separated list of vendor ids
- `vendor_domain` (optional, string) — Vendor domain or comma separated list of vendor domains
- `start_due_date` (optional, string) — Filter out records with due date older than this one (YYYY-MM-DD)
- `end_due_date` (optional, string) — Filter out records with due date newer than this one (YYYY-MM-DD)
- `status` (optional, string) — Schedule status or a comma separated list of statuses: scheduled, upcoming or overdue

## Responses
### 200
List if customer vendor pair and their schedules
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "customer_id": {
            "type": "string",
            "description": "id of the customer"
          },
          "customer_name": {
            "type": "string",
            "description": "name of the customer"
          },
          "customer_domain": {
            "type": "string",
            "description": "domain of the customer"
          },
          "vendor_id": {
            "type": "string",
            "description": "id of the vendor"
          },
          "vendor_name": {
            "type": "string",
            "description": "name of the vendor"
          },
          "vendor_domain": {
            "type": "string",
            "description": "domain of the vendor"
          },
          "status": {
            "type": "string",
            "enum": [
              "overdue",
              "upcoming",
              "scheduled"
            ]
          },
          "is_custom_due_date": {
            "type": "boolean",
            "description": "If the partner has set a custom due date, this flag will be true"
          },
          "due_date": {
            "type": "string",
            "description": "Due date of the schedule"
          },
          "last_published_at": {
            "type": "string",
            "description": "Last published at date of the report published for the customer vendor"
          },
          "draft_count": {
            "type": "number",
            "description": "If the partner has set a custom due date, this flag will be true"
          },
          "business_impact": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "none"
            ]
          },
          "tier": {
            "type": "string",
            "enum": [
              "platinum",
              "gold",
              "silver",
              "low",
              "none"
            ]
          },
          "created_at": {
            "type": "string",
            "description": "created at date of the schedule"
          },
          "edited_at": {
            "type": "string",
            "description": "Edited date of the schedule"
          }
        },
        "required": [
          "customer_id",
          "customer_name",
          "customer_domain",
          "vendor_id",
          "vendor_name",
          "vendor_domain",
          "status",
          "is_custom_due_date",
          "due_date",
          "last_published_at",
          "draft_count",
          "business_impact",
          "tier",
          "created_at",
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
  'https://api.securityscorecard.io//max/v1/partner/schedules' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

