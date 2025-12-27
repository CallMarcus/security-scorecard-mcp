# Edit a portfolio

- **Method:** `PUT`
- **Path:** `/portfolios/{portfolio_id}`
- **Tag:** `portfolios`
- **operationId:** `put_portfolios-portfolio-id`

## Path Parameters
- `portfolio_id` (**required**) — 

## Request Body
```json
{
  "$ref": "#/definitions/PortfolioEdit"
}
```

## Responses
### 200
the edited portfolio
```json
{
  "$ref": "#/definitions/Portfolio"
}
```

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//portfolios/<portfolio_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

