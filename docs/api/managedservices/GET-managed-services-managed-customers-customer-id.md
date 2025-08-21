# get managed customer detail by id

- **Method:** `GET`
- **Path:** `/managed-services/managed-customers/{customer_id}`
- **Tag:** `ManagedServices`
- **operationId:** `get_managed-services-managed-customers-customer-id`

## Description
get managed customer detail by id

## Path Parameters
- `customer_id` (**required**) — id of a customer

## Responses
### 200
Request details
```json
{
  "type": "object",
  "properties": {
    "customer_id": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$"
    },
    "domain": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "available_slots": {
      "type": "integer"
    },
    "status": {
      "type": "string"
    },
    "request_id": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$"
    }
  },
  "additionalProperties": false,
  "required": [
    "customer_id",
    "domain",
    "name",
    "status",
    "request_id"
  ],
  "description": "Request details"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//managed-services/managed-customers/<customer_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

