# Get partner notification settings

- **Method:** `GET`
- **Path:** `/max/v1/partner/notification-settings`
- **Tag:** `V1`
- **operationId:** `getV1PartnerNotificationSettings`

## Description
Retrieve notification settings for the current partner

## Responses
### 200
Partner notification settings
```json
{
  "type": "object",
  "properties": {
    "reply_to_email": {
      "type": "string",
      "format": "email",
      "description": "Reply-to email address for partner notifications"
    },
    "sender_name": {
      "type": "string",
      "description": "Sender name for partner notifications"
    },
    "sending_from_email": {
      "type": "string",
      "format": "email",
      "description": "On-behalf-of sending From address. When set, mail sends as this address via Mailgun (once the domain is verified); otherwise the SecurityScorecard default sender is used."
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Last update timestamp"
    }
  },
  "required": [
    "reply_to_email"
  ],
  "additionalProperties": false
}
```
### 401
Unauthorized
### 403
Forbidden - insufficient permissions
### 404
Partner notification settings not found

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/notification-settings' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

