# Delete a scorecard tag

- **Method:** `DELETE`
- **Path:** `/scorecard-tags/{id}`
- **Tag:** `Tag`
- **operationId:** `delete_scorecard-tags-id`

## Description
Delete a scorecard tag

## Path Parameters
- `id` (**required**) — scorecard tag id

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//scorecard-tags/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

