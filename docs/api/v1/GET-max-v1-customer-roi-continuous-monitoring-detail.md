# Gets the Cost & Time ROI breakdown (Continuous Monitoring) for the ROI dashboard

- **Method:** `GET`
- **Path:** `/max/v1/customer/roi/continuous-monitoring/detail`
- **Tag:** `V1`
- **operationId:** `getV1CustomerRoiContinuousMonitoringDetail`

## Query Parameters
- `period` (optional, string) — Reporting window. Optional, defaults to 90d.
- `tiers` (optional, string) — Comma-separated tiers to filter by. Optional, defaults to all tiers.
- `tag` (optional, string) — Comma-separated vendor tags to filter by. Optional.

## Responses
### 200
Cost & Time ROI breakdown for the period
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
    "hours_saved": {
      "type": "object",
      "properties": {
        "value": {
          "type": "number"
        },
        "unit": {
          "type": "string",
          "enum": [
            "hours"
          ]
        },
        "display_hint": {
          "type": "string"
        }
      },
      "required": [
        "value",
        "unit",
        "display_hint"
      ],
      "additionalProperties": false
    },
    "value_delivered": {
      "type": "object",
      "properties": {
        "value": {
          "type": "number"
        },
        "currency": {
          "type": "string"
        },
        "display_hint": {
          "type": "string"
        }
      },
      "required": [
        "value",
        "currency",
        "display_hint"
      ],
      "additionalProperties": false
    },
    "price_for_period": {
      "type": "object",
      "properties": {
        "value": {
          "type": "number"
        },
        "currency": {
          "type": "string"
        },
        "display_hint": {
          "type": "string"
        }
      },
      "required": [
        "value",
        "currency",
        "display_hint"
      ],
      "additionalProperties": false
    },
    "categories": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "enum": [
              "vendors",
              "reports",
              "findings",
              "weekly-reports",
              "zdaas"
            ]
          },
          "label": {
            "type": "string"
          },
          "hours_saved": {
            "type": "integer"
          },
          "dollar_value": {
            "type": "integer"
          }
        },
        "required": [
          "id",
          "label",
          "hours_saved",
          "dollar_value"
        ],
        "additionalProperties": false
      }
    },
    "whitepaper_url": {
      "type": "string"
    }
  },
  "required": [
    "period",
    "window_start",
    "window_end",
    "months",
    "hours_saved",
    "value_delivered",
    "price_for_period",
    "categories",
    "whitepaper_url"
  ],
  "additionalProperties": false
}
```
### 204
ROI for the period is not favourable

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/roi/continuous-monitoring/detail' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

