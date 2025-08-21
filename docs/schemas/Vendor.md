# Vendor

```json
{
  "description": "A party in the supply chain that makes goods and services available to a company",
  "properties": {
    "company": {
      "example": "Example Ltd",
      "type": "string"
    },
    "connection_detail": {
      "example": "GET - static.image.example.com OK/200",
      "type": "string"
    },
    "domain": {
      "example": "example.com",
      "type": "string"
    },
    "industry": {
      "example": "information_services",
      "type": "string"
    },
    "observed": {
      "format": "date-time",
      "type": "string"
    },
    "score": {
      "example": 75,
      "type": "integer"
    },
    "source": {
      "enum": [
        "HTTP requests",
        "Detected libraries",
        "Mail exchange",
        "Enhanced illumination"
      ],
      "type": "string"
    }
  },
  "type": "object"
}
```
