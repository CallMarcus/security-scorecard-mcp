# Add company to portfolio

- **Method:** `PUT`
- **Path:** `/portfolios/{portfolio_id}/companies/{domain}`
- **Category:** `companies`
- **Operation ID:** `put_portfolios-portfolio-id-companies-domain`

## Path Parameters

- `portfolio_id` (**Required**) - a portfolio unique id
- `domain` (**Required**) - a company's internet domain. this parameter accepts any valid internet domain.

## Responses

### 200
added company's summary
```json
{
  "$ref": "#/definitions/AddCompanyResponse"
}
```

## Example Request

```bash
curl -X PUT \
  'https://platform.securityscorecard.io/portfolios/<portfolio_id>/companies/<domain>' \
  -H 'Authorization: Bearer <your-api-token>'
```
