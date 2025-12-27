# Get risk score by domain

- **Method:** `GET`
- **Path:** `/vendor-detection/{domain}/risk`
- **Tag:** `vendor-detection`
- **operationId:** `get_vendor-detection-domain-risk`

## Description
Returns the supply chain risk score for a given domain

## Path Parameters
- `domain` (**required**) — Domain to use

## Responses
### 200
OK
```json
{
  "$ref": "#/definitions/Risk"
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
  'https://api.securityscorecard.io//vendor-detection/<domain>/risk' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

