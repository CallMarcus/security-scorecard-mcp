# PortfolioVendor

```json
{
  "type": "object",
  "description": "A party in the supply chain that makes goods and services available to a company in a portfolio",
  "properties": {
    "domain": {
      "type": "string",
      "example": "example.com"
    },
    "company": {
      "type": "string",
      "example": "Example Ltd"
    },
    "score": {
      "type": "integer",
      "example": 75
    },
    "thirty_day_change": {
      "type": "integer",
      "format": "float",
      "example": -4
    },
    "products_used": {
      "type": "integer",
      "example": 1815
    },
    "connections_count": {
      "type": "integer",
      "example": 184
    },
    "connections_percent": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    }
  }
}
```
