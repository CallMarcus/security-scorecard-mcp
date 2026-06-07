# Get a SCIM schema by ID

- **Method:** `GET`
- **Path:** `/scim/v2/Schemas/{id}`
- **Tag:** `Scim`
- **operationId:** `get_scim-v2-schemas-id`

## Description
Get a SCIM schema by ID

## Path Parameters
- `id` (**required**) — schema id (e.g., urn:ietf:params:scim:schemas:core:2.0:User)

## Responses
### 200
Schema
```json
{
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
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//scim/v2/Schemas/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

