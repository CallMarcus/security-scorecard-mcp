# Bulk-replace intake vendor form risk tier templates

- **Method:** `PUT`
- **Path:** `/intake-vendor/risk-tier-templates`
- **Tag:** `intake-vendor`
- **operationId:** `updateIntakeVendorFormRiskTierTemplates`

## Description
Bulk-replaces all four (org × risk tier) Atlas template assignments in a single transaction. Body must contain exactly four rows, one per risk tier.

## Request Body
```json
{
  "$ref": "#/definitions/RiskTierTemplatesUpdateRequest"
}
```

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/RiskTierTemplatesResponse"
}
```
### 400
Invalid request body
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//intake-vendor/risk-tier-templates' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

