# Get "service_vuln_host_low" historical issues in a

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/history/events/{effective_date}/issues/service_vuln_host_low/`
- **Category:** `company-issues`
- **Operation ID:** `get_companies-scorecard-identifier-history-events-effective-date-issues-service-vuln-host-low`

## Description

Get "service_vuln_host_low" historical issues in a scorecard

## Path Parameters

- `scorecard_identifier` (**Required**) - find entries where 'scorecard_identifier' equals a string
- `effective_date` (**Required**) - find entries where "effective_date" equals a date

## Query Parameters

- `issue_id` (string, Optional) - find entries where "issue_id" equals a uuid
- `measurement_id_in` (string, Optional) - find entries where "measurement_id" is in a set of uuids (comma-separated)
- `effective_date_from` (string, Optional) - find entries where "effective_date" is greater or equal than a date
- `effective_date_to` (string, Optional) - find entries where "effective_date" is lower or equal than a date
- `effective_date_in` (string, Optional) - find entries where "effective_date" is in a set of dates (comma-separated)
- `group_status` (string, Optional) - find entries where "group_status" equals a string

## Responses

### 200
A page in a list of HistoricalServiceVulnHostLows
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
          "vulnerability_id": {
            "type": "string",
            "description": ""
          },
          "vulnerability_url": {
            "type": "string",
            "description": ""
          },
          "vulnerability_description": {
            "type": "string",
            "description": ""
          },
          "vulnerability_publish_date": {
            "type": "string",
            "format": "date",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
            "description": ""
          },
          "connection_attributes": {
            "type": "object",
            "properties": {
              "protocol": {
                "type": "string"
              },
              "src_ip": {
                "type": "string"
              },
              "src_port": {
                "type": "integer"
              },
              "src_host": {
                "type": "string"
              },
              "dst_ip": {
                "type": "string"
              },
              "dst_port": {
                "type": "integer"
              },
              "dst_host": {
                "type": "string"
              }
            },
            "additionalProperties": false,
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
        "description": "\"service_vuln_host_low\" historical issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of HistoricalServiceVulnHostLows"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/history/events/<effective_date>/issues/service_vuln_host_low/' \
  -H 'Authorization: Bearer <your-api-token>'
```
