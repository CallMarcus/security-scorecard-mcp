# Add a tag to an ip

- **Method:** `POST`
- **Path:** `/ip-domain-tags/{tagId}/parent-domains/{parentDomain}/ip/{ip}`
- **Tag:** `Api`
- **operationId:** `postApiByParentdomainIpByIpAssociateTagsByTagid`

## Path Parameters
- `parentDomain` (**required**) — parent domain
- `ip` (**required**) — ip
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
ip association schema
```json
{
  "type": "object",
  "properties": {
    "ip": {
      "type": "string",
      "description": "ip address"
    },
    "tags": {
      "type": "array",
      "description": "array of tag ids"
    },
    "organization_id": {
      "type": "string",
      "description": "orgarnization id"
    },
    "parent_domain": {
      "type": "string",
      "description": "ip parent domain"
    }
  },
  "required": [
    "ip",
    "tags",
    "organization_id",
    "parent_domain"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//ip-domain-tags/<tagId>/parent-domains/<parentDomain>/ip/<ip>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

