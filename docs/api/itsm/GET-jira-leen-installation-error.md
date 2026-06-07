# Jira Leen installation error

- **Method:** `GET`
- **Path:** `/jira-leen/installation-error`
- **Tag:** `itsm`
- **operationId:** `get_jira-leen-installation-error`

## Description
Shown when Jira Leen app installation fails. Proxies to /jira/installation-error on the backend.

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//jira-leen/installation-error' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

