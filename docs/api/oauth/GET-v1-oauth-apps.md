# List all OAuth applications for the organization

- **Method:** `GET`
- **Path:** `/v1/oauth/apps`
- **Tag:** `OAuth`
- **operationId:** `get_v1-oauth-apps`

## Description
List all OAuth applications for the organization

## Responses
### 200
List of OAuthAppGets
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
            "pattern": "^[\\da-z-]{16,}$",
            "description": "Unique identifier for the OAuth app"
          },
          "application_name": {
            "type": "string",
            "x-example": "My Integration App",
            "description": "Name of the OAuth application"
          },
          "description": {
            "type": "string",
            "description": "Description of the OAuth application"
          },
          "client_id": {
            "type": "string",
            "description": "Unique client ID for the OAuth application"
          },
          "bot_user_id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$",
            "description": "ID of the bot user associated with this OAuth app"
          },
          "organization_id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$",
            "description": "ID of the organization that owns this OAuth app"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "Creation timestamp"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "Last update timestamp"
          },
          "is_active": {
            "type": "boolean",
            "description": "Whether the OAuth app is active"
          },
          "created_by": {
            "type": "string",
            "description": "Username of the user who created this OAuth app"
          },
          "owners_user_ids": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uuid",
              "pattern": "^[\\da-z-]{16,}$"
            },
            "description": "User IDs of owners who can manage this OAuth app"
          },
          "bot_user_roles": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Roles to assign to the bot user"
          },
          "has_expiring_or_expired_secrets": {
            "type": "boolean",
            "description": "True if this app has at least one client secret expiring within the default window (15 days) or already expired"
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "application_name",
          "client_id",
          "bot_user_id",
          "organization_id",
          "created_at",
          "updated_at",
          "is_active",
          "created_by",
          "owners_user_ids"
        ],
        "description": "OAuth application configuration (without secrets)"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of OAuthAppGets"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/oauth/apps' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

