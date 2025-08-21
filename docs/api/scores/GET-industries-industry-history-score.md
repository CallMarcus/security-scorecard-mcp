# Get an industry's historical scores

- **Method:** `GET`
- **Path:** `/industries/{industry}/history/score`
- **Tag:** `scores`
- **operationId:** `get_industries-industry-history-score`

## Path Parameters
- `industry` (**required**) — an industry key, this can be obtained from a [company basic user info](#tag/companies%2Fpaths%2F~1companies~1%7Bdomain%7D%2Fget)

## Query Parameters
- `timing` (optional, string) — timing granularity
- `from` (optional, string) — history start date
- `to` (optional, string) — history end date

## Responses
### 200
industry historical scores
```json
{
  "$ref": "#/definitions/IndustryScoreHistory"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//industries/<industry>/history/score' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

