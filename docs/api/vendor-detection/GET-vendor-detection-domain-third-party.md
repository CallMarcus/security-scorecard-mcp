# Get third party vendors by domain

- **Method:** `GET`
- **Path:** `/vendor-detection/{domain}/third-party`
- **Tag:** `vendor-detection`
- **operationId:** `get_vendor-detection-domain-third-party`

## Description
Returns a list of third party vendors connected to the given domain

## Path Parameters
- `domain` (**required**) — Domain to use

## Query Parameters
- `page` (optional, integer) — Which page of results to return
- `limit` (optional, integer) — How many results to return

## Responses
### 200
OK
```json
{
  "$ref": "#/definitions/Vendors"
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
  'https://api.securityscorecard.io//vendor-detection/<domain>/third-party' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

