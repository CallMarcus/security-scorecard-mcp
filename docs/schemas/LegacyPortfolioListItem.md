# LegacyPortfolioListItem

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "x-example": "Example Co."
    },
    "type": {
      "type": "string",
      "enum": [
        "PRIVATE",
        "PUBLIC"
      ],
      "x-example": "PRIVATE"
    }
  }
}
```
