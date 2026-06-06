# Get a company information, scorecard summary, factor scores and issue counts

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/summary-factors`
- **Category:** `companies`
- **Operation ID:** `get_companies-scorecard-identifier-summary-factors`

## Path Parameters

- `scorecard_identifier` (**Required**) - primary identifier of a company or scorecard

## Query Parameters

- `severity` (string, Optional) - optionally filter issues by severity
- `severity_in` (string, Optional) - optionally filter issues by comma separated severity list

## Responses

### 200
company's summary and factors
```json
{
  "$ref": "#/definitions/CompanySummaryFactors"
}
```

### 400
Bad Request: The scorecard_identifier or the authorization header is malformed.

### 401
Unauthorized

### 403
Company needs to be added to a portfolio first

### 404
Company not found

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/summary-factors' \
  -H 'Authorization: Bearer <your-api-token>'
```
