# Whether the organization has any OAuth app secrets

- **Method:** `GET`
- **Path:** `/v1/oauth/apps/{id}`
- **Tag:** `OAuth`
- **operationId:** `get_v1-oauth-apps-id`

## Description
Whether the organization has any OAuth app secrets about to expire or already expired

## Query Parameters
- `max_days` (optional, integer) — Include secrets expiring within this many days (default 15)

## Responses
### 200
Whether the organization has any OAuth app secrets about to expire or already expired
```json
{
  "type": "object",
  "properties": {
    "has_expiring_or_expired_secrets": {
      "type": "boolean",
      "description": "True if there is at least one OAuth app secret expiring within the window or already expired"
    }
  },
  "additionalProperties": false,
  "required": [
    "has_expiring_or_expired_secrets"
  ],
  "description": "Whether the organization has any OAuth app secrets about to expire or already expired"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/oauth/apps/{id}' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

