# Get a company information, scorecard summary, factor scores and issue counts

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/summary-factors`
- **Tag:** `scores`
- **operationId:** `get_companies-scorecard-identifier-summary-factors`

## Path Parameters
- `scorecard_identifier` (**required**) — primary identifier of a company or scorecard

## Query Parameters
- `severity` (optional, string) — optionally filter issues by severity
- `severity_in` (optional, string) — optionally filter issues by comma separated severity list

## Responses
### 200
company's summary and factors
```json
{
  "$ref": "#/definitions/CompanySummaryFactors"
}
```
### 400
Bad Request: The scorecard_identifier or the authorization header is malformed.
### 401
Unauthorized
### 403
Company needs to be added to a portfolio first
### 404
Company not found

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/summary-factors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

