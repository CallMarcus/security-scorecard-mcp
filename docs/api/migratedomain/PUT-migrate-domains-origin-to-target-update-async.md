# Updates the domains data to another domain

- **Method:** `PUT`
- **Path:** `/migrate-domains/{origin}/to/{target}/update-async`
- **Tag:** `MigrateDomain`
- **operationId:** `put_migrate-domains-origin-to-target-update-async`

## Description
Updates the domains data to another domain

## Path Parameters
- `origin` (**required**) — origin domain to move to target
- `target` (**required**) — target domain

## Request Body
```json
{
  "type": "object",
  "properties": {
    "emails": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "list of user emails"
    },
    "ticket": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

## Responses
### 200
Response of the bulk upsert vendor details records request

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//migrate-domains/<origin>/to/<target>/update-async' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

