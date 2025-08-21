# Gets the list of users for a specific organization

- **Method:** `GET`
- **Path:** `/max/v1/customers/{customer_id}/users`
- **Tag:** `V1`
- **operationId:** `getV1CustomersByOrganizationidUsers`

## Path Parameters
- `organization_id` (**required**) — customer (organization) ID

## Responses
### 200
A list of usernames and email addresses
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "username": {
            "type": "string",
            "description": "Username"
          },
          "email": {
            "type": "string",
            "description": "email of the user"
          }
        },
        "required": [
          "username",
          "email"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "entries"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customers/{customer_id}/users' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

