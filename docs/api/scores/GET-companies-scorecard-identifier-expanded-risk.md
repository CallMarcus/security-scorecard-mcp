# Get a company's expanded risk

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/expanded-risk`
- **Tag:** `scores`
- **operationId:** `get_companies-scorecard-identifier-expanded-risk`

## Path Parameters
- `scorecard_identifier` (**required**) — primary identifier of a company or scorecard

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
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/expanded-risk' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

