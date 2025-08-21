# Get "synth_high_risk_appsec_vulnerabilities" histo

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/history/events/{effective_date}/issues/synth_high_risk_appsec_vulnerabilities/`
- **Tag:** `historical findings`
- **operationId:** `get_companies-scorecard-identifier-history-events-effective-date-issues-synth-high-risk-appsec-vulnerabilities`

## Description
Get "synth_high_risk_appsec_vulnerabilities" historical issues in a scorecard

## Path Parameters
- `scorecard_identifier` (**required**) — find entries where 'scorecard_identifier' equals a string
- `effective_date` (**required**) — find entries where "effective_date" equals a date

## Query Parameters
- `issue_id` (optional, string) — find entries where "issue_id" equals a uuid
- `measurement_id_in` (optional, string) — find entries where "measurement_id" is in a set of uuids (comma-separated)
- `effective_date_from` (optional, string) — find entries where "effective_date" is greater or equal than a date
- `effective_date_to` (optional, string) — find entries where "effective_date" is lower or equal than a date
- `effective_date_in` (optional, string) — find entries where "effective_date" is in a set of dates (comma-separated)
- `group_status` (optional, string) — find entries where "group_status" equals a string

## Responses
### 200
A page in a list of HistoricalSynthHighRiskAppsecVulnerabilities
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
          "domain_one": {
            "type": "string",
            "description": ""
          },
          "domain_two": {
            "type": "string",
            "description": ""
          },
          "domain_three": {
            "type": "string",
            "description": ""
          },
          "domain_four": {
            "type": "string",
            "description": ""
          },
          "domain_five": {
            "type": "string",
            "description": ""
          },
          "reason": {
            "type": "string",
            "description": ""
          },
          "effective_date": {
            "type": "string",
            "format": "date",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
            "description": ""
          },
          "group_status": {
            "type": "string",
            "description": ""
          }
        },
        "additionalProperties": false,
        "description": "\"synth_high_risk_appsec_vulnerabilities\" historical issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of HistoricalSynthHighRiskAppsecVulnerabilities"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/history/events/<effective_date>/issues/synth_high_risk_appsec_vulnerabilities/' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

