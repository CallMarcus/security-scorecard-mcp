# Jira Leen install (GET)

- **Method:** `GET`
- **Path:** `/jira-leen/install`
- **Tag:** `itsm`
- **operationId:** `get_jira-leen-install`

## Description
Entry point for installing the Jira Leen app. Proxies to /jira/install on the backend.

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//jira-leen/install' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

