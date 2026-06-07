# Bulk add/remove default CC emails for a customer

- **Method:** `POST`
- **Path:** `/max/v1/partner/customers/{customerId}/default-cc/bulk`
- **Tag:** `V1`
- **operationId:** `postV1PartnerCustomersByCustomeridDefaultCcBulk`

## Description
Atomically applies the provided add and remove arrays in a single transaction. Emails are trimmed, lowercased, and deduplicated within each array before being applied. Returns the rows actually inserted and the count of rows removed.

## Path Parameters
- `customer_id` (**required**) — Customer ID

## Request Body
```json
{
  "type": "object",
  "properties": {
    "add": {
      "type": "array",
      "description": "Emails to add. Each is trimmed, lowercased, and validated server-side.",
      "items": {
        "type": "string"
      }
    },
    "remove": {
      "type": "array",
      "description": "Emails to remove. Each is trimmed, lowercased, and validated server-side.",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false
}
```

## Responses
### 200
Bulk update result
```json
{
  "type": "object",
  "properties": {
    "added": {
      "type": "array",
      "description": "Rows actually inserted (excludes rows that already existed)",
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
    "removed_count": {
      "type": "integer",
      "description": "Number of rows removed"
    }
  },
  "required": [
    "added",
    "removed_count"
  ],
  "additionalProperties": false
}
```
### 400
Invalid email address in add or remove
### 401
Unauthorized
### 403
Forbidden - insufficient permissions

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//max/v1/partner/customers/{customerId}/default-cc/bulk' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

