# Get a company's historical breaches events

- **Method:** `GET`
- **Path:** `/companies/{domain}/history/events/breaches`
- **Tag:** `event log`
- **operationId:** `get_companies-domain-history-events-breaches`

## Path Parameters
- `domain` (**required**) — primary domain identifying a company

## Query Parameters
- `date_from` (optional, string) — find entries where 'date' is greater or equal than a date
- `date_to` (optional, string) — find entries where 'date' is lower or equal than a date

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

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<domain>/history/events/breaches' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

