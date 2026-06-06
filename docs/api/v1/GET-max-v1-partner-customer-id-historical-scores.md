# Retrieves vendor score grades for a specific customer managed by a partner, grouped by month

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customer_id}/historical-scores`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridHistoricalScores`

## Path Parameters
- `customer_id` (**required**) — Customer ID to get historical scores for

## Query Parameters
- `tiers` (optional, string) — Tiers to filter the data by (gold, silver, platinum)

## Responses
### 200
Historical scores retrieved successfully, grouped by month
```json
{
  "type": "object",
  "description": "Historical scores grouped by month",
  "properties": {},
  "additionalProperties": true
}
```
### 400
Bad request - invalid parameters
### 401
Unauthorized
### 403
Forbidden - insufficient permissions
### 500
Internal server error

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/<customer_id>/historical-scores' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

