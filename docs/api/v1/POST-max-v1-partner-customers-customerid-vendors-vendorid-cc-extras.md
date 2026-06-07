# Add a CC extra for a (customer, vendor)

- **Method:** `POST`
- **Path:** `/max/v1/partner/customers/{customerId}/vendors/{vendorId}/cc-extras`
- **Tag:** `V1`
- **operationId:** `postV1PartnerCustomersByCustomeridVendorsByVendoridCcExtras`

## Description
Adds a CC email to the (customer, vendor) overlay. Idempotent — re-adding an existing email returns the existing row. Email is trimmed and lowercased before storing.

## Path Parameters
- `customer_id` (**required**) — Customer ID
- `vendor_id` (**required**) — Vendor ID

## Request Body
```json
{
  "type": "object",
  "properties": {
    "cc_email": {
      "type": "string",
      "description": "CC email address to add for this (customer, vendor). Server trims, lowercases, and validates the shape."
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
    "vendor_id": {
      "type": "string",
      "format": "uuid",
      "description": "Vendor id"
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
    "vendor_id",
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
  'https://api.securityscorecard.io//max/v1/partner/customers/{customerId}/vendors/{vendorId}/cc-extras' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

