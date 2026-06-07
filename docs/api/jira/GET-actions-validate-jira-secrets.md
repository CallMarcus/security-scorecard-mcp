# Validate Jira secrets

- **Method:** `GET`
- **Path:** `/actions/validate-jira-secrets`
- **Tag:** `jira`
- **operationId:** `get_actions-validate-jira-secrets`

## Description
Validates Jira app secrets configuration.

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//actions/validate-jira-secrets' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

