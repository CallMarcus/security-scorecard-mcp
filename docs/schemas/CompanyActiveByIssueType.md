# CompanyActiveByIssueType

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": [
    "name",
    "issues"
  ],
  "properties": {
    "name": {
      "description": "issue type (permanent key)",
      "type": "string",
      "x-example": "cookie_secure_flag"
    },
    "issues": {
      "description": "list of active issues of this type on this company",
      "type": "array",
      "items": {
        "$ref": "#/definitions/CompanyActiveIssue"
      }
    },
    "issues_count": {
      "type": "number",
      "description": "total active issues of this type on this company",
      "x-example": 42
    }
  }
}
```
