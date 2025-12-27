# Create a new portfolio

- **Method:** `POST`
- **Path:** `/portfolios`
- **Tag:** `portfolios`
- **operationId:** `post_portfolios`

## Request Body
```json
{
  "$ref": "#/definitions/PortfolioCreate"
}
```

## Responses
### 200
the created portfolio
```json
{
  "$ref": "#/definitions/Portfolio"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//portfolios' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

