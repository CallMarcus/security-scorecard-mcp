# Update a custom scorecard

- **Method:** `PUT`
- **Path:** `/custom-scorecards/{id}`
- **Tag:** `custom scorecards`
- **operationId:** `put_custom-scorecards-id`

## Description
Update a custom scorecard

## Path Parameters
- `id` (**required**) — id of custom scorecard to update

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//custom-scorecards/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

