# Get all scorecard tags

- **Method:** `GET`
- **Path:** `/scorecard-tags`
- **Tag:** `Tag`
- **operationId:** `get_scorecard-tags`

## Description
Get all scorecard tags

## Responses
### 200
a list of scorecard tags
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
            "description": "unique identifier of the scorecard tag"
          },
          "name": {
            "type": "string",
            "x-example": "Example Tag Name"
          },
          "description": {
            "type": "string",
            "x-example": "Example Description"
          }
        },
        "additionalProperties": false,
        "required": [
          "name"
        ],
        "description": "a scorecard tag"
      }
    },
    "total": {
      "type": "integer",
      "x-example": 20
    }
  },
  "additionalProperties": false,
  "required": [
    "entries",
    "total"
  ],
  "description": "a list of scorecard tags"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//scorecard-tags' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

