# Get current intake vendor form risk tier templates

- **Method:** `GET`
- **Path:** `/intake-vendor/risk-tier-templates`
- **Tag:** `intake-vendor`
- **operationId:** `getIntakeVendorFormRiskTierTemplates`

## Description
Returns the four (org × risk tier) Atlas template assignments; lazy-seeds with null templateIds on first read for an org.

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/RiskTierTemplatesResponse"
}
```
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//intake-vendor/risk-tier-templates' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

