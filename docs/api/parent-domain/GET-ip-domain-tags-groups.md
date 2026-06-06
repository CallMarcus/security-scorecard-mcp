# Get all ip domain tag groups

- **Method:** `GET`
- **Path:** `/ip-domain-tags/groups`
- **Tag:** `{Parent Domain}`
- **operationId:** `getByParentdomainTagGroups`

## Responses
### 200
tag group schema
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
          "name": {
            "type": "string",
            "description": "tag name"
          },
          "tags": {
            "type": "array",
            "description": "array of tag ids",
            "items": {}
          },
          "description": {
            "type": "string",
            "description": "tag description"
          }
        },
        "required": [
          "id",
          "name",
          "tags",
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
  'https://api.securityscorecard.io//ip-domain-tags/groups' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

