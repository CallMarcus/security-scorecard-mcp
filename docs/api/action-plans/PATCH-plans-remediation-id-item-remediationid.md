# Update the remediation plan item by id

- **Method:** `PATCH`
- **Path:** `/plans/remediation/{id}/item/{remediationId}`
- **Tag:** `action plans`
- **operationId:** `patchPlansRemediationByIdItemByRemediationid`

## Path Parameters
- `id` (**required**) — unique plan id
- `remediationId` (**required**) — 

## Request Body
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "status of the the remediation"
    },
    "risk_severity": {
      "type": "string",
      "description": "Risk severity"
    },
    "risk_category": {
      "type": "string",
      "description": "Category of risk"
    },
    "remediation_actions": {
      "type": "string",
      "description": "Remediation actions"
    },
    "risk_factor": {
      "type": "string",
      "description": ""
    },
    "evidence": {
      "type": "array",
      "description": "Evidence list",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "Title of the issue type"
          },
          "key": {
            "type": "string",
            "description": "Key of the issue type"
          },
          "count": {
            "type": "number",
            "description": "count of findings associated with the issue type"
          },
          "periods": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "if this issue is about past findings, these are the periods when they were observed"
          },
          "severity": {
            "type": "string",
            "description": "Indicator severity (low, medium, high, critical)"
          }
        },
        "required": [
          "title",
          "key"
        ],
        "additionalProperties": false
      }
    },
    "status": {
      "type": "string",
      "description": "status of the the remediation",
      "default": "open",
      "enum": [
        "open",
        "in_progress",
        "under_review",
        "closed"
      ]
    }
  },
  "required": [
    "risk_severity",
    "risk_category",
    "remediation_actions",
    "evidence"
  ],
  "additionalProperties": false
}
```

## Responses
### 204


## Example cURL Request
```bash
curl -X PATCH \
  'https://api.securityscorecard.io//plans/remediation/<id>/item/<remediationId>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

