# Update email domains allowed to access the current intake vendor form

- **Method:** `PUT`
- **Path:** `/intake-vendor/forms/current/access-domains`
- **Tag:** `intake-vendor`
- **operationId:** `updateCurrentFormAccessDomains`

## Description
Updates the list of email domains that have access to the current intake vendor form.

## Request Body
```json
{
  "$ref": "#/definitions/IntakeVendorAccessDomainsInput"
}
```

## Responses
### 200
Access domains were updated successfully
```json
{
  "$ref": "#/definitions/IntakeVendorAccessDomains"
}
```
### 400
Invalid request body
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
No current intake vendor form was found for this organization

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//intake-vendor/forms/current/access-domains' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

