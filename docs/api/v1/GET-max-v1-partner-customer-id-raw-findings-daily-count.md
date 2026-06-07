# Retrieves the count of unique security findings grouped by date and severity level for a specific customer

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customer_id}/raw-findings/daily-count`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridRawFindingsDailyCount`

## Path Parameters
- `customer_id` (**required**) — customer ID to get the daily count of findings for

## Query Parameters
- `tiers` (optional, string) — Tiers to filter the data by (gold, silver, platinum)
- `tag` (optional, string) — Comma-separated list of tag names to filter vendors by

## Responses
### 200
Count of unique security findings grouped by date and severity level
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
          "count": {
            "type": "integer"
          }
        },
        "required": [
          "observed_date",
          "severity",
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
  'https://api.securityscorecard.io//max/v1/partner/<customer_id>/raw-findings/daily-count' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

