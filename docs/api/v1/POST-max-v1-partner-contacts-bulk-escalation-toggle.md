# Bulk enable/disable escalation emails for many contacts

- **Method:** `POST`
- **Path:** `/max/v1/partner/contacts/bulk-escalation-toggle`
- **Tag:** `V1`
- **operationId:** `postV1PartnerContactsBulkEscalationToggle`

## Description
Sets `escalation_enabled` to the supplied value for each contact ID. All-or-nothing: if any contact ID does not exist, the request returns 400 with per-row detail and no preferences are written. Idempotent — applying the same value is a no-op write.

## Request Body
```json
{
  "type": "object",
  "properties": {
    "contact_ids": {
      "type": "array",
      "description": "Contact IDs to update (max 1000, must be unique)",
      "items": {
        "type": "string",
        "format": "uuid"
      },
      "minItems": 1,
      "maxItems": 1000,
      "uniqueItems": true
    },
    "escalation_enabled": {
      "type": "boolean",
      "description": "Target value for escalation_enabled on each contact"
    }
  },
  "required": [
    "contact_ids",
    "escalation_enabled"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
Bulk escalation toggle applied successfully
### 400
One or more contact IDs are invalid or do not exist; nothing was written
```json
{
  "type": "object",
  "properties": {
    "errors": {
      "type": "array",
      "description": "Per-row failure detail. Request is rejected when any row fails \u2014 no preferences are mutated.",
      "items": {
        "type": "object",
        "properties": {
          "contact_id": {
            "type": "string",
            "format": "uuid",
            "description": "Contact ID that failed validation"
          },
          "reason": {
            "type": "string",
            "description": "Why this contact could not be updated"
          }
        },
        "required": [
          "contact_id",
          "reason"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "errors"
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
curl -X POST \
  'https://api.securityscorecard.io//max/v1/partner/contacts/bulk-escalation-toggle' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

