# creates a dashboard

- **Method:** `POST`
- **Path:** `/v1/custom-dashboards`
- **Tag:** `CustomDashboard`
- **operationId:** `post_v1-custom-dashboards`

## Description
creates a dashboard

## Request Body
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "default": "Untitled Report",
      "description": "Name of dashboard"
    },
    "description": {
      "type": "string",
      "description": "Description of dashboard"
    },
    "dashboard": {
      "type": "object",
      "properties": {},
      "additionalProperties": true,
      "description": "Contains dashboard content"
    },
    "dashboard_type": {
      "type": "string",
      "default": "custom_dashboard",
      "description": "create a specific dashboard type, can be either \"smb_dashboard\" or \"custom_dashboard\" which is used as default if nothing is passed"
    },
    "is_managed": {
      "type": "boolean"
    },
    "max_request_id": {
      "type": "string"
    },
    "privacy": {
      "type": "string",
      "default": "private"
    },
    "owner_team_id": {
      "type": "string"
    }
  },
  "additionalProperties": true,
  "required": [
    "dashboard"
  ],
  "description": "Represents a custom dashboard for user"
}
```

## Responses
### 200
Represents a custom dashboard for user
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "description": "Name of dashboard"
    },
    "description": {
      "type": "string",
      "description": "Description of dashboard"
    },
    "dashboard": {
      "type": "object",
      "properties": {},
      "additionalProperties": true,
      "description": "Contains dashboard content"
    },
    "created_by": {
      "type": "string"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$"
    },
    "updated_by": {
      "type": "string"
    },
    "dashboard_type": {
      "type": "string",
      "description": "a dashboard type, can be either \"smb_dashboard\" or \"custom_dashboard\""
    },
    "is_published": {
      "type": "boolean"
    },
    "is_managed": {
      "type": "boolean"
    },
    "published_at": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$"
    },
    "published_by": {
      "type": "string"
    },
    "privacy": {
      "type": "string"
    },
    "owner_organization_id": {
      "type": "string"
    },
    "owner_team_id": {
      "type": "string"
    },
    "owner_user_id": {
      "type": "string"
    },
    "scorecard": {
      "type": "string"
    },
    "managed_scorecard": {
      "type": "string"
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "collection of user base access levels"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "dashboard",
    "created_by",
    "created_at",
    "updated_at",
    "updated_by",
    "dashboard_type"
  ],
  "description": "Represents a custom dashboard for user"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//v1/custom-dashboards' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

