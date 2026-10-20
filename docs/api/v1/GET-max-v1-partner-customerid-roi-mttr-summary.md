# Gets the MTTR (mean time to remediation) summary for the ROI dashboard

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customerId}/roi/mttr/summary`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridRoiMttrSummary`

## Path Parameters
- `customer_id` (**required**) — The managed customer ID.

## Query Parameters
- `period` (optional, string) — Reporting window. Optional, defaults to 90d.
- `tiers` (optional, string) — Comma-separated tiers to filter by. Optional, defaults to all tiers.
- `tag` (optional, string) — Comma-separated vendor tags to filter by. Optional.

## Responses
### 200
MTTR summary for the period
```json
{
  "type": "object",
  "properties": {
    "period": {
      "type": "string",
      "enum": [
        "30d",
        "90d",
        "6m",
        "1y"
      ]
    },
    "window_start": {
      "type": "string"
    },
    "window_end": {
      "type": "string"
    },
    "mttr_days": {
      "type": "number"
    },
    "delta_days_vs_start": {
      "type": "number"
    },
    "resolved_findings_count": {
      "type": "integer"
    },
    "series": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "month": {
            "type": "string"
          },
          "mean_days": {
            "type": "number"
          },
          "resolved_count": {
            "type": "integer"
          }
        },
        "required": [
          "month",
          "mean_days",
          "resolved_count"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "period",
    "window_start",
    "window_end",
    "resolved_findings_count",
    "series"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/{customerId}/roi/mttr/summary' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

