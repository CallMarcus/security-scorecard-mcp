# Portfolio

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "id": {
      "description": "unique identifier",
      "type": "string"
    },
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
