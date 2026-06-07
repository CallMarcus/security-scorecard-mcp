# upload a new document

- **Method:** `POST`
- **Path:** `/managed-services/documents/upload`
- **Tag:** `ManagedServices`
- **operationId:** `post_managed-services-documents-upload`

## Description
upload a new document

## Request Body
```json
{
  "type": "object",
  "properties": {
    "description": {
      "type": "string",
      "description": "file description"
    },
    "category": {
      "type": "string",
      "enum": [
        "likelihood-assessment",
        "zdaas-reports",
        "customer-uploaded",
        "weekly-reports",
        "questionnaire-analysis",
        "other"
      ],
      "description": "document category"
    },
    "associatedVendorIds": {
      "type": "string",
      "description": "a stringified array of vendor ids associated with the uploaded file"
    },
    "customerId": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "description": "a customer id the document is associated with"
    },
    "file": {
      "type": "string",
      "description": "document file"
    }
  },
  "additionalProperties": false,
  "required": [
    "customerId",
    "file"
  ]
}
```

## Responses
### 201
response of create document request
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id"
  ],
  "description": "response of create document request"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//managed-services/documents/upload' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

