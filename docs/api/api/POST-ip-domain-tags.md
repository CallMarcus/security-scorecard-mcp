# Create an ip domain tag

- **Method:** `POST`
- **Path:** `/ip-domain-tags`
- **Tag:** `Api`
- **operationId:** `postApi`

## Request Body
```json
{
  "type": "object",
  "properties": {
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
    "tag"
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
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//ip-domain-tags' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

