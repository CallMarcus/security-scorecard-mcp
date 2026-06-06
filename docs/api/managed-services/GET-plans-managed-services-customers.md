# Get a list of customers for managed services plans.

- **Method:** `GET`
- **Path:** `/plans/managed-services/customers`
- **Category:** `managed-services`
- **Operation ID:** `getPlansManagedServicesCustomers`

## Query Parameters

- `search` (string, Optional) - search text to look into vendors name or domains

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

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/plans/managed-services/customers' \
  -H 'Authorization: Bearer <your-api-token>'
```
