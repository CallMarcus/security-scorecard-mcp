# create a new invitation for a new user/vendor

- **Method:** `POST`
- **Path:** `/invitations`
- **Tag:** `Invitation`
- **operationId:** `post_invitations`

## Description
create a new invitation for a new user/vendor

## Request Body
```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "pattern": "^.+@.+$",
      "x-example": "john.smith@example.com"
    },
    "first_name": {
      "type": "string",
      "x-example": "John"
    },
    "last_name": {
      "type": "string",
      "x-example": "Smith"
    },
    "target_url": {
      "type": "string",
      "x-example": "#/scorecard/example.com",
      "description": "optional url to take the invitee to when arriving to the platform.\nif specified, must be an internal route and only some routes are allowed for\nsecurity reasons (please validate this in advance, or value could be ignored)"
    },
    "message": {
      "type": "string",
      "description": "extra messaging for the invitee"
    },
    "branding_url": {
      "type": "string",
      "description": "branding logo url"
    },
    "domain": {
      "type": "string",
      "description": "the invited company domain"
    },
    "grade_to_maintain": {
      "type": "string",
      "description": "minimum grade that an inviter requests an organization to maintain"
    },
    "days_to_resolve_issue": {
      "type": "integer",
      "description": "minimum days to resolve a scorecard issue"
    },
    "sendme_copy": {
      "type": "boolean",
      "description": "whether we should send a copy to the requesting user"
    },
    "notify_inviter": {
      "type": "boolean",
      "default": true,
      "description": "whether we should notify to invert user"
    },
    "skip_notifications": {
      "type": "boolean",
      "description": "whether we should send skip the notification"
    },
    "cc_requester": {
      "type": "boolean",
      "description": "CC the inviter on the email"
    },
    "sender_email": {
      "type": "string",
      "description": "Email of the user requesting the invite"
    },
    "sender_domain": {
      "type": "string",
      "description": "Domain of the user requesting the invite"
    }
  },
  "additionalProperties": false,
  "required": [
    "email",
    "first_name",
    "last_name",
    "message"
  ],
  "description": "user invitation data"
}
```

## Responses
### 201
No response body

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//invitations' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

