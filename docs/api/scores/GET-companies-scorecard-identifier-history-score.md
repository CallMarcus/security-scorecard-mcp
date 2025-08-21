# Get a company's historical scores

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/history/score`
- **Tag:** `scores`
- **operationId:** `get_companies-scorecard-identifier-history-score`

## Path Parameters
- `scorecard_identifier` (**required**) — primary identifier of a company or scorecard

## Query Parameters
- `timing` (optional, string) — timing granularity
- `from` (optional, string) — history start date
- `to` (optional, string) — history end date

## Responses
### 200
company historical scores
```json
{
  "$ref": "#/definitions/CompanyScoreHistory"
}
```
### 403
to access scorecard's factor level data, company must be added to a portfolio first.
### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/history/score' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

