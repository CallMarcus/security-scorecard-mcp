# Get a company's historical scores

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/history/score`
- **Category:** `company-history`
- **Operation ID:** `get_companies-scorecard-identifier-history-score`

## Path Parameters

- `scorecard_identifier` (**Required**) - primary identifier of a company or scorecard

## Query Parameters

- `timing` (string, Optional) - timing granularity
- `from` (string, Optional) - history start date
- `to` (string, Optional) - history end date

## Responses

### 200
company historical scores
```json
{
  "$ref": "#/definitions/CompanyScoreHistory"
}
```

### 403
to access scorecard's factor level data, company must be added to a portfolio first.

### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/history/score' \
  -H 'Authorization: Bearer <your-api-token>'
```
