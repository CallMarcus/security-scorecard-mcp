# Remove guests from plan by ID

- **Method:** `DELETE`
- **Path:** `/plans/{id}/guests`
- **Category:** `improvement-plans`
- **Operation ID:** `deletePlansByIdGuests`

## Path Parameters

- `id` (**Required**) - unique plan id

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

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/plans/<id>/guests' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
