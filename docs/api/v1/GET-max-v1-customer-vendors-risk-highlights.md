# Return the customer vendors grouped by their status on risk highlight

- **Method:** `GET`
- **Path:** `/max/v1/customer/vendors-risk-highlights`
- **Tag:** `V1`
- **operationId:** `getV1CustomerVendorsRiskHighlights`

## Query Parameters
- `date_range` (optional, number) — Number of days for which the delta needs to be calculated
- `tiers` (optional, string) — Tiers to filter the data by comma separated

## Responses
### 200
vendor counts grouped by risk highlight
```json
{
  "type": "object",
  "properties": {
    "need_attention": {
      "type": "object",
      "properties": {
        "count": {
          "type": "number"
        },
        "delta": {
          "type": "number"
        }
      },
      "required": [
        "count"
      ],
      "additionalProperties": false
    },
    "risk_escalating": {
      "type": "object",
      "properties": {
        "count": {
          "type": "number"
        },
        "delta": {
          "type": "number"
        }
      },
      "required": [
        "count"
      ],
      "additionalProperties": false
    },
    "at_significant_risk": {
      "type": "object",
      "properties": {
        "count": {
          "type": "number"
        },
        "delta": {
          "type": "number"
        }
      },
      "required": [
        "count"
      ],
      "additionalProperties": false
    },
    "has_active_breach": {
      "type": "object",
      "properties": {
        "count": {
          "type": "number"
        },
        "delta": {
          "type": "number"
        }
      },
      "required": [
        "count"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "need_attention",
    "risk_escalating",
    "at_significant_risk",
    "has_active_breach"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/vendors-risk-highlights' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

