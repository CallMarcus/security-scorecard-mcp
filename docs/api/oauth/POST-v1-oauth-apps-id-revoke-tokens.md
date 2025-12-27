# Revoke all access and refresh tokens for an OAuth 

- **Method:** `POST`
- **Path:** `/v1/oauth/apps/{id}/revoke-tokens`
- **Tag:** `OAuth`
- **operationId:** `post_v1-oauth-apps-id-revoke-tokens`

## Description
Revoke all access and refresh tokens for an OAuth application

## Path Parameters
- `id` (**required**) — ID of the OAuth app to revoke tokens for

## Responses
### 200
All tokens revoked successfully

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//v1/oauth/apps/<id>/revoke-tokens' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

