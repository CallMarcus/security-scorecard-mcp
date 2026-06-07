# RiskTierTemplatesResponse

```json
{
  "type": "object",
  "description": "All four (org \u00d7 risk tier) template assignments.",
  "required": [
    "rows"
  ],
  "properties": {
    "rows": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/RiskTierTemplate"
      }
    }
  }
}
```
