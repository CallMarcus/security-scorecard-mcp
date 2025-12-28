# LegacyPortfolioVendorsList

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/VendorScore"
      }
    },
    "count": {
      "description": "total number of companies in this portfolio",
      "type": "integer"
    }
  }
}
```
