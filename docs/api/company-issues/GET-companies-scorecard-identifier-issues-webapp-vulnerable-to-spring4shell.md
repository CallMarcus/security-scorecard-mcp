# Get "webapp_vulnerable_to_spring4shell" issues in 

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/issues/webapp_vulnerable_to_spring4shell`
- **Category:** `company-issues`
- **Operation ID:** `get_companies-scorecard-identifier-issues-webapp-vulnerable-to-spring4shell`

## Description

Get "webapp_vulnerable_to_spring4shell" issues in a scorecard

## Path Parameters

- `scorecard_identifier` (**Required**) - scorecard identifier

## Query Parameters

- `issue_id` (string, Optional) - find entries where "issue_id" equals a uuid
- `issue_id_in` (string, Optional) - find entries where "issue_id" is in a set of uuids (comma-separated)
- `first_seen_time_from` (string, Optional) - find entries where "first_seen_time" is greater or equal than a date-time
- `first_seen_time_to` (string, Optional) - find entries where "first_seen_time" is lower or equal than a date-time
- `last_seen_time_from` (string, Optional) - find entries where "last_seen_time" is greater or equal than a date-time
- `last_seen_time_to` (string, Optional) - find entries where "last_seen_time" is lower or equal than a date-time

## Responses

### 200
A page in a list of WebappVulnerableToSpring4Shells
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "issue_id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[a-z0-9-]{16,}$",
            "description": ""
          },
          "parent_domain": {
            "type": "string",
            "description": ""
          },
          "feedback": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "created_at": {
                  "type": "string",
                  "format": "date-time",
                  "pattern": "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}\\.{0,1}[0-9]*Z$"
                },
                "classifier": {
                  "type": "string"
                },
                "claim": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "feedback_type": {
                  "type": "string"
                },
                "feedback_status": {
                  "type": "string"
                },
                "request_id": {
                  "type": "string"
                },
                "user_id": {
                  "type": "string"
                },
                "last_update": {
                  "type": "number"
                },
                "classifier_type": {
                  "type": "string"
                }
              },
              "additionalProperties": false
            },
            "description": ""
          },
          "count": {
            "type": "number",
            "description": ""
          },
          "first_seen_time": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}\\.{0,1}[0-9]*Z$",
            "description": ""
          },
          "last_seen_time": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}\\.{0,1}[0-9]*Z$",
            "description": ""
          },
          "service_name": {
            "type": "string",
            "description": ""
          },
          "cve_id": {
            "type": "string",
            "description": ""
          },
          "reference": {
            "type": "string",
            "description": ""
          },
          "ip": {
            "type": "string",
            "description": ""
          },
          "port": {
            "type": "integer",
            "description": ""
          },
          "evidence": {
            "type": "string",
            "description": ""
          },
          "reason": {
            "type": "string",
            "description": ""
          }
        },
        "additionalProperties": true,
        "description": "\"webapp_vulnerable_to_spring4shell\" issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of WebappVulnerableToSpring4Shells"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/issues/webapp_vulnerable_to_spring4shell' \
  -H 'Authorization: Bearer <your-api-token>'
```
