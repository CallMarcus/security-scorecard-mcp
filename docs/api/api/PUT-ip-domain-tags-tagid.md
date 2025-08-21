# Edit an ip domain tag

- **Method:** `PUT`
- **Path:** `/ip-domain-tags/{tagId}`
- **Tag:** `Api`
- **operationId:** `putApiByTagid`

## Path Parameters
- `tagId` (**required**) — id tag

## Request Body
```json
{
  "type": "object",
  "properties": {
    "tag": {
      "type": "string",
      "description": "name of the tag to be updated"
    },
    "description": {
      "type": "string",
      "description": "description for the tag to be updated"
    }
  },
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
curl -X PUT \
  'https://api.securityscorecard.io//ip-domain-tags/<tagId>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

