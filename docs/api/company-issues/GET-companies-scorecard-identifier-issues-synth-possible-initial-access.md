# Get "synth_possible_initial_access" issues in a sc

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/issues/synth_possible_initial_access`
- **Category:** `company-issues`
- **Operation ID:** `get_companies-scorecard-identifier-issues-synth-possible-initial-access`

## Description

Get "synth_possible_initial_access" issues in a scorecard

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
A page in a list of SynthPossibleInitialAccesses
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
          "ip_one": {
            "type": "string",
            "description": ""
          },
          "port_one": {
            "type": "integer",
            "description": ""
          },
          "service_one": {
            "type": "string",
            "description": ""
          },
          "ip_two": {
            "type": "string",
            "description": ""
          },
          "port_two": {
            "type": "integer",
            "description": ""
          },
          "service_two": {
            "type": "string",
            "description": ""
          },
          "ip_three": {
            "type": "string",
            "description": ""
          },
          "port_three": {
            "type": "integer",
            "description": ""
          },
          "service_three": {
            "type": "string",
            "description": ""
          },
          "ip_four": {
            "type": "string",
            "description": ""
          },
          "port_four": {
            "type": "integer",
            "description": ""
          },
          "service_four": {
            "type": "string",
            "description": ""
          },
          "ip_five": {
            "type": "string",
            "description": ""
          },
          "port_five": {
            "type": "integer",
            "description": ""
          },
          "service_five": {
            "type": "string",
            "description": ""
          },
          "reason": {
            "type": "string",
            "description": ""
          }
        },
        "additionalProperties": true,
        "description": "\"synth_possible_initial_access\" issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of SynthPossibleInitialAccesses"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/issues/synth_possible_initial_access' \
  -H 'Authorization: Bearer <your-api-token>'
```
