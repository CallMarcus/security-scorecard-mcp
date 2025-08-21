# get score for the industry

- **Method:** `GET`
- **Path:** `/industries/{industry}/score`
- **Tag:** `scores`
- **operationId:** `get_industries-industry-score`

## Description
get score for the industry

## Path Parameters
- `industry` (**required**) — 

## Query Parameters
- `score_type` (optional, string) — 

## Responses
### 200
Industry Score object
```json
{
  "type": "object",
  "properties": {
    "industry": {
      "type": "string",
      "x-example": "technology"
    },
    "avg_score": {
      "type": "integer",
      "x-example": 78
    },
    "avg_grade": {
      "type": "string",
      "x-example": "C"
    }
  },
  "additionalProperties": false,
  "required": [
    "industry",
    "avg_score",
    "avg_grade"
  ],
  "description": "Industry Score object"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//industries/<industry>/score' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

