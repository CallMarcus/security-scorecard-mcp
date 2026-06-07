# Get the effective CC list for a (customer, vendor)

- **Method:** `GET`
- **Path:** `/max/v1/partner/customers/{customerId}/vendors/{vendorId}/effective-cc`
- **Tag:** `V1`
- **operationId:** `getV1PartnerCustomersByCustomeridVendorsByVendoridEffectiveCc`

## Description
Returns the customer default list, the (customer, vendor) overlay, and the deduplicated union of email addresses used for escalation emails.

## Path Parameters
- `customer_id` (**required**) — Customer ID
- `vendor_id` (**required**) — Vendor ID

## Responses
### 200
Effective CC for (customer, vendor)
```json
{
  "type": "object",
  "properties": {
    "default": {
      "type": "array",
      "description": "Customer-level default CC entries",
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
    },
    "extras": {
      "type": "array",
      "description": "(customer, vendor) overlay CC entries",
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
    },
    "effective": {
      "type": "array",
      "description": "Deduplicated union of all CC email addresses, sorted alphabetically",
      "items": {
        "type": "string",
        "format": "email"
      }
    }
  },
  "required": [
    "default",
    "extras",
    "effective"
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
  'https://api.securityscorecard.io//max/v1/partner/customers/{customerId}/vendors/{vendorId}/effective-cc' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

