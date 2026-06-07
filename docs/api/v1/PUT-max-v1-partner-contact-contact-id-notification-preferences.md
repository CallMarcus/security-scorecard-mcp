# Update contact notification preferences

- **Method:** `PUT`
- **Path:** `/max/v1/partner/contact/{contact_id}/notification-preferences`
- **Tag:** `V1`
- **operationId:** `putV1PartnerContactByContactidNotificationPreferences`

## Description
Create or update notification preferences for a contact. Supports partial updates.

## Path Parameters
- `contact_id` (**required**) — Contact ID

## Request Body
```json
{
  "type": "object",
  "properties": {
    "daily_digest_enabled": {
      "type": "boolean",
      "description": "Enable/disable daily digest emails"
    },
    "daily_digest_settings": {
      "type": "object",
      "description": "Section visibility preferences",
      "properties": {
        "all_findings": {
          "type": "boolean",
          "description": "If true, include all findings (not just triaged). Defaults to false."
        }
      },
      "additionalProperties": true
    },
    "escalation_enabled": {
      "type": "boolean",
      "description": "Enable/disable vendor-escalation emails"
    }
  },
  "additionalProperties": false
}
```

## Responses
### 204
Contact notification preferences updated successfully
### 401
Unauthorized
### 403
Forbidden - insufficient permissions

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/v1/partner/contact/<contact_id>/notification-preferences' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

