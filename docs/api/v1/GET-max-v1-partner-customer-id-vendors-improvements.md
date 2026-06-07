# Return the customer vendors grouped by their status on vendor improvement

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customer_id}/vendors-improvements`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridVendorsImprovements`

## Path Parameters
- `customer_id` (**required**) — customer ID to get vendors improvement trends for

## Query Parameters
- `tiers` (optional, string) — Comma-separated list of tier names to filter vendors by
- `tag` (optional, string) — Comma-separated list of tag names to filter vendors by

## Responses
### 200
Customer vendors grouped by their status on vendor improvement
```json
{
  "type": "object",
  "properties": {
    "vendors_doing_well": {
      "type": "object",
      "properties": {
        "count": {
          "type": "integer"
        },
        "percentage": {
          "type": "integer"
        }
      },
      "required": [
        "count",
        "percentage"
      ],
      "additionalProperties": false
    },
    "vendors_improved": {
      "type": "object",
      "properties": {
        "count": {
          "type": "integer"
        },
        "percentage": {
          "type": "integer"
        }
      },
      "required": [
        "count",
        "percentage"
      ],
      "additionalProperties": false
    },
    "vendors_didnt_improve": {
      "type": "object",
      "properties": {
        "count": {
          "type": "integer"
        },
        "percentage": {
          "type": "integer"
        }
      },
      "required": [
        "count",
        "percentage"
      ],
      "additionalProperties": false
    },
    "vendors_worsened": {
      "type": "object",
      "properties": {
        "count": {
          "type": "integer"
        },
        "percentage": {
          "type": "integer"
        }
      },
      "required": [
        "count",
        "percentage"
      ],
      "additionalProperties": false
    },
    "vendors_first_assessment": {
      "type": "object",
      "properties": {
        "count": {
          "type": "integer"
        },
        "percentage": {
          "type": "integer"
        }
      },
      "required": [
        "count",
        "percentage"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "vendors_doing_well",
    "vendors_improved",
    "vendors_didnt_improve",
    "vendors_worsened",
    "vendors_first_assessment"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/<customer_id>/vendors-improvements' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

