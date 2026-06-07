# Set the list of owners for an OAuth application

- **Method:** `PUT`
- **Path:** `/v1/oauth/apps/{id}/owners`
- **Tag:** `OAuth`
- **operationId:** `put_v1-oauth-apps-id-owners`

## Description
Set the list of owners for an OAuth application

## Path Parameters
- `id` (**required**) — ID of the OAuth app to update owners for

## Request Body
```json
{
  "type": "object",
  "properties": {
    "owners_user_ids": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid",
        "pattern": "^[\\da-z-]{16,}$"
      },
      "description": "User IDs of users who can manage this OAuth app (replaces existing list)"
    }
  },
  "additionalProperties": false,
  "required": [
    "owners_user_ids"
  ],
  "description": "Request to set the list of owners for an OAuth app"
}
```

## Responses
### 200
List of owner user IDs for an OAuth app
```json
{
  "type": "object",
  "properties": {
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
    "owners_user_ids"
  ],
  "description": "List of owner user IDs for an OAuth app"
}
```

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//v1/oauth/apps/<id>/owners' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

