# IntakeRiskThresholdRow

```json
{
  "type": "object",
  "description": "One risk band \u2014 tier label, normalized score upper bound, and (optionally) the assigned Atlas template id joined from risk_tier_templates.",
  "required": [
    "level",
    "score"
  ],
  "properties": {
    "level": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "description": "Risk tier label."
    },
    "score": {
      "type": "number",
      "description": "Inclusive upper bound of normalized score for this tier."
    },
    "templateId": {
      "type": "string",
      "description": "Atlas template UUID assigned to this tier. Empty string means \"No assessment\". On PUT, an absent templateId field leaves the existing assignment unchanged."
    }
  }
}
```
