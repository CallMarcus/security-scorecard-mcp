# VendorScore

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
      "description": "primary domain of the company",
      "x-example": "example.com"
    },
    "type": {
      "type": "string",
      "description": "company industry",
      "x-example": "TECHNOLOGY"
    },
    "size": {
      "type": "string",
      "description": "company estimated size (employees)",
      "x-example": "SIZE_501_TO_1000"
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
    "score": {
      "type": "integer",
      "description": "company security score from 0 to 100",
      "x-example": 97
    }
  }
}
```
