# Remove company from portfolio

- **Method:** `DELETE`
- **Path:** `/portfolios/{portfolio_id}/companies/{domain}`
- **Tag:** `portfolios`
- **operationId:** `delete_portfolios-portfolio-id-companies-domain`

## Path Parameters
- `portfolio_id` (**required**) — id of a portfolio you have write access to
- `domain` (**required**) — company primary domain

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//portfolios/<portfolio_id>/companies/<domain>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

