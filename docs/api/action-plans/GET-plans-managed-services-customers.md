# Get a list of customers for managed services plans.

- **Method:** `GET`
- **Path:** `/plans/managed-services/customers`
- **Tag:** `action plans`
- **operationId:** `getPlansManagedServicesCustomers`

## Query Parameters
- `search` (optional, string) — search text to look into vendors name or domains

## Responses
### 200
a list of customers visible by the user
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
          "domain": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "domain"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "entries"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//plans/managed-services/customers' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

