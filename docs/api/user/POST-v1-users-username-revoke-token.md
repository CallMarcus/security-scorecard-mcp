# revokes a user access token

- **Method:** `POST`
- **Path:** `/v1/users/{username}/revoke-token`
- **Tag:** `User`
- **operationId:** `post_v1-users-username-revoke-token`

## Description
revokes a user access token

## Path Parameters
- `username` (**required**) — username of the user whose token should be revoked

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//v1/users/<username>/revoke-token' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

