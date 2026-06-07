# Leen callback

- **Method:** `GET`
- **Path:** `/leen/callback/{app_id}/{organization_id}/{status}`
- **Tag:** `itsm`
- **operationId:** `get_leen-callback-app-id-organization-id-status`

## Description
Callback from Leen for app installation (app_id, organization_id, status).

## Path Parameters
- `app_id` (**required**) — 
- `organization_id` (**required**) — 
- `status` (**required**) — 

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//leen/callback/<app_id>/<organization_id>/<status>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

