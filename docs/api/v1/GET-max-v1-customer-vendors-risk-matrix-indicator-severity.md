# Gets the data for risk matrix comparing bussiness impact with indicator severity

- **Method:** `GET`
- **Path:** `/max/v1/customer/vendors-risk-matrix/indicator-severity`
- **Tag:** `V1`
- **operationId:** `getV1CustomerVendorsRiskMatrixIndicatorSeverity`

## Query Parameters
- `incident_likelihood` (optional, string) — The incident likelihood to filter the risk matrix data. Optional.
- `tiers` (optional, string) — The tiers to filter the risk matrix data. Optional, defaults to all tiers.

## Responses
### 200
Matrix of bussiness impact by indicator severity
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "business_impact": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "none"
            ]
          },
          "indicator_severity": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "none"
            ]
          },
          "count": {
            "type": "integer"
          }
        },
        "required": [
          "business_impact",
          "indicator_severity",
          "count"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "entries"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/vendors-risk-matrix/indicator-severity' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

