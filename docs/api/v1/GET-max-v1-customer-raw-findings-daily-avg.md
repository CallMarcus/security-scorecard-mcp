# Retrieves the average number of unique issues per scorecard, grouped by date and severity level, for a specific customer.

- **Method:** `GET`
- **Path:** `/max/v1/customer/raw-findings/daily-avg`
- **Tag:** `V1`
- **operationId:** `getV1CustomerRawFindingsDailyAvg`

## Query Parameters
- `tiers` (optional, string) — Tiers to filter the data by

## Responses
### 200
Average of unique security findings grouped by date and severity level
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "observed_date": {
            "type": "string"
          },
          "severity": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low"
            ]
          },
          "average": {
            "type": "integer"
          }
        },
        "required": [
          "observed_date",
          "severity",
          "average"
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
  'https://api.securityscorecard.io//max/v1/customer/raw-findings/daily-avg' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

