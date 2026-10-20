# Gets the Cost & Time ROI summary (Questionnaire) for the ROI dashboard

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customerId}/roi/questionnaire/summary`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridRoiQuestionnaireSummary`

## Path Parameters
- `customer_id` (**required**) — The managed customer ID.

## Query Parameters
- `period` (optional, string) — Reporting window. Optional, defaults to 90d.
- `tiers` (optional, string) — Comma-separated tiers to filter by. Optional, defaults to all tiers.
- `tag` (optional, string) — Comma-separated vendor tags to filter by. Optional.

## Responses
### 200
Cost & Time ROI summary (Questionnaire) for the period
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
    "headline": {
      "type": "object",
      "properties": {
        "net_savings_hours": {
          "type": "object",
          "properties": {
            "value": {
              "type": "number"
            },
            "display_hint": {
              "type": "string"
            }
          },
          "required": [
            "value",
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
        "net_savings_cost": {
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
        "roi_multiple": {
          "type": "object",
          "properties": {
            "value": {
              "type": "number"
            },
            "display_hint": {
              "type": "string"
            }
          },
          "required": [
            "value",
            "display_hint"
          ],
          "additionalProperties": false
        },
        "headcount_to_replicate": {
          "type": "object",
          "properties": {
            "value": {
              "type": "number"
            },
            "unit": {
              "type": "string",
              "enum": [
                "FTE"
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
        }
      },
      "required": [
        "net_savings_hours",
        "value_delivered",
        "net_savings_cost",
        "headcount_to_replicate"
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
        }
      },
      "required": [
        "value",
        "currency"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "period",
    "window_start",
    "window_end",
    "months",
    "headline",
    "price_for_period"
  ],
  "additionalProperties": false
}
```
### 204
ROI for the period is not favourable

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/{customerId}/roi/questionnaire/summary' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

