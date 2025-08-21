# Remove item from plan

- **Method:** `DELETE`
- **Path:** `/plans/{id}/items`
- **Tag:** `action plans`
- **operationId:** `deletePlansByIdItems`

## Path Parameters
- `id` (**required**) — unique plan id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "ids": {
      "type": "array",
      "description": "List of item ids",
      "items": {
        "type": "string",
        "description": "unique item id"
      }
    }
  },
  "required": [
    "ids"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
the item was removed

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//plans/<id>/items' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

