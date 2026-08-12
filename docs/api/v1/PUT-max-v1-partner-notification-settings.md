# Update partner notification settings

- **Method:** `PUT`
- **Path:** `/max/v1/partner/notification-settings`
- **Tag:** `V1`
- **operationId:** `putV1PartnerNotificationSettings`

## Description
Create or update notification settings for the current partner

## Request Body
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
      "description": "On-behalf-of sending From address (e.g. product@partner.com). Must be on your organization\u2019s own domain (or a subdomain of it). Once the domain is onboarded and the cutover routes you to Mailgun, your mail sends as this address; an empty string clears it (offboards, reverting to the default sender); omitting it leaves the current value untouched."
    }
  },
  "additionalProperties": false
}
```

## Responses
### 204
Partner notification settings updated successfully
### 401
Unauthorized
### 403
Forbidden - insufficient permissions

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/v1/partner/notification-settings' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

