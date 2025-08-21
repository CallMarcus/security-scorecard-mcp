# PortfolioCompaniesList

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/PortfolioCompaniesListItem"
      }
    },
    "total": {
      "description": "total number of companies in this portfolio",
      "type": "integer",
      "x-example": 10
    }
  }
}
```
