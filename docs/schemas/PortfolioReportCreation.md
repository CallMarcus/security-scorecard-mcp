# PortfolioReportCreation

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "format": {
      "type": "string",
      "description": "output format",
      "enum": [
        "pdf",
        "csv"
      ],
      "x-example": "pdf"
    },
    "portfolio_id": {
      "type": "string",
      "description": "the portfolio id"
    }
  },
  "required": [
    "portfolio_id"
  ]
}
```
