# Edit an ip domain tag group

- **Method:** `PUT`
- **Path:** `/ip-domain-tags/groups/{id}`
- **Tag:** `Api`
- **operationId:** `putApiTagGroupsById`

## Path Parameters
- `id` (**required**) — tag group id

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
      "description": "tag group description"
    }
  },
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
curl -X PUT \
  'https://api.securityscorecard.io//ip-domain-tags/groups/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

