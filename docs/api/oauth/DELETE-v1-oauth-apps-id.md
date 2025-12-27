# Delete an OAuth application

- **Method:** `DELETE`
- **Path:** `/v1/oauth/apps/{id}`
- **Tag:** `OAuth`
- **operationId:** `delete_v1-oauth-apps-id`

## Description
Delete an OAuth application

## Path Parameters
- `id` (**required**) — ID of the OAuth app to delete

## Responses
### 200
OAuth app deleted successfully

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//v1/oauth/apps/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

