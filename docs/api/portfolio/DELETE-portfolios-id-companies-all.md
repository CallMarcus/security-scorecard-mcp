# Remove all companies from a portfolio

- **Method:** `DELETE`
- **Path:** `/portfolios/{id}/companies/all`
- **Tag:** `Portfolio`
- **operationId:** `delete_portfolios-id-companies-all`

## Description
Remove all companies from a portfolio

## Path Parameters
- `id` (**required**) — portfolio id

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//portfolios/<id>/companies/all' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

