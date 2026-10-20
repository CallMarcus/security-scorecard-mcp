# Remove all companies from a portfolio

- **Method:** `DELETE`
- **Path:** `/portfolios/{id}/companies/all`
- **Tag:** `Portfolio`
- **operationId:** `delete_portfolios-id-companies-all`

## Description
Remove all companies from a portfolio

## Path Parameters
- `id` (**required**) — portfolio id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "keepPartialMonitoring": {
      "type": "boolean",
      "description": "move companies with no remaining portfolio to partial monitoring instead of removing them from All Companies; ignored when this behavior is not available for the caller's organization"
    }
  },
  "additionalProperties": false
}
```

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//portfolios/<id>/companies/all' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

