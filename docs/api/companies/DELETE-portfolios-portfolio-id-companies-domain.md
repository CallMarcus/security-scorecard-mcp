# Remove company from portfolio

- **Method:** `DELETE`
- **Path:** `/portfolios/{portfolio_id}/companies/{domain}`
- **Category:** `companies`
- **Operation ID:** `delete_portfolios-portfolio-id-companies-domain`

## Path Parameters

- `portfolio_id` (**Required**) - id of a portfolio you have write access to
- `domain` (**Required**) - company primary domain

## Responses

### 204
No response body

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/portfolios/<portfolio_id>/companies/<domain>' \
  -H 'Authorization: Bearer <your-api-token>'
```
