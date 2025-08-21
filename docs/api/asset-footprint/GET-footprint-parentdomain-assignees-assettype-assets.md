# get assignees for a list of assets of a given type

- **Method:** `GET`
- **Path:** `/footprint/{parentDomain}/assignees/{assetType}/assets`
- **Category:** `asset-footprint`
- **Operation ID:** `getByParentdomainAssigneesByAssettypeAssets`

## Path Parameters

- `parentDomain` (**Required**) - parent domain
- `assetType` (**Required**) - type of the assets (e.g., ip, domain)

## Query Parameters

- `assets` (string, Optional) - list of asset identifiers (max 200)

## Responses

### 200
assignees for the given assets
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "asset": {
            "description": "asset value",
            "type": "string"
          },
          "user": {
            "description": "assignee user",
            "type": "string"
          },
          "team": {
            "description": "assignee team",
            "type": "string"
          }
        },
        "required": [
          "asset"
        ],
        "additionalProperties": false
      }
    },
    "size": {
      "type": "number"
    },
    "total": {
      "type": "number"
    }
  },
  "required": [
    "entries",
    "size",
    "total"
  ],
  "additionalProperties": false
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/footprint/<parentDomain>/assignees/<assetType>/assets' \
  -H 'Authorization: Bearer <your-api-token>'
```
