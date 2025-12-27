# Get third party vendors by portfolio ID

- **Method:** `GET`
- **Path:** `/vendor-detection/portfolios/{portfolioId}`
- **Tag:** `vendor-detection`
- **operationId:** `get_vendor-detection-portfolios-portfolioid`

## Description
Returns a list of third-party vendors used by the companies in a given portfolio

## Path Parameters
- `portfolioId` (**required**) — Portfolio id to use

## Query Parameters
- `domain` (optional, string) — Name of domain to filter by
(Not compatible with `product` query, filter by one or the other)
- `product` (optional, string) — Name of product to filter by
(Not compatible with `domain` query, filter by one or the other)
- `page` (optional, integer) — Which page of results to return
- `limit` (optional, integer) — How many results to return

## Responses
### 200
OK
```json
{
  "$ref": "#/definitions/PortfolioVendors"
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
  "$ref": "#/definitions/ErrorResponse"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//vendor-detection/portfolios/<portfolioId>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

