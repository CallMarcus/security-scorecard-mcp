# Add guests to plan by ID

- **Method:** `POST`
- **Path:** `/plans/{id}/guests`
- **Tag:** `action plans`
- **operationId:** `postPlansByIdGuests`

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
    },
    "is_domain": {
      "type": "boolean",
      "description": "Boolean to check if the guest array is a domain list"
    }
  },
  "required": [
    "guests"
  ],
  "additionalProperties": false
}
```

## Responses
### 201
guest was added successfully
```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "description": "successful response"
    }
  },
  "required": [
    "message"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//plans/<id>/guests' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

