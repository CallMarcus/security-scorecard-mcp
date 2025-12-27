# get list of documents

- **Method:** `GET`
- **Path:** `/managed-services/documents/{customer_id}`
- **Tag:** `ManagedServices`
- **operationId:** `get_managed-services-documents-customer-id`

## Description
get list of documents

## Path Parameters
- `customer_id` (**required**) — id of a customer

## Query Parameters
- `page` (optional, integer) — page number, 0 is the first page
- `limit` (optional, integer) — page limit, the amount of items per page (max: 200)
- `sort` (optional, string) — url encoded json sort string
- `search` (optional, string) — url encoded json search string
- `filter` (optional, string) — url encoded json filter string

## Responses
### 200
a list of documents for current client
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
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
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "customer_id",
          "filename",
          "description",
          "created_at",
          "created_by"
        ],
        "description": "max document"
      }
    },
    "total": {
      "type": "integer",
      "x-example": 20
    }
  },
  "additionalProperties": false,
  "required": [
    "entries",
    "total"
  ],
  "description": "a list of documents for current client"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//managed-services/documents/<customer_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

