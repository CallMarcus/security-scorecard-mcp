# Gets all the vendors and there information for a partner

- **Method:** `GET`
- **Path:** `/max/v1/customer/{customer_id}/slots`
- **Tag:** `V1`
- **operationId:** `getV1CustomerByCustomeridSlots`

## Path Parameters
- `customer_id` (**required**) — Customer ID to get the slots count

## Responses
### 200
Gets the list all the vendors of a partner
```json
{
  "type": "object",
  "properties": {
    "total": {
      "type": "number",
      "description": "slots set from intranet"
    },
    "used": {
      "type": "number",
      "description": "slots consumed"
    },
    "updated_at": {
      "type": "string",
      "description": "updated at time"
    },
    "updated_by": {
      "type": "string",
      "description": "updated by email"
    }
  },
  "required": [
    "total",
    "used",
    "updated_at",
    "updated_by"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/<customer_id>/slots' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

