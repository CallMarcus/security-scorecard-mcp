# Get all expanded risk events in a portfolio

- **Method:** `GET`
- **Path:** `/portfolios/{portfolio_id}/expanded-risk`
- **Tag:** `portfolios`
- **operationId:** `get_portfolios-portfolio-id-expanded-risk`

## Path Parameters
- `portfolio_id` (**required**) — a portfolio unique id

## Query Parameters
- `category` (optional, string) — optionally filter events by category
- `confidence` (optional, string) — optionally filter events by confidence
- `page` (optional, integer) — optionally specify which page of results to return
- `limit` (optional, integer) — optionally specify how many results to return

## Responses
### 200
OK
```json
{
  "$ref": "#/definitions/ExpandedRiskEvents"
}
```
### 400
Bad Request
### 401
Unauthorized
### 403
Company must be added to a portfolio first
### 404
Company not found
### default
Error Payload
```json
{
  "$ref": "#/definitions/ExpandedRiskErrorResponse"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//portfolios/<portfolio_id>/expanded-risk' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

