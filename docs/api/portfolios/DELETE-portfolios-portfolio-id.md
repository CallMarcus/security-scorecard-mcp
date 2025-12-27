# Delete a portfolio

- **Method:** `DELETE`
- **Path:** `/portfolios/{portfolio_id}`
- **Tag:** `portfolios`
- **operationId:** `delete_portfolios-portfolio-id`

## Path Parameters
- `portfolio_id` (**required**) — id of a portfolio you have write access to

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//portfolios/<portfolio_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

