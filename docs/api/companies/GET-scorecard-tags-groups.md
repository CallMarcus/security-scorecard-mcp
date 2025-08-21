# Get all scorecard tag groups

- **Method:** `GET`
- **Path:** `/scorecard-tags/groups`
- **Category:** `companies`
- **Operation ID:** `get_scorecard-tags-groups`

## Description

Get all scorecard tag groups

## Responses

### 200
a list of Scorecard Tag Groups
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
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$",
            "description": "the id of the scorecard tag group"
          },
          "name": {
            "type": "string",
            "description": "scorecard tag group name"
          },
          "tag_ids": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false,
        "required": [
          "name"
        ],
        "description": "Scorecard Tag Group"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "a list of Scorecard Tag Groups"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/scorecard-tags/groups' \
  -H 'Authorization: Bearer <your-api-token>'
```
