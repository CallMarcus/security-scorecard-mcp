# Edit a portfolio

- **Method:** `PUT`
- **Path:** `/portfolios/{portfolio_id}`
- **Category:** `portfolio-management`
- **Operation ID:** `put_portfolios-portfolio-id`

## Path Parameters

- `portfolio_id` (**Required**) - No description

## Request Body

```json
{
  "$ref": "#/definitions/PortfolioEdit"
}
```

## Responses

### 200
the edited portfolio
```json
{
  "$ref": "#/definitions/Portfolio"
}
```

## Example Request

```bash
curl -X PUT \
  'https://platform.securityscorecard.io/portfolios/<portfolio_id>' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
