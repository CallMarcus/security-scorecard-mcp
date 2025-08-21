# CompanyFactorScoreHistoryEntry

```json
{
  "type": "object",
  "additionalProperties": true,
  "properties": {
    "date": {
      "type": "string",
      "format": "date-time",
      "description": "effective date for this score",
      "x-example": "2018-01-14T00:00:00.000Z"
    },
    "factors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "factor key",
            "x-example": "application_security"
          },
          "score": {
            "type": "integer",
            "description": "company factor security score from 0 to 100",
            "x-example": 93
          }
        }
      }
    }
  }
}
```
