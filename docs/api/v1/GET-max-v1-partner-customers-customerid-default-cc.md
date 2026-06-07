# List default CC emails for a customer

- **Method:** `GET`
- **Path:** `/max/v1/partner/customers/{customerId}/default-cc`
- **Tag:** `V1`
- **operationId:** `getV1PartnerCustomersByCustomeridDefaultCc`

## Description
Returns every email in the customer-level default CC list for escalation emails. Empty list when none configured.

## Path Parameters
- `customer_id` (**required**) — Customer ID

## Responses
### 200
Default CC list
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "description": "Row id"
          },
          "partner_id": {
            "type": "string",
            "format": "uuid",
            "description": "Partner organization id"
          },
          "customer_id": {
            "type": "string",
            "format": "uuid",
            "description": "Customer id"
          },
          "cc_email": {
            "type": "string",
            "format": "email",
            "description": "CC email address (lowercased)"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "Row creation timestamp"
          },
          "created_by_user_id": {
            "type": "string",
            "format": "uuid",
            "description": "User who created the row"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "description": "Row last-update timestamp"
          },
          "updated_by_user_id": {
            "type": "string",
            "format": "uuid",
            "description": "User who last updated the row"
          }
        },
        "required": [
          "id",
          "partner_id",
          "customer_id",
          "cc_email",
          "created_at"
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
### 401
Unauthorized
### 403
Forbidden - insufficient permissions

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/customers/{customerId}/default-cc' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

