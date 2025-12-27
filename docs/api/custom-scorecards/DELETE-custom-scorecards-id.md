# Delete a custom scorecard

- **Method:** `DELETE`
- **Path:** `/custom-scorecards/{id}`
- **Tag:** `custom scorecards`
- **operationId:** `delete_custom-scorecards-id`

## Description
Delete a custom scorecard

## Path Parameters
- `id` (**required**) — id of custom scorecard to delete

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//custom-scorecards/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

