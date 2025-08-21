# Get a company's expanded risk

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/expanded-risk`
- **Category:** `companies`
- **Operation ID:** `get_companies-scorecard-identifier-expanded-risk`

## Path Parameters

- `scorecard_identifier` (**Required**) - primary identifier of a company or scorecard

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
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/expanded-risk' \
  -H 'Authorization: Bearer <your-api-token>'
```
