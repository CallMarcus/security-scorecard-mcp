# Get third party vendors by domain

- **Method:** `GET`
- **Path:** `/vendor-detection/{domain}/third-party`
- **Category:** `vendor-analysis`
- **Operation ID:** `get_vendor-detection-domain-third-party`

## Description

Returns a list of third party vendors connected to the given domain

## Path Parameters

- `domain` (**Required**) - Domain to use

## Query Parameters

- `page` (integer, Optional) - Which page of results to return
- `limit` (integer, Optional) - How many results to return

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

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/vendor-detection/<domain>/third-party' \
  -H 'Authorization: Bearer <your-api-token>'
```
