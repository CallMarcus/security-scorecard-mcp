# Deletes the reports in bulk

- **Method:** `DELETE`
- **Path:** `/max/reports/likelihood-assessments`
- **Tag:** `V1`
- **operationId:** `deleteV1ReportsLikelihoodAssessments`

## Request Body
```json
{
  "type": "object",
  "properties": {
    "ids": {
      "type": "array",
      "items": {
        "type": "string",
        "description": "ids of reports that needs to be deleted"
      }
    }
  },
  "required": [
    "ids"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
Deleted successfully

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//max/reports/likelihood-assessments' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

