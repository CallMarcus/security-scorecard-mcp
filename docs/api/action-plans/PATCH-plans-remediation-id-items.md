# Update the remediation plans in bulk by id

- **Method:** `PATCH`
- **Path:** `/plans/remediation/{id}/items`
- **Tag:** `action plans`
- **operationId:** `patchPlansRemediationByIdItems`

## Path Parameters
- `id` (**required**) — unique plan id

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


## Example cURL Request
```bash
curl -X PATCH \
  'https://api.securityscorecard.io//plans/remediation/<id>/items' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

