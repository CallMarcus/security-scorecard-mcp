# Get a company's historical breaches events

- **Method:** `GET`
- **Path:** `/companies/{domain}/history/events/breaches`
- **Category:** `company-history`
- **Operation ID:** `get_companies-domain-history-events-breaches`

## Path Parameters

- `domain` (**Required**) - primary domain identifying a company

## Query Parameters

- `date_from` (string, Optional) - find entries where 'date' is greater or equal than a date
- `date_to` (string, Optional) - find entries where 'date' is lower or equal than a date

## Responses

### 200
company's breach events
```json
{
  "$ref": "#/definitions/CompanyEvents"
}
```

### 403
to access scorecard's events level data, company must be added to a portfolio first.

### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<domain>/history/events/breaches' \
  -H 'Authorization: Bearer <your-api-token>'
```
