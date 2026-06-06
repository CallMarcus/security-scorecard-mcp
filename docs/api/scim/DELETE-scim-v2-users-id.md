# Delete a user

- **Method:** `DELETE`
- **Path:** `/scim/v2/Users/{id}`
- **Tag:** `Scim`
- **operationId:** `delete_scim-v2-users-id`

## Description
Delete a user

## Path Parameters
- `id` (**required**) — user id

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//scim/v2/Users/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

