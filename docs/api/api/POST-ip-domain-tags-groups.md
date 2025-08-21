# Create a new ip domain tag group

- **Method:** `POST`
- **Path:** `/ip-domain-tags/groups`
- **Tag:** `Api`
- **operationId:** `postApiTagGroups`

## Request Body
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "tag group name"
    },
    "description": {
      "type": "string",
      "default": "",
      "description": "tag group description"
    }
  },
  "required": [
    "name"
  ],
  "additionalProperties": false
}
```

## Responses
### 200
tag group schema
```json
{
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
      "description": "array of tag ids"
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
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//ip-domain-tags/groups' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

