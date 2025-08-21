# Add editors to plan by ID

- **Method:** `POST`
- **Path:** `/plans/{id}/editors`
- **Category:** `improvement-plans`
- **Operation ID:** `postPlansByIdEditors`

## Path Parameters

- `id` (**Required**) - unique plan id

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

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/plans/<id>/editors' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
