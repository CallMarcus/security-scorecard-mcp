# Gets the data for risk matrix comparing bussiness impact with incident likelihood

- **Method:** `GET`
- **Path:** `/max/v1/customer/vendors-risk-matrix/incident-likelihood`
- **Tag:** `V1`
- **operationId:** `getV1CustomerVendorsRiskMatrixIncidentLikelihood`

## Query Parameters
- `tiers` (optional, string) — The tiers to filter the risk matrix data. Optional, defaults to all tiers.

## Responses
### 200
Matrix of bussiness impact by incident likelihood
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
          "incident_likelihood": {
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
          "incident_likelihood",
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
  'https://api.securityscorecard.io//max/v1/customer/vendors-risk-matrix/incident-likelihood' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

