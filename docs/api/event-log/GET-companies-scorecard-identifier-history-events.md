# 

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/history/events/`
- **Tag:** `event log`
- **operationId:** `get_companies-scorecard-identifier-history-events`

## Path Parameters
- `scorecard_identifier` (**required**) — find entries where 'scorecard_identifier' equals a string

## Query Parameters
- `date_from` (optional, string) — created at from
- `date_to` (optional, string) — created at to
- `score_type` (optional, string) — 

## Responses
### 200
List of CompanyHistoricalEvents
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "description": "unique identifier"
          },
          "date": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}\\.{0,1}[0-9]*Z$",
            "x-example": "2020-07-03T00:00:00.000Z",
            "description": "date the event occurred"
          },
          "event_type": {
            "type": "string",
            "x-example": "issues",
            "description": "the type of event, at the moment one of these:\n- `issues`: indicates the arrival or departure of issues to this scorecard\n- `breach`: a breach was associated to this company\n- `recalibration`: indicates a recalibration event\n\nNote: additional event types might be introduced in the future."
          },
          "group_status": {
            "type": "string",
            "x-example": "active",
            "description": "when event type is \"issues\" indicates\nthe status of the associated group of issues, at the moment one of:\n- `active`: new issues have been observed\n- `resolved`: issues were refuted and resolution confirmed by SecurityScorecard\n- `departed`: issues are not observed anymore"
          },
          "issue_count": {
            "type": "number",
            "x-example": 34,
            "description": "when event type is \"issues\" indicates\nthe number of issue findings associated to this event"
          },
          "total_score_impact": {
            "type": "number",
            "description": "total score impact of the findings detected in the event, to\nthe company's overall score"
          },
          "issue_type": {
            "type": "string",
            "x-example": "x_xss_protection_incorrect",
            "description": "when event type is \"issues\" indicates\nthe type of the associated issues, one of the\n[existing issue types](#tag/metadata%2Fpaths%2F~1metadata~1issue-types%2Fget)"
          },
          "breach_data": {
            "type": "object",
            "properties": {
              "root_cause": {
                "type": "string"
              },
              "records_lost": {
                "type": "number"
              },
              "date_discovered": {
                "type": "integer"
              },
              "type_of_breach": {
                "type": "string"
              }
            },
            "additionalProperties": false,
            "description": "when event type is \"breach\" includes\nadditional information about the breach.\n\nImportant Note: the fields available here might change in the future."
          },
          "breach_incidents": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "measurement_id": {
                  "type": "string"
                },
                "measurement_type": {
                  "type": "string"
                },
                "title": {
                  "type": "string"
                },
                "summary": {
                  "type": "string"
                },
                "root_cause": {
                  "type": "string"
                },
                "breach_date": {
                  "type": "integer"
                },
                "published_date": {
                  "type": "integer"
                },
                "records_lost": {
                  "type": "number"
                },
                "confirmed": {
                  "type": "boolean"
                },
                "originating_party": {
                  "type": "string"
                }
              },
              "additionalProperties": false
            },
            "description": "when issue type is \"confirmed_first_party_breach\" or\n\"confirmed_third_party_breach\", lists the individual breach incidents\nfrom the breach-ages API for this effective date. Each entry represents\na distinct breach incident that may share the same scoring date. Only\npresent when incident data is available."
          },
          "severity": {
            "type": "string",
            "x-example": "high",
            "description": "severity of associated issue type"
          },
          "factor": {
            "type": "string",
            "x-example": "application_security",
            "description": "factor the associated issue type belongs to"
          },
          "detail_url": {
            "type": "string",
            "description": "api endpoint to get the issue findings detail of this event",
            "example": "https://api.securityscorecard.io/companies/example.com/history/events/20180202/service_vuln_host_medium"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of CompanyHistoricalEvents"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//companies/<scorecard_identifier>/history/events/' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

