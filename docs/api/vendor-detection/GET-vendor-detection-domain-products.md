# Get products by domain

- **Method:** `GET`
- **Path:** `/vendor-detection/{domain}/products`
- **Tag:** `vendor-detection`
- **operationId:** `get_vendor-detection-domain-products`

## Description
Returns a list of products used by the given domain

## Path Parameters
- `domain` (**required**) — Domain to use

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
  'https://api.securityscorecard.io//vendor-detection/<domain>/products' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

