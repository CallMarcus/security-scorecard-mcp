# Get the score context for an issue type

- **Method:** `GET`
- **Path:** `/companies/{domain}/issue-context/{issue_type}`
- **Tag:** `active findings`
- **operationId:** `get_companies-domain-issue-context-issue-type`

## Path Parameters
- `domain` (**required**) — primary domain identifying a company
- `issue_type` (**required**) — issue type to get context for

## Responses
### 200
issue context in similar companies
```json
{
  "$ref": "#/definitions/IssueContext"
}
```
### 404
company not found, or user has no access to it.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<domain>/issue-context/<issue_type>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

