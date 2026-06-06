# Get third party vendors by portfolio ID

- **Method:** `GET`
- **Path:** `/vendor-detection/portfolios/{portfolioId}`
- **Category:** `portfolio-management`
- **Operation ID:** `get_vendor-detection-portfolios-portfolioid`

## Description

Returns a list of third-party vendors used by the companies in a given portfolio

## Path Parameters

- `portfolioId` (**Required**) - Portfolio id to use

## Query Parameters

- `domain` (string, Optional) - Name of domain to filter by
(Not compatible with `product` query, filter by one or the other)
- `product` (string, Optional) - Name of product to filter by
(Not compatible with `domain` query, filter by one or the other)
- `page` (integer, Optional) - Which page of results to return
- `limit` (integer, Optional) - How many results to return

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

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/vendor-detection/portfolios/<portfolioId>' \
  -H 'Authorization: Bearer <your-api-token>'
```
