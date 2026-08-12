# Update a contact (partner-managed)

- **Method:** `PUT`
- **Path:** `/max/partner/contacts/{contact_id}`
- **Tag:** `V1`
- **operationId:** `putV1ContactsById`

## Description
Update contact email and/or per-customer names. **Email is global**: changing it updates the contact for all customers. **firstName/lastName are per-customer**: they only affect the relationship for the given **customerId** (required when sending name fields). Sending only **email** does not require customerId. Note: reverting an email change affects the contact for every customer.

## Path Parameters
- `id` (**required**) — Contact unique identifier

## Request Body
```json
{
  "type": "object",
  "properties": {
    "customer_id": {
      "type": "string",
      "format": "uuid",
      "description": "Customer ID for which to update the relationship; required when updating firstName or lastName"
    },
    "first_name": {
      "type": "string",
      "description": "Contact first name (for this customer); requires customerId"
    },
    "last_name": {
      "type": "string",
      "description": "Contact last name (for this customer); requires customerId"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Contact email address"
    },
    "contact_type": {
      "type": "string",
      "description": "e.g. \"customer\" or \"vendor\"; stored in contact_customers"
    },
    "vendor_id": {
      "type": "string",
      "format": "uuid",
      "description": "Vendor ID on the contact row; only applied when contactType is \"vendor\". Required when switching to vendor if the contact is not already associated with a vendor."
    },
    "customer_domain": {
      "type": "string",
      "description": "Customer domain from UI (e.g. 01counter.com)"
    },
    "title": {
      "type": "string",
      "description": "Contact title"
    },
    "escalation_enabled": {
      "type": "boolean",
      "description": "Whether the contact receives vendor-escalation notifications. Stored in contact notification preferences."
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "do_not_contact",
        "unreachable"
      ],
      "description": "Contact reachability lifecycle: 'active' | 'do_not_contact' | 'unreachable'."
    }
  },
  "additionalProperties": false
}
```

## Responses
### 200
Contact updated successfully
```json
{
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
```
### 400
Invalid request (e.g. missing vendorId or vendor/email conflict)
### 403
Access denied due to insufficient permissions
### 404
Contact not found

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/partner/contacts/{contact_id}' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

