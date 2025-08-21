# Delete an ip domain tag

- **Method:** `DELETE`
- **Path:** `/ip-domain-tags/{tagId}`
- **Tag:** `Api`
- **operationId:** `deleteApiByTagid`

## Path Parameters
- `tagId` (**required**) — tag id

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//ip-domain-tags/<tagId>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

