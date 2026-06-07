# Create a new OAuth application

- **Method:** `POST`
- **Path:** `/v1/oauth/apps`
- **Tag:** `OAuth`
- **operationId:** `post_v1-oauth-apps`

## Description
Create a new OAuth application

## Request Body
```json
{
  "type": "object",
  "properties": {
    "application_name": {
      "type": "string",
      "x-example": "My Integration App",
      "description": "Name of the OAuth application"
    },
    "description": {
      "type": "string",
      "description": "Description of the OAuth application"
    },
    "bot_user_roles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Roles to assign to the bot user"
    },
    "owners_user_ids": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid",
        "pattern": "^[\\da-z-]{16,}$"
      },
      "description": "User IDs of owners who can manage this OAuth app"
    }
  },
  "additionalProperties": false,
  "required": [
    "application_name"
  ],
  "description": "Request to create a new OAuth application"
}
```

## Responses
### 201
OAuth application configuration with initial client secret (only returned on creation)
```json
{
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
    "client_secret": {
      "type": "string",
      "description": "Initial client secret (only returned on creation)"
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
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "application_name",
    "client_id",
    "client_secret",
    "bot_user_id",
    "organization_id",
    "created_at",
    "updated_at",
    "is_active",
    "created_by",
    "owners_user_ids"
  ],
  "description": "OAuth application configuration with initial client secret (only returned on creation)"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//v1/oauth/apps' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

