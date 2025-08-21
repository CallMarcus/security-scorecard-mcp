# Remove guests from plan by ID

- **Method:** `DELETE`
- **Path:** `/plans/{id}/guests`
- **Tag:** `action plans`
- **operationId:** `deletePlansByIdGuests`

## Path Parameters
- `id` (**required**) — unique plan id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "guests": {
      "type": "array",
      "description": "list of guests (user emails) that can access to the plan",
      "items": {
        "type": "string"
      },
      "example": []
    }
  },
  "required": [
    "guests"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
successful response

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//plans/<id>/guests' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

