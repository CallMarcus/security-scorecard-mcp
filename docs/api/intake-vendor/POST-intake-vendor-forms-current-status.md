# Submit the current intake vendor form

- **Method:** `POST`
- **Path:** `/intake-vendor/forms/current/status`
- **Tag:** `intake-vendor`
- **operationId:** `submitCurrentForm`

## Description
Submits the current intake vendor form.

## Responses
### 200
Form was submitted successfully
```json
{
  "$ref": "#/definitions/IntakeVendorPublishStatus"
}
```
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
No current intake vendor form was found for this organization

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//intake-vendor/forms/current/status' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

