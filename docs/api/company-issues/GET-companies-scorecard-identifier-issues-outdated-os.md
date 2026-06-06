# Get "outdated_os" issues in a scorecard

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/issues/outdated_os`
- **Category:** `company-issues`
- **Operation ID:** `get_companies-scorecard-identifier-issues-outdated-os`

## Description

Get "outdated_os" issues in a scorecard

## Path Parameters

- `scorecard_identifier` (**Required**) - scorecard identifier

## Query Parameters

- `issue_id` (string, Optional) - find entries where "issue_id" equals a uuid
- `issue_id_in` (string, Optional) - find entries where "issue_id" is in a set of uuids (comma-separated)
- `first_seen_time_from` (string, Optional) - find entries where "first_seen_time" is greater or equal than a date-time
- `first_seen_time_to` (string, Optional) - find entries where "first_seen_time" is lower or equal than a date-time
- `last_seen_time_from` (string, Optional) - find entries where "last_seen_time" is greater or equal than a date-time
- `last_seen_time_to` (string, Optional) - find entries where "last_seen_time" is lower or equal than a date-time
- `ip_range` (string, Optional) - No description

## Responses

### 200
A page in a list of OutdatedOs
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
          "src_ip": {
            "type": "string",
            "description": ""
          },
          "product_manufacturer": {
            "type": "string",
            "description": ""
          },
          "product_name": {
            "type": "string",
            "description": ""
          },
          "product_type": {
            "type": "string",
            "description": ""
          },
          "product_state_ref": {
            "type": "string",
            "description": ""
          },
          "product_state_status": {
            "type": "string",
            "description": ""
          },
          "product_state_status_description": {
            "type": "string",
            "description": "human-readable description of product_state_status"
          },
          "product_version": {
            "type": "string",
            "description": ""
          },
          "ports": {
            "type": "array",
            "items": {
              "type": "integer"
            },
            "description": ""
          },
          "user_agent": {
            "type": "string",
            "description": ""
          },
          "evidence": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": ""
          },
          "product_latest_version": {
            "type": "string",
            "description": "latest version available of the product"
          },
          "reason": {
            "type": "string",
            "description": ""
          }
        },
        "additionalProperties": true,
        "description": "\"outdated_os\" issues in a scorecard"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "A page in a list of OutdatedOs"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/issues/outdated_os' \
  -H 'Authorization: Bearer <your-api-token>'
```
