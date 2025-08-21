# CompanyActiveIssue

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": [
    "issue_id",
    "issue_count"
  ],
  "properties": {
    "issue_id": {
      "type": "string",
      "description": "issue id",
      "x-example": "55e448c4e4b0c986fd66ff12"
    },
    "issue_count": {
      "type": "number",
      "description": "total number of findings of this issue on this company",
      "x-example": 42
    },
    "effective_date": {
      "type": "string",
      "format": "date-time",
      "description": "effective date of this issue",
      "x-example": "2018-11-02"
    },
    "evidence": {
      "type": "array",
      "items": {
        "type": "string",
        "description": "evidence of this issue"
      }
    },
    "first_seen_time": {
      "type": "string",
      "format": "date-time",
      "description": "first seen time of this issue",
      "x-example": "2018-11-02T00:00:00.000Z"
    },
    "last_seen_time": {
      "type": "string",
      "format": "date-time",
      "description": "last seen time of this issue",
      "x-example": "2018-11-02T00:00:00.000Z"
    },
    "group_status": {
      "type": "string",
      "description": "group status of this issue",
      "x-example": "active"
    },
    "issuer_name": {
      "type": "string",
      "description": "issuer name of this issue"
    },
    "observations": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/CompanyActiveIssueObservation"
      }
    },
    "sha256_fingerprint": {
      "type": "string",
      "description": "sha256 fingerprint of this issue"
    },
    "target": {
      "type": "string",
      "description": "target of this issue"
    },
    "port": {
      "type": "integer",
      "description": "port of this issue"
    }
  }
}
```
