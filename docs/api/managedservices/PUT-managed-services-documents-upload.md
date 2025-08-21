# edit metadata of already uploaded document

- **Method:** `PUT`
- **Path:** `/managed-services/documents/upload`
- **Tag:** `ManagedServices`
- **operationId:** `put_managed-services-documents-upload`

## Description
edit metadata of already uploaded document

## Request Body
```json
{
  "type": "object",
  "properties": {
    "filename": {
      "type": "string",
      "description": "a filename"
    },
    "description": {
      "type": "string",
      "description": "file description"
    },
    "associatedVendorIds": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "an array of vendor ids associated with the uploaded file"
    },
    "documentId": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "description": "a unique identifier of the uploaded document"
    }
  },
  "additionalProperties": false,
  "required": [
    "documentId"
  ]
}
```

## Responses
### 200
No response body

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//managed-services/documents/upload' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

