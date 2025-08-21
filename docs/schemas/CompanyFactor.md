# CompanyFactor

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": {
      "type": "string",
      "description": "factor name/id",
      "x-example": "network_security"
    },
    "score": {
      "type": "integer",
      "description": "security score from 0 to 100",
      "x-example": 95
    },
    "grade": {
      "description": "security grade",
      "$ref": "#/definitions/CompanySecurityGrade",
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
          "type": {
            "description": "issue type (permanent key)",
            "type": "string",
            "x-example": "cookie_secure_flag"
          },
          "count": {
            "description": "total findings of this issue type on this company",
            "type": "integer",
            "x-example": 5
          },
          "detail_url": {
            "description": "api endpoint to get the issue findings detail of this issue type",
            "type": "string",
            "x-example": "https://api.securityscorecard.io/companies/example.com/issues/cookie_secure_flag"
          },
          "total_score_impact": {
            "description": "score impact of all issue findings of this type to the scorecard's overall score",
            "type": "number",
            "x-example": 3.2
          }
        }
      }
    }
  }
}
```
