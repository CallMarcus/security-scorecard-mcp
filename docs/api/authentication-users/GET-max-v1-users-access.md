# Get user access dashboard

- **Method:** `GET`
- **Path:** `/max/v1/users/access`
- **Category:** `authentication-users`
- **Operation ID:** `getV1UsersAccess`

## Responses

### 200
Details of the requested item
```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "description": "Email of the user"
    },
    "access_type": {
      "type": "string",
      "description": "Dashboard access"
    }
  },
  "required": [
    "email",
    "access_type"
  ],
  "additionalProperties": false
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/max/v1/users/access' \
  -H 'Authorization: Bearer <your-api-token>'
```
