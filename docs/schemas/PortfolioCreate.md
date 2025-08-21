# PortfolioCreate

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
    },
    "team_id": {
      "description": "the team id",
      "type": "string",
      "x-example": "2d67d768-0def-5755-9201-1c38dcc1568f"
    }
  },
  "required": [
    "name"
  ]
}
```
