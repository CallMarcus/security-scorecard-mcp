# Get email domains allowed to access the current intake vendor form

- **Method:** `GET`
- **Path:** `/intake-vendor/forms/current/access-domains`
- **Tag:** `intake-vendor`
- **operationId:** `getCurrentFormAccessDomains`

## Description
Returns the list of email domains that have access to the current intake vendor form.

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/IntakeVendorAccessDomains"
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
  'https://api.securityscorecard.io//intake-vendor/forms/current/access-domains' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

