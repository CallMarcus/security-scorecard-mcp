# PortfolioEdit

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": {
      "description": "human-readable name",
      "type": "string",
      "x-example": "Our Vendors"
    },
    "description": {
      "description": "human-readable description",
      "type": "string",
      "x-example": "These are all the vendors we monitor for security risk"
    },
    "privacy": {
      "$ref": "#/definitions/PortfolioPrivacy"
    }
  },
  "required": [
    "name"
  ]
}
```
