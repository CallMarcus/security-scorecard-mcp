# Get all ip domain tags

- **Method:** `GET`
- **Path:** `/ip-domain-tags`
- **Tag:** `Api`
- **operationId:** `getApi`

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

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//ip-domain-tags' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

