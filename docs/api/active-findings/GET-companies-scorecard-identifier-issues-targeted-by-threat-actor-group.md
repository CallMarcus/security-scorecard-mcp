# Get "targeted_by_threat_actor_group" issues in a s

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/issues/targeted_by_threat_actor_group`
- **Tag:** `active findings`
- **operationId:** `get_companies-scorecard-identifier-issues-targeted-by-threat-actor-group`

## Description
Get "targeted_by_threat_actor_group" issues in a scorecard

## Path Parameters
- `scorecard_identifier` (**required**) — scorecard identifier

## Query Parameters
- `issue_id` (optional, string) — find entries where "issue_id" equals a uuid
- `issue_id_in` (optional, string) — find entries where "issue_id" is in a set of uuids (comma-separated)
- `first_seen_time_from` (optional, string) — find entries where "first_seen_time" is greater or equal than a date-time
- `first_seen_time_to` (optional, string) — find entries where "first_seen_time" is lower or equal than a date-time
- `last_seen_time_from` (optional, string) — find entries where "last_seen_time" is greater or equal than a date-time
- `last_seen_time_to` (optional, string) — find entries where "last_seen_time" is lower or equal than a date-time

## Responses
### 200
A page in a list of TargetedByThreatActorGroups
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
          "date": {
            "type": "string",
            "description": ""
          },
          "domain": {
            "type": "string",
            "description": ""
          },
          "data_entries": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": ""
          },
          "language": {
            "type": "string",
            "description": ""
          },
          "messages": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": ""
          },
          "leak_source": {
            "type": "string",
            "description": ""
          },
          "reason": {
            "type": "string",
            "description": ""
          }
        },
        "additionalProperties": true,
        "description": "\"targeted_by_threat_actor_group\" issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of TargetedByThreatActorGroups"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/issues/targeted_by_threat_actor_group' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

