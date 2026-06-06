# Update the remediation plans in bulk by id

- **Method:** `PATCH`
- **Path:** `/plans/remediation/{id}/items`
- **Category:** `improvement-plans`
- **Operation ID:** `patchPlansRemediationByIdItems`

## Path Parameters

- `id` (**Required**) - unique plan id

## Request Body

```json
{
  "type": "object",
  "properties": {
    "ids": {
      "type": "array",
      "description": "List of items to update",
      "items": {
        "type": "string"
      }
    },
    "status": {
      "type": "string"
    }
  },
  "required": [
    "ids",
    "status"
  ],
  "additionalProperties": false
}
```

## Responses

### 204

## Example Request

```bash
curl -X PATCH \
  'https://platform.securityscorecard.io/plans/remediation/<id>/items' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
