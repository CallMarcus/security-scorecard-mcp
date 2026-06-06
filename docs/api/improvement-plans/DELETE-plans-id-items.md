# Remove item from plan

- **Method:** `DELETE`
- **Path:** `/plans/{id}/items`
- **Category:** `improvement-plans`
- **Operation ID:** `deletePlansByIdItems`

## Path Parameters

- `id` (**Required**) - unique plan id

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

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/plans/<id>/items' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
