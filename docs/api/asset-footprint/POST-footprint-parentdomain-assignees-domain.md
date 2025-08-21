# add an assignee to the domain

- **Method:** `POST`
- **Path:** `/footprint/{parentDomain}/assignees/domain`
- **Category:** `asset-footprint`
- **Operation ID:** `postByParentdomainAssigneesDomain`

## Path Parameters

- `parentDomain` (**Required**) - parent domain

## Request Body

```json
{
  "type": "object",
  "properties": {
    "assignees": {
      "type": "array",
      "description": "assignees",
      "items": {
        "type": "object",
        "properties": {
          "asset": {
            "description": "asset value",
            "type": "string"
          },
          "user": {
            "description": "user email",
            "type": "string",
            "default": ""
          },
          "team": {
            "description": "team id",
            "type": "string",
            "default": ""
          }
        }
      }
    }
  },
  "required": [
    "assignees"
  ],
  "additionalProperties": false
}
```

## Responses

### 200
assignees schema
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
  'https://platform.securityscorecard.io/footprint/<parentDomain>/assignees/domain' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
