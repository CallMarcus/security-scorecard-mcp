# Get a company's active issues

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/active-issues`
- **Tag:** `issues`
- **operationId:** `get_companies-scorecard-identifier-active-issues`

## Path Parameters
- `scorecard_identifier` (**required**) — primary identifier of a company or scorecard

## Query Parameters
- `issue_types` (optional, array) — List of issue types to filter by (e.g., tlscert_weak_signature, tlscert_self_signed)

## Responses
### 200
company's active issues
```json
{
  "$ref": "#/definitions/CompanyActiveIssues"
}
```
### 400
Bad Request: The scorecard_identifier or the authorization header is malformed.
### 401
Unauthorized
### 403
to access scorecard's active issues level data, company must be added to a portfolio first.
### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/active-issues' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

