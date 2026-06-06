# delete provided documents

- **Method:** `DELETE`
- **Path:** `/managed-services/documents`
- **Category:** `managed-services`
- **Operation ID:** `delete_managed-services-documents`

## Description

delete provided documents

## Request Body

```json
{
  "type": "object",
  "properties": {
    "documentIds": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "a stringified array of document ids to delete"
    }
  },
  "additionalProperties": false,
  "required": [
    "documentIds"
  ]
}
```

## Responses

### 200
Success confirmation message

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/managed-services/documents' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
