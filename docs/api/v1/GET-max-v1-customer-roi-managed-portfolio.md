# Gets the managed-portfolio snapshot (vendors under MAX management by tier) for the ROI dashboard

- **Method:** `GET`
- **Path:** `/max/v1/customer/roi/managed-portfolio`
- **Tag:** `V1`
- **operationId:** `getV1CustomerRoiManagedPortfolio`

## Query Parameters
- `tiers` (optional, string) — Comma-separated tiers to filter by. Optional, defaults to all tiers.
- `tag` (optional, string) — Comma-separated vendor tags to filter by. Optional.

## Responses
### 200
Managed-portfolio snapshot
```json
{
  "type": "object",
  "properties": {
    "total_vendors": {
      "type": "integer"
    },
    "tiers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "enum": [
              "platinum",
              "gold",
              "silver"
            ]
          },
          "label": {
            "type": "string"
          },
          "count": {
            "type": "integer"
          },
          "description": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "label",
          "count",
          "description"
        ],
        "additionalProperties": false
      }
    },
    "as_of": {
      "type": "string"
    }
  },
  "required": [
    "total_vendors",
    "tiers",
    "as_of"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/roi/managed-portfolio' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

