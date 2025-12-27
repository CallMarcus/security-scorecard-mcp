# Add company to portfolio

- **Method:** `PUT`
- **Path:** `/portfolios/{portfolio_id}/companies/{domain}`
- **Tag:** `portfolios`
- **operationId:** `put_portfolios-portfolio-id-companies-domain`

## Path Parameters
- `portfolio_id` (**required**) — a portfolio unique id
- `domain` (**required**) — a company's internet domain. this parameter accepts any valid internet domain.

## Responses
### 200
added company's summary
```json
{
  "$ref": "#/definitions/AddCompanyResponse"
}
```

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//portfolios/<portfolio_id>/companies/<domain>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

