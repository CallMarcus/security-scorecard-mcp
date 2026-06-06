# Delete a portfolio

- **Method:** `DELETE`
- **Path:** `/portfolios/{portfolio_id}`
- **Category:** `portfolio-management`
- **Operation ID:** `delete_portfolios-portfolio-id`

## Path Parameters

- `portfolio_id` (**Required**) - id of a portfolio you have write access to

## Responses

### 204
No response body

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/portfolios/<portfolio_id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
