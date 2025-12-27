# Get list of all issue types

- **Method:** `GET`
- **Path:** `/max/v2/indicators`
- **Tag:** `V2`
- **operationId:** `getV2Indicators`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `search` (optional, string) — word or phrase to search breaches for
- `sort` (optional, string) — stringified object with value for column to order by and operator

## Responses
### 200
a list of all issue types
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "issue_type": {
            "type": "string",
            "description": "ID of the indicator and Issue Type"
          },
          "name": {
            "type": "string"
          },
          "severity": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "breach_risk": {
            "type": "string",
            "description": "Breach risk"
          },
          "threat_level": {
            "type": "string",
            "description": "Threat level"
          }
        },
        "required": [
          "issue_type",
          "name",
          "severity",
          "category",
          "breach_risk",
          "threat_level"
        ],
        "additionalProperties": false
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    },
    "total": {
      "type": "integer"
    }
  },
  "additionalProperties": true,
  "required": [
    "entries",
    "page",
    "size",
    "total"
  ]
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v2/indicators' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

