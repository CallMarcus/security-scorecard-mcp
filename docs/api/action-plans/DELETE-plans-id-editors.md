# Remove editors from plan by ID

- **Method:** `DELETE`
- **Path:** `/plans/{id}/editors`
- **Tag:** `action plans`
- **operationId:** `deletePlansByIdEditors`

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
### 204
successful response

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//plans/<id>/editors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

