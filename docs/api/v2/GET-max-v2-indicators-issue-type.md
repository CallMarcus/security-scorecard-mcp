# Get a issue type

- **Method:** `GET`
- **Path:** `/max/v2/indicators/{issue_type}`
- **Tag:** `V2`
- **operationId:** `getV2IndicatorsByIssuetype`

## Path Parameters
- `issue_type` (**required**) — Primary identifier of indicator to receive.

## Responses
### 200
a list of all issue types
```json
{
  "type": "object",
  "properties": {
    "issue_type": {
      "type": "string",
      "description": "ID of the indicator and Issue Type"
    },
    "name": {
      "type": "string"
    },
    "severity": {
      "type": "string"
    },
    "category": {
      "type": "string"
    },
    "breach_risk": {
      "type": "string",
      "description": "Breach risk"
    },
    "threat_level": {
      "type": "string",
      "description": "Threat level"
    }
  },
  "required": [
    "issue_type",
    "name",
    "severity",
    "category",
    "breach_risk",
    "threat_level"
  ],
  "additionalProperties": false
}
```
### 404
Indicator not found

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v2/indicators/<issue_type>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

