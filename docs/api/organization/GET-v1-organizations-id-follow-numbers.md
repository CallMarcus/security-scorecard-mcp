# get follows from organizations

- **Method:** `GET`
- **Path:** `/v1/organizations/{id}/follow-numbers`
- **Tag:** `Organization`
- **operationId:** `get_v1-organizations-id-follow-numbers`

## Description
get follows from organizations

## Path Parameters
- `id` (**required**) — id of user organization

## Responses
### 200
number of followed companies
```json
{
  "type": "object",
  "properties": {
    "size": {
      "type": "number",
      "description": "number of all follows"
    },
    "available_slots": {
      "type": "number",
      "description": "number of available slots"
    }
  },
  "additionalProperties": false,
  "required": [
    "size",
    "available_slots"
  ],
  "description": "number of followed companies"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/organizations/<id>/follow-numbers' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

