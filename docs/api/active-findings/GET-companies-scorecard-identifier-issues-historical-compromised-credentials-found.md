# Get "historical_compromised_credentials_found" iss

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/issues/historical_compromised_credentials_found`
- **Tag:** `active findings`
- **operationId:** `get_companies-scorecard-identifier-issues-historical-compromised-credentials-found`

## Description
Get "historical_compromised_credentials_found" issues in a scorecard

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
A page in a list of HistoricalCompromisedCredentialsFounds
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
          "password": {
            "type": "string",
            "description": ""
          },
          "infection_date": {
            "type": "string",
            "description": ""
          },
          "domain": {
            "type": "string",
            "description": ""
          },
          "user_name": {
            "type": "string",
            "description": ""
          },
          "reason": {
            "type": "string",
            "description": ""
          },
          "url": {
            "type": "string",
            "description": ""
          },
          "ip": {
            "type": "string",
            "description": ""
          },
          "stealer_name": {
            "type": "string",
            "description": ""
          },
          "country": {
            "type": "string",
            "description": ""
          },
          "zip_code": {
            "type": "string",
            "description": ""
          },
          "location": {
            "type": "string",
            "description": ""
          },
          "current_language": {
            "type": "string",
            "description": ""
          },
          "os": {
            "type": "string",
            "description": ""
          },
          "filename": {
            "type": "string",
            "description": ""
          }
        },
        "additionalProperties": true,
        "description": "\"historical_compromised_credentials_found\" issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of HistoricalCompromisedCredentialsFounds"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/issues/historical_compromised_credentials_found' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

