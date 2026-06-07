# List owner user IDs for an OAuth application

- **Method:** `GET`
- **Path:** `/v1/oauth/apps/{id}/owners`
- **Tag:** `OAuth`
- **operationId:** `get_v1-oauth-apps-id-owners`

## Description
List owner user IDs for an OAuth application

## Path Parameters
- `id` (**required**) — ID of the OAuth app to list owners for

## Responses
### 200
List of owner user IDs for an OAuth app
```json
{
  "type": "object",
  "properties": {
    "owners_user_ids": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid",
        "pattern": "^[\\da-z-]{16,}$"
      },
      "description": "User IDs of owners who can manage this OAuth app"
    }
  },
  "additionalProperties": false,
  "required": [
    "owners_user_ids"
  ],
  "description": "List of owner user IDs for an OAuth app"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/oauth/apps/<id>/owners' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

