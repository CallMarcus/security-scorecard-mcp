# Delete plan by ID

- **Method:** `DELETE`
- **Path:** `/plans/{id}`
- **Tag:** `action plans`
- **operationId:** `deletePlansById`

## Path Parameters
- `id` (**required**) — unique plan id

## Responses
### 204
Delete user plan by ID

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//plans/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

