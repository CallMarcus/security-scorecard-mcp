# Get a SCIM resource type by ID

- **Method:** `GET`
- **Path:** `/scim/v2/ResourceTypes/{id}`
- **Tag:** `Scim`
- **operationId:** `get_scim-v2-resourcetypes-id`

## Description
Get a SCIM resource type by ID

## Path Parameters
- `id` (**required**) — resource type id (User or Group)

## Responses
### 200
Resource Type
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
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//scim/v2/ResourceTypes/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

