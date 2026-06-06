# get all notifications from latest 7 days

- **Method:** `GET`
- **Path:** `/users/by-username/{username}/notifications/recent`
- **Category:** `authentication-users`
- **Operation ID:** `get_users-by-username-username-notifications-recent`

## Description

get all notifications from latest 7 days

## Path Parameters

- `username` (**Required**) - username the notifications' owner

## Query Parameters

- `portfolio` (string, Optional) - filter notifications by portfolio id
- `sort` (string, Optional) - sort notifications by unread status or date
- `order` (string, Optional) - specify the order of sorting, asc or desc
- `unread` (boolean, Optional) - Wether to filter by read or unread notifications
- `page_size` (number, Optional) - page size

## Responses

### 200
A page in a list of Notifications
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
            "description": "the notification id"
          },
          "username": {
            "type": "string",
            "x-example": "john.smith@example.com",
            "description": "owner of notification"
          },
          "priority": {
            "type": "boolean",
            "description": "the notification priority"
          },
          "is_alert_for_rule_owner": {
            "type": "boolean",
            "description": "flag that indicates if the notification was from a user workflow rule"
          },
          "change_type": {
            "type": "string",
            "x-example": "score_change",
            "description": "the notification change type"
          },
          "alert_settings": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "array of ids of the alert settings that caused the creation of this notification"
          },
          "domain": {
            "type": "string",
            "x-example": "sample-company.com",
            "description": "the domain identifying the company associated to the change/event that happened."
          },
          "last_logged_in": {
            "type": "string",
            "description": "last time contact logged in"
          },
          "company_name": {
            "type": "string",
            "x-example": "Sample Company LLC"
          },
          "portfolios": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "portfolio id"
                },
                "name": {
                  "type": "string",
                  "description": "portfolio name"
                }
              },
              "additionalProperties": false,
              "required": [
                "id",
                "name"
              ],
              "description": "reference to a portfolio"
            }
          },
          "my_scorecard": {
            "type": "boolean",
            "description": "indicates user own scorecard should be monitored"
          },
          "platform_score_date": {
            "type": "string",
            "description": "the date (YYYYMMDD) the event was detected"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "creation datetime"
          },
          "read": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "notification read datetime"
          },
          "processed_on": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "notification processed datetime"
          },
          "processed_by": {
            "type": "object",
            "properties": {
              "first_name": {
                "type": "string"
              },
              "last_name": {
                "type": "string"
              },
              "email": {
                "type": "string"
              }
            },
            "additionalProperties": false,
            "description": "when a notification has an additional action, processedBy\n      stores the data of the user who completed the notification action"
          },
          "change_data": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "direction": {
                  "type": "string"
                },
                "score": {
                  "type": "number",
                  "x-example": 82,
                  "description": "the company score"
                },
                "grade_letter": {
                  "type": "string",
                  "x-example": "B",
                  "description": "the grade letter associated to the score"
                },
                "factor": {
                  "type": "string",
                  "x-example": "application_security"
                },
                "score_impact": {
                  "type": "number",
                  "x-example": -3
                }
              },
              "additionalProperties": true
            }
          },
          "category": {
            "type": "string",
            "description": "notification category: standard, prioritized, queued, or customer_contacts"
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "username",
          "change_type",
          "domain",
          "company_name",
          "created_at",
          "change_data"
        ],
        "description": "a notification within platform"
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    }
  },
  "additionalProperties": false,
  "required": [
    "entries",
    "page",
    "size"
  ],
  "description": "A page in a list of Notifications"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/users/by-username/<username>/notifications/recent' \
  -H 'Authorization: Bearer <your-api-token>'
```
