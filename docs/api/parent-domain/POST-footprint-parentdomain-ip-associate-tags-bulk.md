# bulk associate IPs with tags.

- **Method:** `POST`
- **Path:** `/footprint/{parentDomain}/ip/associate-tags/bulk`
- **Tag:** `{Parent Domain}`
- **operationId:** `postByParentdomainIpAssociateTagsBulk`

## Path Parameters
- `parentDomain` (**required**) — parent domain that the ip is associated with

## Request Body
```json
{
  "type": "object",
  "properties": {
    "ips": {
      "type": "array",
      "description": "ips to bulk association",
      "items": {
        "type": "object",
        "properties": {
          "ip": {
            "description": "Ip target",
            "type": "string"
          },
          "add_tags": {
            "type": "array",
            "description": "array of tag ids"
          },
          "remove_tags": {
            "type": "array",
            "description": "array of tag ids"
          }
        }
      }
    }
  },
  "required": [
    "ips"
  ],
  "additionalProperties": false
}
```

## Responses
### 200
ip schema
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "ip": {
            "type": "string",
            "description": "ip address"
          },
          "tags": {
            "type": "array",
            "description": "array of tag ids",
            "items": {}
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
curl -X POST \
  'https://api.securityscorecard.io//footprint/<parentDomain>/ip/associate-tags/bulk' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

