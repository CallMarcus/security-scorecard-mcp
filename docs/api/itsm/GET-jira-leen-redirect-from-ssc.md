# Jira Leen redirect from SSC

- **Method:** `GET`
- **Path:** `/jira-leen/redirect-from-ssc`
- **Tag:** `itsm`
- **operationId:** `get_jira-leen-redirect-from-ssc`

## Description
Handles redirect back from SSC during Jira Leen app flow. Proxies to /jira/redirect-from-ssc on the backend.

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//jira-leen/redirect-from-ssc' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

