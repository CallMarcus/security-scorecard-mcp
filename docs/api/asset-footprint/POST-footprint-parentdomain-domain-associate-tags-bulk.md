# bulk associate domains with tags.

- **Method:** `POST`
- **Path:** `/footprint/{parentDomain}/domain/associate-tags/bulk`
- **Category:** `asset-footprint`
- **Operation ID:** `postByParentdomainDomainAssociateTagsBulk`

## Path Parameters

- `parentDomain` (**Required**) - parent domain that the domain is associated with

## Request Body

```json
{
  "type": "object",
  "properties": {
    "domains": {
      "type": "array",
      "description": "domains to bulk association",
      "items": {
        "type": "object",
        "properties": {
          "domain": {
            "description": "domain target",
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
    "domains"
  ],
  "additionalProperties": false
}
```

## Responses

### 200
domain schema
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "domain": {
            "type": "string",
            "description": "domain"
          },
          "tags": {
            "type": "array",
            "description": "array of tag ids",
            "items": {}
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
    }
  },
  "required": [
    "entries"
  ],
  "additionalProperties": false
}
```

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/footprint/<parentDomain>/domain/associate-tags/bulk' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
