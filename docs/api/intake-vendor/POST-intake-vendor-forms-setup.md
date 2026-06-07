# Set up the intake vendor form for the current organization

- **Method:** `POST`
- **Path:** `/intake-vendor/forms/setup`
- **Tag:** `intake-vendor`
- **operationId:** `setupIntakeVendorForm`

## Description
Sets up the intake vendor form for the current organization.

## Responses
### 201
Intake vendor form was set up successfully
```json
{
  "$ref": "#/definitions/IntakeVendorForm"
}
```
### 400
Invalid request body
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 409
An intake vendor form already exists for this organization

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//intake-vendor/forms/setup' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

