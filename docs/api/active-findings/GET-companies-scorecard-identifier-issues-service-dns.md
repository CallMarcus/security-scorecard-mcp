# Get "service_dns" issues in a scorecard

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/issues/service_dns`
- **Tag:** `active findings`
- **operationId:** `get_companies-scorecard-identifier-issues-service-dns`

## Description
Get "service_dns" issues in a scorecard

## Path Parameters
- `scorecard_identifier` (**required**) — scorecard identifier

## Query Parameters
- `issue_id` (optional, string) — find entries where "issue_id" equals a uuid
- `issue_id_in` (optional, string) — find entries where "issue_id" is in a set of uuids (comma-separated)
- `first_seen_time_from` (optional, string) — find entries where "first_seen_time" is greater or equal than a date-time
- `first_seen_time_to` (optional, string) — find entries where "first_seen_time" is lower or equal than a date-time
- `last_seen_time_from` (optional, string) — find entries where "last_seen_time" is greater or equal than a date-time
- `last_seen_time_to` (optional, string) — find entries where "last_seen_time" is lower or equal than a date-time
- `ip_range` (optional, string) — 

## Responses
### 200
A page in a list of ServiceDns
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
          "product_name": {
            "type": "string",
            "description": ""
          },
          "product_version": {
            "type": "string",
            "description": ""
          },
          "banner": {
            "type": "string",
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
          "evidence1": {
            "type": "string",
            "description": ""
          },
          "evidence2": {
            "type": "string",
            "description": ""
          }
        },
        "additionalProperties": true,
        "description": "\"service_dns\" issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of ServiceDns"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/issues/service_dns' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

