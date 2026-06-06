# Get a company information and scorecard summary

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}`
- **Tag:** `scores`
- **operationId:** `get_companies-scorecard-identifier`

## Path Parameters
- `scorecard_identifier` (**required**) — primary identifier of a company or scorecard in SecurityScorecard. To determine this value, company must be added to a portfolio first.

## Responses
### 200
company's summary
```json
{
  "$ref": "#/definitions/CompanySummary"
}
```
### 400
Bad Request: The scorecard_identifier or the authorization header is malformed.
### 401
Unauthorized
### 403
Company needs to be added to a portfolio first
### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get it created.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

