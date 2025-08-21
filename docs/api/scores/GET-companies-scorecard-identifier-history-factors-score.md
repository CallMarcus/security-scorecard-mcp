# Get a company's historical factor scores

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/history/factors/score`
- **Tag:** `scores`
- **operationId:** `get_companies-scorecard-identifier-history-factors-score`

## Description
Note: each entry in the response will have scores for each factor, you can obtain the factors currently available from [factor metadata](#tag/metadata%2Fpaths%2F~1metadata~1factors%2Fget)

## Path Parameters
- `scorecard_identifier` (**required**) — primary identifier of a company or scorecard

## Query Parameters
- `date_from` (optional, string) — history start date
- `date_to` (optional, string) — history end date
- `timing` (optional, string) — date granularity, it could be "daily" (default), "weekly" or "monthly"

## Responses
### 200
company historical scores
```json
{
  "$ref": "#/definitions/CompanyFactorScoreHistory"
}
```
### 403
to access scorecard's factor level data, company must be added to a portfolio first.
### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/history/factors/score' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

