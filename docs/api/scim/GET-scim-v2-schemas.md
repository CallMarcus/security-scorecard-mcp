# List all SCIM schemas

- **Method:** `GET`
- **Path:** `/scim/v2/Schemas`
- **Tag:** `Scim`
- **operationId:** `get_scim-v2-schemas`

## Description
List all SCIM schemas

## Responses
### 200
List of Schemas
```json
{
  "type": "object",
  "properties": {
    "schemas": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "Resources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "attributes": {
            "type": "array",
            "items": {
              "type": "object"
            }
          },
          "meta": {
            "type": "object",
            "properties": {
              "resourceType": {
                "type": "string"
              },
              "location": {
                "type": "string"
              }
            },
            "additionalProperties": true,
            "required": [
              "resourceType",
              "location"
            ]
          }
        },
        "additionalProperties": true,
        "required": [
          "id",
          "name",
          "attributes"
        ],
        "description": "SCIM Schema"
      }
    },
    "itemsPerPage": {
      "type": "integer"
    },
    "startIndex": {
      "type": "integer"
    },
    "totalResults": {
      "type": "integer"
    }
  },
  "additionalProperties": true,
  "required": [
    "schemas",
    "Resources",
    "itemsPerPage",
    "startIndex",
    "totalResults"
  ],
  "description": "SCIM Schema List"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//scim/v2/Schemas' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

