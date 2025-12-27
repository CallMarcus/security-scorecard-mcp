# Gets customers managed by the partner

- **Method:** `GET`
- **Path:** `/max/v1/partner/managed-customers`
- **Tag:** `V1`
- **operationId:** `getV1PartnerManagedCustomers`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `sort` (optional, string) — stringified object with value for column to sort by and operator
- `last_update_sent` (optional, string) — Last update sent filter, accept stringified object with date value and operator
- `search` (optional, string) — Search by customer name or domain

## Responses
### 200
Customers
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
            "description": "Id of the customer"
          },
          "customer_name": {
            "type": "string",
            "description": "Name of the customer"
          },
          "customer_domain": {
            "type": "string",
            "description": "Domain of the customer"
          },
          "managed_vendors": {
            "type": "number",
            "description": "Number of managed vendors"
          },
          "available_slots": {
            "type": "number",
            "description": "Number of available slots"
          },
          "last_update_sent": {
            "type": "string",
            "description": "Last update sent"
          },
          "engagement_active_breach": {
            "type": "number",
            "description": "Number of engagement active breach"
          },
          "silver_vendors": {
            "type": "number",
            "description": "Number of silver vendors"
          },
          "gold_vendors": {
            "type": "number",
            "description": "Number of gold vendors"
          },
          "platinum_vendors": {
            "type": "number",
            "description": "Number of platinum vendors"
          },
          "unknown_vendors": {
            "type": "number",
            "description": "Number of unknown vendors"
          },
          "total_utilization": {
            "type": "number",
            "description": "Total utilization"
          },
          "silver_available_slots": {
            "type": "number",
            "description": "Number of silver available slots"
          },
          "gold_available_slots": {
            "type": "number",
            "description": "Number of gold available slots"
          },
          "platinum_available_slots": {
            "type": "number",
            "description": "Number of platinum available slots"
          },
          "active_breaches": {
            "type": "number",
            "description": "Number of active breaches"
          }
        },
        "required": [
          "customer_id",
          "customer_name",
          "customer_domain",
          "managed_vendors",
          "available_slots",
          "last_update_sent",
          "engagement_active_breach",
          "silver_vendors",
          "gold_vendors",
          "platinum_vendors",
          "unknown_vendors",
          "total_utilization",
          "silver_available_slots",
          "gold_available_slots",
          "platinum_available_slots",
          "active_breaches"
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
  'https://api.securityscorecard.io//max/v1/partner/managed-customers' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

