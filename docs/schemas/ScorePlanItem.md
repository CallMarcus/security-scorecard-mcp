# ScorePlanItem

```json
{
  "type": "object",
  "additionalProperties": false,
  "description": "issue that require remediation",
  "properties": {
    "issue_type": {
      "type": "string",
      "description": "issue type key",
      "x-example": "redirect_chain_contains_http"
    },
    "title": {
      "type": "string",
      "description": "issue type title",
      "x-example": "Redirect Chain Contains HTTP\""
    },
    "findings": {
      "type": "integer",
      "description": "amount of findings of that issue type",
      "x-example": 5
    },
    "remediations": {
      "type": "integer",
      "description": "amount of findings of that issue type that plan suggests to remediate",
      "x-example": 3
    },
    "factor": {
      "type": "string",
      "description": "the factor this issue type belong to",
      "x-example": "application_security"
    },
    "severity": {
      "type": "string",
      "description": "the issue type severity",
      "x-example": "medium"
    }
  }
}
```
