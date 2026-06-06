# Get all portfolios you have access to

- **Method:** `GET`
- **Path:** `/portfolios`
- **Tag:** `portfolios`
- **operationId:** `get_portfolios`

## Responses
### 200
the list of portfolios
```json
{
  "$ref": "#/definitions/PortfolioList"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//portfolios' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

