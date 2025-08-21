# IndustryScoreHistoryEntry

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "industry": {
      "type": "string",
      "description": "industry (permanent key)",
      "x-example": "technology"
    },
    "date": {
      "type": "string",
      "format": "date-time",
      "description": "effective date for these scores",
      "x-example": "2018-01-14T00:00:00.000Z"
    },
    "minScore": {
      "type": "integer",
      "description": "minimum score for companies on this industry",
      "x-example": 57
    },
    "maxScore": {
      "type": "integer",
      "description": "maximum score for companies on this industry",
      "x-example": 99
    },
    "avgScore": {
      "type": "number",
      "description": "average score for companies on this industry",
      "x-example": 87.89847328244275
    }
  }
}
```
