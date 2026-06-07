# IntakeRiskSettings

```json
{
  "type": "object",
  "description": "Per-tier risk thresholds with template assignments for the current intake vendor form.",
  "required": [
    "rows"
  ],
  "properties": {
    "rows": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/IntakeRiskThresholdRow"
      }
    }
  }
}
```
