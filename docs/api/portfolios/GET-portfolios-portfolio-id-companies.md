# Get all companies in a portfolio

- **Method:** `GET`
- **Path:** `/portfolios/{portfolio_id}/companies`
- **Tag:** `portfolios`
- **operationId:** `get_portfolios-portfolio-id-companies`

## Path Parameters
- `portfolio_id` (**required**) — a portfolio unique id

## Query Parameters
- `grade` (optional, string) — company score grade filter
- `industry` (optional, string) — industry filter
- `vulnerability` (optional, string) — CVE vulnerability filter
- `issue_type` (optional, string) — issue type filter
- `status` (optional, string) — company status
- `had_breach_within_last_days` (optional, number) — companies with breaches in last N days

## Responses
### 200
the list of companies
```json
{
  "$ref": "#/definitions/PortfolioCompaniesList"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//portfolios/<portfolio_id>/companies' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

