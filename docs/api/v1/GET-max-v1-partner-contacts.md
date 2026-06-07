# List all contacts for all customers of the partner

- **Method:** `GET`
- **Path:** `/max/v1/partner/contacts`
- **Tag:** `V1`
- **operationId:** `getV1PartnerContacts`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `vendor_id` (optional, string) — Optional vendor ID filter. Omit for all contacts; pass a UUID for that vendor; pass the literal string "null" for customer-only contacts (no vendor).
- `search` (optional, string) — Search text to filter contacts by email, first name, or last name (case-insensitive substring match).
- `sort` (optional, string) — Sort order as a JSON string representing an array of objects with "id" (field name: email, first_name, last_name, created_at) and "desc" (boolean).
- `email` (optional, string) — Email filter; accepts a single value or comma-separated list (case-insensitive substring match; multiple values are ORed).
- `first_name` (optional, string) — First name filter; accepts a single value or comma-separated list (case-insensitive substring match; multiple values are ORed).
- `last_name` (optional, string) — Last name filter; accepts a single value or comma-separated list (case-insensitive substring match; multiple values are ORed).

## Responses
### 200
List of contacts across all managed customers
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
            "description": "Contact unique identifier"
          },
          "first_name": {
            "type": "string",
            "description": "Contact first name"
          },
          "last_name": {
            "type": "string",
            "description": "Contact last name"
          },
          "email": {
            "type": "string",
            "format": "email",
            "description": "Contact email address; unique per (email, vendorId) so same email may exist for different vendors"
          },
          "created_by_user_id": {
            "type": "string",
            "format": "uuid",
            "description": "User ID who created this contact (for audit logging)"
          },
          "created_by_organization_id": {
            "type": "string",
            "format": "uuid",
            "description": "Organization ID who created this contact (for audit logging)"
          },
          "vendor_id": {
            "type": "string",
            "format": "uuid",
            "description": "Vendor ID this contact is associated with (null if contact is for customer directly)"
          },
          "customer_ids": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uuid"
            },
            "description": "Customer IDs this contact is associated with, limited to customers managed by the partner that requests the data"
          },
          "customer_id": {
            "type": "string",
            "format": "uuid",
            "description": "Customer ID for this row; present when one row per contact_customers (partner list) for editing"
          },
          "created_at": {
            "type": "string",
            "description": "Date and time when the contact was created"
          },
          "updated_at": {
            "type": "string",
            "description": "Date and time when the contact was last updated"
          },
          "updated_by_user_id": {
            "type": "string",
            "format": "uuid",
            "description": "User ID who last updated this contact (for audit logging)"
          },
          "updated_by_organization_id": {
            "type": "string",
            "format": "uuid",
            "description": "Organization ID who last updated this contact (for audit logging)"
          },
          "contact_type": {
            "type": "string",
            "description": "e.g. \"customer\" or \"vendor\"; from contact_customers"
          },
          "title": {
            "type": "string",
            "description": "Contact title from contact_customers"
          },
          "customer_domain": {
            "type": "string",
            "description": "Customer domain from contact_customers"
          },
          "contact_domain": {
            "type": "string",
            "description": "Vendor domain for vendor contacts (from ClickHouse), customer domain for customer contacts (from contact_customers)"
          },
          "company_name": {
            "type": "string",
            "description": "Company name: vendor name for vendor contacts, customer/company name for customer contacts (from ClickHouse customers_dict/vendors_dict)"
          },
          "daily_digest_enabled": {
            "type": "boolean",
            "description": "Whether the contact receives daily digest notifications. Defaults to true if not explicitly set."
          },
          "escalation_enabled": {
            "type": "boolean",
            "description": "Whether the contact receives vendor-escalation notifications. Defaults to true if not explicitly set."
          }
        },
        "required": [
          "id",
          "email",
          "created_by_user_id",
          "created_by_organization_id",
          "customer_ids",
          "created_at"
        ],
        "additionalProperties": false
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    },
    "total": {
      "type": "integer"
    }
  },
  "additionalProperties": true,
  "required": [
    "entries",
    "page",
    "size",
    "total"
  ]
}
```
### 400
Invalid query parameters
### 403
Access denied

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/contacts' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

