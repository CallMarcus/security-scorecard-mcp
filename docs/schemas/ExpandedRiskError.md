# ExpandedRiskError

```json
{
  "properties": {
    "data": {
      "additionalProperties": true,
      "description": "The field that is causing the error",
      "example": {
        "domain": "example.com"
      },
      "type": "object"
    },
    "key": {
      "description": "Some string to be used for further lookup",
      "example": "company_not_in_a_portfolio",
      "type": "string"
    },
    "message": {
      "description": "Human readable message, suitable for showing in some UI",
      "example": "company must be added to a portfolio first: example.com",
      "type": "string"
    },
    "statusCode": {
      "example": 403,
      "type": "integer"
    }
  },
  "required": [
    "message",
    "statusCode"
  ]
}
```
