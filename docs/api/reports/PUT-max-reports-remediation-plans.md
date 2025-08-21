# Publish or unpublish the report

- **Method:** `PUT`
- **Path:** `/max/reports/remediation-plans`
- **Tag:** `Reports`
- **operationId:** `putReportsRemediationPlans`

## Request Body
```json
{
  "type": "object",
  "properties": {
    "is_published": {
      "type": "boolean",
      "description": "if true publishes the report, if false changes the reports to draft"
    },
    "ids": {
      "type": "array",
      "description": "List of ids to Publish",
      "items": {
        "type": "string",
        "description": "ids of the published report"
      }
    }
  },
  "required": [
    "is_published"
  ],
  "additionalProperties": false
}
```

## Responses
### 200
Data was updated successfully
```json
{
  "type": "object",
  "properties": {
    "failed": {
      "type": "array",
      "description": "List of ids to that were updated successfully",
      "items": {
        "type": "string",
        "description": "ids of reports that published or un published"
      }
    },
    "message": {
      "type": "string",
      "description": "Status update message"
    }
  },
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/reports/remediation-plans' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

