# bulk tags creation

- **Method:** `POST`
- **Path:** `/footprint/tags/bulk`
- **Category:** `asset-footprint`
- **Operation ID:** `postTagsBulk`

## Request Body

```json
{
  "type": "object",
  "properties": {
    "tags": {
      "type": "array",
      "description": "tags to bulk creation",
      "items": {
        "type": "object",
        "properties": {
          "tag": {
            "description": "tag name",
            "type": "string"
          },
          "description": {
            "description": "tag description",
            "type": "string"
          },
          "is_public": {
            "description": "public tag flag",
            "type": "boolean"
          }
        }
      }
    }
  },
  "required": [
    "tags"
  ],
  "additionalProperties": false
}
```

## Responses

### 200
tag schema
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "organization_id": {
            "type": "string",
            "description": "tag organization id"
          },
          "id": {
            "type": "string",
            "description": "tag organization id"
          },
          "tag": {
            "type": "string",
            "description": "tag name"
          },
          "description": {
            "type": "string",
            "description": "tag description"
          }
        },
        "required": [
          "id",
          "tag",
          "description"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "entries"
  ],
  "additionalProperties": false
}
```

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/footprint/tags/bulk' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
