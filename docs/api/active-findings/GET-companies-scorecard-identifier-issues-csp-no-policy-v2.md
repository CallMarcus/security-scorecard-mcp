# Get "csp_no_policy_v2" issues in a scorecard

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/issues/csp_no_policy_v2`
- **Tag:** `active findings`
- **operationId:** `get_companies-scorecard-identifier-issues-csp-no-policy-v2`

## Description
Get "csp_no_policy_v2" issues in a scorecard

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
A page in a list of CspNoPolicyV2s
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
          "analysis": {
            "type": "string",
            "description": ""
          },
          "domain": {
            "type": "string",
            "description": ""
          },
          "scheme": {
            "type": "string",
            "description": ""
          },
          "initial_url": {
            "type": "string"
          },
          "final_url": {
            "type": "string"
          },
          "evidence": {
            "type": "string"
          },
          "reason": {
            "type": "string",
            "description": ""
          },
          "observations": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "last_seen_at": {
                  "type": "string",
                  "format": "date-time",
                  "pattern": "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}\\.{0,1}[0-9]*Z$"
                },
                "evidence": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "initial_url": {
                  "type": "string"
                },
                "final_url": {
                  "type": "string"
                }
              },
              "additionalProperties": false
            },
            "description": ""
          },
          "analysis_description": {
            "type": "string",
            "description": "human-readable description of analysis"
          }
        },
        "additionalProperties": true,
        "description": "\"csp_no_policy_v2\" issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of CspNoPolicyV2s"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/issues/csp_no_policy_v2' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

