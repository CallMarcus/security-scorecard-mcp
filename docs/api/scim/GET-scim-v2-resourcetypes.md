# List all SCIM resource types

- **Method:** `GET`
- **Path:** `/scim/v2/ResourceTypes`
- **Tag:** `Scim`
- **operationId:** `get_scim-v2-resourcetypes`

## Description
List all SCIM resource types

## Responses
### 200
List of Resource Types
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
          "schemas": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "endpoint": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "schema": {
            "type": "string"
          },
          "schemaExtensions": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "schema": {
                  "type": "string"
                },
                "required": {
                  "type": "boolean"
                }
              },
              "additionalProperties": false,
              "required": [
                "schema",
                "required"
              ]
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
          "schemas",
          "id",
          "name",
          "endpoint",
          "schema"
        ],
        "description": "SCIM Resource Type"
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
  "description": "SCIM Resource Type List"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//scim/v2/ResourceTypes' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

