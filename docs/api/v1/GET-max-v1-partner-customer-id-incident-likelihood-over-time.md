# Get incident likelihood over time for a specific customer

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customer_id}/incident-likelihood-over-time`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridIncidentLikelihoodOverTime`

## Description
Retrieves incident likelihood data for the last 4 quarters ending at the specified date

## Path Parameters
- `customer_id` (**required**) — Customer ID to retrieve incident likelihood data for

## Query Parameters
- `tiers` (optional, string) — Tiers to filter the data by (gold, silver, platinum)

## Responses
### 200
Incident likelihood over time data for the last 4 quarters
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "quarter": {
            "type": "string",
            "description": "Quarter in ISO format (YYYY-QN)"
          },
          "low_count": {
            "type": "integer",
            "description": "Number of low incident likelihoods"
          },
          "medium_count": {
            "type": "integer",
            "description": "Number of medium incident likelihoods"
          },
          "high_count": {
            "type": "integer",
            "description": "Number of high incident likelihoods"
          },
          "critical_count": {
            "type": "integer",
            "description": "Number of critical incident likelihoods"
          }
        },
        "required": [
          "quarter",
          "low_count",
          "medium_count",
          "high_count",
          "critical_count"
        ],
        "additionalProperties": false
      },
      "description": "Array of incident likelihood data for the last 4 quarters"
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
  'https://api.securityscorecard.io//max/v1/partner/<customer_id>/incident-likelihood-over-time' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

