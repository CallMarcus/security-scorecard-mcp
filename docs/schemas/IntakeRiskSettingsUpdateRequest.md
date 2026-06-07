# IntakeRiskSettingsUpdateRequest

```json
{
  "type": "object",
  "description": "Request body for PUT /intake-vendor/forms/current/risk-settings.",
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
