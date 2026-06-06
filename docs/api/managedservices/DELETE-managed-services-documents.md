# delete provided documents

- **Method:** `DELETE`
- **Path:** `/managed-services/documents`
- **Tag:** `ManagedServices`
- **operationId:** `delete_managed-services-documents`

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

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//managed-services/documents' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

