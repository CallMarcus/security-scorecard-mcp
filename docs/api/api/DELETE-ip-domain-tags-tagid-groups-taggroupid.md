# Remove ip domain tag to a ip domain tag group

- **Method:** `DELETE`
- **Path:** `/ip-domain-tags/{tagId}/groups/{tagGroupId}`
- **Tag:** `Api`
- **operationId:** `deleteApiGroupsByTaggroupidAssociationByTagid`

## Path Parameters
- `tagGroupId` (**required**) — id of updated tag-group
- `tagId` (**required**) — tag id

## Request Body
```json
{
  "type": "object",
  "properties": {},
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
curl -X DELETE \
  'https://api.securityscorecard.io//ip-domain-tags/<tagId>/groups/<tagGroupId>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

