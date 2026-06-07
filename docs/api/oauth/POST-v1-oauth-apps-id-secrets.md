# Add a new client secret for an OAuth application

- **Method:** `POST`
- **Path:** `/v1/oauth/apps/{id}/secrets`
- **Tag:** `OAuth`
- **operationId:** `post_v1-oauth-apps-id-secrets`

## Description
Add a new client secret for an OAuth application

## Path Parameters
- `id` (**required**) — ID of the OAuth app to add secret to

## Request Body
```json
{
  "type": "object",
  "properties": {
    "comment": {
      "type": "string",
      "description": "Optional comment about the secret"
    },
    "expiration_date": {
      "type": "string",
      "description": "Expiration date for the secret"
    }
  },
  "additionalProperties": false,
  "description": "Request to add a new client secret"
}
```

## Responses
### 201
OAuth application client secret with secret value (only returned on creation)
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "description": "Unique identifier for the secret"
    },
    "client_secret": {
      "type": "string",
      "description": "The client secret value (only returned on creation)"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
      "description": "Creation timestamp"
    },
    "comment": {
      "type": "string",
      "description": "Optional comment about the secret"
    },
    "expiration_date": {
      "type": "string",
      "description": "Optional expiration date for the secret"
    },
    "created_by": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "description": "ID of the user who created the secret"
    },
    "updated_by": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "description": "ID of the user who updated the secret"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
      "description": "Last update timestamp"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "client_secret",
    "created_at",
    "created_by",
    "updated_by",
    "updated_at"
  ],
  "description": "OAuth application client secret with secret value (only returned on creation)"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//v1/oauth/apps/<id>/secrets' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

