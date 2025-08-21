# get document data with download url

- **Method:** `GET`
- **Path:** `/managed-services/documents/download/{document_id}`
- **Category:** `managed-services`
- **Operation ID:** `get_managed-services-documents-download-document-id`

## Description

get document data with download url

## Path Parameters

- `document_id` (**Required**) - id of a document

## Responses

### 200
document data with presigned download url
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "customer_id": {
      "type": "string"
    },
    "filename": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "created_at": {
      "type": "string"
    },
    "created_by": {
      "type": "string"
    },
    "associated_vendors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "domain": {
            "type": "string",
            "x-example": "example.org"
          },
          "name": {
            "type": "string",
            "x-example": "Example Org"
          },
          "id": {
            "type": "string",
            "x-example": "d5e43774-4358-4e70-85be-69ae2b62640b"
          }
        },
        "additionalProperties": false,
        "required": [
          "domain",
          "name",
          "id"
        ]
      }
    },
    "url": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "customer_id",
    "filename",
    "description",
    "created_at",
    "created_by",
    "url"
  ],
  "description": "document data with presigned download url"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/managed-services/documents/download/<document_id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
