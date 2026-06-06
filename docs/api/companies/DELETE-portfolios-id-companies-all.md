# Remove all companies from a portfolio

- **Method:** `DELETE`
- **Path:** `/portfolios/{id}/companies/all`
- **Category:** `companies`
- **Operation ID:** `delete_portfolios-id-companies-all`

## Description

Remove all companies from a portfolio

## Path Parameters

- `id` (**Required**) - portfolio id

## Responses

### 204
No response body

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/portfolios/<id>/companies/all' \
  -H 'Authorization: Bearer <your-api-token>'
```
