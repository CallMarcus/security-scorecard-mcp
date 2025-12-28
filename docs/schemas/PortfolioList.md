# PortfolioList

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/PortfolioListItem"
      }
    },
    "count": {
      "description": "total number of portfolios in this list",
      "type": "integer",
      "x-example": 10
    }
  }
}
```
