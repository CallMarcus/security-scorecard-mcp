# Validate Jira Legacy secrets

- **Method:** `GET`
- **Path:** `/apps/jira-legacy/actions/validate-jira-secrets`
- **Tag:** `itsm`
- **operationId:** `get_apps-jira-legacy-actions-validate-jira-secrets`

## Description
Validates Jira Legacy app secrets configuration.

## Responses
### 200
OK

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//apps/jira-legacy/actions/validate-jira-secrets' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

