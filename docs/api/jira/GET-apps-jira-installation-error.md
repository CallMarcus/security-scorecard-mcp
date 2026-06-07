# Installation error page

- **Method:** `GET`
- **Path:** `/apps/jira/installation-error`
- **Tag:** `jira`
- **operationId:** `get_apps-jira-installation-error`

## Description
Shown when Jira app installation fails.

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//apps/jira/installation-error' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

