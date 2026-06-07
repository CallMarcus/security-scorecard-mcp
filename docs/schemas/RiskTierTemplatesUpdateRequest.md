# RiskTierTemplatesUpdateRequest

```json
{
  "type": "object",
  "description": "Bulk-replaces all four (org \u00d7 risk tier) template assignments. Must contain exactly four rows covering low, medium, high, critical.",
  "required": [
    "rows"
  ],
  "properties": {
    "rows": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/RiskTierTemplatesUpdateRow"
      }
    }
  }
}
```
