# Retrieves vendor score grades for a customer grouped by month

- **Method:** `GET`
- **Path:** `/max/v1/customer/historical-scores`
- **Tag:** `V1`
- **operationId:** `getV1CustomerHistoricalScores`

## Query Parameters
- `tiers` (optional, string) — Tiers to filter the data by (gold, silver, platinum)

## Responses
### 200
Historical scores retrieved successfully, grouped by month
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
  'https://api.securityscorecard.io//max/v1/customer/historical-scores' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

