# Get "cobalt_strike_c2_detected" issues in a scorec

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/issues/cobalt_strike_c2_detected`
- **Category:** `company-issues`
- **Operation ID:** `get_companies-scorecard-identifier-issues-cobalt-strike-c2-detected`

## Description

Get "cobalt_strike_c2_detected" issues in a scorecard

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
A page in a list of CobaltStrikeC2Detecteds
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
            "description": "Unique UUID for this measurement."
          },
          "parent_domain": {
            "type": "string",
            "description": "Parent domain aka vendor."
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
            "description": "Epoch of observation in nanoseconds."
          },
          "last_seen_time": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}\\.{0,1}[0-9]*Z$",
            "description": "Epoch of observation in nanoseconds."
          },
          "ip": {
            "type": "string",
            "description": ""
          },
          "port": {
            "type": "integer",
            "description": ""
          },
          "country_city": {
            "type": "string",
            "description": ""
          },
          "protocol": {
            "type": "string",
            "description": ""
          },
          "app_proto": {
            "type": "string",
            "description": ""
          },
          "affected_product": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": ""
          },
          "attack_target": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": ""
          },
          "extra": {
            "type": "string",
            "description": ""
          },
          "reason": {
            "type": "string",
            "description": ""
          }
        },
        "additionalProperties": true,
        "description": "\"cobalt_strike_c2_detected\" issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of CobaltStrikeC2Detecteds"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/issues/cobalt_strike_c2_detected' \
  -H 'Authorization: Bearer <your-api-token>'
```
