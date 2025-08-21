# CompanyActiveIssues

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "issue_types": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/CompanyActiveByIssueType"
      }
    },
    "total_active_issues": {
      "description": "total number of active issues",
      "type": "number"
    }
  }
}
```
