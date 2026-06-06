# Delete a specific client secret

- **Method:** `DELETE`
- **Path:** `/v1/oauth/apps/{id}/secrets/{secret_id}`
- **Tag:** `OAuth`
- **operationId:** `delete_v1-oauth-apps-id-secrets-secret-id`

## Description
Delete a specific client secret

## Path Parameters
- `id` (**required**) — ID of the OAuth app
- `secret_id` (**required**) — ID of the secret to delete

## Responses
### 200
Secret deleted successfully

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//v1/oauth/apps/<id>/secrets/<secret_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

