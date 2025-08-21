# Get a list of vendors for managed services plans.

- **Method:** `GET`
- **Path:** `/plans/managed-services/vendors`
- **Tag:** `action plans`
- **operationId:** `getPlansManagedServicesVendors`

## Query Parameters
- `search` (optional, string) — search text to look into vendors name or domains

## Responses
### 200
a list of vendors visible by the user
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
  'https://api.securityscorecard.io//plans/managed-services/vendors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

