# Jira Legacy redirect from SSC

- **Method:** `GET`
- **Path:** `/apps/jira-legacy/redirect-from-ssc`
- **Tag:** `itsm`
- **operationId:** `get_apps-jira-legacy-redirect-from-ssc`

## Description
Handles redirect back from SSC during Jira Legacy app flow.

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//apps/jira-legacy/redirect-from-ssc' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

