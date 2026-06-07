# RiskTierTemplatesUpdateRow

```json
{
  "type": "object",
  "description": "One template-assignment row in a bulk update.",
  "required": [
    "riskTier",
    "templateId"
  ],
  "properties": {
    "riskTier": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ]
    },
    "templateId": {
      "type": "string",
      "description": "Atlas template UUID; empty string means \"No assessment\"."
    }
  }
}
```
