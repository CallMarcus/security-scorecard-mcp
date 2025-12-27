# Delete an ip domain tag group

- **Method:** `DELETE`
- **Path:** `/ip-domain-tags/groups/{id}`
- **Tag:** `Api`
- **operationId:** `deleteApiTagGroupsById`

## Path Parameters
- `id` (**required**) — tag group id

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//ip-domain-tags/groups/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

