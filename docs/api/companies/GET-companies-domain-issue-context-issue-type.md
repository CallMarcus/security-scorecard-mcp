# Get the score context for an issue type

- **Method:** `GET`
- **Path:** `/companies/{domain}/issue-context/{issue_type}`
- **Category:** `companies`
- **Operation ID:** `get_companies-domain-issue-context-issue-type`

## Path Parameters

- `domain` (**Required**) - primary domain identifying a company
- `issue_type` (**Required**) - issue type to get context for

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

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<domain>/issue-context/<issue_type>' \
  -H 'Authorization: Bearer <your-api-token>'
```
