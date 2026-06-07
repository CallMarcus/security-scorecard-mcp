# Get current intake vendor form

- **Method:** `GET`
- **Path:** `/intake-vendor/forms/current`
- **Tag:** `intake-vendor`
- **operationId:** `getCurrentForm`

## Description
Returns the current organization intake vendor form including its questions, options, mappings, and access emails.

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/IntakeVendorForm"
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
curl -X GET \
  'https://api.securityscorecard.io//intake-vendor/forms/current' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

