# Get current intake vendor form publish status

- **Method:** `GET`
- **Path:** `/intake-vendor/forms/current/publish-status`
- **Tag:** `intake-vendor`
- **operationId:** `getIntakeVendorFormPublishStatus`

## Description
Returns publish status for the current intake vendor form (active or inactive), optional public URL, and last update time.

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/IntakeVendorPublishStatus"
}
```
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//intake-vendor/forms/current/publish-status' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

