# Gets the MTTC (mean time to completion) summary for the ROI dashboard, aggregated across every customer the partner manages

- **Method:** `GET`
- **Path:** `/max/v1/partner/roi/mttc-summary`
- **Tag:** `V1`
- **operationId:** `getV1PartnerRoiMttcSummary`

## Query Parameters
- `period` (optional, string) — Reporting window. Optional, defaults to 90d.

## Responses
### 200
MTTC summary for the period
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
    "months": {
      "type": "integer"
    },
    "mttc": {
      "type": "object",
      "properties": {
        "value": {
          "type": "number"
        },
        "unit": {
          "type": "string",
          "enum": [
            "days",
            "hours"
          ]
        }
      },
      "required": [
        "value",
        "unit"
      ],
      "additionalProperties": false
    },
    "questionnaires_completed": {
      "type": "integer"
    },
    "overdue_count": {
      "type": "integer"
    },
    "status_breakdown": {
      "type": "object",
      "properties": {
        "not_started": {
          "type": "integer"
        },
        "in_progress": {
          "type": "integer"
        },
        "in_review": {
          "type": "integer"
        },
        "completed": {
          "type": "integer"
        }
      },
      "required": [
        "not_started",
        "in_progress",
        "in_review",
        "completed"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "period",
    "window_start",
    "window_end",
    "months",
    "mttc",
    "questionnaires_completed",
    "overdue_count",
    "status_breakdown"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/roi/mttc-summary' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

