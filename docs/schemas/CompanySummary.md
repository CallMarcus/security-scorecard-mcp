# CompanySummary

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
      "description": "security score from 0 to 100. this property is undefined if score is still being calculated.",
      "x-example": 97
    },
    "industry": {
      "type": "string",
      "description": "industry (unique identifier). 'unknown' if this wasn't yet determined.",
      "x-example": "technology"
    },
    "size": {
      "description": "estimated size, based on number of employees. 'unknown' if this wasn't yet determined)",
      "$ref": "#/definitions/CompanySize",
      "x-example": "size_501_to_1000"
    },
    "uuid": {
      "type": "string",
      "description": "Identifier"
    },
    "last30day_score_change": {
      "type": "integer",
      "description": "The delta score in 30 days"
    },
    "is_custom": {
      "type": "boolean",
      "description": "Is custom scorecard"
    },
    "is_entity": {
      "type": "boolean",
      "description": "Is an entity"
    },
    "is_un_published": {
      "type": "boolean",
      "description": "Is unpublished"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "created date"
    },
    "disputed": {
      "type": "boolean",
      "description": "Is disputed"
    },
    "provisional": {
      "type": "boolean",
      "description": "The score is provisional"
    }
  }
}
```
