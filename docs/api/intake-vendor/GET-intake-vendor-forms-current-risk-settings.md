# Get current intake vendor form risk settings

- **Method:** `GET`
- **Path:** `/intake-vendor/forms/current/risk-settings`
- **Tag:** `intake-vendor`
- **operationId:** `getIntakeVendorFormRiskSettings`

## Description
Returns the per-tier risk thresholds joined with the assigned Atlas template id for the current intake vendor form.

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/IntakeRiskSettings"
}
```
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
Intake form not found for organization

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//intake-vendor/forms/current/risk-settings' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

