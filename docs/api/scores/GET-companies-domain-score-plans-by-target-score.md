# Get the score plan by score target

- **Method:** `GET`
- **Path:** `/companies/{domain}/score-plans/by-target/{score}`
- **Tag:** `scores`
- **operationId:** `get_companies-domain-score-plans-by-target-score`

## Path Parameters
- `domain` (**required**) — primary domain identifying a company
- `score` (**required**) — score target: the score you want to reach

## Responses
### 200
issue context in similar companies
```json
{
  "$ref": "#/definitions/ScorePlan"
}
```
### 403
to access this scorecard, company must be added to a portfolio first.
### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<domain>/score-plans/by-target/<score>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

