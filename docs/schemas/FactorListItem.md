# FactorListItem

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "key": {
      "description": "permanent key for this factor",
      "type": "string",
      "x-example": "application_security"
    },
    "name": {
      "description": "human-readable name",
      "type": "string",
      "x-example": "Application Security"
    },
    "description": {
      "description": "human-readable description",
      "type": "string",
      "x-example": "Detecting common website application vulnerabilities"
    }
  }
}
```
