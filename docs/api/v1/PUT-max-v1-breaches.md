# Update the status of the finding as reported to make it available in the Likelihood Assessment report

- **Method:** `PUT`
- **Path:** `/max/v1/breaches`
- **Tag:** `V1`
- **operationId:** `putV1Breaches`

## Request Body
```json
{
  "type": "object",
  "properties": {
    "breaches": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "breach_id": {
            "type": "string",
            "description": "id(issueId) of the breach for which the report status needs to be updated"
          },
          "vendor_id": {
            "type": "string",
            "description": "id of the vendor associated with the breach for which the report status needs to be updated"
          },
          "report": {
            "type": "boolean",
            "description": "if true the breach/breaches will be used for the likelihood report generation"
          },
          "triaged": {
            "type": "boolean",
            "description": "if true the breach/breaches is considered triaged"
          }
        },
        "additionalProperties": false,
        "required": [
          "breach_id",
          "vendor_id",
          "report",
          "triaged"
        ]
      },
      "description": "Array of breach ids/id and the vendor ids which needs to be marked as reported"
    }
  },
  "required": [
    "breaches"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
Finding report status updated successfully

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/v1/breaches' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

