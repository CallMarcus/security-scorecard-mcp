# Update the dashboard access for the organization

- **Method:** `POST`
- **Path:** `/max/v1/customers/{customer_id}/access`
- **Tag:** `V1`
- **operationId:** `postV1CustomersByOrganizationidAccess`

## Path Parameters
- `organization_id` (**required**) — 

## Request Body
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

## Responses
### 204


## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//max/v1/customers/{customer_id}/access' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

