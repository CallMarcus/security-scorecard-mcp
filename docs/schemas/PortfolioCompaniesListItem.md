# PortfolioCompaniesListItem

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": {
      "type": "string",
      "description": "public company name",
      "x-example": "Example Co."
    },
    "domain": {
      "type": "string",
      "description": "primary domain of the company (used as unique identifier)",
      "x-example": "example.com"
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
    "score": {
      "type": "integer",
      "description": "security score from 0 to 100",
      "x-example": 97
    },
    "industry": {
      "type": "string",
      "description": "industry (unique identifier)",
      "x-example": "technology"
    },
    "size": {
      "description": "estimated size, based on number of employees",
      "$ref": "#/definitions/CompanySize"
    },
    "last30days_score_change": {
      "description": "last 30 days score change",
      "type": "integer"
    }
  }
}
```
