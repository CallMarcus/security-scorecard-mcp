# CompanyScoreHistory

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "entries": {
      "type": "array",
      "description": "list of historical scores (this can be empty if the company hasn't been scored yet)",
      "items": {
        "$ref": "#/definitions/CompanyScoreHistoryEntry"
      }
    }
  }
}
```
