# get api audit logs

- **Method:** `GET`
- **Path:** `/audits/api-logs`
- **Tag:** `Audit`
- **operationId:** `get_audits-api-logs`

## Description
get api audit logs

## Query Parameters
- `usernames` (optional, array) — usernames of the audit log
- `activities` (optional, array) — activities of the audit log
- `categories` (optional, array) — activities of the audit log
- `sub_categories` (optional, array) — activities of the audit log
- `start_date` (optional, string) — start creation datetime
- `end_date` (optional, string) — end creation datetime
- `page` (optional, integer) — page number, 0 is the first page
- `page_size` (optional, integer) — page size, the amount of items per page (max: 200)
- `sort` (optional, string) — sort audit log
- `desc` (optional, boolean) — ascending or descending sort
- `is_api_request` (optional, boolean) — Whether the request is an API request
- `search` (optional, string) — search text to look into activity log fields
- `path` (optional, array) — Formatted API path pattern

## Responses
### 200
A page in a list of SearchApiAuditLogs
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
            "description": "Unique log identifier"
          },
          "action_id": {
            "type": "string",
            "description": "Unique action identifier"
          },
          "bulk_action": {
            "type": "boolean",
            "description": "Whether it was a bulk action"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "Timestamp when the action occurred"
          },
          "organization": {
            "type": "string",
            "description": "Organization name"
          },
          "username": {
            "type": "string",
            "x-example": "mail@securityscorecard.io",
            "description": "Username who performed the action"
          },
          "path": {
            "type": "string",
            "description": "API path accessed"
          },
          "path_format": {
            "type": "string",
            "description": "Formatted API path pattern"
          },
          "http_method": {
            "type": "string",
            "description": "HTTP method used"
          },
          "http_status": {
            "type": "integer",
            "description": "Response HTTP status"
          },
          "response_time": {
            "type": "integer",
            "description": "Time taken for the request"
          },
          "request_timestamp": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "Timestamp of the request"
          },
          "is_api_request": {
            "type": "boolean",
            "description": "Whether the request is an API request"
          },
          "scorecard_identifier": {
            "type": "string",
            "description": "Scorecard Identifier"
          },
          "portfolio_id": {
            "type": "string",
            "description": "Portfolio ID"
          },
          "client_app_name": {
            "type": "string",
            "description": "Name of the client app"
          },
          "client_app_version": {
            "type": "string",
            "description": "Version of the client app"
          },
          "user_agent": {
            "type": "string",
            "description": "User agent string from the request"
          },
          "team": {
            "type": "string",
            "description": "Team name"
          },
          "service": {
            "type": "string",
            "description": "Service name"
          },
          "ip": {
            "type": "string",
            "description": "IP address of the request"
          },
          "params": {
            "type": "string",
            "description": "Request parameters"
          },
          "body": {
            "type": "string",
            "description": "Request body"
          },
          "user": {
            "type": "object",
            "properties": {
              "first_name": {
                "type": "string",
                "description": "First name of the user"
              },
              "last_name": {
                "type": "string",
                "description": "Last name of the user"
              },
              "email": {
                "type": "string",
                "description": "Email address of the user"
              }
            },
            "additionalProperties": false,
            "required": [
              "first_name",
              "last_name",
              "email"
            ],
            "description": "User details"
          },
          "country": {
            "type": "string",
            "description": "Country"
          },
          "country_code": {
            "type": "string",
            "description": "Country code"
          },
          "action": {
            "type": "string",
            "description": "Action type (e.g. VIEW)"
          },
          "sub_action": {
            "type": "string",
            "description": "Sub action if any"
          },
          "category": {
            "type": "string",
            "description": "Category of the action (e.g. SCORECARD)"
          },
          "sub_category": {
            "type": "string",
            "description": "Sub category of the action if any"
          },
          "primary_entity": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "ID of the primary entity"
              },
              "value": {
                "type": "string",
                "description": "Value of the primary entity"
              },
              "type": {
                "type": "string",
                "description": "Type of the primary entity"
              }
            },
            "additionalProperties": false,
            "required": [
              "type"
            ],
            "description": "Details of the primary entity related to the action"
          },
          "related_entity": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "ID of the related entity"
              },
              "value": {
                "type": "string",
                "description": "Value of the related entity"
              },
              "type": {
                "type": "string",
                "description": "Type of the related entity"
              }
            },
            "additionalProperties": false,
            "description": "Details of any related entity associated with the action"
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "action_id",
          "bulk_action",
          "timestamp",
          "organization",
          "username",
          "path",
          "path_format",
          "http_method",
          "http_status",
          "response_time",
          "request_timestamp",
          "is_api_request",
          "scorecard_identifier",
          "portfolio_id",
          "client_app_name",
          "client_app_version",
          "user_agent",
          "team",
          "service",
          "ip",
          "params",
          "body",
          "user",
          "country",
          "country_code",
          "action",
          "category",
          "primary_entity"
        ],
        "description": "Audit Log Entry"
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    },
    "total": {
      "type": "number"
    }
  },
  "additionalProperties": false,
  "required": [
    "entries",
    "page",
    "size",
    "total"
  ],
  "description": "A page in a list of SearchApiAuditLogs"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//audits/api-logs' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

