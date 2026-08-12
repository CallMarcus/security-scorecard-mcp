# List contacts for a customer

- **Method:** `GET`
- **Path:** `/max/partner/customers/{customer_id}/contacts`
- **Tag:** `V1`
- **operationId:** `getV1CustomersByCustomeridContacts`

## Path Parameters
- `customer_id` (**required**) — Customer ID

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `vendor_id` (optional, string) — Optional vendor ID filter. Omit for all; pass a UUID for that vendor; pass the literal string "null" for customer-only contacts.
- `search` (optional, string) — Search text to filter contacts by email, first name, or last name (case-insensitive substring match).
- `sort` (optional, string) — Sort order as a JSON string representing an array of objects with "id" (field name: email, first_name, last_name, created_at) and "desc" (boolean).
- `email` (optional, string) — Email filter; accepts a single value or comma-separated list (case-insensitive substring match; multiple values are ORed).
- `first_name` (optional, string) — First name filter; accepts a single value or comma-separated list (case-insensitive substring match; multiple values are ORed).
- `last_name` (optional, string) — Last name filter; accepts a single value or comma-separated list (case-insensitive substring match; multiple values are ORed).

## Responses
### 200
List of contacts
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
          },
          "status": {
            "type": "string",
            "enum": [
              "active",
              "do_not_contact",
              "unreachable"
            ],
            "description": "Contact reachability lifecycle: 'active' | 'do_not_contact' | 'unreachable'. Distinct from the per-customer escalation send-gate."
          },
          "escalation_status": {
            "type": "string",
            "enum": [
              "active",
              "removed"
            ],
            "description": "Per-customer escalation send-gate from contact_customers (scoped to the customer in the read): 'active' | 'removed'. A contact hard-bounced/removed for one customer can stay 'active' for another \u2014 distinct from the person-level `status` above."
          },
          "removal_reason": {
            "type": "string",
            "enum": [
              "hard_bounce",
              "vendor_requested",
              "manual",
              "do_not_contact"
            ],
            "description": "Why the contact was removed for this customer, when escalationStatus is 'removed': 'hard_bounce' (escalation email hard-bounced) | 'vendor_requested' | 'manual' | 'do_not_contact' (a curated import marked them do-not-contact for this customer). Null/absent while active."
          },
          "discovered_from": {
            "type": "string",
            "enum": [
              "manual",
              "mailbox",
              "ssc_api",
              "zoominfo",
              "zoominfo_search"
            ],
            "description": "How the contact person was first discovered: 'manual' | 'mailbox' | 'ssc_api' | 'zoominfo' | 'zoominfo_search'."
          },
          "zoominfo_person_id": {
            "type": "string",
            "description": "ZoomInfo person id when the contact was resolved via ZoomInfo"
          },
          "contact_accuracy_score": {
            "type": "integer",
            "description": "ZoomInfo contact accuracy score (0-100)"
          },
          "employment_status": {
            "type": "string",
            "description": "Employment status reported by ZoomInfo research"
          },
          "last_researched_at": {
            "type": "string",
            "description": "When ZoomInfo research last ran for this contact"
          },
          "enriched_at": {
            "type": "string",
            "description": "When enrichment data was last written for this contact"
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
Access denied due to insufficient permissions

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/partner/customers/<customer_id>/contacts' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

