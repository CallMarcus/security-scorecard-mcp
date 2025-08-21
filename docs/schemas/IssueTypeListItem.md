# IssueTypeListItem

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "key": {
      "description": "permanent key for this issue type",
      "type": "string",
      "x-example": "cookie_secure_flag"
    },
    "severity": {
      "description": "severity of this type of issue",
      "type": "string",
      "enum": [
        "POSITIVE",
        "INFO",
        "LOW",
        "MEDIUM",
        "HIGH"
      ],
      "x-example": "MEDIUM"
    },
    "short_description": {
      "description": "human-readable name",
      "type": "string"
    },
    "long_description": {
      "description": "human-readable description",
      "type": "string"
    },
    "recommendation": {
      "description": "steps to resolve the issue",
      "type": "string"
    }
  }
}
```
