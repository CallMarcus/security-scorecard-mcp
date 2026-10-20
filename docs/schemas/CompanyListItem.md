# CompanyListItem

```json
{
  "description": "A company as returned by GET /all-companies. Extends Company with the score fields, which only the list endpoint populates. GET /all-companies/{domain} returns Company without them.",
  "allOf": [
    {
      "$ref": "#/definitions/Company"
    },
    {
      "type": "object",
      "properties": {
        "score": {
          "type": "number",
          "description": "Score of the company",
          "example": 95
        },
        "grade": {
          "type": "string",
          "description": "Grade of the company",
          "example": "A"
        },
        "last30Days_breach_count": {
          "type": "number",
          "description": "Number of breaches recorded for the company in the last 30 days",
          "example": 0
        },
        "last_month_score_change": {
          "type": "number",
          "description": "Change in the company's score over the last month",
          "example": 0
        }
      }
    }
  ]
}
```
