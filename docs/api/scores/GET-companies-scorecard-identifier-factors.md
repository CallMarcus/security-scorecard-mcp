# Get a company's factor scores and issue counts

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/factors`
- **Tag:** `scores`
- **operationId:** `get_companies-scorecard-identifier-factors`

## Path Parameters
- `scorecard_identifier` (**required**) — primary identifier of a company or scorecard

## Query Parameters
- `severity` (optional, string) — optionally filter issues by severity
- `severity_in` (optional, string) — optionally filter issues by comma separated severity list

## Responses
### 200
company's factors
```json
{
  "$ref": "#/definitions/CompanyFactors"
}
```
### 400
Bad Request: The scorecard_identifier or the authorization header is malformed.
### 401
Unauthorized
### 403
to access scorecard's factor level data, company must be added to a portfolio first.
### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/factors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

