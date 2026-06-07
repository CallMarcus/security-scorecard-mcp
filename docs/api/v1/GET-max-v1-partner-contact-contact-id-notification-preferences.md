# Get contact notification preferences

- **Method:** `GET`
- **Path:** `/max/v1/partner/contact/{contact_id}/notification-preferences`
- **Tag:** `V1`
- **operationId:** `getV1PartnerContactByContactidNotificationPreferences`

## Description
Retrieve notification preferences for a contact. Returns defaults if not configured.

## Path Parameters
- `contact_id` (**required**) — Contact ID

## Responses
### 200
Contact notification preferences
```json
{
  "type": "object",
  "properties": {
    "daily_digest_enabled": {
      "type": "boolean",
      "description": "Whether daily digest emails are enabled for this contact"
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
      "description": "Whether vendor-escalation emails are enabled for this contact"
    }
  },
  "required": [
    "daily_digest_enabled",
    "escalation_enabled"
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
  'https://api.securityscorecard.io//max/v1/partner/contact/<contact_id>/notification-preferences' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

