# Add editors to plan by ID

- **Method:** `POST`
- **Path:** `/plans/{id}/editors`
- **Tag:** `action plans`
- **operationId:** `postPlansByIdEditors`

## Path Parameters
- `id` (**required**) — unique plan id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "editors": {
      "type": "array",
      "description": "list of editors (user emails) that can edit the plan",
      "items": {
        "type": "string"
      },
      "example": [],
      "default": []
    }
  },
  "additionalProperties": false
}
```

## Responses
### 201
editor was added successfully
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
  'https://api.securityscorecard.io//plans/<id>/editors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

