# Get all companies in a portfolio

- **Method:** `GET`
- **Path:** `/portfolios/{portfolio_id}/companies`
- **Category:** `portfolio-management`
- **Operation ID:** `get_portfolios-portfolio-id-companies`

## Path Parameters

- `portfolio_id` (**Required**) - a portfolio unique id

## Query Parameters

- `grade` (string, Optional) - company score grade filter
- `industry` (string, Optional) - industry filter
- `vulnerability` (string, Optional) - CVE vulnerability filter
- `issue_type` (string, Optional) - issue type filter
- `status` (string, Optional) - company status
- `had_breach_within_last_days` (number, Optional) - companies with breaches in last N days

## Responses

### 200
the list of companies
```json
{
  "$ref": "#/definitions/PortfolioCompaniesList"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/portfolios/<portfolio_id>/companies' \
  -H 'Authorization: Bearer <your-api-token>'
```
