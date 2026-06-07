# Update a specific client secret

- **Method:** `PATCH`
- **Path:** `/v1/oauth/apps/{id}/secrets/{secret_id}`
- **Tag:** `OAuth`
- **operationId:** `patch_v1-oauth-apps-id-secrets-secret-id`

## Description
Update a specific client secret

## Path Parameters
- `id` (**required**) — ID of the OAuth app
- `secret_id` (**required**) — ID of the secret to update

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
  "description": "Request to update a client secret"
}
```

## Responses
### 200
OAuth application client secret (without secret value)
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
      "description": "Expiration date for the secret"
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
    "created_at",
    "created_by",
    "updated_by",
    "updated_at"
  ],
  "description": "OAuth application client secret (without secret value)"
}
```

## Example cURL Request
```bash
curl -X PATCH \
  'https://api.securityscorecard.io//v1/oauth/apps/<id>/secrets/<secret_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

