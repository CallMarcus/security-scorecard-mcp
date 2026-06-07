# Redirect from SSC

- **Method:** `GET`
- **Path:** `/apps/jira/redirect-from-ssc`
- **Tag:** `jira`
- **operationId:** `get_apps-jira-redirect-from-ssc`

## Description
Handles redirect back from SSC during Jira app flow.

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//apps/jira/redirect-from-ssc' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

