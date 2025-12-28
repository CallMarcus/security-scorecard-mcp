# CompanySummaryFactors

```json
{
  "allOf": [
    {
      "$ref": "#/definitions/CompanySummary"
    },
    {
      "type": "object",
      "properties": {
        "factors": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/CompanyFactor"
          }
        }
      }
    }
  ]
}
```
