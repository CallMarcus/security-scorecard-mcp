# get historical factor scores for the industry

- **Method:** `GET`
- **Path:** `/industries/{industry}/history/factors`
- **Tag:** `scores`
- **operationId:** `get_industries-industry-history-factors`

## Description
get historical factor scores for the industry

## Path Parameters
- `industry` (**required**) — 

## Query Parameters
- `from` (optional, string) — 
- `to` (optional, string) — 
- `score_type` (optional, string) — 

## Responses
### 200
List of IndustryFactorsHistories
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}\\.{0,1}[0-9]*Z$"
          },
          "factors": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "x-example": "application_security"
                },
                "score": {
                  "type": "integer",
                  "x-example": 83
                }
              },
              "additionalProperties": false,
              "required": [
                "name",
                "score"
              ]
            }
          }
        },
        "additionalProperties": false,
        "required": [
          "date",
          "factors"
        ]
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of IndustryFactorsHistories"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//industries/<industry>/history/factors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

