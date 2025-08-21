# Get user access dashboard

- **Method:** `GET`
- **Path:** `/max/v1/users/access`
- **Tag:** `V1`
- **operationId:** `getV1UsersAccess`

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

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/users/access' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

