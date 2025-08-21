# VendorFactorSummaryItem

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "key": {
      "type": "string",
      "description": "factor key",
      "x-example": "application_security"
    },
    "grade": {
      "type": "string",
      "description": "company security grade (A to F)",
      "enum": [
        "A",
        "B",
        "C",
        "D",
        "F"
      ],
      "x-example": "A"
    },
    "grade_url": {
      "type": "string",
      "description": "url to an image depicting the grade"
    },
    "issue_summary": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "severity": {
            "description": "severity of this type of issue",
            "type": "string",
            "enum": [
              "positive",
              "info",
              "low",
              "medium",
              "high"
            ],
            "x-example": "medium"
          },
          "issue_type": {
            "description": "issue type (permanent key)",
            "type": "string",
            "x-example": "cookie_secure_flag"
          },
          "count": {
            "description": "total findings of this issue type on this company",
            "type": "integer",
            "x-example": 42
          }
        }
      }
    }
  }
}
```
