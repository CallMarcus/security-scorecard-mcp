# Remove a tag from a domain

- **Method:** `DELETE`
- **Path:** `/ip-domain-tags/{tagId}/parent-domains/{parentDomain}/domain/{domain}`
- **Tag:** `Api`
- **operationId:** `deleteApiByParentdomainDomainByDomainAssociateTagsByTagid`

## Path Parameters
- `parentDomain` (**required**) — parent domain
- `domain` (**required**) — domain
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
domain association schema
```json
{
  "type": "object",
  "properties": {
    "domain": {
      "type": "string",
      "description": "domain"
    },
    "tags": {
      "type": "array",
      "description": "array of tag ids"
    },
    "organization_id": {
      "type": "string",
      "description": "orgarnization id"
    }
  },
  "required": [
    "domain",
    "tags",
    "organization_id"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//ip-domain-tags/<tagId>/parent-domains/<parentDomain>/domain/<domain>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

