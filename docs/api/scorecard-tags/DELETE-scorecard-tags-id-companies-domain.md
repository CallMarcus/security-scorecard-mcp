# Remove a scorecard tag from a company

- **Method:** `DELETE`
- **Path:** `/scorecard-tags/{id}/companies/{domain}`
- **Tag:** `scorecard-tags`
- **operationId:** `delete_scorecard-tags-id-companies-domain`

## Path Parameters
- `id` (**required**) — id of a scorecard tag you have write access to
- `domain` (**required**) — company primary domain

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//scorecard-tags/<id>/companies/<domain>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

