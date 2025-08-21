# PortfolioVendors

```json
{
  "type": "object",
  "description": "Vendors used by companies in a portfolio",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/PortfolioVendor"
      }
    }
  },
  "allOf": [
    {
      "$ref": "#/definitions/CollectionResponse"
    }
  ]
}
```
