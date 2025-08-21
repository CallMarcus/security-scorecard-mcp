# Risk

```json
{
  "type": "object",
  "description": "Supply chain risk",
  "enum": [
    "low",
    "medium",
    "high",
    "critical",
    "none"
  ],
  "properties": {
    "risk_score": {
      "type": "number",
      "format": "integer",
      "example": 83,
      "description": "The aggregate score of all 1st and 2nd connections detected for a company."
    }
  }
}
```
