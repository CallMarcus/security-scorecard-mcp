# Get all the ip tags of the parent domain

- **Method:** `GET`
- **Path:** `/ip-domain-tags/parent-domains/{parentDomain}/ips`
- **Tag:** `Api`
- **operationId:** `getApiByParentdomainIpRelatedTags`

## Path Parameters
- `parentDomain` (**required**) — parent domain

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
          "id": {
            "type": "string",
            "description": "tag organization id"
          },
          "name": {
            "type": "string",
            "description": "tag name"
          }
        },
        "required": [
          "id",
          "name"
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
  'https://api.securityscorecard.io//ip-domain-tags/parent-domains/<parentDomain>/ips' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

