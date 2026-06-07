# List all client secrets for an OAuth application

- **Method:** `GET`
- **Path:** `/v1/oauth/apps/{id}/secrets`
- **Tag:** `OAuth`
- **operationId:** `get_v1-oauth-apps-id-secrets`

## Description
List all client secrets for an OAuth application

## Path Parameters
- `id` (**required**) — ID of the OAuth app to list secrets for

## Responses
### 200
List of OAuthAppSecrets
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
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of OAuthAppSecrets"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/oauth/apps/<id>/secrets' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

