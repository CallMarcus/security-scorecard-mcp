# Get all expanded risk events in a portfolio

- **Method:** `GET`
- **Path:** `/portfolios/{portfolio_id}/expanded-risk`
- **Category:** `portfolio-management`
- **Operation ID:** `get_portfolios-portfolio-id-expanded-risk`

## Path Parameters

- `portfolio_id` (**Required**) - a portfolio unique id

## Query Parameters

- `category` (string, Optional) - optionally filter events by category
- `confidence` (string, Optional) - optionally filter events by confidence
- `page` (integer, Optional) - optionally specify which page of results to return
- `limit` (integer, Optional) - optionally specify how many results to return

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

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/portfolios/<portfolio_id>/expanded-risk' \
  -H 'Authorization: Bearer <your-api-token>'
```
