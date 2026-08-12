# Returns, per tier, how many slots are allocated and currently used for each customer. Includes unknown to represent vendors without a defined tier. Also returns a totals object with the overall allocated and used values.

- **Method:** `GET`
- **Path:** `/max/v1/partner/tier-slots`
- **Tag:** `V1`
- **operationId:** `getV1PartnerTierSlots`

## Responses
### 200
Tier slots information for the partner
```json
{
  "type": "object",
  "properties": {
    "tiers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "tier": {
            "type": "string",
            "enum": [
              "platinum",
              "gold",
              "silver",
              "questionnaire",
              "unknown"
            ],
            "description": "Tier name (platinum, gold, silver, questionnaire, unknown)"
          },
          "total": {
            "type": "integer",
            "description": "Total allocated slots for this tier"
          },
          "used": {
            "type": "integer",
            "description": "Currently used slots for this tier"
          },
          "missing_slots": {
            "type": "integer",
            "description": "missing slots which show over consumption"
          },
          "available_slots": {
            "type": "integer",
            "description": "available slots count"
          },
          "list_price": {
            "type": "string",
            "description": "Per-tier list price in USD as an exact decimal string; omitted when unset"
          },
          "discount_pct": {
            "type": "string",
            "description": "Per-tier discount percent 0-100 as a decimal string; omitted when unset"
          }
        },
        "required": [
          "tier",
          "total",
          "used",
          "missing_slots",
          "available_slots"
        ],
        "additionalProperties": false
      },
      "description": "Array of tier slot information"
    },
    "totals": {
      "type": "object",
      "properties": {
        "total": {
          "type": "integer",
          "description": "Total allocated slots across all tiers"
        },
        "used": {
          "type": "integer",
          "description": "Total used slots across all tiers"
        }
      },
      "description": "Overall totals across all tiers",
      "required": [
        "total",
        "used"
      ],
      "additionalProperties": false
    },
    "updated_at": {
      "type": "string",
      "description": "Datetime when the data was last updated"
    },
    "updated_by": {
      "type": "string",
      "description": "User who last updated the data"
    }
  },
  "required": [
    "tiers"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/tier-slots' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

