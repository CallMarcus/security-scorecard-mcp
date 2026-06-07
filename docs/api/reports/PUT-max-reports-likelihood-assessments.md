# Publish or unpublish the report

- **Method:** `PUT`
- **Path:** `/max/reports/likelihood-assessments`
- **Tag:** `Reports`
- **operationId:** `putReportsLikelihoodAssessments`

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

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/reports/likelihood-assessments' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

