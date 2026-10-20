# Gets the triaging-noise funnel for the ROI dashboard

- **Method:** `GET`
- **Path:** `/max/v1/customer/roi/triage-funnel`
- **Tag:** `V1`
- **operationId:** `getV1CustomerRoiTriageFunnel`

## Query Parameters
- `period` (optional, string) — Reporting window. Optional, defaults to 90d.
- `tiers` (optional, string) — Comma-separated tiers to filter by. Optional, defaults to all tiers.
- `tag` (optional, string) — Comma-separated vendor tags to filter by. Optional.

## Responses
### 200
Triaging-noise funnel for the period
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
    "stages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "enum": [
              "detected",
              "prioritized",
              "escalated"
            ]
          },
          "count": {
            "type": "integer"
          },
          "tiers": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "silver",
                "gold",
                "platinum"
              ]
            }
          }
        },
        "required": [
          "id",
          "count",
          "tiers"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "period",
    "window_start",
    "window_end",
    "stages"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/roi/triage-funnel' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

