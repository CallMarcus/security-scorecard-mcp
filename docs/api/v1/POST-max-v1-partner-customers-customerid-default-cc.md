# Add a default CC email for a customer

- **Method:** `POST`
- **Path:** `/max/v1/partner/customers/{customerId}/default-cc`
- **Tag:** `V1`
- **operationId:** `postV1PartnerCustomersByCustomeridDefaultCc`

## Description
Adds a CC email to the customer-level default list. Idempotent — re-adding an existing email returns the existing row. Email is trimmed and lowercased before storing.

## Path Parameters
- `customer_id` (**required**) — Customer ID

## Request Body
```json
{
  "type": "object",
  "properties": {
    "cc_email": {
      "type": "string",
      "description": "CC email address to add for this customer. Server trims, lowercases, and validates the shape."
    }
  },
  "required": [
    "cc_email"
  ],
  "additionalProperties": false
}
```

## Responses
### 201
Row added (or existing row returned on conflict)
```json
{
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
```
### 400
Invalid email address
### 401
Unauthorized
### 403
Forbidden - insufficient permissions

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//max/v1/partner/customers/{customerId}/default-cc' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

