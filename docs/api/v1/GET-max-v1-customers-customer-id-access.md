# Gets dashboard access for customer

- **Method:** `GET`
- **Path:** `/max/v1/customers/{customer_id}/access`
- **Tag:** `V1`
- **operationId:** `getV1CustomersByOrganizationidAccess`

## Path Parameters
- `organization_id` (**required**) — customer (organization) ID

## Responses
### 200
Gets the dashboard access settings for customer
```json
{
  "type": "object",
  "properties": {
    "organization_access_type": {
      "type": "string",
      "enum": [
        "none",
        "limited",
        "full"
      ]
    },
    "organization_access_scope": {
      "type": "string",
      "enum": [
        "org",
        "user"
      ]
    },
    "users": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "email"
      }
    }
  },
  "required": [
    "organization_access_type",
    "organization_access_scope",
    "users"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customers/{customer_id}/access' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

