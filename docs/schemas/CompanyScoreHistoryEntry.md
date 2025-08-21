# CompanyScoreHistoryEntry

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "domain": {
      "type": "string",
      "description": "primary domain of the company",
      "x-example": "example.com"
    },
    "date": {
      "type": "string",
      "format": "date-time",
      "description": "effective date for this score",
      "x-example": "2018-01-14T00:00:00.000Z"
    },
    "score": {
      "type": "integer",
      "description": "company security score from 0 to 100",
      "x-example": 97
    }
  }
}
```
