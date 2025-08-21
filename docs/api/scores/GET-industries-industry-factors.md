# get factor scores for the industry

- **Method:** `GET`
- **Path:** `/industries/{industry}/factors`
- **Tag:** `scores`
- **operationId:** `get_industries-industry-factors`

## Description
get factor scores for the industry

## Path Parameters
- `industry` (**required**) — 

## Query Parameters
- `score_type` (optional, string) — 

## Responses
### 200
List of IndustryFactors
```json
{
  "type": "object",
  "properties": {
    "entries": {
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
    "entries"
  ],
  "description": "List of IndustryFactors"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//industries/<industry>/factors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

