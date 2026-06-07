# Update current intake vendor form risk settings

- **Method:** `PUT`
- **Path:** `/intake-vendor/forms/current/risk-settings`
- **Tag:** `intake-vendor`
- **operationId:** `updateIntakeVendorFormRiskSettings`

## Description
Updates the per-tier risk thresholds. Each row may optionally include a templateId to atomically upsert the (org, tier) template assignment in the same transaction. Rows whose templateId field is absent leave the existing assignment unchanged; an empty string means "No assessment".

## Request Body
```json
{
  "$ref": "#/definitions/IntakeRiskSettingsUpdateRequest"
}
```

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/IntakeRiskSettings"
}
```
### 400
Invalid request body
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
Intake form not found for organization

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//intake-vendor/forms/current/risk-settings' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

